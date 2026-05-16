import { createClient } from '@/lib/supabase/server';
import { listProjects } from '@/lib/db/projects';
import type { Project } from '@/types';
import { ProjectsClient } from './projects-client';

export const metadata = { title: 'Projects — Capduction' };

const DEMO_PROJECTS: Project[] = [
  {
    id: 'demo-1',
    user_id: 'demo',
    name: 'Matte red lipstick Q3',
    description: 'New shade launch — scripts + captions across channels',
    cover_color: '#FF8FB5',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'demo-2',
    user_id: 'demo',
    name: 'Summer Glow Campaign',
    description: 'Pastel bundle — TikTok-first',
    cover_color: '#5DD5DA',
    created_at: new Date(Date.now() - 86400_000).toISOString(),
    updated_at: new Date(Date.now() - 86400_000).toISOString(),
  },
];

export default async function ProjectsPage() {
  const isDemoMode = !process.env.NEXT_PUBLIC_SUPABASE_URL;
  let projects: Project[] = [];

  if (!isDemoMode) {
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) projects = await listProjects();
    } catch { /* swallow */ }
  } else {
    projects = DEMO_PROJECTS;
  }

  return <ProjectsClient projects={projects} isDemoMode={isDemoMode} />;
}
