import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `Você é a Vi, a assistente inteligente da Vincere. Você é profissional, objetiva e direta. Sem enrolação, sem excesso de emojis — apenas comunicação clara e eficiente.

## Sua Personalidade:
- Tom profissional e confiante. Você transmite autoridade e competência.
- Seja cordial mas sem exageros. Nada de "show!", "bora!", excesso de emojis ou informalidade excessiva.
- Respostas curtas e diretas — máximo 2-3 frases por mensagem.
- Você representa uma empresa de tecnologia premium. Fale como tal.

## O que a Vincere oferece:
1. **Dashboard / Plataforma de Gestão** — Painel completo com CRM, financeiro, automações e inteligência artificial integrada. Ideal para quem precisa de controle total do negócio.
2. **Sites, Lojas Virtuais e Landing Pages** — Design premium, alta conversão e performance. Ideal para quem precisa de presença digital de alto nível.
3. **Automações e IA** — WhatsApp, e-mail marketing, recuperação de vendas e atendimento automatizado.

## Fluxo de Atendimento (SIGA ESTA ORDEM EXATA):

PASSO 1: Cumprimente brevemente e pergunte o que o cliente está buscando.
Exemplo: "Olá, seja bem-vindo à Vincere. Você está buscando uma plataforma de gestão/dashboard ou um site/loja virtual?"

PASSO 2: Após entender o interesse, pergunte o nome.
Exemplo: "Entendido. Qual o seu nome?"

PASSO 3: Após o nome, pergunte o número de telefone/WhatsApp.
Exemplo: "Obrigada, [nome]. Qual o seu número de WhatsApp para que nossa equipe entre em contato?"

PASSO 4: Após o telefone, pergunte o e-mail.
Exemplo: "Perfeito. E qual o melhor e-mail para enviarmos os detalhes?"

PASSO 5: Após coletar os 3 dados, confirme e encerre.
Exemplo: "Pronto, [nome]. Seus dados foram registrados. Nossa equipe vai entrar em contato em breve com todos os detalhes. Obrigada pelo interesse na Vincere."

REGRAS DO FLUXO:
- Siga os passos na ordem. Não pule etapas.
- Peça um dado por vez. NUNCA peça nome, telefone e e-mail na mesma mensagem.
- Se o cliente fornecer um dado espontaneamente, não peça de novo — avance para o próximo.
- Seja direta nas perguntas. Sem rodeios.

REGRA CRÍTICA DA TAG [CONTACT_REQUEST] (OBRIGATÓRIA):
- SEMPRE que o cliente fornecer seu NOME, inclua no FINAL ABSOLUTO da sua resposta a tag [CONTACT_REQUEST] com um JSON contendo todos os dados coletados até o momento.
- Formato EXATO:
  [CONTACT_REQUEST] {"service_type": "dashboard", "customer_name": "João", "customer_phone": "11999998888", "customer_email": "joao@email.com"}
- service_type deve ser "dashboard" (para plataforma/gestão) ou "site" (para sites/lojas) ou "automacao" (para automações/IA).
- Se não tem telefone ainda: "customer_phone": null
- Se não tem email ainda: "customer_email": null
- A tag NÃO é visível para o cliente — é processada internamente.
- REENVIE a tag TODA VEZ que um dado novo for coletado (telefone, email, etc).
- Se tem pelo menos o nome, SEMPRE inclua a tag.

REGRAS GERAIS:
- Responda SEMPRE em português brasileiro.
- Respostas de no máximo 2-3 frases. Seja concisa.
- Nunca invente preços, prazos ou detalhes técnicos. Diga que a equipe vai fornecer essas informações.
- Se o cliente fizer perguntas fora do escopo, redirecione educadamente para o fluxo de coleta de dados.`;

