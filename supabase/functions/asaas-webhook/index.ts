import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0"

serve(async (req) => {
  try {
    const body = await req.json()
    const event = body.event
    const payment = body.payment

    const supabaseUrl = Deno.env.get('SUPABASE_URL') || ''
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    console.log(`Asaas Webhook Received: ${event}`, payment)

    if (event === 'PAYMENT_RECEIVED' || event === 'PAYMENT_CONFIRMED') {
      const metadata = payment.metadata || {}
      const paymentType = metadata.payment_type
      const targetOrgId = metadata.org_id
      const email = payment.customer_email || metadata.customer_email
      const name = payment.customer_name || 'Cliente'
      const amount = payment.value

      if (paymentType === 'vincere_subscription') {
        // Find org by owner_email or metadata.org_id
        let { data: org } = await supabase
          .from('organizations')
          .select('id')
          .eq('owner_email', email)
          .maybeSingle()

        if (!org && targetOrgId) {
          org = { id: targetOrgId }
        }

        if (org) {
          await supabase.from('organizations')
            .update({ status: 'active' })
            .eq('id', org.id)
        } else {
          // Create new org if it doesn't exist
          await supabase.from('organizations').insert({
            name: `Empresa de ${name}`,
            owner_email: email,
            plan: 'starter',
            status: 'active',
          })
        }

        // --- ENVIAR EMAIL DE BOAS-VINDAS ---
        try {
          const supabaseUrl = Deno.env.get('SUPABASE_URL') || ''
          const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
          const welcomeUrl = `${supabaseUrl}/functions/v1/send-welcome-email`
          await fetch(welcomeUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${supabaseServiceKey}`,
            },
            body: JSON.stringify({
              customerName: name,
              customerEmail: email,
              planName: 'Starter',
            }),
          })
          console.log(`✅ Welcome email triggered for ${email} (Asaas)`)
        } catch (emailErr) {
          console.error('⚠️ Welcome email failed (non-blocking):', emailErr)
        }
      } else if (paymentType === 'client_revenue' && targetOrgId) {
        // Record transaction
        await supabase.from('transactions').insert({
          client_name: name,
          amount: amount,
          status: 'aprovado',
          gateway: 'asaas',
          product: payment.description || 'Serviço/Mensalidade',
          org_id: targetOrgId,
          date: new Date().toISOString()
        })

        // Add/Update customer
        await supabase.from('customers').upsert({
          email: email,
          name: name,
          total_spent: amount,
          status: 'Cliente Ativo',
          org_id: targetOrgId,
        }, { onConflict: 'email,org_id' })
      }
    }

    return new Response(JSON.stringify({ received: true }), { 
      headers: { 'Content-Type': 'application/json' },
      status: 200 
    })
  } catch (err) {
    console.error('Webhook Error:', err.message)
    return new Response(JSON.stringify({ error: err.message }), { status: 400 })
  }
})
