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
    const { planName, priceAmount, paymentType = 'vincere_subscription', orgId, customerName, customerEmail, cpfCnpj } = await req.json()

    const ASAAS_API_KEY = Deno.env.get('ASAAS_API_KEY')
    const ASAAS_URL = 'https://www.asaas.com/api/v3' // Use sandbox for testing if needed

    if (!ASAAS_API_KEY) {
      throw new Error('ASAAS_API_KEY not configured')
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL') || ''
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // 1. Find or Create Customer in Asaas
    let asaasCustomerId = ''
    
    // Check if we already have a customer with this email
    const customerSearchRes = await fetch(`${ASAAS_URL}/customers?email=${customerEmail}`, {
      headers: { 'access_token': ASAAS_API_KEY }
    })
    const searchData = await customerSearchRes.json()
    
    if (searchData.data && searchData.data.length > 0) {
      asaasCustomerId = searchData.data[0].id
    } else {
      const createCustomerRes = await fetch(`${ASAAS_URL}/customers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'access_token': ASAAS_API_KEY
        },
        body: JSON.stringify({
          name: customerName,
          email: customerEmail,
          cpfCnpj: cpfCnpj,
          notificationDisabled: false
        })
      })
      const newCustomer = await createCustomerRes.json()
      if (newCustomer.errors) throw new Error(newCustomer.errors[0].description)
      asaasCustomerId = newCustomer.id
    }

    // 2. Create Payment or Subscription
    const isSubscription = paymentType === 'vincere_subscription'
    const endpoint = isSubscription ? '/subscriptions' : '/payments'
    
    const body: any = {
      customer: asaasCustomerId,
      billingType: 'UNDEFINED', // Allow user to choose in checkout (Pix, Card, Boleto)
      value: priceAmount,
      dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Tomorrow
      description: isSubscription ? `Assinatura Vincere - Plano ${planName}` : 'Pagamento Vincere',
      metadata: {
        payment_type: paymentType,
        org_id: orgId || ''
      }
    }

    if (isSubscription) {
      body.cycle = 'MONTHLY'
    }

    const paymentRes = await fetch(`${ASAAS_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'access_token': ASAAS_API_KEY
      },
      body: JSON.stringify(body)
    })

    const paymentData = await paymentRes.json()
    if (paymentData.errors) throw new Error(paymentData.errors[0].description)

    return new Response(
      JSON.stringify({ invoiceUrl: paymentData.invoiceUrl || paymentData.bankSlipUrl }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  }
})
