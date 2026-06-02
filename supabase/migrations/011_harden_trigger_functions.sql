-- 011_harden_trigger_functions
-- handle_new_user() and set_updated_at() are trigger functions. Triggers fire
-- as the table owner regardless of EXECUTE privilege, so revoking direct
-- EXECUTE from anon/authenticated/PUBLIC does NOT affect trigger behavior --
-- it only removes the pointless /rest/v1/rpc/ direct-call surface. Pin
-- search_path on both to satisfy the mutable-search_path linter.

REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC;
ALTER FUNCTION public.handle_new_user() SET search_path = public, pg_temp;

REVOKE EXECUTE ON FUNCTION public.set_updated_at() FROM anon;
REVOKE EXECUTE ON FUNCTION public.set_updated_at() FROM authenticated;
REVOKE EXECUTE ON FUNCTION public.set_updated_at() FROM PUBLIC;
ALTER FUNCTION public.set_updated_at() SET search_path = public, pg_temp;
