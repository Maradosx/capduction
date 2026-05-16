import { createClient } from '@/lib/supabase/server';
import { getProfile } from '@/lib/db/profiles';
import { getUserSettings } from '@/lib/db/settings';
import { SettingsForm } from './settings-form';
import { SettingsHeader } from './settings-header';
import type { Profile, UserSettings } from '@/types';

export default async function SettingsPage() {
  const isDemoMode = !process.env.NEXT_PUBLIC_SUPABASE_URL;

  let profile:  Profile | null      = null;
  let settings: UserSettings | null = null;

  if (!isDemoMode) {
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) [profile, settings] = await Promise.all([getProfile(), getUserSettings()]);
    } catch { /* swallow */ }
  }

  return (
    <div className="max-w-[800px] mx-auto flex flex-col gap-6">
      <SettingsHeader isDemoMode={isDemoMode} />

      <SettingsForm
        defaults={{
          full_name:        profile?.full_name ?? '',
          company_name:     settings?.company_name ?? '',
          default_platform: settings?.default_platform ?? 'TikTok',
          default_tone:     settings?.default_tone ?? 'Friendly',
          default_duration: settings?.default_duration ?? '30s',
          brand_voice:      settings?.brand_voice ?? '',
        }}
        email={profile?.email ?? 'demo@capduction.app'}
        plan={profile?.plan ?? 'free'}
        avatarUrl={profile?.avatar_url ?? null}
        isDemoMode={isDemoMode}
      />
    </div>
  );
}
