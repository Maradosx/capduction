-- ============================================================
-- Capduction — Migration 005: Add 'creator' to plan check
-- Run in Supabase SQL Editor (already applied to live ljpgkbkrpnpfjzxjsfzn).
-- ============================================================

-- Add 'creator' to allowed plan values for the 4-tier pricing
-- (Free / Creator ฿199 / Studio ฿549 / Agency ฿1,890).
--
-- Without this, the Stripe webhook silently fails on plan='creator':
--   1. Postgres CHECK constraint violation
--   2. supabase-js returns error
--   3. webhook handler's outer try/catch returns 200 to prevent Stripe
--      retry-storm, only emitting a console.error
--   4. User pays but profile is never upgraded.

ALTER TABLE public.profiles
  DROP CONSTRAINT IF EXISTS profiles_plan_check;

ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_plan_check
  CHECK (plan IN ('free', 'creator', 'studio', 'agency'));
