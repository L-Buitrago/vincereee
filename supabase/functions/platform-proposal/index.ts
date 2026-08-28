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
    const { messages = [] } = await req.json();

    const cleanMessages = messages
      .map((m: any) => ({
        role: m.role === "assistant" ? "assistant" : "user",
        content: String(m.content || "").trim()
      }))
      .filter((m: any) => m.content.length > 0)
      .slice(-15);

    const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
    const OPENROUTER_API_KEY = Deno.env.get("OPENROUTER_API_KEY");
    const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    // 1. Native Gemini
    if (GEMINI_API_KEY) {
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
        contents.push({ role: "user", parts: [{ text: cleanMessages[cleanMessages.length - 1]?.content || "Olá" }] });
      }

      for (const model of ["gemini-2.5-flash", "gemini-2.0-flash"]) {
        try {
          const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY.trim()}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
              contents,
              generationConfig: { maxOutputTokens: 1024, temperature: 0.7 }
            })
          });
          if (res.ok) {
            const data = await res.json();
            const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text;
            if (reply) return new Response(JSON.stringify({ reply }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
          }
        } catch (e) {
          console.error("Gemini proposal error:", e);
        }
      }
    }

    // 2. OpenRouter
    if (OPENROUTER_API_KEY) {
      try {
        const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${OPENROUTER_API_KEY.trim()}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            model: "google/gemini-2.5-flash",
            messages: [{ role: "system", content: SYSTEM_PROMPT }, ...cleanMessages],
            max_tokens: 1000,
            temperature: 0.7
          })
        });
        if (res.ok) {
          const data = await res.json();
          const reply = data?.choices?.[0]?.message?.content;
          if (reply) return new Response(JSON.stringify({ reply }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
        }
      } catch (e) {
        console.error("OpenRouter proposal error:", e);
      }
    }

    // 3. OpenAI
    if (OPENAI_API_KEY) {
      try {
        const res = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${OPENAI_API_KEY.trim()}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [{ role: "system", content: SYSTEM_PROMPT }, ...cleanMessages],
            max_tokens: 1000,
            temperature: 0.7
          })
        });
        if (res.ok) {
          const data = await res.json();
          const reply = data?.choices?.[0]?.message?.content;
          if (reply) return new Response(JSON.stringify({ reply }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
        }
      } catch (e) {
        console.error("OpenAI proposal error:", e);
      }
    }

    // 4. Lovable
    if (LOVABLE_API_KEY) {
      try {
        const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${LOVABLE_API_KEY.trim()}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "google/gemini-2.5-flash",
            messages: [{ role: "system", content: SYSTEM_PROMPT }, ...cleanMessages],
          }),
        });
        if (response.ok) {
          const data = await response.json();
          const reply = data.choices?.[0]?.message?.content;
          if (reply) return new Response(JSON.stringify({ reply }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
        }
      } catch (e) {
        console.error("Lovable proposal error:", e);
      }
    }

    return new Response(JSON.stringify({ reply: "Como posso ajudar você a escolher o melhor plano para o seu negócio?" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });

  } catch (e) {
    console.error("platform-proposal error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Erro desconhecido" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
