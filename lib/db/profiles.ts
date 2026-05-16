/**
 * lib/db/profiles.ts
 * Server-side helpers for profiles table.
 * All functions require a Supabase server client scoped to the logged-in user.
 */
import { createClient } from '@/lib/supabase/server';
import { Profile } from '@/types';

/** Get the current user's profile. Returns null if unauthenticated. */
export async function getProfile(): Promise<Profile | null> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (error) {
    // If no row yet, row may not exist (first login before trigger fires)
    return null;
  }
  return data as Profile;
}

/** Upsert profile (used during first login or settings update). */
export async function upsertProfile(
  updates: Partial<Omit<Profile, 'id' | 'created_at' | 'updated_at'>>
): Promise<Profile | null> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('profiles')
    .upsert({ id: user.id, email: user.email!, ...updates })
    .select()
    .single();

  if (error) {
    console.error('[upsertProfile]', error.message);
    return null;
  }
  return data as Profile;
}

/** Safely decrement credits by 1. Returns false if insufficient credits. */
export async function decrementCredit(): Promise<boolean> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  // Use RPC to avoid race conditions (atomic decrement)
  const { error } = await supabase.rpc('decrement_credit', { uid: user.id });
  if (error) {
    console.error('[decrementCredit]', error.message);
    return false;
  }
  return true;
}
