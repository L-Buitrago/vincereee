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
    const { customerName, customerEmail, amount, dueDate } = await req.json()

    if (!customerEmail || !customerName) {
      return new Response(
        JSON.stringify({ error: 'Missing customer data' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
    const RESEND_FROM = Deno.env.get('RESEND_FROM') || 'Vincere <cobranca@resend.dev>'

    const formattedAmount = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(amount || 0)
    const formattedDate = dueDate ? new Date(dueDate).toLocaleDateString('pt-BR') : 'Não informada'

    const emailHtml = `
<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:'Segoe UI',Roboto,sans-serif">
  <div style="max-width:560px;margin:40px auto;background:#111;border-radius:16px;overflow:hidden;border:1px solid #1a1a1a">
    <!-- Header -->
    <div style="padding:40px 32px 24px;text-align:center;background:linear-gradient(135deg,#0a0a0a,#1a0a0a)">
      <h1 style="color:#f59e0b;font-size:24px;margin:0 0 8px">⚠️ Pagamento em Atraso</h1>
      <p style="color:#888;font-size:14px;margin:0">${customerName}, identificamos uma pendência no seu pagamento.</p>
    </div>
    <!-- Body -->
    <div style="padding:32px">
      <div style="background:#0a0a0a;border-radius:12px;padding:20px;border:1px solid #2a1a0a;margin-bottom:24px">
        <div style="display:flex;justify-content:space-between;margin-bottom:12px">
          <div>
            <p style="color:#888;font-size:12px;text-transform:uppercase;letter-spacing:1px;margin:0 0 4px">Valor</p>
            <p style="color:#f59e0b;font-size:22px;font-weight:700;margin:0">${formattedAmount}</p>
          </div>
          <div style="text-align:right">
            <p style="color:#888;font-size:12px;text-transform:uppercase;letter-spacing:1px;margin:0 0 4px">Vencimento</p>
            <p style="color:#f87171;font-size:16px;font-weight:700;margin:0">${formattedDate}</p>
          </div>
        </div>
      </div>
      <p style="color:#ccc;font-size:14px;line-height:1.7;margin:0 0 24px">
        Para evitar a suspensão dos seus serviços, regularize o pagamento o mais rápido possível. Se já realizou o pagamento, desconsidere este aviso.
      </p>
      <a href="https://vincere-tecnologia.lovable.app/plataforma/assinatura"
         style="display:block;text-align:center;background:#f59e0b;color:#000;padding:14px 24px;border-radius:12px;text-decoration:none;font-weight:700;font-size:15px">
        Regularizar Pagamento →
      </a>
    </div>
    <!-- Footer -->
    <div style="padding:24px 32px;border-top:1px solid #1a1a1a;text-align:center">
      <p style="color:#555;font-size:11px;margin:0">
        Se precisar de ajuda, entre em contato com nosso suporte ou responda este email.
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
          subject: `⚠️ Pagamento em atraso — ${formattedAmount}`,
          html: emailHtml,
        }),
      })

      if (resendRes.ok) {
        console.log('✅ Overdue email sent to:', customerEmail)
        emailSent = true
      } else {
        const errText = await resendRes.text()
        console.error('❌ Resend error:', resendRes.status, errText)
      }
    } else {
      console.warn('⚠️ RESEND_API_KEY not configured — email logged but NOT sent.')
      console.log(`📧 Would send overdue notice to: ${customerEmail} | Amount: ${formattedAmount}`)
    }

    return new Response(
      JSON.stringify({ success: true, sent: emailSent }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (err) {
    const error = err as Error
    console.error('Overdue email error:', error.message)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
