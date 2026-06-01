/**
 * Admin gating helper.
 *
 * Reads ADMIN_EMAILS env (comma-separated, case-insensitive). In development
 * ONLY, falls back to the founder's email so the gate works out-of-the-box
 * without env config. In production an unset/empty ADMIN_EMAILS yields an
 * EMPTY allow-list — never a hardcoded admin — so a misconfigured deploy
 * fails closed (nobody is admin) instead of silently trusting a baked-in
 * email that could be spoofed or left stale.
 *
 * Used by:
 *  - app/dashboard/admin/* server pages
 *  - components/dashboard/sidebar.tsx (to conditionally render admin link)
 */

// Dev-only convenience fallback. Lowercased to match isAdmin()'s comparison.
const DEV_FALLBACK_ADMIN = 'athit.boonpinit@gmail.com';

export function adminEmails(): string[] {
  const raw = process.env.ADMIN_EMAILS;
  if (!raw || !raw.trim()) {
    // Fail closed in production; convenience fallback only in development.
    return process.env.NODE_ENV === 'production' ? [] : [DEV_FALLBACK_ADMIN];
  }
  return raw.split(',').map((e) => e.trim().toLowerCase()).filter(Boolean);
}

export function isAdmin(email: string | null | undefined): boolean {
  if (!email) return false;
  return adminEmails().includes(email.toLowerCase());
}
