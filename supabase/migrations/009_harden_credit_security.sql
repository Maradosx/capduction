-- ============================================================
-- Capduction — Migration 009: harden credit / billing security
-- ============================================================
--
-- Closes three privilege-escalation holes found in a production audit.
-- These are DEFENSE-IN-DEPTH at the database trust boundary — they hold even
-- if an attacker bypasses the API and talks to PostgREST directly with the
-- public anon key.
--
-- ⚠️  TEST ON A SUPABASE PREVIEW BRANCH BEFORE APPLYING TO PRODUCTION.
--     It changes table privileges and a function signature; verify the
--     generate flow (decrement) and Stripe webhook (credit refill) still work.
--
-- ── #1  CRITICAL — users could rewrite their own credits / plan ────────────
-- The `profiles_update` RLS policy (migration 001) only checks the ROW
-- (`auth.uid() = id`); it does NOT restrict WHICH COLUMNS may change. So any
-- logged-in user could call PostgREST directly:
--
--     supabase.from('profiles')
--       .update({ credits_remaining: 999999, plan: 'agency',
--                 subscription_status: 'active' })
--       .eq('id', myId)
--
-- and mint unlimited credits / upgrade themselves for free — defeating the
-- whole credit economy and the locked-down increment_credit RPC (008).
--
-- Fix: column-level UPDATE privileges. RLS controls the row; GRANT controls
-- the columns. authenticated may only write the cosmetic profile fields. The
-- credit/billing columns are writable ONLY by:
--   • the service_role admin client (Stripe webhook, refunds), and
--   • the SECURITY DEFINER credit RPCs (run as the table owner),
-- both of which bypass these grants.

REVOKE UPDATE ON public.profiles FROM authenticated;
REVOKE UPDATE ON public.profiles FROM anon;

-- Re-grant ONLY the user-editable cosmetic columns.
GRANT UPDATE (full_name, avatar_url, email) ON public.profiles TO authenticated;

-- (The existing profiles_update RLS policy still applies on top, so a user can
--  only touch their OWN row's cosmetic columns.)


-- ── #2  HIGH — any user could drain ANOTHER user's credits ─────────────────
-- decrement_credit(p_user_id, p_amount) is SECURITY DEFINER, granted to
-- `authenticated`, and took an arbitrary p_user_id with NO ownership check.
-- A logged-in attacker could call:
--
--     supabase.rpc('decrement_credit', { p_user_id: '<victim>', p_amount: 9999 })
--
-- to zero out a victim's paid credits (griefing / denial of paid service).
--
-- Fix: reject calls where p_user_id is not the caller (service_role exempt, so
-- server-side admin paths still work). Logic is otherwise unchanged from 006.

CREATE OR REPLACE FUNCTION public.decrement_credit(
  p_user_id uuid,
  p_amount  integer DEFAULT 1
)
RETURNS integer AS $$
DECLARE
  remaining integer;
BEGIN
  -- Ownership guard: a user may only spend their OWN credits. service_role
  -- (auth.role() = 'service_role') is exempt for trusted server-side calls.
  IF p_user_id IS DISTINCT FROM auth.uid()
     AND coalesce(auth.role(), '') IS DISTINCT FROM 'service_role' THEN
    RAISE EXCEPTION 'forbidden: cannot decrement another user''s credits';
  END IF;

  -- Atomic: refuses to subtract if remaining < amount (never goes negative).
  UPDATE public.profiles
  SET credits_remaining = credits_remaining - GREATEST(p_amount, 0)
  WHERE id = p_user_id AND credits_remaining >= GREATEST(p_amount, 0)
  RETURNING credits_remaining INTO remaining;

  -- -1 signals "not enough credits" so the caller can surface a friendly error.
  RETURN COALESCE(remaining, -1);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

REVOKE ALL    ON FUNCTION public.decrement_credit(uuid, integer) FROM PUBLIC;
GRANT  EXECUTE ON FUNCTION public.decrement_credit(uuid, integer) TO authenticated;
GRANT  EXECUTE ON FUNCTION public.decrement_credit(uuid, integer) TO service_role;


-- ── #3  MEDIUM — drop the stale single-arg overload ────────────────────────
-- Migration 002 defined decrement_credit(uuid) with a DIFFERENT exhausted
-- sentinel (returns 0) than the live 2-arg version (returns -1), and it also
-- lacked the ownership guard above. Nothing calls it anymore (all callers pass
-- p_user_id → the 2-arg form). Remove it to kill the ambiguity + the
-- unguarded drain vector.

DROP FUNCTION IF EXISTS public.decrement_credit(uuid);
