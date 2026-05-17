'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { Search, Zap, ChevronDown, LogOut, Settings, Menu } from 'lucide-react';
import { LangToggle } from '@/components/lang-toggle';
import { useT } from '@/lib/i18n';
import { useMobileMenu } from './menu-context';

interface TopbarProps {
  user?: { email: string; full_name?: string | null; avatar_url?: string | null } | null;
  isDemoMode?: boolean;
  credits?: number;
  plan?: string;
}

export function Topbar({ user, isDemoMode, credits = 0, plan = 'free' }: TopbarProps) {
  const t = useT();
  const [menuOpen, setMenuOpen] = useState(false);
  const { setOpen: setDrawerOpen } = useMobileMenu();
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when click lands outside the dropdown wrapper.
  // Use the click event (after pointerdown + pointerup) so Link/form submits
  // inside the menu can fire BEFORE the close runs.
  useEffect(() => {
    if (!menuOpen) return;
    const onDocClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('click', onDocClick);
    return () => document.removeEventListener('click', onDocClick);
  }, [menuOpen]);

  const displayName =
    user?.full_name ?? user?.email?.split('@')[0] ?? (isDemoMode ? 'Demo User' : 'Guest');
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <header className="fixed top-5 left-5 lg:left-[268px] right-5 z-40 flex items-center gap-2 sm:gap-3
                       glass rounded-[16px] px-3 sm:px-4 py-3">
      {/* Mobile hamburger */}
      <button
        type="button"
        onClick={() => setDrawerOpen(true)}
        aria-label="Open menu"
        data-cursor="open"
        className="hover-target lg:hidden w-9 h-9 flex items-center justify-center text-ink-3 hover:text-ink
                   bg-white/40 hover:bg-white/70 rounded-[10px] transition-all flex-shrink-0"
      >
        <Menu size={18} />
      </button>

      {/* Search — collapses to icon-only on small. Click navigates to history
          where the user can search through their generations. */}
      <Link
        href="/dashboard/history"
        data-cursor="go"
        className="hover-target hidden sm:flex flex-1 max-w-[420px] items-center gap-2 px-3.5 py-2.5
                   bg-white/60 border border-white/80 rounded-[10px] font-mono text-xs text-ink-3
                   hover:bg-white/85 hover:text-ink transition-all no-underline"
      >
        <Search size={14} />
        <span className="lang-th:font-thai truncate">{t('top.search')}</span>
      </Link>
      <Link
        href="/dashboard/history"
        data-cursor="go"
        aria-label="Search"
        className="sm:hidden hover-target w-9 h-9 flex items-center justify-center text-ink-3
                   bg-white/40 hover:bg-white/70 rounded-[10px] transition-all flex-shrink-0 no-underline"
      >
        <Search size={16} />
      </Link>

      <div className="flex-1" />

      {isDemoMode && (
        <span className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full
                         bg-amber-100/80 border border-amber-200 text-[11px] font-mono text-amber-700
                         font-semibold tracking-wider uppercase">
          <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse" />
          DEMO MODE
        </span>
      )}

      <LangToggle />

      {/* Credits indicator — always visible, links to Pricing for top-up.
          Replaces the dead Bell button (no notifications feature yet). */}
      <Link
        href="/pricing"
        data-cursor="go"
        aria-label={t('top.credits.aria')}
        title={t('top.credits.tooltip')}
        className={`hover-target inline-flex items-center gap-1.5 px-3 h-9 rounded-[10px] font-semibold text-[12px] transition-all no-underline whitespace-nowrap
          ${credits <= 0
            ? 'bg-rose-100 border border-rose-200 text-rose-700 hover:bg-rose-200'
            : credits <= 5
            ? 'bg-amber-100 border border-amber-200 text-amber-800 hover:bg-amber-200'
            : 'bg-white/55 border border-white/70 text-ink hover:bg-white/80'}`}
      >
        <Zap size={13} className={credits > 5 ? 'text-iridescent' : ''} />
        <span>
          <strong className="font-bold">{credits}</strong>
          <span className="opacity-70 ml-1 hidden sm:inline">{t('top.credits.label')}</span>
        </span>
      </Link>

      {/* Avatar dropdown */}
      <div ref={menuRef} className="relative">
        <button
          onClick={() => setMenuOpen((v) => !v)}
          data-cursor="open"
          className="hover-target flex items-center gap-2.5 px-2 py-1.5 rounded-[10px] hover:bg-white/55 transition-all"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink to-violet text-white
                          flex items-center justify-center font-semibold text-[13px]
                          shadow-[0_2px_8px_rgba(181,143,255,0.4)]">
            {user?.avatar_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={user.avatar_url} alt="" className="w-full h-full rounded-full object-cover" />
            ) : (
              initial
            )}
          </div>
          <div className="hidden md:block leading-[1.1] text-left">
            <div className="text-[13px] font-semibold text-ink lang-th:font-thai">{displayName}</div>
            <div className="text-[10px] text-slate font-mono">
              {user?.email ?? 'demo@capduction.app'}
            </div>
          </div>
          <ChevronDown size={14} className="text-ink-3" />
        </button>

        {menuOpen && (
          <div className="absolute right-0 top-full mt-2 w-56 glass-strong rounded-[14px] p-2 shadow-glass-lg">
            <Link
              href="/dashboard/settings"
              data-cursor="go"
              className="hover-target flex items-center gap-2.5 px-3 py-2.5 rounded-[8px] text-sm text-ink-3 hover:bg-white/55 hover:text-ink transition-all no-underline lang-th:font-thai"
            >
              <Settings size={14} />
              {t('top.menu.settings')}
            </Link>
            <div className="h-px bg-[var(--line)] my-1" />
            {isDemoMode ? (
              <Link
                href="/login"
                data-cursor="go"
                className="hover-target flex items-center gap-2.5 px-3 py-2.5 rounded-[8px] text-sm text-ink-3 hover:bg-white/55 hover:text-ink transition-all no-underline lang-th:font-thai"
              >
                <LogOut size={14} />
                {t('top.menu.login')}
              </Link>
            ) : (
              <form action="/auth/signout" method="post" className="m-0">
                <button
                  type="submit"
                  data-cursor="start"
                  className="hover-target w-full flex items-center gap-2.5 px-3 py-2.5 rounded-[8px] text-sm text-ink-3 hover:bg-white/55 hover:text-ink transition-all lang-th:font-thai border-0 bg-transparent text-left"
                >
                  <LogOut size={14} />
                  {t('top.menu.logout')}
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
