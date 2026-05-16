/**
 * lib/db/settings.ts
 * Server-side helpers for user_settings table.
 */
import { createClient } from '@/lib/supabase/server';
import { UserSettings } from '@/types';

/** Get current user's settings. Returns null if none saved yet. */
export async function getUserSettings(): Promise<UserSettings | null> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('user_settings')
    .select('*')
    .eq('user_id', user.id)
    .single();

  if (error) return null;
  return data as UserSettings;
}

/** Create or update user settings. */
export async function upsertUserSettings(
  updates: Partial<Omit<UserSettings, 'id' | 'user_id' | 'created_at' | 'updated_at'>>
): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Unauthorized' };

  const { error } = await supabase
    .from('user_settings')
    .upsert({ user_id: user.id, ...updates })
    .eq('user_id', user.id);

  if (error) {
    console.error('[upsertUserSettings]', error.message);
    return { success: false, error: error.message };
  }
  return { success: true };
}
