import { createClient } from '@/lib/supabase/server';
import type { BrandVoice } from '@/types';

export async function listBrandVoices(): Promise<BrandVoice[]> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];
  const { data } = await supabase
    .from('brand_voices')
    .select('*')
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false });
  return (data ?? []) as BrandVoice[];
}

export async function getBrandVoice(id: string): Promise<BrandVoice | null> {
  const supabase = createClient();
  const { data } = await supabase.from('brand_voices').select('*').eq('id', id).single();
  return (data as BrandVoice) ?? null;
}

/** Format a brand voice as a plain-text context block to inject into prompts. */
export function brandVoiceToContext(bv: BrandVoice): string {
  const parts = [
    `Brand voice name: ${bv.name}`,
    `Voice description: ${bv.description}`,
  ];
  if (bv.sample_posts?.length) {
    parts.push('Sample posts (mimic this style):');
    bv.sample_posts.forEach((p, i) => parts.push(`  ${i + 1}. "${p}"`));
  }
  return parts.join('\n');
}
