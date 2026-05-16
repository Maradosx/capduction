'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

const MAX_BYTES = 2 * 1024 * 1024;
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

export async function uploadAvatarAction(
  formData: FormData,
): Promise<{ error?: string; url?: string }> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Unauthorized' };

  const file = formData.get('avatar') as File | null;
  if (!file || file.size === 0) return { error: 'No file uploaded.' };

  if (file.size > MAX_BYTES) {
    return { error: 'File too large (max 2 MB).' };
  }
  if (!ALLOWED_TYPES.includes(file.type)) {
    return { error: 'Unsupported file type. Use JPG, PNG, WebP, or GIF.' };
  }

  const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
  const safeExt = ['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(ext) ? ext : 'jpg';
  // Cache-busting filename so the browser/CDN immediately serves the new image.
  const path = `${user.id}/avatar-${Date.now()}.${safeExt}`;

  const buf = Buffer.from(await file.arrayBuffer());

  const { error: uploadErr } = await supabase.storage
    .from('avatars')
    .upload(path, buf, {
      contentType: file.type,
      upsert: true,
    });
  if (uploadErr) return { error: uploadErr.message };

  const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(path);

  const { error: profileErr } = await supabase
    .from('profiles')
    .update({ avatar_url: publicUrl })
    .eq('id', user.id);
  if (profileErr) return { error: profileErr.message };

  // Best-effort cleanup of older avatars for this user.
  const { data: files } = await supabase.storage
    .from('avatars')
    .list(user.id);
  if (files?.length) {
    const stale = files
      .filter((f) => !path.endsWith(f.name))
      .map((f) => `${user.id}/${f.name}`);
    if (stale.length) {
      await supabase.storage.from('avatars').remove(stale);
    }
  }

  revalidatePath('/dashboard/settings');
  revalidatePath('/dashboard');
  return { url: publicUrl };
}

export async function removeAvatarAction(): Promise<{ error?: string }> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Unauthorized' };

  const { data: files } = await supabase.storage.from('avatars').list(user.id);
  if (files?.length) {
    await supabase.storage
      .from('avatars')
      .remove(files.map((f) => `${user.id}/${f.name}`));
  }

  const { error } = await supabase
    .from('profiles')
    .update({ avatar_url: null })
    .eq('id', user.id);
  if (error) return { error: error.message };

  revalidatePath('/dashboard/settings');
  revalidatePath('/dashboard');
  return {};
}
