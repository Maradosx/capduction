'use client';

import Link from 'next/link';
import { useT } from '@/lib/i18n';
import { BrandMark } from './brand-mark';

const COLS = [
  {
    h5: 'STUDIOS',
    links: [
      { href: '/dashboard/workspace/script',  label: 'Script Studio' },
      { href: '/dashboard/workspace/caption', label: 'Caption Studio' },
      { href: '/dashboard/workspace/combo',   label: 'Combo Mode' },
      { href: '/dashboard/brand-voice',       label: 'Brand Voice' },
    ],
  },
  {
    h5: 'RESOURCES',
    links: [
      { href: '/docs',       label: 'Documentation' },
      { href: '/changelog',  label: 'Changelog' },
      { href: '/api-docs',   label: 'API' },
      { href: '/status',     label: 'Status' },
    ],
  },
  {
    h5: 'COMPANY',
    links: [
      { href: '/about',   label: 'About' },
      { href: '/careers', label: 'Careers' },
      { href: '/contact', label: 'Contact' },
      { href: '/privacy', label: 'Privacy' },
    ],
  },
];

export function CapFooter() {
  const t = useT();
  return (
    <footer
      className="px-8 pt-16 pb-8 relative z-[2]"
      style={{
        background: 'rgba(255,255,255,0.5)',
        backdropFilter: 'blur(28px)',
        WebkitBackdropFilter: 'blur(28px)',
        borderTop: '1px solid rgba(255,255,255,0.5)',
      }}
    >
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr] gap-12 pb-12 border-b border-[var(--line)] mb-6">
        <div>
          <Link href="/" className="flex items-center gap-3 mb-4 text-ink no-underline">
            <BrandMark className="w-8 h-8" />
            <span className="font-bold text-[20px]">Capduction</span>
          </Link>
          <p className="text-sm text-ink-3 max-w-[320px] leading-relaxed font-thai">
            {t('ft.tag')}
          </p>
        </div>
        {COLS.map((col) => (
          <div key={col.h5}>
            <h5
              className="font-mono text-[10px] tracking-[0.22em] uppercase mb-5 font-semibold text-iridescent"
            >
              {col.h5}
            </h5>
            {col.links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                data-cursor="go"
                className="hover-target block text-ink no-underline text-sm py-1.5 transition-colors hover:text-iridescent"
              >
                {l.label}
              </Link>
            ))}
          </div>
        ))}
      </div>
      <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-2 pt-6 font-mono text-[10px] tracking-[0.14em] uppercase text-ink-3">
        <span>© 2026 CAPDUCTION · MADE IN BANGKOK</span>
        <span className="text-iridescent font-semibold flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-pink shadow-[0_0_10px_rgba(255,143,181,0.6)] animate-pulse" />
          All systems operational · 99.98%
        </span>
        <span>SOFT LIQUID · V1.0</span>
      </div>
    </footer>
  );
}
