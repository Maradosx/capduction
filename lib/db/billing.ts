/**
 * lib/db/billing.ts
 * Server-side helpers for billing operations.
 * These run with service-role privileges in webhook context.
 */
import { createAdminClient } from '@/lib/supabase/admin';

interface BillingUpdate {
  plan: 'free' | 'studio' | 'agency';
  subscription_status: string;
  billing_customer_id?: string;
  stripe_price_id?: string | null;
  current_period_end?: string | null;
}

/**
 * Update a profile's billing columns ONLY (plan, status, period_end, customer_id).
 *
 * Does NOT touch credits_remaining — that's the caller's job via
 * `refreshCreditsForPlan` (called explicitly only on:
 *   - checkout.session.completed   (initial activation)
 *   - invoice.paid (cycle)         (monthly renewal)
 *   - subscription tier upgrade    (e.g. studio → agency)
 * ).
 *
 * Previously this function also reset credits on every webhook call — that
 * leaked free credits when Stripe fired subscription.updated for trivial
 * reasons (card update, address change, status flip).
 *
 * Uses the Supabase service client (bypasses RLS) — webhook context only.
 */
export async function updateBillingStatus(
  userId: string,
  updates: BillingUpdate,
  stripeEventId: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = createAdminClient();

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

  // Update profile billing columns (NOT credits — see comment above)
  const { error: profileErr } = await supabase
    .from('profiles')
    .update({
      plan: updates.plan,
      subscription_status: updates.subscription_status,
      billing_customer_id: updates.billing_customer_id,
      stripe_price_id: updates.stripe_price_id ?? null,
      current_period_end: updates.current_period_end ?? null,
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
