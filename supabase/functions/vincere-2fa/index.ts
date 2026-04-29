import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || ''
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const { action, userId, deviceId, code, email } = await req.json()

    if (action === 'send') {
      if (!userId || !email) {
        return new Response(JSON.stringify({ error: 'Missing userId or email' }), { status: 400, headers: corsHeaders })
      }

      // Generate 6-digit code
      const verificationCode = Math.floor(100000 + Math.random() * 900000).toString()
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString() // 10 minutes

      // Save to DB
      const { error: dbError } = await supabase
        .from('vincere_verification_codes')
        .insert([{ user_id: userId, code: verificationCode, expires_at: expiresAt }])

      if (dbError) throw dbError

      // Send Email
      const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
      const RESEND_FROM = Deno.env.get('RESEND_FROM') || 'Vincere <security@resend.dev>'

      if (RESEND_API_KEY) {
        const emailHtml = `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
            <h2 style="color: #0ea5e9;">Verificação de Novo Dispositivo</h2>
            <p>Olá,</p>
            <p>Identificamos uma tentativa de login na sua conta Vincere a partir de um novo dispositivo ou navegador.</p>
            <p>Use o código abaixo para autorizar este dispositivo:</p>
            <div style="background: #f4f4f4; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 5px; margin: 20px 0; border-radius: 5px;">
              ${verificationCode}
            </div>
            <p style="color: #666; font-size: 14px;">Este código expira em 10 minutos. Se você não solicitou este login, recomendamos alterar sua senha imediatamente.</p>
            <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
            <p style="font-size: 12px; color: #999;">© Vincere Tecnologia</p>
          </div>
        `

        const res = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${RESEND_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: RESEND_FROM,
            to: [email],
            subject: 'Seu código de verificação Vincere',
            html: emailHtml,
          }),
        })

        if (!res.ok) {
          const err = await res.text()
          console.error('Resend error:', err)
        }
      }

      return new Response(JSON.stringify({ success: true }), { headers: corsHeaders })
    }

    if (action === 'verify') {
      if (!userId || !code || !deviceId) {
        return new Response(JSON.stringify({ error: 'Missing params' }), { status: 400, headers: corsHeaders })
      }

      // Check code
      const { data, error } = await supabase
        .from('vincere_verification_codes')
        .select('*')
        .eq('user_id', userId)
        .eq('code', code)
        .gt('expires_at', new Date().toISOString())
        .order('created_at', { ascending: false })
        .limit(1)

      if (error || !data || data.length === 0) {
        return new Response(JSON.stringify({ error: 'Código inválido ou expirado' }), { status: 400, headers: corsHeaders })
      }

      // Code valid, register device
      const { error: deviceError } = await supabase
        .from('vincere_known_devices')
        .upsert([{ user_id: userId, device_id: deviceId, last_login_at: new Date().toISOString() }], { onConflict: 'user_id,device_id' })

      if (deviceError) throw deviceError

      // Cleanup codes for this user
      await supabase.from('vincere_verification_codes').delete().eq('user_id', userId)

      return new Response(JSON.stringify({ success: true }), { headers: corsHeaders })
    }

    return new Response(JSON.stringify({ error: 'Invalid action' }), { status: 400, headers: corsHeaders })

  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: corsHeaders })
  }
})
