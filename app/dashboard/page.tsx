import { createClient } from '@/lib/supabase/server';
import { getProfile } from '@/lib/db/profiles';
import { getRecentGenerations, getGenerationCount } from '@/lib/db/generations';
import type { Generation, Profile } from '@/types';
import { DashboardClient } from './dashboard-client';

export default async function DashboardHome() {
  const isDemoMode = !process.env.NEXT_PUBLIC_SUPABASE_URL;

  let profile: Profile | null = null;
  let recent:  Generation[]   = [];
  let total = 0;

  if (!isDemoMode) {
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        [profile, recent, total] = await Promise.all([
          getProfile(),
          getRecentGenerations(5),
          getGenerationCount(),
        ]);
      }
    } catch { /* swallow */ }
  }

  const displayName = profile?.full_name?.split(' ')[0]
    ?? profile?.email?.split('@')[0]
    ?? (isDemoMode ? 'Demo' : 'creator');
  const credits = profile?.credits_remaining ?? 10;
  const plan    = profile?.plan ?? 'free';

  return (
    <DashboardClient
      displayName={displayName}
      credits={credits}
      plan={plan}
      total={total}
      recent={recent}
      isDemoMode={isDemoMode}
    />
  );
}
