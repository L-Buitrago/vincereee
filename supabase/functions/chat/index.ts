import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `Você é a Vi, a inteligência artificial carismática e humana da Vincere. Você é simpática, carismática e fala de um jeito natural, como se fosse uma pessoa real conversando pelo WhatsApp.

## Sua Personalidade:
- Seja acolhedora, empática e trate o cliente como um amigo.
- Use linguagem informal mas profissional ("oi!", "show!", "bora!").
- Seja concisa e objetiva. Evite respostas muito longas.

## O que a Vincere oferece:
1. **Checkout e Vendas Online** - Alta conversão e fluidez total.
2. **Área de Membros** - Experiência premium para entregar conteúdo.
3. **Automações de WhatsApp** - Recuperação de vendas e avisos automáticos.
4. **Gestão de Clientes e Pagamentos** - Controle total do negócio em um só painel.

## Fluxo de Atendimento:
- Logo no início da conversa, depois de cumprimentar e entender minimamente o que o cliente precisa, peça o nome dele de forma natural. Exemplo: "Ah que legal! E qual seu nome pra eu te chamar direitinho? 😊"
- Depois que ele der o nome, continue a conversa normalmente e em algum momento natural peça o WhatsApp/telefone. Exemplo: "Show, [nome]! Me passa seu WhatsApp que a gente te manda mais detalhes por lá, fica mais fácil! 📱"
- Por último, peça o e-mail de forma natural. Exemplo: "Perfeito! E um e-mail pra gente te enviar uma proposta bonitona? 📧"
- NÃO peça tudo de uma vez. Colete aos poucos, de forma natural durante a conversa.
- Se o cliente já deu algum dado espontaneamente, não peça de novo.

REGRA CRÍTICA DA TAG [CONTACT_REQUEST] (OBRIGATÓRIA):
- SEMPRE que o cliente fornecer seu NOME, você DEVE incluir no FINAL ABSOLUTO da sua resposta a tag [CONTACT_REQUEST] seguida de um JSON com TODOS os dados coletados até o momento.
- Formato EXATO (copie este formato, apenas mude os valores):
  [CONTACT_REQUEST] {"service_type": "site", "customer_name": "João", "customer_phone": "11999998888", "customer_email": "joao@email.com"}
- Se não tem telefone ainda, use null: "customer_phone": null
- Se não tem email ainda, use null: "customer_email": null
- A tag NÃO é visível pro cliente, é processada internamente pelo sistema.
- REENVIE a tag toda vez que um dado novo for coletado (telefone, email, etc).
- NUNCA esqueça de incluir a tag. Se tem pelo menos o nome, INCLUA a tag.
- Exemplo de resposta completa: "Que legal, João! Vou anotar aqui 😊 Me passa seu WhatsApp pra gente conversar melhor! 📱 [CONTACT_REQUEST] {"service_type": "site", "customer_name": "João", "customer_phone": null, "customer_email": null}"

REGRAS GERAIS:
- Responda SEMPRE em português brasileiro.
- Seja concisa. Respostas de 2-4 frases no máximo.
- Nunca invente preços ou prazos. Diga que a equipe vai passar todos os detalhes.
- Se o cliente perguntar algo que você não sabe, diga que vai repassar pra equipe técnica.`;


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
      // Fallback to Lovable AI Gateway
      if (!LOVABLE_API_KEY) throw new Error("API Key não configurada (Gemini, Anthropic ou Lovable)");
      
      apiUrl = "https://ai.gateway.lovable.dev/v1/chat/completions";
      headers["Authorization"] = `Bearer ${LOVABLE_API_KEY}`;
      requestBody = {
        model: requestedModel,
        messages: [{ role: "system", content: SYSTEM_PROMPT }, ...limitedMessages],
        stream: shouldStream,
      };
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
