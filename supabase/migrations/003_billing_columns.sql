-- ============================================================
-- SellBoost AI — Migration 003: Billing Columns & Events
-- Run in Supabase SQL Editor AFTER migrations 001 and 002
-- ============================================================

-- ─── Extend profiles with billing fields ─────────────────────
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS subscription_status  text NOT NULL DEFAULT 'inactive'
    CHECK (subscription_status IN ('active', 'inactive', 'past_due', 'canceled', 'trialing')),
  ADD COLUMN IF NOT EXISTS billing_customer_id  text,
  ADD COLUMN IF NOT EXISTS stripe_price_id      text,
  ADD COLUMN IF NOT EXISTS current_period_end   timestamptz;

-- Unique index on billing_customer_id for fast webhook lookups
CREATE UNIQUE INDEX IF NOT EXISTS profiles_billing_customer_id_idx
  ON public.profiles (billing_customer_id)
  WHERE billing_customer_id IS NOT NULL;

-- ─── Plan credit allocations (reference table) ───────────────
CREATE TABLE IF NOT EXISTS public.plan_credits (
  plan          text PRIMARY KEY,
  credits       integer NOT NULL,
  description   text
);

INSERT INTO public.plan_credits (plan, credits, description) VALUES
  ('free',       10,   'One-time allocation on signup'),
  ('starter',   300,   'Refreshed monthly on invoice.paid'),
  ('pro',      9999,   'Refreshed monthly on invoice.paid')
ON CONFLICT (plan) DO UPDATE SET
  credits = EXCLUDED.credits,
  description = EXCLUDED.description;

-- ─── Billing events audit log ────────────────────────────────
CREATE TABLE IF NOT EXISTS public.billing_events (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  event_type      text NOT NULL,   -- e.g. 'subscription_activated', 'credits_refilled'
  stripe_event_id text,            -- idempotency: Stripe event.id
  metadata        jsonb NOT NULL DEFAULT '{}',
  created_at      timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS billing_events_user_id_idx    ON public.billing_events (user_id);
CREATE INDEX IF NOT EXISTS billing_events_created_at_idx ON public.billing_events (created_at DESC);
CREATE UNIQUE INDEX IF NOT EXISTS billing_events_stripe_event_id_idx
  ON public.billing_events (stripe_event_id)
  WHERE stripe_event_id IS NOT NULL;

-- ─── RLS on billing_events ────────────────────────────────────
ALTER TABLE public.billing_events ENABLE ROW LEVEL SECURITY;

-- Users can read their own billing history
DROP POLICY IF EXISTS billing_events_select ON public.billing_events;
CREATE POLICY billing_events_select ON public.billing_events
  FOR SELECT USING (auth.uid() = user_id);

-- Only service role can insert (webhooks run as service role)
-- Client cannot insert billing events directly
DROP POLICY IF EXISTS billing_events_insert ON public.billing_events;
CREATE POLICY billing_events_insert ON public.billing_events
  FOR INSERT WITH CHECK (false); -- blocked for anon/authenticated

-- ─── RLS on plan_credits — public read ───────────────────────
ALTER TABLE public.plan_credits ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS plan_credits_select ON public.plan_credits;
CREATE POLICY plan_credits_select ON public.plan_credits
  FOR SELECT USING (true);
