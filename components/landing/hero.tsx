'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useT } from '@/lib/i18n';
import { AppIcon } from '@/components/brand-mark';

const SPARKLES = [
  { top: '20%', right: '22%', color: 'var(--gold)',   delay: '0s',   size: 18 },
  { top: '60%', right: '16%', color: 'var(--pink)',   delay: '0.7s', size: 18 },
  { top: '28%', left:  '18%', color: 'var(--violet)', delay: '1.4s', size: 18 },
  { top: '70%', left:  '26%', color: 'var(--teal)',   delay: '2.1s', size: 18 },
  { top: '15%', left:  '50%', color: 'var(--gold)',   delay: '0.4s', size: 12 },
];

export function LandingHero() {
  const t = useT();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes('@')) return;
    // Phase 1: just route to /signup with prefilled email
    const url = new URL('/signup', window.location.origin);
    url.searchParams.set('email', email);
    window.location.href = url.toString();
    setSubmitted(true);
  };

  return (
    <section className="relative z-[2] min-h-[88vh] px-8 pt-[140px] pb-[60px] flex flex-col items-center justify-center text-center">
      {SPARKLES.map((s, i) => (
        <svg
          key={i}
          viewBox="0 0 24 24"
          fill="currentColor"
          className="absolute animate-twinkle pointer-events-none"
          aria-hidden
          style={{
            top: s.top,
            right: s.right,
            left: s.left,
            color: s.color,
            width: s.size,
            height: s.size,
            filter: `drop-shadow(0 0 8px ${s.color})`,
            animationDelay: s.delay,
          }}
        >
          <path d="M12 0l2.4 9.6L24 12l-9.6 2.4L12 24l-2.4-9.6L0 12l9.6-2.4z" />
        </svg>
      ))}

      <div className="mb-9 animate-float">
        <AppIcon size={120} />
      </div>

      <h1 className="font-display text-[clamp(48px,7vw,100px)] leading-[1] font-bold tracking-[-0.035em] text-ink max-w-[1100px] mb-5 lang-th:font-thai lang-th:text-[clamp(40px,6vw,88px)] lang-th:leading-[1.05]">
        <span className="font-serif italic font-normal text-chrome text-[1.08em]">
          {t('hero.h.serif')}
        </span>
        <br />
        <span className="text-iridescent">{t('hero.h.iri')}</span>
      </h1>

      <p
        className="text-[18px] leading-[1.55] text-ink-3 max-w-[580px] mx-auto mb-9 lang-th:font-thai"
        dangerouslySetInnerHTML={{ __html: t('hero.sub') }}
      />

      <form
        onSubmit={handleSubmit}
        className="inline-flex items-center pl-[22px] pr-[5px] py-[5px] glass-strong rounded-[14px] min-w-[460px] max-w-full"
      >
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t('hero.email.placeholder')}
          className="flex-1 bg-transparent border-0 py-3 text-ink text-sm outline-none min-w-0 placeholder:text-slate lang-th:font-thai"
        />
        <button
          type="submit"
          data-cursor="join"
          disabled={submitted}
          className="hover-target btn-grad px-[22px] py-[11px] rounded-[9px] text-white font-semibold text-sm border-0 whitespace-nowrap disabled:opacity-50 lang-th:font-thai"
        >
          {t('hero.cta')}
        </button>
      </form>

      <div className="mt-6 inline-flex items-center gap-2.5 font-mono text-[11px] text-ink-3 tracking-[0.1em] uppercase">
        <div className="flex">
          <Avatar gradient="linear-gradient(135deg, var(--pink), var(--violet))" />
          <Avatar gradient="linear-gradient(135deg, var(--peach), var(--rose))" />
          <Avatar gradient="linear-gradient(135deg, var(--mint), var(--teal))" />
        </div>
        <span>
          <strong className="text-ink font-bold">2,847</strong>{' '}
          <span className="lang-th:font-thai">{t('hero.trust')}</span>
        </span>
      </div>

      {/* Hint to scroll */}
      <Link
        href="#dashboard-preview"
        className="hover-target absolute bottom-6 left-1/2 -translate-x-1/2 text-ink-3 hover:text-ink transition-colors"
        data-cursor="next"
        aria-label="Scroll to preview"
      >
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </Link>
    </section>
  );
}

function Avatar({ gradient }: { gradient: string }) {
  return (
    <div
      className="w-5 h-5 rounded-full border-2 -ml-1.5 first:ml-0"
      style={{ background: gradient, borderColor: 'var(--bg)' }}
    />
  );
}
