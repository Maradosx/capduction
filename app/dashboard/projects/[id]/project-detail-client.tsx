'use client';

import Link from 'next/link';
import { ArrowLeft, Plus, Settings, FileText, Type, Wand2 } from 'lucide-react';
import { useT } from '@/lib/i18n';
import type { Project, Generation } from '@/types';
import { ProjectForm } from '../project-form';

const STUDIO_META: Record<string, { label: string; icon: typeof Wand2; grad: string; href: string }> = {
  script:  { label: 'Script',  icon: FileText, grad: 'from-pink to-rose',    href: '/dashboard/workspace/script' },
  caption: { label: 'Caption', icon: Type,     grad: 'from-violet to-pink',  href: '/dashboard/workspace/caption' },
  combo:   { label: 'Combo',   icon: Wand2,    grad: 'from-teal to-violet',  href: '/dashboard/workspace/combo' },
};

export function ProjectDetailClient({
  project, generations, stats,
}: {
  project: Project;
  generations: Generation[];
  stats: { total: number; script: number; caption: number; combo: number };
}) {
  const t = useT();

  return (
    <div className="max-w-[1100px] mx-auto flex flex-col gap-6">
      <Link
        href="/dashboard/projects"
        data-cursor="go"
        className="hover-target inline-flex items-center gap-2 text-ink-3 hover:text-ink text-[13px] font-mono no-underline lang-th:font-thai"
      >
        <ArrowLeft size={14} />
        {t('pj.back_all')}
      </Link>

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

      <div className="flex flex-wrap gap-3">
        {(['script', 'caption', 'combo'] as const).map((s) => {
          const meta = STUDIO_META[s];
          return (
            <Link
              key={s}
              href={`${meta.href}?projectId=${project.id}`}
              data-cursor="create"
              className={`hover-target inline-flex items-center gap-2 px-5 py-3 rounded-[12px] bg-gradient-to-br ${meta.grad} text-white font-semibold text-[13px] no-underline shadow-[0_4px_14px_rgba(181,143,255,0.4)] hover:-translate-y-0.5 transition-all lang-th:font-thai`}
            >
              <Plus size={14} /> {t('pj.detail.add', { label: meta.label })}
            </Link>
          );
        })}
      </div>

      <section>
        <h2 className="font-mono text-[10px] tracking-[0.22em] uppercase text-ink-3 font-semibold mb-3 lang-th:font-thai lang-th:normal-case lang-th:tracking-normal">
          {t('pj.detail.gens')}
        </h2>
        {generations.length === 0 ? (
          <div className="glass rounded-[14px] p-10 text-center text-ink-3 text-[14px] lang-th:font-thai">
            {t('pj.detail.empty')}
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

      <details className="glass rounded-[14px] p-5">
        <summary className="hover-target flex items-center gap-2 font-mono text-[11px] tracking-[0.2em] uppercase text-ink-3 font-semibold cursor-pointer lang-th:font-thai lang-th:normal-case lang-th:tracking-normal" data-cursor="open">
          <Settings size={13} />
          {t('pj.detail.settings')}
        </summary>
        <div className="mt-4">
          <ProjectForm
            mode="edit"
            initial={{
              id:          project.id,
              name:        project.name,
              description: project.description ?? '',
              cover_color: project.cover_color ?? '#FF8FB5',
            }}
          />
        </div>
      </details>
    </div>
  );
}
