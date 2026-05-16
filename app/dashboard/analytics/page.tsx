import { createClient } from '@/lib/supabase/server';
import { getProfile } from '@/lib/db/profiles';
import {
  getGenerationCount,
  getGenerationsThisWeek,
  getTopPlatformAndTone,
} from '@/lib/db/generations';
import { AnalyticsClient } from './analytics-client';

export default async function AnalyticsPage() {
  const isDemoMode = !process.env.NEXT_PUBLIC_SUPABASE_URL;

  let total = 0, week = 0, scripts = 0, captions = 0, combos = 0, credits = 10;
  let plan = 'free' as 'free' | 'studio' | 'agency';
  let topPlatform: string | null = null, topTone: string | null = null;

  if (!isDemoMode) {
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const [t, w, s, c, co, prof, top] = await Promise.all([
          getGenerationCount(),
          getGenerationsThisWeek(),
          getGenerationCount('script'),
          getGenerationCount('caption'),
          getGenerationCount('combo'),
          getProfile(),
          getTopPlatformAndTone(),
        ]);
        total    = t; week = w; scripts = s; captions = c; combos = co;
        credits  = prof?.credits_remaining ?? 10;
        plan     = (prof?.plan ?? 'free') as typeof plan;
        topPlatform = top.platform;
        topTone     = top.tone;
      }
    } catch { /* swallow */ }
  }

  return (
    <AnalyticsClient
      isDemoMode={isDemoMode}
      total={total}
      week={week}
      credits={credits}
      plan={plan}
      scripts={scripts}
      captions={captions}
      combos={combos}
      topPlatform={topPlatform}
      topTone={topTone}
    />
  );
}
