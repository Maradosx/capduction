'use client';

import Link from 'next/link';
import { Check, ArrowLeft, ShieldCheck, RefreshCw, Lock, CreditCard } from 'lucide-react';
import { useT } from '@/lib/i18n';

interface Props {
  isLoggedIn: boolean;
  currentPlan: string | null;
}

export function PricingClient({ isLoggedIn, currentPlan }: Props) {
  const t = useT();

  const PLANS = [
    {
      id: 'free' as const,
      name: 'Free',
      price: '฿0',
      description: t('pr.free.desc'),
      features: [t('pr.free.f1'), t('pr.free.f2'), t('pr.free.f3'), t('pr.free.f4')],
      ctaLabel: t('pr.free.cta'),
      featured: false,
    },
    {
      id: 'studio' as const,
      name: 'Studio',
      price: '฿349',
      description: t('pr.studio.desc'),
      features: [t('pr.studio.f1'), t('pr.studio.f2'), t('pr.studio.f3'), t('pr.studio.f4'), t('pr.studio.f5'), t('pr.studio.f6')],
      ctaLabel: t('pr.studio.cta'),
      featured: true,
    },
    {
      id: 'agency' as const,
      name: 'Agency',
      price: '฿1,290',
      description: t('pr.agency.desc'),
      features: [t('pr.agency.f1'), t('pr.agency.f2'), t('pr.agency.f3'), t('pr.agency.f4'), t('pr.agency.f5'), t('pr.agency.f6')],
      ctaLabel: t('pr.agency.cta'),
      featured: false,
    },
  ];

  return (
    <main className="pt-[120px] px-5 pb-20">
      <header className="max-w-[800px] mx-auto text-center mb-12">
        <div className="font-mono text-[11px] tracking-[0.22em] uppercase text-ink-3 mb-4 inline-flex items-center gap-3">
          <span className="text-iridescent text-[14px]">✦</span>
          {t('pr.eye').replace(/^✦ /, '').replace(/ ✦$/, '')}
          <span className="text-iridescent text-[14px]">✦</span>
        </div>
        <h1 className="font-display font-bold text-[clamp(40px,5.5vw,72px)] tracking-[-0.03em] leading-[1.05] text-ink mb-4 lang-th:font-thai">
          {t('pr.h.serif')} <span className="text-iridescent">{t('pr.h.iri')}</span>
        </h1>
        <p className="text-ink-3 text-[16px] lang-th:font-thai">{t('pr.sub')}</p>
      </header>

      <section className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-5">
        {PLANS.map((plan) => {
          const isCurrent = isLoggedIn && currentPlan === plan.id;
          return (
            <div
              key={plan.id}
              className={`relative rounded-[24px] p-7 flex flex-col transition-all hover:-translate-y-1.5
                ${plan.featured
                  ? 'bg-gradient-to-b from-white/85 to-violet-50/70 backdrop-blur-[28px] border-2 border-violet/40 shadow-[0_24px_56px_rgba(181,143,255,0.25)]'
                  : 'glass'}`}
            >
              {plan.featured && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 btn-grad px-3.5 py-1 rounded-full text-white font-mono text-[10px] tracking-wider font-semibold">
                  {t('pr.recommended')}
                </div>
              )}
              <div className="font-mono text-[11px] tracking-[0.22em] uppercase text-ink-3 mb-3 font-semibold">
                {plan.name.toUpperCase()}
              </div>
              <div className="flex items-baseline gap-1 mb-1">
                <span className="font-display font-bold text-[48px] leading-none text-ink">{plan.price}</span>
                <span className="text-ink-3 text-[14px] font-mono">/mo</span>
              </div>
              <p className="text-[14px] text-ink-3 leading-relaxed mb-6 lang-th:font-thai">{plan.description}</p>

              <ul className="flex flex-col gap-2.5 flex-1 mb-6">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-[13px] text-ink-2 lang-th:font-thai">
                    <Check size={14} className="text-iridescent flex-shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>

              {isCurrent ? (
                <div className="text-center py-3 px-4 rounded-[12px] bg-emerald-100/60 text-emerald-700 font-semibold text-[13px] border border-emerald-200 lang-th:font-thai">
                  {t('pr.current')}
                </div>
              ) : (
                <Link
                  href={
                    plan.id === 'free'
                      ? (isLoggedIn ? '/dashboard' : '/signup')
                      : `/api/billing/checkout?plan=${plan.id}`
                  }
                  data-cursor="start"
                  className={`hover-target block text-center py-3 px-4 rounded-[12px] font-semibold text-[13px] no-underline transition-all lang-th:font-thai
                    ${plan.featured
                      ? 'btn-grad text-white'
                      : 'bg-white/65 border border-white/80 text-ink hover:bg-white/85'}`}
                >
                  {plan.ctaLabel}
                </Link>
              )}
            </div>
          );
        })}
      </section>

      {/* Risk reversal row — answers "is this safe to try?" before scroll */}
      <section className="max-w-[1000px] mx-auto mt-12 grid grid-cols-2 md:grid-cols-4 gap-3">
        <RiskBadge icon={CreditCard}  label={t('pr.risk.nocard')} />
        <RiskBadge icon={RefreshCw}   label={t('pr.risk.cancel')} />
        <RiskBadge icon={ShieldCheck} label={t('pr.risk.pdpa')}  />
        <RiskBadge icon={Lock}        label={t('pr.risk.stripe')} />
      </section>

      {/* Inline FAQ — keep purchase intent on this page */}
      <section className="max-w-[760px] mx-auto mt-20">
        <h2 className="font-display font-bold text-[26px] md:text-[30px] text-ink mb-6 text-center lang-th:font-thai">
          {t('pr.faq.h')}
        </h2>
        <div className="flex flex-col gap-2.5">
          <PriceFaq q={t('pr.faq.q1')}>{t('pr.faq.a1')}</PriceFaq>
          <PriceFaq q={t('pr.faq.q2')}>{t('pr.faq.a2')}</PriceFaq>
          <PriceFaq q={t('pr.faq.q3')}>{t('pr.faq.a3')}</PriceFaq>
          <PriceFaq q={t('pr.faq.q4')}>{t('pr.faq.a4')}</PriceFaq>
          <PriceFaq q={t('pr.faq.q5')}>{t('pr.faq.a5')}</PriceFaq>
          <PriceFaq q={t('pr.faq.q6')}>{t('pr.faq.a6')}</PriceFaq>
        </div>

        <div className="mt-6 text-center text-[13px] text-ink-3 lang-th:font-thai">
          {t('pr.faq.more')}{' '}
          <Link href="mailto:hello@capduction.com" data-cursor="go" className="text-iridescent font-semibold no-underline hover:underline">
            hello@capduction.com
          </Link>
        </div>
      </section>

      <div className="text-center mt-12">
        <Link
          href={isLoggedIn ? '/dashboard' : '/'}
          data-cursor="go"
          className="hover-target inline-flex items-center gap-2 text-ink-3 hover:text-ink text-[13px] font-mono no-underline lang-th:font-thai"
        >
          <ArrowLeft size={14} />
          {isLoggedIn ? t('pr.back.dash') : t('pr.back.home')}
        </Link>
      </div>
    </main>
  );
}

function RiskBadge({ icon: Icon, label }: { icon: React.ElementType; label: string }) {
  return (
    <div className="glass rounded-[12px] px-4 py-3 flex items-center gap-2.5">
      <Icon size={16} className="text-iridescent flex-shrink-0" />
      <span className="text-[12px] text-ink font-semibold leading-tight lang-th:font-thai">{label}</span>
    </div>
  );
}

function PriceFaq({ q, children }: { q: string; children: React.ReactNode }) {
  return (
    <details className="group glass rounded-[12px] overflow-hidden">
      <summary className="hover-target cursor-pointer px-5 py-3.5 text-[14px] font-semibold text-ink flex items-center justify-between gap-3 list-none lang-th:font-thai">
        {q}
        <span className="text-ink-3 text-[20px] leading-none group-open:rotate-45 transition-transform">+</span>
      </summary>
      <div className="px-5 pb-4 text-[13px] text-ink-3 leading-[1.65] lang-th:font-thai">
        {children}
      </div>
    </details>
  );
}
