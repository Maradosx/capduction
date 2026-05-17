/**
 * lib/db/billing.ts
 * Server-side helpers for billing operations.
 * These run with service-role privileges in webhook context.
 */
import { createAdminClient } from '@/lib/supabase/admin';
import { PLAN_CREDITS } from '@/types';

interface BillingUpdate {
  plan: 'free' | 'studio' | 'agency';
  subscription_status: string;
  billing_customer_id?: string;
  stripe_price_id?: string | null;
  current_period_end?: string | null;
}

/**
 * Update a profile's billing state and refill credits.
 * Uses the Supabase service client (bypasses RLS) — only call from server/webhook context.
 */
export async function updateBillingStatus(
  userId: string,
  updates: BillingUpdate,
  stripeEventId: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = createAdminClient();

  const creditsToRefill = PLAN_CREDITS[updates.plan] ?? PLAN_CREDITS.free;

  // Idempotency guard: skip if we've already processed this Stripe event
  const { data: existing } = await supabase
    .from('billing_events')
    .select('id')
    .eq('stripe_event_id', stripeEventId)
    .maybeSingle();

  if (existing) {
    console.log(`[billing] Already processed event ${stripeEventId}, skipping.`);
    return { success: true };
  }

  // Update profile billing columns + refill credits
  const { error: profileErr } = await supabase
    .from('profiles')
    .update({
      plan: updates.plan,
      subscription_status: updates.subscription_status,
      billing_customer_id: updates.billing_customer_id,
      stripe_price_id: updates.stripe_price_id ?? null,
      current_period_end: updates.current_period_end ?? null,
      credits_remaining: creditsToRefill,
      updated_at: new Date().toISOString(),
    })
    .eq('id', userId);

  if (profileErr) {
    console.error('[billing] Failed to update profile:', profileErr.message);
    return { success: false, error: profileErr.message };
  }

  // Log billing event (service role bypasses INSERT policy restriction)
  await supabase.from('billing_events').insert({
    user_id: userId,
    event_type: `billing_${updates.plan}_${updates.subscription_status}`,
    stripe_event_id: stripeEventId,
    metadata: {
      plan: updates.plan,
      credits_refilled: creditsToRefill,
      current_period_end: updates.current_period_end,
    },
  });

  return { success: true };
}

/**
 * Find a user profile by their Stripe customer ID.
 * Used in webhook handlers where we only have the Stripe customer ID.
 */
export async function getProfileByCustomerId(
  customerId: string
): Promise<{ id: string; plan: string } | null> {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from('profiles')
    .select('id, plan')
    .eq('billing_customer_id', customerId)
    .single();

  if (error || !data) return null;
  return data;
}

/**
 * Store Stripe customer ID on first checkout completion.
 */
export async function linkStripeCustomer(
  userId: string,
  customerId: string
): Promise<void> {
  const supabase = createAdminClient();
  await supabase
    .from('profiles')
    .update({ billing_customer_id: customerId })
    .eq('id', userId);
}
