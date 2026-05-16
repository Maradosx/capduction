'use client';

import { useState } from 'react';
import { useT } from '@/lib/i18n';

export function BottomCta() {
  const t = useT();
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes('@')) return;
    const url = new URL('/signup', window.location.origin);
    url.searchParams.set('email', email);
    window.location.href = url.toString();
  };

  return (
    <section
      className="relative z-[2] px-8 py-[100px] text-center border-t border-[var(--line)] overflow-hidden"
    >
      <div
        className="absolute inset-0 -z-10 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 60% 50% at 30% 50%, rgba(255,143,181,0.15), transparent 60%), radial-gradient(ellipse 60% 50% at 70% 50%, rgba(181,143,255,0.15), transparent 60%)',
        }}
      />
      <div className="max-w-[720px] mx-auto">
        <h2 className="text-[clamp(42px,5.5vw,72px)] font-bold tracking-[-0.03em] leading-[1.05] text-ink mb-5 lang-th:font-thai">
          <span className="font-serif italic font-normal">{t('bcta.h.serif')}</span>
          <br />
          <span className="text-iridescent">{t('bcta.h.iri')}</span>
        </h2>
        <p className="text-ink-3 text-[17px] mb-8 leading-[1.55] lang-th:font-thai">{t('bcta.p')}</p>

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
            className="hover-target btn-grad px-[22px] py-[11px] rounded-[9px] text-white font-semibold text-sm border-0 whitespace-nowrap lang-th:font-thai"
          >
            {t('bcta.btn')}
          </button>
        </form>
      </div>
    </section>
  );
}
