import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `Você é a Vi, a inteligência artificial da Vincere. Sua missão é ajudar novos clientes a entenderem como a Vincere pode escalar o negócio deles.

## Sua Personalidade:
- Profissional, direta e objetiva.
- Linguagem clara e concisa. Frases curtas.
- NÃO use emojis em nenhuma circunstância.
- Vá direto ao ponto sem enrolação.

## O que oferecemos:
1. **Checkout e Vendas Online** - Alta conversão e checkout fluido.
2. **Área de Membros** - Experiência premium para seus alunos/clientes.
3. **Automações de WhatsApp** - Recuperação de vendas e notificações automáticas.
4. **Gestão de Clientes e Pagamentos** - Tudo centralizado em um só lugar.

## Planos:
- **Starter (R$ 97/mês)**: Base sólida para começar.
- **Pro (R$ 197/mês)**: Para escalar com automações e área de membros.
- **Enterprise (R$ 497/mês)**: Solução robusta e personalizada.

## Regras:
1. Seja empática mas direta.
2. Recomende o plano Pro para quem quer escalar.
3. Respostas curtas, máximo 2 parágrafos.
4. Quando o cliente estiver pronto, direcione para os botões de "Fechar plano" abaixo do chat.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...messages.map((m: { role: string; content: string }) => ({
            role: m.role,
            content: m.content,
          })),
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Muitas requisições. Tente novamente em instantes." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Créditos insuficientes." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || "Desculpe, não consegui processar sua mensagem.";

    return new Response(JSON.stringify({ reply }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("platform-proposal error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Erro desconhecido" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
