'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

export async function updateProfileAction(formData: FormData): Promise<{ error?: string }> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Unauthorized' };

  const full_name = (formData.get('full_name') as string | null)?.trim() ?? '';
  if (!full_name) return { error: 'Name cannot be empty.' };

  const { error } = await supabase
    .from('profiles')
    .update({ full_name })
    .eq('id', user.id);

  if (error) return { error: error.message };

  revalidatePath('/dashboard/settings');
  revalidatePath('/dashboard');
  return {};
}

export async function updateSettingsAction(formData: FormData): Promise<{ error?: string }> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Unauthorized' };

  const default_tone     = (formData.get('default_tone') as string | null) ?? null;
  const default_platform = (formData.get('default_platform') as string | null) ?? null;
  const default_duration = (formData.get('default_duration') as string | null) ?? null;
  const company_name     = (formData.get('company_name') as string | null)?.trim() ?? null;
  const brand_voice      = (formData.get('brand_voice') as string | null)?.trim() ?? null;

  const { error } = await supabase
    .from('user_settings')
    .upsert({
      user_id: user.id,
      default_tone,
      default_platform,
      default_duration,
      company_name,
      brand_voice,
    });

  if (error) return { error: error.message };

  revalidatePath('/dashboard/settings');
  return {};
}
