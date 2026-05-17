'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useT } from '@/lib/i18n';
import { BrandMark } from '@/components/brand-mark';
import type { Project } from '@/types';
import { Wand2, FileText, Type, FolderOpen, Mic2, Clock, BarChart3, Settings, Sparkles, X, Inbox } from 'lucide-react';
import { useMobileMenu } from './menu-context';

interface SidebarProps {
  /** Project list for the PROJECTS section */
  projects?: Project[];
  /** User's plan + credits — shown in upgrade nudge at bottom */
  plan?: 'free' | 'creator' | 'studio' | 'agency';
  credits?: number;
  /** When true, an admin-only "Feedback Inbox" link appears in RESOURCES. */
  isAdmin?: boolean;
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

export function Sidebar({ projects = [], plan = 'free', credits = 10, isAdmin = false }: SidebarProps) {
  const t = useT();
  const pathname = usePathname();
  const { open, setOpen } = useMobileMenu();

  return (
    <>
      {/* Mobile backdrop */}
      {open && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-ink/40 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={`flex flex-col w-[260px] lg:w-[240px] fixed left-0 lg:left-5 top-0 lg:top-5 bottom-0 lg:bottom-5
                    z-50 glass-strong lg:rounded-[20px] p-4 overflow-y-auto
                    transition-transform duration-300 ease-out lg:!translate-x-0
                    ${open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Mobile close button */}
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Close menu"
          className="lg:hidden absolute top-4 right-4 w-8 h-8 rounded-full bg-white/60
                     flex items-center justify-center text-ink-3 hover:text-ink hover:bg-white/80 transition"
        >
          <X size={16} />
        </button>
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

      <SectionHeader>{t('side.section.studios')}</SectionHeader>
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
      <SectionHeader>{t('side.section.projects')}</SectionHeader>
      {projects.length === 0 ? (
        <Link
          href="/dashboard/projects/new"
          data-cursor="create"
          className="hover-target text-[12px] text-ink-3 px-3.5 py-2 rounded-[10px] hover:bg-white/55 hover:text-ink transition-all flex items-center gap-2.5 lang-th:font-thai no-underline"
        >
          <FolderOpen size={14} className="opacity-70" />
          {t('side.first_project')}
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
      <SectionHeader>{t('side.section.resources')}</SectionHeader>
      {RESOURCE_ITEMS.map((item) => (
        <SidebarLink
          key={item.href}
          href={item.href}
          icon={<item.icon size={14} />}
          label={t(item.labelKey)}
          active={pathname?.startsWith(item.href)}
        />
      ))}

      {/* Admin-only: feedback inbox. Hidden for non-admins. */}
      {isAdmin && (
        <>
          <Separator />
          <SectionHeader>ADMIN</SectionHeader>
          <SidebarLink
            href="/dashboard/admin/feedback"
            icon={<Inbox size={14} />}
            label={t('side.admin.feedback')}
            active={pathname?.startsWith('/dashboard/admin/feedback')}
          />
        </>
      )}

      {/* Bottom: credits + upgrade nudge */}
      <div className="mt-auto pt-4">
        <div className="glass rounded-[14px] p-4">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles size={14} className="text-iridescent" />
            <span className="font-mono text-[10px] tracking-[0.18em] uppercase text-ink-3 font-semibold">
              {t('side.credits')}
            </span>
          </div>
          <div className="font-display font-bold text-[28px] leading-none text-ink mb-1">{credits}</div>
          <div className="text-[11px] text-ink-3 mb-3 lang-th:font-thai">
            {plan === 'free'
              ? t('side.plan_free')
              : t('side.plan_paid', { plan: plan === 'studio' ? 'Studio' : 'Agency' })}
          </div>
          {plan === 'free' && (
            <Link
              href="/pricing"
              data-cursor="start"
              className="hover-target btn-grad w-full block text-center px-3 py-2 rounded-[10px] text-white font-semibold text-[12px] no-underline lang-th:font-thai"
            >
              {t('side.upgrade')}
            </Link>
          )}
        </div>
      </div>
      </aside>
    </>
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
