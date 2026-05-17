-- ============================================================
-- Capduction — Migration 006: decrement_credit accepts amount
-- (Already applied to live ljpgkbkrpnpfjzxjsfzn before this commit.)
-- ============================================================

-- Allow decrement_credit to subtract N credits in one atomic call.
-- Used so variants > 1 charges the correct number of credits
-- (variants=3 → 3 credits, not 1). Default 1 preserves prior callers.
CREATE OR REPLACE FUNCTION public.decrement_credit(
  p_user_id uuid,
  p_amount  integer DEFAULT 1
)
RETURNS integer AS $$
DECLARE
  remaining integer;
BEGIN
  -- Atomic: refuses to subtract if remaining < amount (never goes negative).
  UPDATE public.profiles
  SET credits_remaining = credits_remaining - p_amount
  WHERE id = p_user_id AND credits_remaining >= p_amount
  RETURNING credits_remaining INTO remaining;

  -- -1 signals "not enough credits" so the caller can refund the
  -- generation row or surface a friendly error.
  RETURN COALESCE(remaining, -1);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION public.decrement_credit(uuid, integer) TO authenticated;
