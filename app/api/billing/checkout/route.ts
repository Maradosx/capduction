import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { stripe, PRICE_IDS, isPaidPlan, isStripeConfigured } from '@/lib/stripe';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * GET /api/billing/checkout?plan=studio
 * Creates a Stripe Checkout session for the requested paid plan and redirects.
 *
 * Behavior:
 *  - Demo mode (no Stripe key): redirect to /pricing?error=stripe_not_configured
 *  - Not logged in: redirect to /login?next=/pricing
 *  - Invalid plan: 400
 *  - Success: 303 redirect to Stripe Checkout URL
 *  - Stripe returns user to /dashboard/settings on success or /pricing on cancel
 */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const plan = url.searchParams.get('plan') ?? '';
  const origin = `${url.protocol}//${url.host}`;

  if (!isStripeConfigured()) {
    return NextResponse.redirect(`${origin}/pricing?error=stripe_not_configured`, 303);
  }
  if (!isPaidPlan(plan)) {
    return NextResponse.json({ error: 'Invalid plan' }, { status: 400 });
  }
  const priceId = PRICE_IDS[plan];
  if (!priceId) {
    return NextResponse.redirect(`${origin}/pricing?error=missing_price_id&plan=${plan}`, 303);
  }

  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.redirect(`${origin}/login?next=/pricing`, 303);
  }

  // Reuse existing customer if profile already has one
  const { data: profile } = await supabase
    .from('profiles')
    .select('billing_customer_id, email')
    .eq('id', user.id)
    .single();

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card', 'promptpay'],
      customer:        profile?.billing_customer_id ?? undefined,
      customer_email:  profile?.billing_customer_id ? undefined : (user.email ?? undefined),
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${origin}/dashboard/settings?upgraded=${plan}`,
      cancel_url:  `${origin}/pricing?cancelled=1`,
      metadata: {
        supabase_user_id: user.id,
        plan,
      },
      subscription_data: {
        metadata: {
          supabase_user_id: user.id,
          plan,
        },
      },
      allow_promotion_codes: true,
    });
    if (!session.url) throw new Error('No session URL');
    return NextResponse.redirect(session.url, 303);
  } catch (err: any) {
    console.error('[billing/checkout]', err?.message ?? err);
    return NextResponse.redirect(`${origin}/pricing?error=checkout_failed`, 303);
  }
}
