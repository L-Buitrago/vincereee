import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT_RECOVERY = `Você é um assistente virtual inteligente de uma empresa de serviços. Sua missão é recuperar clientes que possuem pagamentos pendentes ou checkouts não finalizados.
Sua voz é amigável, carismática e humana. Nada de robôs! Use gírias leves como "show", "bora", "poxa" de forma natural.

DIRETRIZES:
1. Identificação: Identifique-se como sendo do negócio {{business_name}} (ex: "Aqui é da Mecânica do Zé").
2. Seja empática: Pergunte se houve algum problema técnico ou se ficou alguma dúvida sobre o serviço/pagamento.
3. Seja prestativa: Ofereça ajuda para finalizar.
4. Não pressione: O tom deve ser de "estou aqui se precisar", não de vendedora chata.
5. Linguagem concisa: 2-3 frases curtas.

CONTEXTO DO CLIENTE:
Nome: {{customer_name}}
Empresa: {{business_name}}
Valor: {{amount}}
Link de Recuperação: {{checkout_url}}

EXEMPLO DE MENSAGEM:
"Oi {{customer_name}}! Tudo bem? Aqui é da {{business_name}}. Vi que ficou uma pendência aqui no sistema, aconteceu algum probleminha? Se tiver qualquer dúvida, tô aqui pra te ajudar! 😊 Bora resolver isso?"`;

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { recoveryId } = await req.json();
    
    if (!recoveryId) {
      return new Response(JSON.stringify({ error: "recoveryId is required" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Fetch recovery data and organization name
    const { data: recovery, error: fetchError } = await supabase
      .from("recoveries")
      .select("*, organizations(name)")
      .eq("id", recoveryId)
      .single();

    if (fetchError || !recovery) {
      throw new Error("Recovery record not found");
    }

    const business_name = (recovery as any).organizations?.name || "Vincere";

    // Generate recovery URL (Asaas payment link or Vincere proposal page)
    const checkout_url = recovery.checkout_id 
      ? `https://www.asaas.com/i/${recovery.checkout_id}`
      : "https://vincere.com.br/#/plataforma/proposta";

    // Replace variables in prompt
    const prompt = SYSTEM_PROMPT_RECOVERY
      .replace(/{{customer_name}}/g, recovery.customer_name || "aí")
      .replace(/{{business_name}}/g, business_name)
      .replace("{{amount}}", `R$ ${recovery.amount}`)
      .replace("{{checkout_url}}", checkout_url);

    // Call AI to generate recovery message (multi-provider fallback)
    const OPENROUTER_API_KEY = Deno.env.get("OPENROUTER_API_KEY");
    const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");

    let generatedMessage = "";

    // Strategy 1: OpenRouter
    if (OPENROUTER_API_KEY && !generatedMessage) {
      try {
        const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${OPENROUTER_API_KEY.trim()}`,
            "Content-Type": "application/json",
            "HTTP-Referer": "https://vincere.com.br",
            "X-Title": "Vincere Recovery"
          },
          body: JSON.stringify({
            model: "google/gemini-2.5-flash",
            messages: [
              { role: "system", content: prompt },
              { role: "user", content: "Gere a mensagem de recuperação para este cliente." }
            ],
            max_tokens: 500,
            temperature: 0.8
          }),
          signal: AbortSignal.timeout(8000)
        });
        if (res.ok) {
          const data = await res.json();
          generatedMessage = data?.choices?.[0]?.message?.content || "";
        }
      } catch (err) {
        console.warn("[Recovery] OpenRouter error:", err);
      }
    }

    // Strategy 2: Native Gemini API
    if (GEMINI_API_KEY && !generatedMessage) {
      try {
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY.trim()}`;
        const res = await fetch(apiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            systemInstruction: { parts: [{ text: prompt }] },
            contents: [{ role: "user", parts: [{ text: "Gere a mensagem de recuperação para este cliente." }] }],
            generationConfig: { maxOutputTokens: 500, temperature: 0.8 }
          }),
          signal: AbortSignal.timeout(6000)
        });
        if (res.ok) {
          const data = await res.json();
          generatedMessage = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
        }
      } catch (err) {
        console.warn("[Recovery] Gemini error:", err);
      }
    }

    if (!generatedMessage) {
      throw new Error("Nenhuma API de IA configurada (OPENROUTER_API_KEY ou GEMINI_API_KEY)");
    }

    // Save generated message to DB
    await supabase.from("recoveries")
      .update({ last_ai_message: generatedMessage, status: 'contacted' })
      .eq("id", recoveryId);

    // ─────────────────────────────────────────────────────────────────
    // WHATSAPP INTEGRATION VIA Z-API
    // ─────────────────────────────────────────────────────────────────
    // Required env vars (configure in Supabase Edge Secrets when ready):
    //   ZAPI_INSTANCE_ID   – Your Z-API instance ID
    //   ZAPI_TOKEN          – Your Z-API security token
    //   ZAPI_CLIENT_TOKEN   – Your Z-API client token (optional, for extra auth)
    //
    // How to set up:
    //   1. Sign up at https://z-api.io
    //   2. Create an instance and connect your WhatsApp
    //   3. Copy Instance ID + Token from the dashboard
    //   4. Add them to Supabase: Settings → Edge Function Secrets
    // ─────────────────────────────────────────────────────────────────

    const ZAPI_INSTANCE_ID = Deno.env.get("ZAPI_INSTANCE_ID");
    const ZAPI_TOKEN = Deno.env.get("ZAPI_TOKEN");
    const ZAPI_CLIENT_TOKEN = Deno.env.get("ZAPI_CLIENT_TOKEN");
    let whatsappSent = false;

    if (ZAPI_INSTANCE_ID && ZAPI_TOKEN && recovery.customer_phone) {
      try {
        // Format phone: remove non-digits, ensure country code
        let phone = recovery.customer_phone.replace(/\D/g, "");
        if (phone.startsWith("0")) phone = "55" + phone.substring(1);
        if (!phone.startsWith("55")) phone = "55" + phone;

        const zapiUrl = `https://api.z-api.io/instances/${ZAPI_INSTANCE_ID}/token/${ZAPI_TOKEN}/send-text`;
        
        const headers: Record<string, string> = {
          "Content-Type": "application/json",
        };
        // Client token is optional extra authentication
        if (ZAPI_CLIENT_TOKEN) {
          headers["Client-Token"] = ZAPI_CLIENT_TOKEN;
        }

        const zapiRes = await fetch(zapiUrl, {
          method: "POST",
          headers,
          body: JSON.stringify({
            phone: phone,
            message: generatedMessage,
          }),
        });

        if (zapiRes.ok) {
          const zapiData = await zapiRes.json();
          console.log(`✅ WhatsApp sent via Z-API to ${phone}:`, zapiData);
          whatsappSent = true;

          // Update recovery status to reflect WhatsApp was sent
          await supabase.from("recoveries")
            .update({ status: 'whatsapp_sent' })
            .eq("id", recoveryId);
        } else {
          const errText = await zapiRes.text();
          console.error(`❌ Z-API error (${zapiRes.status}):`, errText);
        }
      } catch (whatsappError) {
        console.error("❌ WhatsApp send failed:", (whatsappError as Error).message);
      }
    } else {
      if (!ZAPI_INSTANCE_ID || !ZAPI_TOKEN) {
        console.log("ℹ️  Z-API not configured — message saved to DB only. Configure ZAPI_INSTANCE_ID and ZAPI_TOKEN to enable WhatsApp.");
      }
      if (!recovery.customer_phone) {
        console.log("ℹ️  No phone number for this recovery — WhatsApp skipped.");
      }
    }

    // Notify admins about recovery attempt
    const adminEmails = ['luisgu0703@gmail.com', 'nathanwar03@gmail.com', 'ryanfernandosilva12@gmail.com'];
    await supabase.from('notifications').insert(
      adminEmails.map(email => ({
        user_email: email,
        title: `🔄 Recuperação ${whatsappSent ? '(WhatsApp Enviado!)' : '(Mensagem Gerada)'}`,
        body: `Cliente: ${recovery.customer_name || recovery.customer_email} | Valor: R$ ${recovery.amount}`,
        type: 'recovery',
      }))
    );

    console.log(`AI Recovery Message for ${recovery.customer_email}: ${generatedMessage}`);

    return new Response(JSON.stringify({ 
      message: generatedMessage, 
      checkout_url,
      whatsapp_sent: whatsappSent 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: (e as Error).message }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
