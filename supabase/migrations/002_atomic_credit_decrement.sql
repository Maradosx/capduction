-- ============================================================
-- SellBoost AI — Migration 002: Atomic Credit Decrement RPC
-- Run in Supabase SQL Editor AFTER migration 001
-- ============================================================

-- Atomic, race-safe credit decrement function.
-- Returns the new credit count. Returns -1 if already at 0.
CREATE OR REPLACE FUNCTION public.decrement_credit(uid uuid)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_credits integer;
  new_credits     integer;
BEGIN
  -- Lock the row for update to prevent concurrent decrements
  SELECT credits_remaining INTO current_credits
  FROM public.profiles
  WHERE id = uid
  FOR UPDATE;

  IF current_credits IS NULL THEN
    RETURN -1; -- Profile doesn't exist
  END IF;

  IF current_credits <= 0 THEN
    RETURN 0; -- Already exhausted
  END IF;

  new_credits := current_credits - 1;

  UPDATE public.profiles
  SET credits_remaining = new_credits,
      updated_at = now()
  WHERE id = uid;

  RETURN new_credits;
END;
$$;

-- Restrict: only the authenticated user may call this for their own uid
REVOKE ALL ON FUNCTION public.decrement_credit(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.decrement_credit(uuid) TO authenticated;
