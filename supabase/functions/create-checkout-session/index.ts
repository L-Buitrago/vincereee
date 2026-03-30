import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import Stripe from 'https://esm.sh/stripe@14.17.0?target=deno'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { planName, priceAmount, paymentType = 'vincere_subscription', orgId } = await req.json()

    // Initialize Stripe using the secret key from Supabase Edge Secrets
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
      apiVersion: '2023-10-16',
      httpClient: Stripe.createFetchHttpClient(),
    })

    const isSubscription = paymentType === 'vincere_subscription';

    // Create Checkout Session for Embedded Checkout
    const session = await stripe.checkout.sessions.create({
      ui_mode: 'embedded',
      payment_method_types: isSubscription ? ['card'] : ['card', 'pix'],
      metadata: {
        payment_type: paymentType,
        org_id: orgId || '',
      },
      payment_method_options: isSubscription ? undefined : {
        pix: {
          expires_after_seconds: 1800, // 30 minutes
        },
      },
      line_items: [
        {
          price_data: {
             currency: 'brl',
             product_data: {
               name: paymentType === 'vincere_subscription' 
                ? `Vincere Plataforma - Plano ${planName}`
                : `Mensalidade / Serviço`,
             },
             unit_amount: Math.round(priceAmount * 100), // Ensure integer
             recurring: paymentType === 'vincere_subscription' ? {
                interval: 'month',
             } : undefined
          },
          quantity: 1,
        },
      ],
      mode: paymentType === 'vincere_subscription' ? 'subscription' : 'payment',
      return_url: `${req.headers.get("origin") || 'https://vincere-tecnologia.lovable.app'}/plataforma/dashboard?session_id={CHECKOUT_SESSION_ID}`,
    })

    return new Response(
      JSON.stringify({ clientSecret: session.client_secret }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (err) {
    const error = err as Error;
    console.error("Stripe Error:", error.message);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200, // Changed to 200 so the frontend fetch doesn't throw a generic HttpError
      }
    )
  }
})
