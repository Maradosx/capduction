'use client';

import Link from 'next/link';
import { useT } from '@/lib/i18n';
import { BrandMark } from './brand-mark';
import { LangToggle } from './lang-toggle';

interface CapNavProps {
  /** Show "Get started" CTA in nav (false on auth pages) */
  showCta?: boolean;
  /** Currently active link (matches href) */
  active?: string;
}

const NAV_LINKS = [
  { href: '/',        key: 'nav.home' },
  { href: '/#studios', key: 'nav.studios' },
  { href: '/pricing', key: 'nav.pricing' },
  { href: '/#showcase', key: 'nav.showcase' },
  { href: '/#faq',     key: 'nav.faq' },
];

export function CapNav({ showCta = true, active = '/' }: CapNavProps) {
  const t = useT();
  return (
    <nav
      className="fixed top-5 left-5 right-5 z-[100] flex justify-between items-center
                 px-[14px] py-3 pl-[22px] rounded-[18px] glass"
    >
      <Link href="/" className="brand flex items-center gap-3 text-ink no-underline">
        <BrandMark className="w-9 h-9" />
        <span className="font-semibold text-[18px] tracking-tight">Capduction</span>
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

      <div className="right flex items-center gap-3">
        <LangToggle />
        {showCta && (
          <Link
            href="/signup"
            data-cursor="start"
            className="hover-target btn-grad px-5 py-2.5 rounded-full text-sm font-semibold text-white no-underline"
          >
            {t('nav.cta')}
          </Link>
        )}
      </div>
    </nav>
  );
}