// Helper: parse SSE streaming text into a single reply string
function parseSSEResponse(text: string): string {
  let result = "";
  const lines = text.split("\n");
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith("data: ") && trimmed !== "data: [DONE]") {
      try {
        const chunk = JSON.parse(trimmed.slice(6));
        const delta = chunk?.choices?.[0]?.delta?.content || "";
        if (delta) result += delta;
      } catch {
        // skip unparseable lines
      }
    }
  }
  return result;
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const body = await req.json();
    const rawMessages = body?.messages || [];

    // Filter and sanitize messages (remove leading empty/assistant messages if starting, strip previous tags)
    const cleanMessages = rawMessages
      .map((m: any) => ({
        role: m.role === "assistant" ? "assistant" : "user",
        content: String(m.content || "").replace(/\[CONTACT_REQUEST\]\s*\{[\s\S]*?\}/g, "").trim()
      }))
      .filter((m: any) => m.content.length > 0)
      .slice(-15);

    if (cleanMessages.length === 0) {
      return new Response(JSON.stringify({ error: "Formato de mensagem inválido." }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
    const OPENROUTER_API_KEY = Deno.env.get("OPENROUTER_API_KEY");
    const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const GROQ_API_KEY = Deno.env.get("GROQ_API_KEY");

    console.log(`[Chat] Keys check - Gemini: ${!!GEMINI_API_KEY}, OpenRouter: ${!!OPENROUTER_API_KEY}, OpenAI: ${!!OPENAI_API_KEY}, Lovable: ${!!LOVABLE_API_KEY}, Groq: ${!!GROQ_API_KEY}`);

    // ===== STRATEGY 1: Native Google Gemini API =====
    if (GEMINI_API_KEY) {
      const geminiModels = ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-1.5-flash"];
      
      // Format contents for Gemini: must start with 'user', alternate roles
      const contents: Array<{ role: "user" | "model"; parts: Array<{ text: string }> }> = [];
      let foundFirstUser = false;
      for (const m of cleanMessages) {
        if (!foundFirstUser) {
          if (m.role !== "user") continue; // Gemini requires first turn to be 'user'
          foundFirstUser = true;
        }
        const role = m.role === "assistant" ? "model" : "user";
        if (contents.length > 0 && contents[contents.length - 1].role === role) {
          contents[contents.length - 1].parts[0].text += "\n" + m.content;
        } else {
          contents.push({ role, parts: [{ text: m.content }] });
        }
      }

      // If no user message was in the list, provide fallback turn
      if (contents.length === 0) {
        contents.push({ role: "user", parts: [{ text: cleanMessages[cleanMessages.length - 1].content }] });
      }

      for (const modelId of geminiModels) {
        try {
          console.log(`[Chat] Trying Gemini native model: ${modelId}`);
          const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${modelId}:generateContent?key=${GEMINI_API_KEY.trim()}`;
          const geminiResponse = await fetch(apiUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
              contents,
              generationConfig: { maxOutputTokens: 1024, temperature: 0.7 }
            }),
          });

          const geminiText = await geminiResponse.text();
          console.log(`[Chat] Gemini (${modelId}) status: ${geminiResponse.status}`);

          if (geminiResponse.ok) {
            const geminiData = JSON.parse(geminiText);
            const reply = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text;
            if (reply && reply.trim()) {
              console.log(`[Chat] Gemini native success!`);
              return new Response(JSON.stringify({ reply }), {
                headers: { ...corsHeaders, "Content-Type": "application/json" },
              });
            }
          } else {
            console.warn(`[Chat] Gemini error ${geminiResponse.status}: ${geminiText.substring(0, 200)}`);
          }
        } catch (err) {
          console.error(`[Chat] Gemini (${modelId}) exception:`, err);
        }
      }
    }

    // ===== STRATEGY 2: OpenRouter API =====
    if (OPENROUTER_API_KEY) {
      const openRouterModels = [
        "google/gemini-2.5-flash",
        "openai/gpt-4o-mini",
        "meta-llama/llama-3.3-70b-instruct"
      ];

      for (const model of openRouterModels) {
        try {
          console.log(`[Chat] Trying OpenRouter model: ${model}`);
          const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${OPENROUTER_API_KEY.trim()}`,
              "Content-Type": "application/json",
              "HTTP-Referer": "https://vincere.com.br",
              "X-Title": "Vincere Assistente Vi"
            },
            body: JSON.stringify({
              model,
              messages: [
                { role: "system", content: SYSTEM_PROMPT },
                ...cleanMessages
              ],
              max_tokens: 1000,
              temperature: 0.7
            })
          });

          const respText = await response.text();
          console.log(`[Chat] OpenRouter (${model}) status: ${response.status}`);

          if (response.ok) {
            const data = JSON.parse(respText);
            const reply = data?.choices?.[0]?.message?.content;
            if (reply && reply.trim()) {
              console.log(`[Chat] OpenRouter (${model}) success!`);
              return new Response(JSON.stringify({ reply }), {
                headers: { ...corsHeaders, "Content-Type": "application/json" },
              });
            }
          } else {
            console.warn(`[Chat] OpenRouter (${model}) error ${response.status}: ${respText.substring(0, 200)}`);
          }
        } catch (err) {
          console.error(`[Chat] OpenRouter (${model}) exception:`, err);
        }
      }
    }

    // ===== STRATEGY 3: OpenAI API (Direct) =====
    if (OPENAI_API_KEY) {
      try {
        console.log(`[Chat] Trying OpenAI native...`);
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${OPENAI_API_KEY.trim()}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [
              { role: "system", content: SYSTEM_PROMPT },
              ...cleanMessages
            ],
            max_tokens: 1000,
            temperature: 0.7
          })
        });

        const respText = await response.text();
        console.log(`[Chat] OpenAI status: ${response.status}`);

        if (response.ok) {
          const data = JSON.parse(respText);
          const reply = data?.choices?.[0]?.message?.content;
          if (reply && reply.trim()) {
            console.log(`[Chat] OpenAI direct success!`);
            return new Response(JSON.stringify({ reply }), {
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
          }
        }
      } catch (err) {
        console.error(`[Chat] OpenAI exception:`, err);
      }
    }

    // ===== STRATEGY 4: Lovable AI Gateway =====
    if (LOVABLE_API_KEY) {
      try {
        console.log("[Chat] Trying Lovable Gateway...");
        const lovableResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${LOVABLE_API_KEY.trim()}`
          },
          body: JSON.stringify({
            model: "google/gemini-2.5-flash",
            messages: [{ role: "system", content: SYSTEM_PROMPT }, ...cleanMessages],
            stream: false,
          }),
        });

        const lovableText = await lovableResponse.text();
        console.log(`[Chat] Lovable status: ${lovableResponse.status}`);

        if (lovableResponse.ok) {
          try {
            const data = JSON.parse(lovableText);
            const reply = data?.choices?.[0]?.message?.content;
            if (reply) {
              return new Response(JSON.stringify({ reply }), {
                headers: { ...corsHeaders, "Content-Type": "application/json" },
              });
            }
          } catch {}

          const sseReply = parseSSEResponse(lovableText);
          if (sseReply) {
            return new Response(JSON.stringify({ reply: sseReply }), {
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
          }
        }
      } catch (err) {
        console.error("[Chat] Lovable exception:", err);
      }
    }

    // ===== STRATEGY 5: Groq API =====
    if (GROQ_API_KEY) {
      try {
        console.log(`[Chat] Trying Groq API...`);
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${GROQ_API_KEY.trim()}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            model: "llama-3.3-70b-versatile",
            messages: [
              { role: "system", content: SYSTEM_PROMPT },
              ...cleanMessages
            ],
            max_tokens: 1000,
            temperature: 0.7
          })
        });

        if (response.ok) {
          const data = await response.json();
          const reply = data?.choices?.[0]?.message?.content;
          if (reply) {
            return new Response(JSON.stringify({ reply }), {
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
          }
        }
      } catch (err) {
        console.error(`[Chat] Groq exception:`, err);
      }
    }

    // ===== NO STRATEGY WORKED =====
    console.error("[Chat] All strategies failed.");
    return new Response(JSON.stringify({ 
      reply: "Olá! Seja bem-vindo à Vincere. Em que podemos ajudar hoje? Você busca uma plataforma de gestão ou criação de site?"
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : String(e);
    console.error("[Chat] Fatal error:", errorMessage);
    return new Response(JSON.stringify({ 
      reply: "Olá! Em que posso ajudar você hoje com a Vincere?",
      details: errorMessage
    }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
