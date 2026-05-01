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


serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const body = await req.json();
    const messages = body?.messages || [];
    const shouldStream = body?.stream !== false;
    const requestedModel = body?.model || "google/gemini-1.5-flash";

    // Limit context history
    const limitedMessages = messages.slice(-15);

    if (limitedMessages.length === 0) {
      return new Response(JSON.stringify({ error: "Formato de mensagem inválido." }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
    const ANTHROPIC_API_KEY = Deno.env.get("ANTHROPIC_API_KEY");
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    let apiUrl: string;
    let headers: Record<string, string> = { "Content-Type": "application/json" };
    let requestBody: any;

    // Lógica para selecionar o provedor baseado no modelo e chaves disponíveis
    if (requestedModel.includes("claude") && ANTHROPIC_API_KEY) {
      // Direct Anthropic API
      apiUrl = "https://api.anthropic.com/v1/messages";
      headers["x-api-key"] = ANTHROPIC_API_KEY;
      headers["anthropic-version"] = "2023-06-01";
      requestBody = {
        model: requestedModel.replace("anthropic/", ""),
        system: SYSTEM_PROMPT,
        messages: limitedMessages.map((m: any) => ({
          role: m.role === "assistant" ? "assistant" : "user",
          content: m.content,
        })),
        max_tokens: 4096,
        stream: shouldStream,
      };
    } else if (requestedModel.includes("gemini") && GEMINI_API_KEY) {
      // Direct Google Gemini API (OpenAI Compatible)
      apiUrl = `https://generativelanguage.googleapis.com/v1beta/openai/chat/completions`;
      headers["Authorization"] = `Bearer ${GEMINI_API_KEY}`;
      requestBody = {
        model: requestedModel.includes("/") ? requestedModel.split("/")[1] : requestedModel,
        messages: [{ role: "system", content: SYSTEM_PROMPT }, ...limitedMessages],
        stream: shouldStream,
      };
    } else {
      // No valid API key found
      console.error(`No API key found for model: ${requestedModel}. GEMINI_API_KEY: ${GEMINI_API_KEY ? "SET" : "NOT SET"}, ANTHROPIC_API_KEY: ${ANTHROPIC_API_KEY ? "SET" : "NOT SET"}, LOVABLE_API_KEY: ${LOVABLE_API_KEY ? "SET" : "NOT SET"}`);
      
      if (LOVABLE_API_KEY) {
        // Fallback to Lovable AI Gateway
        apiUrl = "https://ai.gateway.lovable.dev/v1/chat/completions";
        headers["Authorization"] = `Bearer ${LOVABLE_API_KEY}`;
        requestBody = {
          model: requestedModel,
          messages: [{ role: "system", content: SYSTEM_PROMPT }, ...limitedMessages],
          stream: shouldStream,
        };
      } else {
        return new Response(JSON.stringify({ 
          error: "API Key não configurada. Configure GEMINI_API_KEY nos Secrets do Supabase.",
          reply: "Desculpe, estou com um problema técnico no momento. A equipe já foi notificada! 🔧"
        }), {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    console.log(`Using provider for model: ${requestedModel} (Stream: ${shouldStream})`);

    const response = await fetch(apiUrl, {
      method: "POST",
      headers,
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error(`Provider error (${response.status}):`, errorData);
      
      if (response.status === 402) return new Response(JSON.stringify({ error: "Créditos insuficientes no provedor." }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      if (response.status === 429) return new Response(JSON.stringify({ error: "Limite de requisições atingido." }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      
      throw new Error(`Erro na API: ${response.status}`);
    }

    if (shouldStream) {
      return new Response(response.body, {
        headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
      });
    } else {
      const data = await response.json();
      const reply = data.choices?.[0]?.message?.content || "";
      return new Response(JSON.stringify({ reply }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
  } catch (e) {
    console.error("chat error:", e instanceof Error ? e.message : String(e));
    return new Response(JSON.stringify({ error: "Ocorreu um erro ao processar sua mensagem." }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
