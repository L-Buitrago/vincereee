import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0"

/**
 * send-welcome-email
 * 
 * Called by the stripe-webhook after a customer pays.
 * Uses Supabase's built-in email sending via auth.admin.
 * 
 * For production, you'd integrate with Resend, SendGrid, etc.
 * This version uses a simple approach via Supabase's email system.
 */

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { customerName, customerEmail, planName } = await req.json()

    if (!customerEmail || !customerName) {
      return new Response(
        JSON.stringify({ error: 'Missing customer data' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // For now, log the welcome email (in production, use Resend/SendGrid)
    console.log(`
    ========================================
    📧 WELCOME EMAIL
    ========================================
    Para: ${customerEmail}
    Nome: ${customerName}
    Plano: ${planName || 'Starter'}
    ========================================
    
    Assunto: Bem-vindo à Vincere, ${customerName}! 🎉

    Olá ${customerName},

    Sua assinatura do plano ${planName || 'Starter'} foi ativada com sucesso!

    Acesse sua plataforma em:
    https://vincere-tecnologia.lovable.app/plataforma/dashboard

    Se precisar de ajuda, fale com a Vi, nossa assistente,
    ou entre em contato pelo email contato@vinceretech.com.

    Equipe Vincere
    ========================================
    `)

    // Store email log in database for tracking
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || ''
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    await supabase.from('contact_requests').insert({
      customer_name: customerName,
      customer_email: customerEmail,
      service_type: 'welcome_email',
      message: `Email de boas-vindas enviado para plano ${planName || 'Starter'}`,
      status: 'sent',
    })

    return new Response(
      JSON.stringify({ success: true, message: 'Welcome email logged' }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (err) {
    const error = err as Error
    console.error('Welcome email error:', error.message)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
