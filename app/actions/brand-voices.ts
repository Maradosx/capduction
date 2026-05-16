'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

function parseSamples(formData: FormData): string[] {
  const samples: string[] = [];
  for (let i = 0; i < 3; i++) {
    const v = (formData.get(`sample_${i}`) as string | null)?.trim();
    if (v) samples.push(v);
  }
  return samples;
}

export async function createBrandVoiceAction(formData: FormData): Promise<{ error?: string }> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Unauthorized' };

  const name        = (formData.get('name') as string | null)?.trim() ?? '';
  const description = (formData.get('description') as string | null)?.trim() ?? '';
  const sample_posts = parseSamples(formData);

  if (!name) return { error: 'ใส่ชื่อ brand voice' };
  if (!description) return { error: 'อธิบายโทนของแบรนด์' };
  if (name.length > 60) return { error: 'ชื่อยาวเกิน 60 ตัวอักษร' };

  const { data, error } = await supabase
    .from('brand_voices')
    .insert({ user_id: user.id, name, description, sample_posts })
    .select('id')
    .single();

  if (error) return { error: error.message };
  revalidatePath('/dashboard/brand-voice');
  redirect(`/dashboard/brand-voice/${data.id}`);
}

export async function updateBrandVoiceAction(formData: FormData): Promise<{ error?: string }> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Unauthorized' };

  const id          = (formData.get('id') as string | null) ?? '';
  const name        = (formData.get('name') as string | null)?.trim() ?? '';
  const description = (formData.get('description') as string | null)?.trim() ?? '';
  const sample_posts = parseSamples(formData);

  if (!id || !name || !description) return { error: 'Missing fields' };

  const { error } = await supabase
    .from('brand_voices')
    .update({ name, description, sample_posts })
    .eq('id', id);

  if (error) return { error: error.message };
  revalidatePath('/dashboard/brand-voice');
  revalidatePath(`/dashboard/brand-voice/${id}`);
  return {};
}

export async function deleteBrandVoiceAction(formData: FormData): Promise<void> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;
  const id = (formData.get('id') as string | null) ?? '';
  if (!id) return;
  await supabase.from('brand_voices').delete().eq('id', id);
  revalidatePath('/dashboard/brand-voice');
  redirect('/dashboard/brand-voice');
}
