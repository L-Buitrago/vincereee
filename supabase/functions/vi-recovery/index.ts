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

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    // Generate recovery URL
    const checkout_url = recovery.checkout_id 
      ? `https://checkout.stripe.com/pay/${recovery.checkout_id}`
      : "https://vincere-tecnologia.lovable.app/plataforma/proposta";

    // Replace variables in prompt
    const prompt = SYSTEM_PROMPT_RECOVERY
      .replace(/{{customer_name}}/g, recovery.customer_name || "aí")
      .replace(/{{business_name}}/g, business_name)
      .replace("{{amount}}", `R$ ${recovery.amount}`)
      .replace("{{checkout_url}}", checkout_url);

    // Call AI to generate message
    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-pro",
        messages: [
          { role: "system", content: prompt },
          { role: "user", content: "Gere a mensagem de recuperação para este cliente." }
        ],
      }),
    });

    const aiResult = await aiResponse.json();
    const generatedMessage = aiResult.choices[0].message.content;

    // Save generated message to DB
    await supabase.from("recoveries")
      .update({ last_ai_message: generatedMessage, status: 'contacted' })
      .eq("id", recoveryId);

    // --- WHATSAPP INTEGRATION ---
    // Example: Integration with Z-API or Evolution API
    // const WHATSAPP_API_URL = Deno.env.get("WHATSAPP_API_URL");
    // const WHATSAPP_TOKEN = Deno.env.get("WHATSAPP_TOKEN");
    // if (WHATSAPP_API_URL && recovery.customer_phone) {
    //   await fetch(WHATSAPP_API_URL, {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json", "Authorization": WHATSAPP_TOKEN },
    //     body: JSON.stringify({ phone: recovery.customer_phone, message: generatedMessage })
    //   });
    // }

    console.log(`AI Recovery Message for ${recovery.customer_email}: ${generatedMessage}`);

    return new Response(JSON.stringify({ message: generatedMessage, checkout_url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
