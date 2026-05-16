import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getProject, getProjectGenerations, getProjectStats } from '@/lib/db/projects';
import type { Project, Generation } from '@/types';
import { ProjectDetailClient } from './project-detail-client';

const DEMO_PROJECT: Project = {
  id: 'demo-1',
  user_id: 'demo',
  name: 'Matte red lipstick Q3',
  description: 'New shade launch — scripts + captions across channels',
  cover_color: '#FF8FB5',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

export default async function ProjectDetailPage({ params }: { params: { id: string } }) {
  const isDemoMode = !process.env.NEXT_PUBLIC_SUPABASE_URL;

  let project: Project | null = null;
  let generations: Generation[] = [];
  let stats = { total: 0, script: 0, caption: 0, combo: 0 };

  if (isDemoMode) {
    if (params.id !== 'demo-1' && params.id !== 'demo-2') notFound();
    project = { ...DEMO_PROJECT, id: params.id, name: params.id === 'demo-2' ? 'Summer Glow Campaign' : DEMO_PROJECT.name };
  } else {
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) notFound();
      project = await getProject(params.id);
      if (!project) notFound();
      [generations, stats] = await Promise.all([
        getProjectGenerations(params.id),
        getProjectStats(params.id),
      ]);
    } catch {
      notFound();
    }
  }

  if (!project) notFound();

  return <ProjectDetailClient project={project} generations={generations} stats={stats} />;
}
