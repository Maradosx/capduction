/**
 * lib/supabase/admin.ts
 * Service-role Supabase client. Bypasses RLS.
 *
 * ⚠ NEVER import from client components or API routes that handle untrusted input
 * without explicit authorization checks. Only use in:
 *   - Stripe webhooks (no user session available)
 *   - Server-side billing / credit operations
 *   - Admin scripts
 */
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

let _admin: SupabaseClient<any, 'public', any> | null = null;

export function createAdminClient(): SupabaseClient<any, 'public', any> {
  if (_admin) return _admin;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error(
      '[supabase/admin] Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY — ' +
      'webhook + billing operations require the service-role key.'
    );
  }

  _admin = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return _admin;
}
