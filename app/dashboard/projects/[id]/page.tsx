import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, FileText, Type, Wand2, Plus, Settings } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { getProject, getProjectGenerations, getProjectStats } from '@/lib/db/projects';
import { ProjectForm } from '../project-form';
import type { Project, Generation } from '@/types';

const STUDIO_META: Record<string, { label: string; icon: typeof Wand2; href: string; grad: string }> = {
  script:  { label: 'Script',  icon: FileText, href: '/dashboard/workspace/script',  grad: 'from-pink to-rose' },
  caption: { label: 'Caption', icon: Type,     href: '/dashboard/workspace/caption', grad: 'from-violet to-pink' },
  combo:   { label: 'Combo',   icon: Wand2,    href: '/dashboard/workspace/combo',   grad: 'from-teal to-violet' },
};

const DEMO_PROJECT: Project = {
  id: 'demo-1',
  user_id: 'demo',
  name: 'ลิปสติกแดงแมตต์ Q3',
  description: 'แคมเปญลอนช์สีใหม่ — script + caption ทุก channel',
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

  return (
    <div className="max-w-[1100px] mx-auto flex flex-col gap-6">
      <Link
        href="/dashboard/projects"
        data-cursor="go"
        className="hover-target inline-flex items-center gap-2 text-ink-3 hover:text-ink text-[13px] font-mono no-underline"
      >
        <ArrowLeft size={14} />
        All projects
      </Link>

      {/* Header */}
      <div className="glass-strong rounded-[20px] p-6 md:p-7 flex items-center gap-5">
        <div
          className="w-16 h-16 rounded-[18px] flex-shrink-0 flex items-center justify-center"
          style={{
            background: `radial-gradient(circle at 35% 28%, white, ${project.cover_color ?? '#FF8FB5'} 60%, var(--ink-3))`,
            boxShadow:  '0 0 0 1px rgba(255,255,255,0.6), 0 8px 22px rgba(94,79,138,0.22)',
          }}
        />
        <div className="flex-1 min-w-0">
          <h1 className="font-display font-bold text-[clamp(24px,3vw,32px)] text-ink truncate lang-th:font-thai">
            {project.name}
          </h1>
          {project.description && (
            <p className="text-[14px] text-ink-3 mt-1 lang-th:font-thai">{project.description}</p>
          )}
          <div className="mt-3 flex items-center gap-3 text-[11px] font-mono text-ink-3 uppercase tracking-wider">
            <span>{stats.total} total</span>
            <span className="w-0.5 h-0.5 rounded-full bg-ink-3" />
            <span>{stats.script} script</span>
            <span className="w-0.5 h-0.5 rounded-full bg-ink-3" />
            <span>{stats.caption} caption</span>
            <span className="w-0.5 h-0.5 rounded-full bg-ink-3" />
            <span>{stats.combo} combo</span>
          </div>
        </div>
      </div>

      {/* Quick-add buttons */}
      <div className="flex flex-wrap gap-3">
        {(['script', 'caption', 'combo'] as const).map((s) => {
          const meta = STUDIO_META[s];
          const Icon = meta.icon;
          return (
            <Link
              key={s}
              href={`${meta.href}?projectId=${project!.id}`}
              data-cursor="create"
              className={`hover-target inline-flex items-center gap-2 px-5 py-3 rounded-[12px] bg-gradient-to-br ${meta.grad} text-white font-semibold text-[13px] no-underline shadow-[0_4px_14px_rgba(181,143,255,0.4)] hover:-translate-y-0.5 transition-all lang-th:font-thai`}
            >
              <Plus size={14} /> เพิ่ม {meta.label}
            </Link>
          );
        })}
      </div>

      {/* Generations list */}
      <section>
        <h2 className="font-mono text-[10px] tracking-[0.22em] uppercase text-ink-3 font-semibold mb-3">
          — Generations ใน project
        </h2>
        {generations.length === 0 ? (
          <div className="glass rounded-[14px] p-10 text-center text-ink-3 text-[14px] lang-th:font-thai">
            ยังไม่มี generation ในโปรเจกต์นี้ · กดปุ่มด้านบนเพื่อสร้างอันแรก
          </div>
        ) : (
          <div className="glass rounded-[18px] overflow-hidden">
            {generations.map((g, i) => {
              const meta = STUDIO_META[g.studio];
              const Icon = meta?.icon ?? FileText;
              return (
                <Link
                  key={g.id}
                  href={`/dashboard/history#${g.id}`}
                  data-cursor="open"
                  className={`flex items-center gap-4 px-5 py-4 hover:bg-white/55 transition-all no-underline
                    ${i !== generations.length - 1 ? 'border-b border-[var(--line)]' : ''}`}
                >
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${meta?.grad ?? 'from-pink to-violet'} flex items-center justify-center flex-shrink-0`}>
                    <Icon size={14} className="text-white drop-shadow-sm" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[14px] font-semibold text-ink truncate lang-th:font-thai">{g.product_name}</div>
                    <div className="text-[11px] text-ink-3 font-mono mt-0.5">
                      {meta?.label} · {g.platform} · {g.tone}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      {/* Edit/Delete form */}
      <details className="glass rounded-[14px] p-5">
        <summary className="hover-target flex items-center gap-2 font-mono text-[11px] tracking-[0.2em] uppercase text-ink-3 font-semibold cursor-pointer" data-cursor="open">
          <Settings size={13} />
          ตั้งค่าโปรเจกต์
        </summary>
        <div className="mt-4">
          <ProjectForm
            mode="edit"
            initial={{
              id:          project.id,
              name:        project.name,
              description: project.description ?? '',
              cover_color: project.cover_color ?? undefined,
            }}
          />
        </div>
      </details>
    </div>
  );
}
