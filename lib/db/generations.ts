/**
 * Server-side helpers for the generations table.
 * Updated for the v2 multi-studio schema (migration 004): uses `studio` column + `payload` jsonb.
 */
import { createClient } from '@/lib/supabase/server';
import type { Generation, StudioMode, Platform, Tone } from '@/types';

/** Get the most recent N generations for the current user. */
export async function getRecentGenerations(limit = 5): Promise<Generation[]> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from('generations')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) return [];
  return (data ?? []) as Generation[];
}

/** Total generation count for the current user. */
export async function getGenerationCount(studio?: StudioMode): Promise<number> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return 0;

  let q = supabase
    .from('generations')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', user.id);

  if (studio) q = q.eq('studio', studio);

  const { count } = await q;
  return count ?? 0;
}

/** Generations created in the last 7 days. */
export async function getGenerationsThisWeek(): Promise<number> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return 0;

  const weekAgo = new Date(Date.now() - 7 * 86400_000).toISOString();
  const { count } = await supabase
    .from('generations')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .gte('created_at', weekAgo);

  return count ?? 0;
}

/** Top platform + top tone the user has generated for. */
export async function getTopPlatformAndTone(): Promise<{
  platform: Platform | null;
  tone: Tone | null;
}> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { platform: null, tone: null };

  const { data } = await supabase
    .from('generations')
    .select('platform, tone')
    .eq('user_id', user.id);

  if (!data?.length) return { platform: null, tone: null };

  const tally = <K extends string>(arr: { [k in K]: string }[], key: K) => {
    const counts = new Map<string, number>();
    for (const row of arr) {
      const v = row[key];
      if (!v) continue;
      counts.set(v, (counts.get(v) ?? 0) + 1);
    }
    let top = '', max = 0;
    counts.forEach((n, k) => { if (n > max) { max = n; top = k; } });
    return top || null;
  };

  return {
    platform: tally(data, 'platform') as Platform | null,
    tone:     tally(data, 'tone') as Tone | null,
  };
}

/** Delete a generation (RLS enforces user ownership). */
export async function deleteGeneration(id: string): Promise<boolean> {
  const supabase = createClient();
  const { error } = await supabase.from('generations').delete().eq('id', id);
  return !error;
}
