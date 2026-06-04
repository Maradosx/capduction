/**
 * lib/db/billing.ts
 * Server-side helpers for billing operations.
 * These run with service-role privileges in webhook context.
 */
import { createAdminClient } from '@/lib/supabase/admin';

interface BillingUpdate {
  plan: 'free' | 'creator' | 'studio' | 'agency';
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
 * Does NOT mark the Stripe event processed either — that is done LAST by
 * `markStripeEventProcessed`, only after EVERY side effect (this write AND the
 * credit grant) has succeeded. If we marked the event here (mid-flow) and the
 * subsequent credit grant then failed, the webhook's top-level idempotency
 * guard would treat the retry as a duplicate and skip it — leaving a paying
 * user un-credited forever. All writes are absolute (set plan=X, credits=alloc)
 * so a Stripe retry re-running them is safe.
 *
 * Uses the Supabase service client (bypasses RLS) — webhook context only.
 */
export async function updateBillingStatus(
  userId: string,
  updates: BillingUpdate
): Promise<{ success: boolean; error?: string }> {
  const supabase = createAdminClient();

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

  return { success: true };
}

/**
 * Record that a Stripe event has been fully processed. MUST be called LAST in a
 * webhook case — after the billing write AND any credit grant have succeeded —
 * so the top-level `hasProcessedStripeEvent` guard only short-circuits events
 * that genuinely completed end to end.
 *
 * Tolerant of the unique-constraint violation on `stripe_event_id` (race where
 * Stripe delivers the same event twice concurrently): the duplicate insert is a
 * no-op success, since all side effects are idempotent absolute writes.
 */
export async function markStripeEventProcessed(
  userId: string,
  eventType: string,
  stripeEventId: string,
  metadata: Record<string, unknown> = {}
): Promise<void> {
  const supabase = createAdminClient();
  const { error } = await supabase.from('billing_events').insert({
    user_id: userId,
    event_type: eventType,
    stripe_event_id: stripeEventId,
    metadata,
  });
  // 23505 = unique_violation → event already recorded by a concurrent delivery.
  if (error && (error as { code?: string }).code !== '23505') {
    console.error('[billing] Failed to record processed event:', error.message);
  }
}

/**
 * Idempotency check for the WHOLE webhook event — call this at the very top of
 * the handler, before any side effects (credit grants, plan changes).
 *
 * The previous design only guarded `updateBillingStatus`, but
 * `refreshCreditsForPlan` ran separately and unguarded — so a duplicate
 * `invoice.paid` retry (Stripe retries on any non-2xx or timeout) would
 * re-grant a full month of credits mid-cycle. Checking here covers every
 * side effect for the event.
 *
 * Returns true if we've already recorded this Stripe event id.
 */
export async function hasProcessedStripeEvent(stripeEventId: string): Promise<boolean> {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from('billing_events')
    .select('id')
    .eq('stripe_event_id', stripeEventId)
    .maybeSingle();
  return Boolean(data);
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
