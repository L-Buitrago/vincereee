import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0"

/**
 * send-welcome-email
 * 
 * Called by the stripe-webhook after a customer pays.
 * Uses Resend API to send transactional emails.
 * 
 * Required env vars:
 *   RESEND_API_KEY  – Your Resend.com API key
 *   RESEND_FROM     – Verified sender (e.g. "Vincere <onboarding@vinceretech.com>")
 *                     Falls back to "Vincere <onboarding@resend.dev>" (Resend sandbox)
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

    const plan = planName || 'Starter'
    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
    const RESEND_FROM = Deno.env.get('RESEND_FROM') || 'Vincere <onboarding@resend.dev>'

    // ── Build the email HTML ──────────────────────────────────────────
    const emailHtml = `
<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:'Segoe UI',Roboto,sans-serif">
  <div style="max-width:560px;margin:40px auto;background:#111;border-radius:16px;overflow:hidden;border:1px solid #1a1a1a">
    <!-- Header -->
    <div style="padding:40px 32px 24px;text-align:center;background:linear-gradient(135deg,#0a0a0a,#111)">
      <h1 style="color:#fff;font-size:28px;margin:0 0 8px">Bem-vindo à Vincere! 🚀</h1>
      <p style="color:#888;font-size:14px;margin:0">${customerName}, sua jornada começa agora.</p>
    </div>
    <!-- Body -->
    <div style="padding:32px">
      <div style="background:#0a0a0a;border-radius:12px;padding:20px;border:1px solid #1a1a1a;margin-bottom:24px">
        <p style="color:#888;font-size:12px;text-transform:uppercase;letter-spacing:1px;margin:0 0 8px">Seu plano</p>
        <p style="color:#0ea5e9;font-size:22px;font-weight:700;margin:0">${plan}</p>
      </div>
      <p style="color:#ccc;font-size:14px;line-height:1.7;margin:0 0 24px">
        Sua assinatura foi ativada com sucesso! Acesse sua plataforma agora e comece a escalar seu negócio com inteligência.
      </p>
      <a href="https://vincere-tecnologia.lovable.app/plataforma/dashboard"
         style="display:block;text-align:center;background:#0ea5e9;color:#fff;padding:14px 24px;border-radius:12px;text-decoration:none;font-weight:700;font-size:15px">
        Acessar meu Dashboard →
      </a>
    </div>
    <!-- Footer -->
    <div style="padding:24px 32px;border-top:1px solid #1a1a1a;text-align:center">
      <p style="color:#555;font-size:11px;margin:0">
        Precisa de ajuda? Fale com a Vi, nossa assistente inteligente, ou responda este email.
      </p>
      <p style="color:#333;font-size:10px;margin:8px 0 0">© ${new Date().getFullYear()} Vincere Tecnologia</p>
    </div>
  </div>
</body>
</html>`

    let emailSent = false

    // ── Send via Resend (production) ─────────────────────────────────
    if (RESEND_API_KEY) {
      const resendRes = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: RESEND_FROM,
          to: [customerEmail],
          subject: `Bem-vindo à Vincere, ${customerName}! 🎉`,
          html: emailHtml,
        }),
      })

      if (resendRes.ok) {
        const resendData = await resendRes.json()
        console.log('✅ Email sent via Resend:', resendData.id)
        emailSent = true
      } else {
        const errText = await resendRes.text()
        console.error('❌ Resend error:', resendRes.status, errText)
        // We still continue — we log the attempt in the DB
      }
    } else {
      console.warn('⚠️ RESEND_API_KEY not configured — email logged but NOT sent.')
      console.log(`📧 Would send to: ${customerEmail} | Plan: ${plan}`)
    }

    // ── Log in database for tracking ────────────────────────────────
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || ''
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    await supabase.from('contact_requests').insert({
      customer_name: customerName,
      customer_email: customerEmail,
      service_type: 'welcome_email',
      message: `Email de boas-vindas para plano ${plan}`,
      status: emailSent ? 'sent' : 'pending',
    })

    // ── Also notify admins ──────────────────────────────────────────
    const adminEmails = ['luisgu0703@gmail.com', 'nathanwar03@gmail.com', 'ryanfernandosilva12@gmail.com']
    await supabase.from('notifications').insert(
      adminEmails.map(email => ({
        user_email: email,
        title: `💰 Nova Assinatura! ${plan}`,
        body: `${customerName} (${customerEmail}) assinou o plano ${plan}.`,
        type: 'payment',
      }))
    )

    return new Response(
      JSON.stringify({ success: true, sent: emailSent }),
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
