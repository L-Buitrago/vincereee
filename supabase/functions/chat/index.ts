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
    const messages = body?.messages || [];
    const requestedModel = body?.model || "gemini-2.0-flash";

    const limitedMessages = messages.slice(-15);

    if (limitedMessages.length === 0) {
      return new Response(JSON.stringify({ error: "Formato de mensagem inválido." }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    console.log(`[Chat] Model: ${requestedModel}, Gemini: ${GEMINI_API_KEY ? "SET" : "MISSING"}, Lovable: ${LOVABLE_API_KEY ? "SET" : "MISSING"}`);

    let geminiStatus = 0;
    let geminiErrorText = "";
    let lovableStatus = 0;
    let lovableErrorText = "";

    // ===== STRATEGY 1: Native Google Gemini API =====
    if (GEMINI_API_KEY) {
      const modelId = "gemini-2.0-flash";
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${modelId}:generateContent?key=${GEMINI_API_KEY.trim()}`;
      
      console.log(`[Chat] Trying native Gemini with model: ${modelId}`);

      try {
        // Build contents array ensuring proper role alternation
        const contents: any[] = [];
        for (const m of limitedMessages) {
          const role = m.role === "assistant" ? "model" : "user";
          // Avoid consecutive same-role messages
          if (contents.length > 0 && contents[contents.length - 1].role === role) {
            contents[contents.length - 1].parts[0].text += "\n" + m.content;
          } else {
            contents.push({ role, parts: [{ text: m.content }] });
          }
        }

        const geminiResponse = await fetch(apiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
            contents,
            generationConfig: { maxOutputTokens: 2048, temperature: 0.7 }
          }),
        });

        const geminiText = await geminiResponse.text();
        geminiStatus = geminiResponse.status;
        if (!geminiResponse.ok) geminiErrorText = geminiText;
        console.log(`[Chat] Gemini status: ${geminiResponse.status}, body: ${geminiText.substring(0, 200)}`);

        if (geminiResponse.ok) {
          const geminiData = JSON.parse(geminiText);
          const reply = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (reply) {
            console.log(`[Chat] Gemini success! Reply length: ${reply.length}`);
            return new Response(JSON.stringify({ reply }), {
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
          }
          console.warn("[Chat] Gemini returned empty reply, falling back...");
        } else {
          console.warn(`[Chat] Gemini API error ${geminiResponse.status}: ${geminiText.substring(0, 200)}`);
        }
      } catch (err) {
        console.error("[Chat] Gemini fetch exception:", err);
        geminiErrorText = String(err);
      }
    }

    // ===== STRATEGY 2: Lovable AI Gateway (handles SSE streaming) =====
    if (LOVABLE_API_KEY) {
      console.log("[Chat] Falling back to Lovable Gateway...");
      
      const lovableResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${LOVABLE_API_KEY.trim()}`
        },
        body: JSON.stringify({
          model: "google/gemini-2.0-flash",
          messages: [{ role: "system", content: SYSTEM_PROMPT }, ...limitedMessages],
          stream: false,
        }),
      });

      const lovableText = await lovableResponse.text();
      lovableStatus = lovableResponse.status;
      if (!lovableResponse.ok) lovableErrorText = lovableText;
      console.log(`[Chat] Lovable status: ${lovableResponse.status}, body length: ${lovableText.length}`);

      // Try parsing as JSON first
      try {
        const data = JSON.parse(lovableText);
        const reply = data?.choices?.[0]?.message?.content;
        if (reply) {
          console.log(`[Chat] Lovable JSON success! Reply length: ${reply.length}`);
          return new Response(JSON.stringify({ reply }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
      } catch {
        // Not JSON — probably SSE streaming
      }

      // Parse as SSE streaming
      const sseReply = parseSSEResponse(lovableText);
      if (sseReply) {
        console.log(`[Chat] Lovable SSE success! Reply length: ${sseReply.length}`);
        return new Response(JSON.stringify({ reply: sseReply }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      console.error("[Chat] Lovable returned unparseable response:", lovableText.substring(0, 300));
    }

    // ===== NO STRATEGY WORKED =====
    return new Response(JSON.stringify({ 
      reply: "Estou com dificuldades técnicas no momento. Por favor, entre em contato pelo WhatsApp."
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : String(e);
    console.error("[Chat] Fatal error:", errorMessage);
    return new Response(JSON.stringify({ 
      reply: "Desculpe, ocorreu um erro ao me conectar. Pode tentar de novo?",
      details: errorMessage
    }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
