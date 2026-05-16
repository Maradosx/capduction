import Link from 'next/link';
import { FolderOpen, Plus, FileText, Type, Wand2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { listProjects } from '@/lib/db/projects';
import type { Project } from '@/types';

export const metadata = { title: 'Projects — Capduction' };

const DEMO_PROJECTS: Project[] = [
  {
    id: 'demo-1',
    user_id: 'demo',
    name: 'ลิปสติกแดงแมตต์ Q3',
    description: 'แคมเปญลอนช์สีใหม่ — script + caption ทุก channel',
    cover_color: '#FF8FB5',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'demo-2',
    user_id: 'demo',
    name: 'Summer Glow Campaign',
    description: 'Bundle สีพาสเทล 5 ตัว · TikTok-first',
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

  return (
    <div className="max-w-[1200px] mx-auto flex flex-col gap-6">
      <div className="flex justify-between items-end flex-wrap gap-4">
        <div>
          <h1 className="font-display font-bold text-[clamp(28px,3.5vw,42px)] tracking-[-0.025em] text-ink lang-th:font-thai">
            <span className="text-iridescent">โปรเจกต์</span>
          </h1>
          <p className="text-ink-3 text-[15px] mt-1 lang-th:font-thai">
            จัดกลุ่ม script + caption ของแต่ละสินค้า/แคมเปญในที่เดียว
            {isDemoMode && ' · Demo mode — แสดงข้อมูลตัวอย่าง'}
          </p>
        </div>
        <Link
          href="/dashboard/projects/new"
          data-cursor="create"
          className="hover-target btn-grad px-5 py-3 rounded-[12px] text-white font-semibold text-[14px] no-underline inline-flex items-center gap-2 lang-th:font-thai"
        >
          <Plus size={16} /> โปรเจกต์ใหม่
        </Link>
      </div>

      {projects.length === 0 ? (
        <div className="glass rounded-[18px] p-12 text-center">
          <FolderOpen size={32} className="mx-auto mb-3 text-ink-3 opacity-40" />
          <p className="text-ink-3 text-[14px] mb-4 lang-th:font-thai">
            ยังไม่มีโปรเจกต์ — สร้างอันแรกเพื่อจัดกลุ่ม generations
          </p>
          <Link
            href="/dashboard/projects/new"
            data-cursor="create"
            className="hover-target btn-grad px-5 py-2.5 rounded-full text-white font-semibold text-[13px] no-underline inline-flex items-center gap-2 lang-th:font-thai"
          >
            <Plus size={14} /> เริ่มโปรเจกต์แรก
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((p) => (
            <Link
              key={p.id}
              href={`/dashboard/projects/${p.id}`}
              data-cursor="open"
              className="hover-target glass rounded-[18px] p-5 no-underline transition-all hover:-translate-y-1 hover:shadow-glass-lg block"
            >
              <div className="flex items-start gap-3 mb-3">
                <div
                  className="w-12 h-12 rounded-[14px] flex items-center justify-center flex-shrink-0"
                  style={{
                    background: `radial-gradient(circle at 35% 28%, white, ${p.cover_color ?? '#FF8FB5'} 60%, var(--ink-3))`,
                    boxShadow:  '0 0 0 1px rgba(255,255,255,0.6), 0 6px 18px rgba(94,79,138,0.18)',
                  }}
                >
                  <FolderOpen size={18} className="text-white drop-shadow-sm" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-display font-bold text-[17px] text-ink truncate lang-th:font-thai">{p.name}</div>
                  <div className="text-[11px] text-ink-3 font-mono mt-0.5">
                    Updated · {new Date(p.updated_at).toLocaleDateString('th-TH', { day: 'numeric', month: 'short' })}
                  </div>
                </div>
              </div>
              {p.description && (
                <p className="text-[13px] text-ink-3 leading-relaxed line-clamp-2 lang-th:font-thai">
                  {p.description}
                </p>
              )}
              <div className="mt-4 pt-3 border-t border-[var(--line)] flex items-center gap-3 text-[10px] font-mono text-ink-3 uppercase tracking-wider">
                <span className="flex items-center gap-1"><FileText size={11} /> Script</span>
                <span className="flex items-center gap-1"><Type size={11} /> Caption</span>
                <span className="flex items-center gap-1"><Wand2 size={11} /> Combo</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
