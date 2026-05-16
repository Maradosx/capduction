'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { useT } from '@/lib/i18n';
import { BrandMark } from './brand-mark';
import { LangToggle } from './lang-toggle';

interface CapNavProps {
  showCta?: boolean;
  active?: string;
}

const NAV_LINKS = [
  { href: '/',          key: 'nav.home' },
  { href: '/#studios',  key: 'nav.studios' },
  { href: '/pricing',   key: 'nav.pricing' },
  { href: '/#showcase', key: 'nav.showcase' },
  { href: '/#faq',      key: 'nav.faq' },
];

export function CapNav({ showCta = true, active = '/' }: CapNavProps) {
  const t = useT();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => { setOpen(false); }, [pathname]);
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <>
      <nav
        className="fixed top-3 sm:top-5 left-3 sm:left-5 right-3 sm:right-5 z-[100] flex justify-between items-center
                   px-3 sm:px-[14px] py-2.5 sm:py-3 pl-3 sm:pl-[22px] rounded-[14px] sm:rounded-[18px] glass"
      >
        <Link href="/" className="brand flex items-center gap-2.5 sm:gap-3 text-ink no-underline">
          <BrandMark className="w-8 h-8 sm:w-9 sm:h-9" />
          <span className="font-semibold text-[16px] sm:text-[18px] tracking-tight">Capduction</span>
        </Link>

        <div className="center hidden md:flex gap-2 items-center">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              data-cursor="go"
              className={`hover-target px-[18px] py-[9px] rounded-full text-sm font-medium transition-all
                ${active === link.href
                  ? 'bg-[rgba(184,143,255,0.15)] text-ink'
                  : 'text-ink-3 hover:bg-[rgba(255,255,255,0.6)] hover:text-ink'}`}
            >
              {t(link.key as never)}
            </Link>
          ))}
        </div>

        <div className="right flex items-center gap-2 sm:gap-3">
          <div className="hidden sm:block"><LangToggle /></div>
          {showCta && (
            <Link
              href="/signup"
              data-cursor="start"
              className="hover-target btn-grad px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-full text-[12px] sm:text-sm
                         font-semibold text-white no-underline whitespace-nowrap"
            >
              {t('nav.cta')}
            </Link>
          )}
          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            className="md:hidden w-9 h-9 flex items-center justify-center rounded-full
                       bg-white/60 hover:bg-white/85 text-ink-3 hover:text-ink transition"
          >
            <Menu size={17} />
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden fixed inset-0 z-[110] bg-ink/40 backdrop-blur-sm" onClick={() => setOpen(false)}>
          <div
            className="absolute top-3 left-3 right-3 glass-strong rounded-[20px] p-4 pt-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <BrandMark className="w-8 h-8" />
                <span className="font-semibold text-[16px] tracking-tight">Capduction</span>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="w-9 h-9 flex items-center justify-center rounded-full bg-white/60 text-ink-3 hover:text-ink"
              >
                <X size={16} />
              </button>
            </div>
            <div className="flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-3 rounded-[12px] text-[15px] font-medium no-underline transition
                    ${active === link.href
                      ? 'bg-[rgba(184,143,255,0.18)] text-ink'
                      : 'text-ink-3 hover:bg-white/55 hover:text-ink'}`}
                >
                  {t(link.key as never)}
                </Link>
              ))}
            </div>
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-[var(--line)]">
              <LangToggle />
              {showCta && (
                <Link
                  href="/signup"
                  className="btn-grad px-5 py-2.5 rounded-full text-[13px] font-semibold text-white no-underline"
                >
                  {t('nav.cta')}
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
