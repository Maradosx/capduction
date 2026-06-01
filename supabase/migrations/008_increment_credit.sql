-- ============================================================
-- Capduction — Migration 008: atomic increment_credit (refunds)
-- ============================================================
--
-- Adds the counterpart to decrement_credit so the generate routes can
-- atomically REFUND credits when a generation fails AFTER the credit was
-- reserved (reserveCredits → generate → refundCredits on error).
--
-- SECURITY: This is granted to service_role ONLY — never to `authenticated`.
-- If it were callable by logged-in users they could top up their own credits
-- for free. Refunds therefore run through the service-role admin client in
-- lib/api-handler.ts (refundCredits()), the same trust boundary used by the
-- Stripe webhook handler.

CREATE OR REPLACE FUNCTION public.increment_credit(
  p_user_id uuid,
  p_amount  integer DEFAULT 1
)
RETURNS integer AS $$
DECLARE
  remaining integer;
BEGIN
  UPDATE public.profiles
  SET credits_remaining = credits_remaining + GREATEST(p_amount, 0)
  WHERE id = p_user_id
  RETURNING credits_remaining INTO remaining;

  RETURN COALESCE(remaining, -1);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Lock it down: only the service role (webhooks / server-side admin client).
REVOKE ALL ON FUNCTION public.increment_credit(uuid, integer) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.increment_credit(uuid, integer) FROM authenticated;
GRANT EXECUTE ON FUNCTION public.increment_credit(uuid, integer) TO service_role;
