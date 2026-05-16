/**
 * lib/db/events.ts
 * Analytics event tracking — stores to usage_events table.
 * Design: fire-and-forget on client, awaited on server.
 */
import { createClient } from '@/lib/supabase/server';

export type EventType =
  | 'GENERATE'
  | 'UPGRADE_CLICK'
  | 'CREDIT_EXHAUSTED'
  | 'LOCKED_FEATURE_CLICK'
  | 'FIRST_GENERATION'
  | 'REFERRAL_SIGNUP'
  | 'REFERRAL_CREDIT_AWARDED'
  | 'PLAN_UPGRADED'
  | 'PLAN_CANCELLED'
  | 'BILLING_PORTAL_OPEN';

interface TrackEventParams {
  event: EventType;
  metadata?: Record<string, string | number | boolean | null>;
}

/**
 * Server-side event tracker. Call from API routes or server actions.
 */
export async function trackEvent({ event, metadata = {} }: TrackEventParams): Promise<void> {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from('usage_events').insert({
      user_id: user.id,
      event_type: event,
      metadata,
    });
  } catch {
    // Tracking errors are non-fatal — never surface to user
  }
}

/**
 * Analytics query helpers for dashboard
 */
export async function getActivationFunnelStats(userId: string) {
  const supabase = createClient();

  const { data } = await supabase
    .from('usage_events')
    .select('event_type, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: true });

  if (!data) return null;

  const firstGeneration = data.find((e) => e.event_type === 'FIRST_GENERATION');
  const upgradeClicks = data.filter((e) => e.event_type === 'UPGRADE_CLICK').length;
  const creditExhaustions = data.filter((e) => e.event_type === 'CREDIT_EXHAUSTED').length;
  const planUpgraded = data.find((e) => e.event_type === 'PLAN_UPGRADED');

  return {
    firstGenerationAt: firstGeneration?.created_at ?? null,
    upgradeClicks,
    creditExhaustions,
    convertedAt: planUpgraded?.created_at ?? null,
  };
}

/**
 * Aggregate stats for admin/internal analytics
 */
export async function getAdminEventCounts() {
  const supabase = createClient();

  const { data } = await supabase
    .from('usage_events')
    .select('event_type')
    .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

  if (!data) return {};

  return data.reduce((acc: Record<string, number>, row) => {
    acc[row.event_type] = (acc[row.event_type] ?? 0) + 1;
    return acc;
  }, {});
}
