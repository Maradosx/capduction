import { createClient } from '@/lib/supabase/server';
import type { Project, Generation } from '@/types';

export async function listProjects(): Promise<Project[]> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];
  const { data } = await supabase
    .from('projects')
    .select('*')
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false });
  return (data ?? []) as Project[];
}

export async function getProject(id: string): Promise<Project | null> {
  const supabase = createClient();
  const { data } = await supabase.from('projects').select('*').eq('id', id).single();
  return (data as Project) ?? null;
}

/** Generations attached to a given project (RLS enforces ownership). */
export async function getProjectGenerations(projectId: string): Promise<Generation[]> {
  const supabase = createClient();
  const { data } = await supabase
    .from('generations')
    .select('*')
    .eq('project_id', projectId)
    .order('created_at', { ascending: false });
  return (data ?? []) as Generation[];
}

/** Count of generations grouped by studio for project header. */
export async function getProjectStats(projectId: string): Promise<{ total: number; script: number; caption: number; combo: number }> {
  const supabase = createClient();
  const { data } = await supabase
    .from('generations')
    .select('studio')
    .eq('project_id', projectId);
  const stats = { total: 0, script: 0, caption: 0, combo: 0 };
  for (const row of data ?? []) {
    stats.total += 1;
    if (row.studio === 'script' || row.studio === 'caption' || row.studio === 'combo') {
      stats[row.studio as 'script' | 'caption' | 'combo'] += 1;
    }
  }
  return stats;
}
