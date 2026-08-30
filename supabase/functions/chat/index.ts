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

    // NOTE: In-app notifications are handled by the DB trigger `notify_admins_new_vi_lead`
    // which fires automatically on vi_leads INSERT. No need to duplicate here.

    console.log("[Chat Edge] Lead successfully saved! ✅ (notifications via DB trigger)");
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

    const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
    const OPENROUTER_API_KEY = Deno.env.get("OPENROUTER_API_KEY");
    const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");

    let reply = "";

    // Build Gemini-native contents format (needed for direct Gemini calls)
    const buildGeminiContents = () => {
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
      return contents;
    };

    // ===== STRATEGY: PARALLEL RACE (whoever responds first wins) =====
    // This ensures the user ALWAYS gets a fast response, even if one provider is down.

    const providers: Array<Promise<string>> = [];

    // PRIORITY 1: Google Gemini Direct (you pay for Google AI Pro — this is YOUR provider)
    if (GEMINI_API_KEY) {
      const geminiPromise = (async (): Promise<string> => {
        const contents = buildGeminiContents();
        // Try gemini-2.5-flash first (fastest), then 2.0-flash as backup
        for (const modelId of ["gemini-2.5-flash", "gemini-2.0-flash"]) {
          try {
            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${modelId}:generateContent?key=${GEMINI_API_KEY.trim()}`;
            const res = await fetch(apiUrl, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
                contents,
                generationConfig: { maxOutputTokens: 800, temperature: 0.7 }
              }),
              signal: AbortSignal.timeout(12000) // 12s — generous for reliability
            });

            if (res.ok) {
              const data = await res.json();
              const r = data?.candidates?.[0]?.content?.parts?.[0]?.text;
              if (r && r.trim()) {
                console.log(`[Chat] ✅ Gemini (${modelId}) responded successfully`);
                return r;
              }
            }
            console.warn(`[Chat] Gemini (${modelId}) returned empty or error status ${res.status}`);
          } catch (err) {
            console.warn(`[Chat] Gemini (${modelId}) error:`, (err as Error).message);
          }
        }
        throw new Error("Gemini: all models failed");
      })();
      providers.push(geminiPromise);
    }

    // PRIORITY 2: OpenRouter (routes to many models — good redundancy)
    if (OPENROUTER_API_KEY) {
      const openRouterPromise = (async (): Promise<string> => {
        // Only try the best model, don't loop through 3 (wastes time)
        try {
          const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${OPENROUTER_API_KEY.trim()}`,
              "Content-Type": "application/json",
              "HTTP-Referer": "https://vincere.com.br",
              "X-Title": "Vincere Vi"
            },
            body: JSON.stringify({
              model: "google/gemini-2.5-flash",
              messages: [
                { role: "system", content: SYSTEM_PROMPT },
                ...cleanMessages
              ],
              max_tokens: 800,
              temperature: 0.7
            }),
            signal: AbortSignal.timeout(15000) // 15s — OpenRouter can be slower
          });

          if (res.ok) {
            const data = await res.json();
            const r = data?.choices?.[0]?.message?.content;
            if (r && r.trim()) {
              console.log("[Chat] ✅ OpenRouter responded successfully");
              return r;
            }
          }
        } catch (err) {
          console.warn("[Chat] OpenRouter error:", (err as Error).message);
        }
        throw new Error("OpenRouter failed");
      })();
      providers.push(openRouterPromise);
    }

    // PRIORITY 3: OpenAI Direct (if configured)
    if (OPENAI_API_KEY) {
      const openaiPromise = (async (): Promise<string> => {
        try {
          const res = await fetch("https://api.openai.com/v1/chat/completions", {
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
            signal: AbortSignal.timeout(12000)
          });

          if (res.ok) {
            const data = await res.json();
            const r = data?.choices?.[0]?.message?.content;
            if (r && r.trim()) {
              console.log("[Chat] ✅ OpenAI responded successfully");
              return r;
            }
          }
        } catch (err) {
          console.warn("[Chat] OpenAI error:", (err as Error).message);
        }
        throw new Error("OpenAI failed");
      })();
      providers.push(openaiPromise);
    }

    // RACE all providers in parallel — first to respond wins!
    if (providers.length > 0) {
      try {
        reply = await Promise.any(providers);
      } catch (aggregateError) {
        // ALL providers failed
        console.error("[Chat] ❌ ALL AI providers failed:", (aggregateError as Error).message);
      }
    } else {
      console.error("[Chat] ❌ No AI API keys configured!");
    }

    // Smart fallback — still follows the lead capture flow
    if (!reply) {
      const lastMsg = cleanMessages[cleanMessages.length - 1]?.content?.toLowerCase() || "";
      if (lastMsg.match(/oi|olá|ola|bom dia|boa tarde|boa noite|hey|eai/)) {
        reply = "Olá! Seja bem-vindo à Vincere. Você está buscando uma plataforma de gestão/dashboard ou um site/loja virtual?";
      } else {
        reply = "Obrigada pelo interesse! Para que eu possa te ajudar melhor, poderia me dizer seu nome?";
      }
      console.warn("[Chat] ⚠️ Using fallback response (no AI available)");
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
