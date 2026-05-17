import { Sidebar } from '@/components/dashboard/sidebar';
import { Topbar } from '@/components/dashboard/topbar';
import { MobileMenuProvider } from '@/components/dashboard/menu-context';
import { createClient } from '@/lib/supabase/server';
import { getProfile } from '@/lib/db/profiles';
import { listProjects } from '@/lib/db/projects';
import type { Profile, Project } from '@/types';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const isDemoMode = !process.env.NEXT_PUBLIC_SUPABASE_URL;

  let user: { email: string; full_name?: string | null; avatar_url?: string | null } | null = null;
  let profile: Profile | null = null;
  let projects: Project[] = [];

  if (!isDemoMode) {
    const supabase = createClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();
    if (authUser) {
      try {
        [profile, projects] = await Promise.all([getProfile(), listProjects()]);
      } catch { /* swallow — keep dashboard accessible */ }
      user = {
        email:      authUser.email ?? '',
        full_name:  profile?.full_name ?? authUser.user_metadata?.full_name ?? null,
        avatar_url: profile?.avatar_url ?? authUser.user_metadata?.avatar_url ?? null,
      };
    }
  }

  const plan    = profile?.plan ?? 'free';
  const credits = profile?.credits_remaining ?? 10;

  return (
    <MobileMenuProvider>
      <div className="min-h-screen">
        <Sidebar projects={projects} plan={plan} credits={credits} />
        <Topbar user={user} isDemoMode={isDemoMode} credits={credits} plan={plan} />
        <main className="lg:ml-[268px] pt-[88px] px-5 pb-12">
          {children}
        </main>
      </div>
    </MobileMenuProvider>
  );
}
