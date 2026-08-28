import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const ADMIN_EMAILS = [
  'luisgu0703@gmail.com',
  'assasinghost910@gmail.com',
  'nathanwar03@gmail.com',
  'ryanfernandosilva12@gmail.com'
];

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

// Helper: Extract lead data either from AI tag or by parsing user messages directly
function extractLeadData(rawReply: string, allMessages: any[]) {
  // Try tag first
  const match = rawReply.match(/\[CONTACT_REQUEST\]\s*(\{[\s\S]*?\})/);
  if (match) {
    try {
      const parsed = JSON.parse(match[1]);
      if (parsed && parsed.customer_name) return parsed;
    } catch {}
  }

  // Fallback: parse conversation messages
  const userTexts = allMessages.filter(m => m.role === "user").map(m => m.content);
  const fullText = userTexts.join(" ");

  const phoneMatch = fullText.match(/(?:\+?55\s?)?(?:\(?\d{2}\)?\s?)?\d{4,5}[\s.-]?\d{4}/);
  const phone = phoneMatch ? phoneMatch[0].trim() : null;

  const emailMatch = fullText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  const email = emailMatch ? emailMatch[0].trim() : null;

  let name: string | null = null;
  for (const msg of userTexts) {
    const clean = msg.trim();
    if (clean.match(/\d{4,}/) || clean.includes("@") || clean.split(/\s+/).length > 5 || clean.length > 60) continue;
    const lower = clean.toLowerCase();
    if (["oi", "olá", "ola", "bom dia", "boa tarde", "boa noite", "sim", "não", "nao", "ok", "obrigado", "obrigada", "site", "dashboard", "plataforma", "loja", "automação", "automacao"].includes(lower)) continue;
    if (clean.match(/^[A-Za-zÀ-ÿ\s]{2,50}$/) && clean.split(/\s+/).length <= 4) {
      name = clean;
      break;
    }
  }

  if (name || phone || email) {
    return {
      service_type: fullText.toLowerCase().includes("site") ? "site" : (fullText.toLowerCase().includes("dashboard") ? "dashboard" : "geral"),
      customer_name: name,
      customer_phone: phone,
      customer_email: email
    };
  }

  return null;
}

// Helper to save lead and notifications to Supabase
async function handleLeadAndNotifications(supabase: any, sessionId: string, rawReply: string, messages: any[]) {
  try {
    const data = extractLeadData(rawReply, messages);
    if (!data || !data.customer_name) return;

    console.log("[Chat Edge] Saving Lead & Notifying Admins:", data);

    const name = String(data.customer_name).trim();
    const phone = data.customer_phone ? String(data.customer_phone).trim() : "Não informado";
    const email = data.customer_email ? String(data.customer_email).trim() : `chat_${sessionId.substring(0, 8)}@vincere.temp`;
    const serviceType = data.service_type || "chat_lead";

    // 1. Save to contact_requests
    await supabase.from("contact_requests").insert({
      session_id: sessionId,
      service_type: serviceType,
      customer_name: name,
      customer_phone: phone !== "Não informado" ? phone : null,
      customer_email: email.includes("@vincere.temp") ? null : email,
      message: messages.map(m => `${m.role}: ${m.content}`).join("\n"),
      status: "pending"
    });

    // 2. Save to vi_leads (admin panel)
    await supabase.from("vi_leads").insert({
      name: name,
      email: email,
      phone: phone,
      needs: `[Via Chat Vi]\nServiço: ${serviceType}\n\n${messages.map(m => `${m.role}: ${m.content}`).join("\n")}`
    });

    // 3. Save to customers (CRM)
    await supabase.from("customers").insert({
      name: name,
      phone: phone,
      email: email,
      status: "Lead",
      org_id: null
    });

    // 4. Create in-app notification for all Vincere admins
    for (const adminEmail of ADMIN_EMAILS) {
      await supabase.from("notifications").insert({
        user_email: adminEmail,
        title: `🎯 Novo Lead via Vi: ${name}`,
        body: `Serviço: ${serviceType} | Tel: ${phone} | E-mail: ${email.includes("@vincere.temp") ? 'Aguardando' : email}`,
        type: 'lead',
        read: false
      });
    }

    console.log("[Chat Edge] Lead & Admin Notifications successfully created! ✅");
  } catch (err) {
    console.error("[Chat Edge] Error handling lead & notifications:", err);
  }
}

