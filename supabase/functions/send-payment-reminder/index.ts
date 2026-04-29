import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { customerName, customerEmail, amount, dueDate, planName } = await req.json()

    if (!customerEmail || !customerName) {
      return new Response(
        JSON.stringify({ error: 'Missing customer data' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
    const RESEND_FROM = Deno.env.get('RESEND_FROM') || 'Vincere <cobranca@resend.dev>'

    const formattedAmount = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(amount || 0)
    const formattedDate = dueDate ? new Date(dueDate).toLocaleDateString('pt-BR') : 'em breve'
    const plan = planName || 'Vincere'

    const emailHtml = `
<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:'Segoe UI',Roboto,sans-serif">
  <div style="max-width:560px;margin:40px auto;background:#111;border-radius:16px;overflow:hidden;border:1px solid #1a1a1a">
    <!-- Header -->
    <div style="padding:40px 32px 24px;text-align:center;background:linear-gradient(135deg,#0a0a0a,#111)">
      <h1 style="color:#0ea5e9;font-size:24px;margin:0 0 8px">🔔 Lembrete de Pagamento</h1>
      <p style="color:#888;font-size:14px;margin:0">${customerName}, sua próxima cobrança está chegando.</p>
    </div>
    <!-- Body -->
    <div style="padding:32px">
      <div style="background:#0a0a0a;border-radius:12px;padding:20px;border:1px solid #1a1a1a;margin-bottom:24px">
        <div style="display:flex;justify-content:space-between">
          <div>
            <p style="color:#888;font-size:12px;text-transform:uppercase;letter-spacing:1px;margin:0 0 4px">Plano</p>
            <p style="color:#0ea5e9;font-size:18px;font-weight:700;margin:0">${plan}</p>
          </div>
          <div style="text-align:right">
            <p style="color:#888;font-size:12px;text-transform:uppercase;letter-spacing:1px;margin:0 0 4px">Valor</p>
            <p style="color:#fff;font-size:22px;font-weight:700;margin:0">${formattedAmount}</p>
          </div>
        </div>
        <div style="margin-top:16px;padding-top:16px;border-top:1px solid #1a1a1a">
          <p style="color:#888;font-size:12px;text-transform:uppercase;letter-spacing:1px;margin:0 0 4px">Vencimento</p>
          <p style="color:#f59e0b;font-size:16px;font-weight:700;margin:0">📅 ${formattedDate}</p>
        </div>
      </div>
      <p style="color:#ccc;font-size:14px;line-height:1.7;margin:0 0 24px">
        Este é um lembrete amigável de que sua assinatura será renovada em breve. Certifique-se de que seu método de pagamento está atualizado para evitar interrupções.
      </p>
      <a href="https://vincere-tecnologia.lovable.app/plataforma/assinatura"
         style="display:block;text-align:center;background:#0ea5e9;color:#fff;padding:14px 24px;border-radius:12px;text-decoration:none;font-weight:700;font-size:15px">
        Ver Minha Assinatura →
      </a>
    </div>
    <!-- Footer -->
    <div style="padding:24px 32px;border-top:1px solid #1a1a1a;text-align:center">
      <p style="color:#555;font-size:11px;margin:0">
        Se precisar alterar seu plano ou método de pagamento, acesse suas configurações.
      </p>
      <p style="color:#333;font-size:10px;margin:8px 0 0">© ${new Date().getFullYear()} Vincere Tecnologia</p>
    </div>
  </div>
</body>
</html>`

    let emailSent = false

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
          subject: `🔔 Lembrete: Seu pagamento de ${formattedAmount} vence ${formattedDate}`,
          html: emailHtml,
        }),
      })

      if (resendRes.ok) {
        console.log('✅ Reminder email sent to:', customerEmail)
        emailSent = true
      } else {
        const errText = await resendRes.text()
        console.error('❌ Resend error:', resendRes.status, errText)
      }
    } else {
      console.warn('⚠️ RESEND_API_KEY not configured — email logged but NOT sent.')
      console.log(`📧 Would send reminder to: ${customerEmail} | Amount: ${formattedAmount} | Due: ${formattedDate}`)
    }

    return new Response(
      JSON.stringify({ success: true, sent: emailSent }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (err) {
    const error = err as Error
    console.error('Reminder email error:', error.message)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
