/**
 * Admin gating helper.
 *
 * Reads ADMIN_EMAILS env (comma-separated). Falls back to the founder's
 * email so the gate works out-of-the-box in dev without env config.
 *
 * Used by:
 *  - app/dashboard/admin/* server pages
 *  - components/dashboard/sidebar.tsx (to conditionally render admin link)
 */

const FALLBACK_ADMIN = 'athit.boonpinit@gmail.com';

export function adminEmails(): string[] {
  const raw = process.env.ADMIN_EMAILS;
  if (!raw) return [FALLBACK_ADMIN];
  return raw.split(',').map((e) => e.trim().toLowerCase()).filter(Boolean);
}

export function isAdmin(email: string | null | undefined): boolean {
  if (!email) return false;
  return adminEmails().includes(email.toLowerCase());
}
