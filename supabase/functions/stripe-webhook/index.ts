import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0"
import Stripe from 'https://esm.sh/stripe@14.17.0?target=deno'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2023-10-16',
  httpClient: Stripe.createFetchHttpClient(),
})

const cryptoProvider = Stripe.createSubtleCryptoProvider()

serve(async (req) => {
  const signature = req.headers.get('Stripe-Signature')

  if (!signature) {
    return new Response('Sem assinatura da Stripe', { status: 400 })
  }

  try {
    const body = await req.text()
    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET') || ''
    
    const event = await stripe.webhooks.constructEventAsync(
      body, signature, webhookSecret, undefined, cryptoProvider
    )

    const supabaseUrl = Deno.env.get('SUPABASE_URL') || ''
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const eventType = event.type
    const dataObject = event.data.object as any
    const metadata = dataObject.metadata || {}
    const paymentType = metadata.payment_type || 'vincere_subscription'
    const targetOrgId = metadata.org_id

    if (eventType === 'checkout.session.completed') {
      const email = dataObject.customer_details?.email
      const name = dataObject.customer_details?.name || 'Cliente'
      const phone = dataObject.customer_details?.phone || null
      const amount = (dataObject.amount_total || 0) / 100
      const stripeCustomerId = dataObject.customer || null
      const checkoutId = dataObject.id

      if (!email) return new Response('Email missing', { status: 400 })

      if (paymentType === 'vincere_subscription') {
        // --- SCENARIO A: Vincere Platform Subscription ---
        let finalOrgId: string | null = null

        const { data: existingOrg } = await supabase
          .from('organizations')
          .select('id')
          .eq('owner_email', email)
          .maybeSingle()

        if (existingOrg) {
          finalOrgId = existingOrg.id
          await supabase.from('organizations')
            .update({ status: 'active', stripe_customer_id: stripeCustomerId })
            .eq('id', finalOrgId)
        } else {
          const { data: newOrg, error: orgError } = await supabase
            .from('organizations')
            .insert({
              name: `Empresa de ${name}`,
              owner_email: email,
              stripe_customer_id: stripeCustomerId,
              plan: 'starter',
              status: 'active',
            })
            .select('id')
            .single()

          if (!orgError) finalOrgId = newOrg.id
        }

        if (finalOrgId) {
          const { data: authUser } = await supabase.auth.admin.listUsers()
          const matchingUser = authUser?.users?.find(u => u.email === email)
          if (matchingUser) {
            await supabase.from('org_members').upsert({
              org_id: finalOrgId,
              user_id: matchingUser.id,
              role: 'owner',
            }, { onConflict: 'org_id,user_id' })
          }
        }
      } else if (paymentType === 'client_revenue' && targetOrgId) {
        // --- SCENARIO B: Client (School) Revenue ---
        // 1. Record transaction for the school
        await supabase.from('transactions').insert({
          client_name: name,
          amount: amount,
          status: 'aprovado',
          gateway: 'stripe',
          product: dataObject.line_items?.[0]?.description || 'Serviço/Mensalidade',
          org_id: targetOrgId,
          date: new Date().toISOString()
        })

        // 2. Add/Update the student in the school's customer list
        await supabase.from('customers').upsert({
          email: email,
          name: name,
          phone: phone,
          total_spent: amount,
          status: 'Cliente Ativo',
          org_id: targetOrgId,
        }, { onConflict: 'email,org_id' })
      }

      // Update recovery if exists
      if (checkoutId) {
        await supabase.from('recoveries')
          .update({ status: 'recovered' })
          .eq('checkout_id', checkoutId)
      }
    } else if (eventType === 'checkout.session.expired' || eventType === 'payment_intent.payment_failed') {
      const email = dataObject.customer_details?.email
      if (email) {
        await supabase.from('recoveries').upsert({
          customer_email: email,
          customer_name: dataObject.customer_details?.name,
          customer_phone: dataObject.customer_details?.phone,
          amount: (dataObject.amount_total || 0) / 100,
          checkout_id: dataObject.id,
          org_id: targetOrgId, // Link to the specific school if available
          status: 'pending'
        }, { onConflict: 'checkout_id' })
      }
    }

    return new Response(JSON.stringify({ received: true }), { status: 200 })
  } catch (err) {
    console.error(`Webhook Error: ${err.message}`)
    return new Response(`Webhook Error: ${err.message}`, { status: 400 })
  }
})
