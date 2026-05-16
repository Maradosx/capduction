'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Search, Bell, ChevronDown, LogOut, Settings } from 'lucide-react';
import { LangToggle } from '@/components/lang-toggle';

interface TopbarProps {
  user?: { email: string; full_name?: string | null; avatar_url?: string | null } | null;
  isDemoMode?: boolean;
}

export function Topbar({ user, isDemoMode }: TopbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  // Close menu on outside click
  useEffect(() => {
    if (!menuOpen) return;
    const close = () => setMenuOpen(false);
    document.addEventListener('pointerdown', close);
    return () => document.removeEventListener('pointerdown', close);
  }, [menuOpen]);

  const displayName =
    user?.full_name ?? user?.email?.split('@')[0] ?? (isDemoMode ? 'Demo User' : 'Guest');
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <header className="fixed top-5 left-[268px] right-5 z-40 flex items-center gap-3
                       glass rounded-[16px] px-4 py-3">
      {/* Search */}
      <div className="flex-1 max-w-[420px] flex items-center gap-2 px-3.5 py-2.5
                      bg-white/60 border border-white/80 rounded-[10px] font-mono text-xs text-ink-3">
        <Search size={14} />
        <span className="lang-th:font-thai">ค้นหา script, caption, project...</span>
        <span className="ml-auto px-1.5 py-0.5 bg-violet/10 rounded text-[10px]">⌘K</span>
      </div>

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

      <button
        data-cursor="open"
        className="hover-target w-9 h-9 flex items-center justify-center text-ink-3 hover:text-ink
                   bg-white/40 hover:bg-white/70 rounded-[10px] transition-all"
        aria-label="Notifications"
      >
        <Bell size={16} />
      </button>

      {/* Avatar dropdown */}
      <div className="relative" onPointerDown={(e) => e.stopPropagation()}>
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
              ตั้งค่าบัญชี
            </Link>
            <div className="h-px bg-[var(--line)] my-1" />
            {isDemoMode ? (
              <Link
                href="/login"
                data-cursor="go"
                className="hover-target flex items-center gap-2.5 px-3 py-2.5 rounded-[8px] text-sm text-ink-3 hover:bg-white/55 hover:text-ink transition-all no-underline lang-th:font-thai"
              >
                <LogOut size={14} />
                เข้าสู่ระบบ
              </Link>
            ) : (
              <form action="/auth/signout" method="post" className="m-0">
                <button
                  type="submit"
                  data-cursor="start"
                  className="hover-target w-full flex items-center gap-2.5 px-3 py-2.5 rounded-[8px] text-sm text-ink-3 hover:bg-white/55 hover:text-ink transition-all lang-th:font-thai border-0 bg-transparent text-left"
                >
                  <LogOut size={14} />
                  ออกจากระบบ
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
