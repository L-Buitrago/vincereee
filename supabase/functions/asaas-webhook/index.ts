import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0"

serve(async (req) => {
  try {
    // ── Webhook Security: Verify access token ──────────────────────
    const webhookToken = Deno.env.get('ASAAS_WEBHOOK_TOKEN')
    if (webhookToken) {
      const authHeader = req.headers.get('asaas-access-token') || req.headers.get('access_token') || ''
      const url = new URL(req.url)
      const queryToken = url.searchParams.get('token') || ''
      
      if (authHeader !== webhookToken && queryToken !== webhookToken) {
        console.error('❌ Webhook rejected: Invalid or missing authentication token')
        return new Response(JSON.stringify({ error: 'Unauthorized' }), { 
          headers: { 'Content-Type': 'application/json' },
          status: 401 
        })
      }
    } else {
      console.warn('⚠️ ASAAS_WEBHOOK_TOKEN not configured — webhook accepting all requests (INSECURE)')
    }

    const body = await req.json()
    const event = body.event
    const payment = body.payment

    const supabaseUrl = Deno.env.get('SUPABASE_URL') || ''
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    console.log(`✅ Asaas Webhook Received: ${event}`, JSON.stringify({
      id: payment?.id,
      value: payment?.value,
      status: payment?.status,
      customer: payment?.customer,
    }))

    if (event === 'PAYMENT_RECEIVED' || event === 'PAYMENT_CONFIRMED') {
      const metadata = payment.metadata || {}
      const paymentType = metadata.payment_type
      const targetOrgId = metadata.org_id
      const email = payment.customer_email || metadata.customer_email
      const name = payment.customer_name || 'Cliente'
      const amount = payment.value

      if (paymentType === 'vincere_subscription') {
        // Determine plan based on amount paid
        let plan = 'starter'
        if (amount >= 497) plan = 'enterprise'
        else if (amount >= 197) plan = 'pro'

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
            .update({ status: 'active', plan })
            .eq('id', org.id)
        } else {
          // Create new org if it doesn't exist
          const { data: newOrg } = await supabase.from('organizations').insert({
            name: `Empresa de ${name}`,
            owner_email: email,
            plan,
            status: 'active',
          }).select('id').single()

          org = newOrg
        }

        // Auto-associate user as org_member (so SubscriptionGuard grants access)
        if (org && email) {
          const { data: authUser } = await supabase.auth.admin.listUsers()
          const matchedUser = authUser?.users?.find(
            (u: any) => u.email?.toLowerCase() === email.toLowerCase()
          )
          if (matchedUser) {
            // Upsert to avoid duplicate key error
            await supabase.from('org_members').upsert({
              org_id: org.id,
              user_id: matchedUser.id,
              role: 'admin'
            }, { onConflict: 'org_id,user_id' })
            console.log(`✅ User ${email} linked to org ${org.id} as admin`)
          }
        }

        // --- ENVIAR EMAIL DE BOAS-VINDAS ---
        try {
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
              planName: plan.charAt(0).toUpperCase() + plan.slice(1),
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

    // Handle payment overdue
    if (event === 'PAYMENT_OVERDUE') {
      const metadata = payment.metadata || {}
      const email = payment.customer_email || metadata.customer_email
      const name = payment.customer_name || 'Cliente'

      console.log(`⚠️ Payment overdue for ${email}`)

      // Trigger overdue email
      try {
        const overdueUrl = `${supabaseUrl}/functions/v1/send-overdue-email`
        await fetch(overdueUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${supabaseServiceKey}`,
          },
          body: JSON.stringify({
            customerName: name,
            customerEmail: email,
            amount: payment.value,
            dueDate: payment.dueDate,
          }),
        })
      } catch (emailErr) {
        console.error('⚠️ Overdue email failed (non-blocking):', emailErr)
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
