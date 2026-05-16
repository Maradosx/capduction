'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useT } from '@/lib/i18n';
import { BrandMark } from '@/components/brand-mark';
import type { Project } from '@/types';
import { Wand2, FileText, Type, FolderOpen, Mic2, Clock, BarChart3, Settings, Sparkles } from 'lucide-react';

interface SidebarProps {
  /** Project list for the PROJECTS section */
  projects?: Project[];
  /** User's plan + credits — shown in upgrade nudge at bottom */
  plan?: 'free' | 'studio' | 'agency';
  credits?: number;
}

const STUDIO_ITEMS = [
  { href: '/dashboard/workspace/combo',   labelKey: 'dash.combo'   as const, icon: Wand2,    badge: 'NEW' },
  { href: '/dashboard/workspace/script',  labelKey: 'dash.script'  as const, icon: FileText },
  { href: '/dashboard/workspace/caption', labelKey: 'dash.caption' as const, icon: Type },
];

const RESOURCE_ITEMS = [
  { href: '/dashboard/brand-voice', labelKey: 'dash.brand_voice' as const, icon: Mic2 },
  { href: '/dashboard/history',     labelKey: 'dash.history'     as const, icon: Clock },
  { href: '/dashboard/analytics',   labelKey: 'sidebar.analytics' as const, icon: BarChart3 },
  { href: '/dashboard/settings',    labelKey: 'sidebar.settings'  as const, icon: Settings },
];

export function Sidebar({ projects = [], plan = 'free', credits = 10 }: SidebarProps) {
  const t = useT();
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex flex-col w-[240px] fixed left-5 top-5 bottom-5 z-50
                      glass-strong rounded-[20px] p-4 overflow-y-auto">
      {/* Brand mini */}
      <Link href="/dashboard" data-cursor="go" className="hover-target flex items-center gap-2.5 mb-6 text-ink no-underline px-1">
        <BrandMark className="w-9 h-9" />
        <div className="leading-[1.15]">
          <div className="font-bold text-[15px]">
            Capduction
            <span className="ml-1.5 inline-block px-1.5 py-0.5 btn-grad rounded text-[9px] font-mono tracking-wider align-middle font-semibold">
              Beta
            </span>
          </div>
          <div className="text-[10px] text-slate font-mono">AI Script Studio</div>
        </div>
      </Link>

      <SectionHeader>STUDIOS</SectionHeader>
      {STUDIO_ITEMS.map((item) => (
        <SidebarLink
          key={item.href}
          href={item.href}
          icon={<item.icon size={14} />}
          label={t(item.labelKey)}
          active={pathname?.startsWith(item.href)}
          badge={item.badge}
        />
      ))}

      <Separator />
      <SectionHeader>PROJECTS</SectionHeader>
      {projects.length === 0 ? (
        <Link
          href="/dashboard/projects/new"
          data-cursor="create"
          className="hover-target text-[12px] text-ink-3 px-3.5 py-2 rounded-[10px] hover:bg-white/55 hover:text-ink transition-all flex items-center gap-2.5 lang-th:font-thai no-underline"
        >
          <FolderOpen size={14} className="opacity-70" />
          + เริ่มโปรเจกต์แรก
        </Link>
      ) : (
        projects.slice(0, 5).map((p) => (
          <SidebarLink
            key={p.id}
            href={`/dashboard/projects/${p.id}`}
            icon={<FolderOpen size={14} />}
            label={p.name}
            active={pathname === `/dashboard/projects/${p.id}`}
          />
        ))
      )}

      <Separator />
      <SectionHeader>RESOURCES</SectionHeader>
      {RESOURCE_ITEMS.map((item) => (
        <SidebarLink
          key={item.href}
          href={item.href}
          icon={<item.icon size={14} />}
          label={t(item.labelKey)}
          active={pathname?.startsWith(item.href)}
        />
      ))}

      {/* Bottom: credits + upgrade nudge */}
      <div className="mt-auto pt-4">
        <div className="glass rounded-[14px] p-4">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles size={14} className="text-iridescent" />
            <span className="font-mono text-[10px] tracking-[0.18em] uppercase text-ink-3 font-semibold">
              Credits
            </span>
          </div>
          <div className="font-display font-bold text-[28px] leading-none text-ink mb-1">{credits}</div>
          <div className="text-[11px] text-ink-3 mb-3 lang-th:font-thai">
            {plan === 'free' ? 'แผน Free · ฟรี 10 ครั้ง/เดือน' : `แผน ${plan === 'studio' ? 'Studio' : 'Agency'}`}
          </div>
          {plan === 'free' && (
            <Link
              href="/pricing"
              data-cursor="start"
              className="hover-target btn-grad w-full block text-center px-3 py-2 rounded-[10px] text-white font-semibold text-[12px] no-underline lang-th:font-thai"
            >
              ↑ Upgrade to Studio
            </Link>
          )}
        </div>
      </div>
    </aside>
  );
}

function SectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <h6 className="font-mono text-[9px] tracking-[0.22em] text-slate uppercase mx-3.5 mb-2 mt-1 font-semibold">
      {children}
    </h6>
  );
}

function Separator() {
  return <div className="h-px bg-[var(--line)] mx-2 my-3" />;
}

function SidebarLink({
  href, icon, label, active, badge,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  badge?: string;
}) {
  return (
    <Link
      href={href}
      data-cursor="go"
      className={`hover-target relative flex items-center gap-2.5 px-3.5 py-2.5 rounded-[10px] text-[13px] no-underline transition-all mb-0.5 lang-th:font-thai
        ${active
          ? 'bg-gradient-to-br from-pink/15 to-violet/15 text-ink font-semibold border border-violet/25'
          : 'text-ink-3 hover:bg-white/55 hover:text-ink'}`}
    >
      <span className={active ? 'opacity-100' : 'opacity-70'}>{icon}</span>
      <span className="flex-1 truncate">{label}</span>
      {badge && (
        <span className="btn-grad text-white px-1.5 py-0.5 rounded-full text-[9px] tracking-wider font-semibold">
          {badge}
        </span>
      )}
    </Link>
  );
}
