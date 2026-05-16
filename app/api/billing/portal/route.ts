import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { stripe, isStripeConfigured } from '@/lib/stripe';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * GET /api/billing/portal
 * Creates a Stripe Customer Portal session for the logged-in user
 * (manage subscription, view invoices, cancel, update payment method).
 */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const origin = `${url.protocol}//${url.host}`;

  if (!isStripeConfigured()) {
    return NextResponse.redirect(`${origin}/pricing?error=stripe_not_configured`, 303);
  }

  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.redirect(`${origin}/login?next=/dashboard/settings`, 303);
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('billing_customer_id')
    .eq('id', user.id)
    .single();

  if (!profile?.billing_customer_id) {
    // No customer yet — send them to pricing to subscribe first
    return NextResponse.redirect(`${origin}/pricing?error=no_subscription`, 303);
  }

  try {
    const session = await stripe.billingPortal.sessions.create({
      customer:    profile.billing_customer_id,
      return_url:  `${origin}/dashboard/settings`,
    });
    return NextResponse.redirect(session.url, 303);
  } catch (err: any) {
    console.error('[billing/portal]', err?.message ?? err);
    return NextResponse.redirect(`${origin}/dashboard/settings?error=portal_failed`, 303);
  }
}
