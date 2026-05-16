'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { PROJECT_COLORS } from './projects-shared';

export async function createProjectAction(formData: FormData): Promise<{ error?: string }> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Unauthorized' };

  const name        = (formData.get('name') as string | null)?.trim() ?? '';
  const description = (formData.get('description') as string | null)?.trim() || null;
  const cover_color = (formData.get('cover_color') as string | null)?.trim() || PROJECT_COLORS[0];

  if (!name) return { error: 'ใส่ชื่อโปรเจกต์' };
  if (name.length > 60) return { error: 'ชื่อยาวเกิน 60 ตัวอักษร' };

  const { data, error } = await supabase
    .from('projects')
    .insert({ user_id: user.id, name, description, cover_color })
    .select('id')
    .single();

  if (error) return { error: error.message };
  revalidatePath('/dashboard');
  revalidatePath('/dashboard/projects');
  redirect(`/dashboard/projects/${data.id}`);
}

export async function updateProjectAction(formData: FormData): Promise<{ error?: string }> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Unauthorized' };

  const id          = (formData.get('id') as string | null) ?? '';
  const name        = (formData.get('name') as string | null)?.trim() ?? '';
  const description = (formData.get('description') as string | null)?.trim() || null;
  const cover_color = (formData.get('cover_color') as string | null)?.trim() || null;

  if (!id || !name) return { error: 'Missing fields' };

  const { error } = await supabase
    .from('projects')
    .update({ name, description, cover_color })
    .eq('id', id);

  if (error) return { error: error.message };
  revalidatePath('/dashboard/projects');
  revalidatePath(`/dashboard/projects/${id}`);
  return {};
}

export async function deleteProjectAction(formData: FormData): Promise<void> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const id = (formData.get('id') as string | null) ?? '';
  if (!id) return;

  await supabase.from('projects').delete().eq('id', id);
  revalidatePath('/dashboard');
  revalidatePath('/dashboard/projects');
  redirect('/dashboard/projects');
}