// Helper to save chat messages history
async function logMessageToDb(supabase: any, sessionId: string, role: string, content: string) {
  try {
    const clean = content.replace(/\[CONTACT_REQUEST\]\s*\{[\s\S]*?\}/g, "").trim();
    if (!clean) return;
    await supabase.from("chat_messages").insert({
      session_id: sessionId,
      role: role,
      content: clean
    });
  } catch (err) {
    console.warn("[Chat Edge] Could not log chat message to DB:", err);
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const body = await req.json();
    const rawMessages = body?.messages || [];
    const sessionId = body?.sessionId || crypto.randomUUID();

    // Initialize Supabase Client with Service Role Key for backend actions
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    const supabase = (supabaseUrl && supabaseServiceKey) 
      ? createClient(supabaseUrl, supabaseServiceKey) 
      : null;

    // Filter and sanitize messages
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

    // Log the latest user message to chat_messages table
    const lastUserMsg = cleanMessages[cleanMessages.length - 1];
    if (supabase && lastUserMsg && lastUserMsg.role === "user") {
      logMessageToDb(supabase, sessionId, "user", lastUserMsg.content);
    }

    const OPENROUTER_API_KEY = Deno.env.get("OPENROUTER_API_KEY");
    const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
    const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const GROQ_API_KEY = Deno.env.get("GROQ_API_KEY");

    let reply = "";

    // ===== STRATEGY 1: OpenRouter API (Fast & Reliable) =====
    if (OPENROUTER_API_KEY && !reply) {
      const openRouterModels = [
        "google/gemini-2.5-flash",
        "openai/gpt-4o-mini",
        "meta-llama/llama-3.3-70b-instruct"
      ];

      for (const model of openRouterModels) {
        try {
          const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${OPENROUTER_API_KEY.trim()}`,
              "Content-Type": "application/json",
              "HTTP-Referer": "https://vincere.com.br",
              "X-Title": "Vincere Vi"
            },
            body: JSON.stringify({
              model,
              messages: [
                { role: "system", content: SYSTEM_PROMPT },
                ...cleanMessages
              ],
              max_tokens: 800,
              temperature: 0.7
            }),
            signal: AbortSignal.timeout(6000)
          });

          if (response.ok) {
            const data = await response.json();
            const r = data?.choices?.[0]?.message?.content;
            if (r && r.trim()) {
              reply = r;
              break;
            }
          }
        } catch (err) {
          console.warn(`[Chat] OpenRouter (${model}) error:`, err);
        }
      }
    }

    // ===== STRATEGY 2: Native Google Gemini API =====
    if (GEMINI_API_KEY && !reply) {
      const contents: Array<{ role: "user" | "model"; parts: Array<{ text: string }> }> = [];
      let foundFirstUser = false;
      for (const m of cleanMessages) {
        if (!foundFirstUser) {
          if (m.role !== "user") continue;
          foundFirstUser = true;
        }
        const role = m.role === "assistant" ? "model" : "user";
        if (contents.length > 0 && contents[contents.length - 1].role === role) {
          contents[contents.length - 1].parts[0].text += "\n" + m.content;
        } else {
          contents.push({ role, parts: [{ text: m.content }] });
        }
      }

      if (contents.length === 0) {
        contents.push({ role: "user", parts: [{ text: cleanMessages[cleanMessages.length - 1].content }] });
      }

      for (const modelId of ["gemini-2.5-flash", "gemini-2.0-flash"]) {
        try {
          const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${modelId}:generateContent?key=${GEMINI_API_KEY.trim()}`;
          const geminiResponse = await fetch(apiUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
              contents,
              generationConfig: { maxOutputTokens: 800, temperature: 0.7 }
            }),
            signal: AbortSignal.timeout(5000)
          });

          if (geminiResponse.ok) {
            const geminiData = await geminiResponse.json();
            const r = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text;
            if (r && r.trim()) {
              reply = r;
              break;
            }
          }
        } catch (err) {
          console.warn(`[Chat] Gemini (${modelId}) error:`, err);
        }
      }
    }

    // ===== STRATEGY 3: OpenAI API (Direct) =====
    if (OPENAI_API_KEY && !reply) {
      try {
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
            max_tokens: 800,
            temperature: 0.7
          }),
          signal: AbortSignal.timeout(5000)
        });

        if (response.ok) {
          const data = await response.json();
          const r = data?.choices?.[0]?.message?.content;
          if (r && r.trim()) reply = r;
        }
      } catch (err) {
        console.warn("[Chat] OpenAI error:", err);
      }
    }

    if (!reply) {
      reply = "Entendido! Qual o seu nome para continuarmos?";
    }

    // Backend actions: Log assistant response and save leads + admin notifications
    if (supabase) {
      logMessageToDb(supabase, sessionId, "assistant", reply);
      const allUpdatedMessages = [...cleanMessages, { role: "assistant", content: reply }];
      handleLeadAndNotifications(supabase, sessionId, reply, allUpdatedMessages);
    }

    return new Response(JSON.stringify({ reply }), {
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
