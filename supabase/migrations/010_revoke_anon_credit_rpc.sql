-- 010_revoke_anon_credit_rpc
-- Close the anon-EXECUTE hole on the credit RPCs. Supabase default
-- privileges auto-grant EXECUTE to `anon` on every new public function;
-- migrations 008/009 revoked PUBLIC + authenticated but NOT anon, leaving
-- increment_credit (no ownership guard) callable by unauthenticated requests
-- via PostgREST (/rest/v1/rpc/increment_credit). Revoke anon, and pin
-- search_path on both functions.

REVOKE EXECUTE ON FUNCTION public.increment_credit(uuid, integer) FROM anon;
REVOKE EXECUTE ON FUNCTION public.increment_credit(uuid, integer) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.decrement_credit(uuid, integer) FROM anon;

ALTER FUNCTION public.increment_credit(uuid, integer) SET search_path = public, pg_temp;
ALTER FUNCTION public.decrement_credit(uuid, integer) SET search_path = public, pg_temp;
