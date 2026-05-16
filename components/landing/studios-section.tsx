'use client';

import { useT } from '@/lib/i18n';

const STUDIOS = [
  {
    id: 'script',
    nameKey: 'st.1.name' as const,
    tagKey:  'st.1.tag'  as const,
    descKey: 'st.1.desc' as const,
    orbGrad:
      'radial-gradient(circle at 35% 28%, white, var(--peach) 25%, var(--rose) 60%, var(--pink))',
    blobColor: 'var(--peach)',
  },
  {
    id: 'caption',
    nameKey: 'st.2.name' as const,
    tagKey:  'st.2.tag'  as const,
    descKey: 'st.2.desc' as const,
    orbGrad:
      'radial-gradient(circle at 35% 28%, white, var(--lav) 25%, var(--violet) 60%, var(--ink-3))',
    blobColor: 'var(--lav)',
  },
  {
    id: 'combo',
    nameKey: 'st.3.name' as const,
    tagKey:  'st.3.tag'  as const,
    descKey: 'st.3.desc' as const,
    orbGrad:
      'radial-gradient(circle at 35% 28%, white, var(--mint) 25%, var(--teal) 60%, #2A7B82)',
    blobColor: 'var(--mint)',
  },
] as const;

export function StudiosSection() {
  const t = useT();

  return (
    <section id="studios" className="relative z-[2] px-8 py-[100px]">
      <div className="max-w-[800px] mx-auto mb-15 text-center">
        <div className="font-mono text-[11px] tracking-[0.22em] uppercase text-ink-3 mb-6 inline-flex items-center gap-3.5">
          <span className="text-iridescent text-[14px]">✦</span>
          {t('st.eye')}
          <span className="text-iridescent text-[14px]">✦</span>
        </div>
        <h2 className="font-display text-[clamp(40px,5.4vw,76px)] font-bold tracking-[-0.03em] leading-[1.05] text-ink mb-[18px] lang-th:font-thai">
          {t('st.h.left')} <span className="text-iridescent">{t('st.h.iri')}</span>
          <br />
          {t('st.h.right')}
        </h2>
        <p className="text-ink-3 text-[17px] leading-[1.55] lang-th:font-thai">{t('st.p')}</p>
      </div>

      <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-5">
        {STUDIOS.map((s) => (
          <div
            key={s.id}
            className="relative overflow-hidden glass rounded-[22px] p-9 px-[30px] transition-all hover:-translate-y-1.5 hover:shadow-glass-lg"
          >
            <div
              className="absolute -top-1/2 -right-1/2 w-full h-full rounded-full opacity-0 transition-opacity duration-500 group-hover:opacity-60 pointer-events-none"
              style={{
                background: `radial-gradient(circle, ${s.blobColor}, transparent 70%)`,
                filter: 'blur(40px)',
              }}
            />
            <div className="relative z-[1]">
              <div
                className="w-[76px] h-[76px] rounded-full mb-7 relative"
                style={{
                  background: s.orbGrad,
                  boxShadow:
                    '0 0 0 1px rgba(255,255,255,0.6), 0 14px 32px rgba(94,79,138,0.25)',
                }}
              >
                <div
                  className="absolute top-2 left-[18px] w-6 h-2.5 rounded-full -rotate-[25deg]"
                  style={{ background: 'rgba(255,255,255,0.7)' }}
                />
              </div>
              <h3 className="font-display text-[26px] font-bold tracking-[-0.02em] text-ink mb-1.5 lang-th:font-thai">
                <span className="font-serif italic font-normal text-violet lang-th:font-thai lang-th:not-italic lang-th:font-extrabold">
                  {t(s.nameKey).split(' ')[0]}
                </span>{' '}
                {t(s.nameKey).split(' ').slice(1).join(' ')}
              </h3>
              <div className="font-mono text-[10px] tracking-[0.16em] uppercase text-ink-3 mb-5 font-semibold">
                {t(s.tagKey)}
              </div>
              <p className="text-sm leading-[1.65] text-ink-3 lang-th:font-thai lang-th:text-[15px]">
                {t(s.descKey)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
