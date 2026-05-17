import { redirect, notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { isAdmin } from '@/lib/admin';
import { FeedbackInbox, type FeedbackRow } from './feedback-inbox';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Feedback Inbox — Capduction' };

/**
 * Server-rendered admin inbox for in-app feedback.
 *
 * Gating: must be logged in AND email must be in ADMIN_EMAILS env
 * (fallback: athit.boonpinit@gmail.com). Non-admins get 404 — better
 * than 403 because it doesn't even hint the route exists.
 *
 * Read path uses service-role client to bypass the RLS policy that
 * scopes feedback rows to their author.
 */
export default async function AdminFeedbackPage({
  searchParams,
}: {
  searchParams: { type?: string; q?: string };
}) {
  // Demo mode (no Supabase config locally) — render a placeholder rather
  // than crashing createClient() with "URL and Key required".
  const isDemoMode = !process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (isDemoMode) {
    return (
      <FeedbackInbox
        rows={[]}
        counts={{ all: 0 }}
        activeType="all"
        query=""
        error="Demo mode — Supabase not configured. This page is fully functional in production."
      />
    );
  }

  // Gate
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login?next=/dashboard/admin/feedback');
  if (!isAdmin(user.email)) notFound();

  // Read (service-role, sees every row)
  const admin = createAdminClient();
  let query = admin
    .from('feedback')
    .select('id, created_at, type, email, message, page, user_agent, metadata, user_id')
    .order('created_at', { ascending: false })
    .limit(200);

  if (searchParams.type && searchParams.type !== 'all') {
    query = query.eq('type', searchParams.type);
  }
  if (searchParams.q) {
    // Postgres ILIKE — case-insensitive substring search on message + email.
    const term = `%${searchParams.q.replace(/[%_]/g, '\\$&')}%`;
    query = query.or(`message.ilike.${term},email.ilike.${term}`);
  }

  const { data, error } = await query;
  const rows: FeedbackRow[] = (data as FeedbackRow[] | null) ?? [];

  // Aggregate counts for the filter chips.
  const { data: counts } = await admin
    .from('feedback')
    .select('type', { count: 'exact', head: false });
  const byType = (counts ?? []).reduce<Record<string, number>>((acc, r: any) => {
    acc[r.type] = (acc[r.type] ?? 0) + 1;
    acc.all = (acc.all ?? 0) + 1;
    return acc;
  }, {});

  return (
    <FeedbackInbox
      rows={rows}
      counts={byType}
      activeType={searchParams.type ?? 'all'}
      query={searchParams.q ?? ''}
      error={error?.message ?? null}
    />
  );
}
