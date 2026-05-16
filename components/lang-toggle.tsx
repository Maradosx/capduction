'use client';

import { useI18n } from '@/lib/i18n';

export function LangToggle() {
  const { lang, setLang } = useI18n();
  return (
    <div className="lang-toggle inline-flex p-1 bg-white/60 border border-white/60 rounded-full gap-0.5">
      <button
        onClick={() => setLang('th')}
        data-cursor="switch"
        className={`hover-target border-0 px-3 py-1 rounded-full font-mono text-[10px] transition-all
          ${lang === 'th' ? 'bg-ink text-white shadow-sm' : 'bg-transparent text-ink-3'}`}
      >
        TH
      </button>
      <button
        onClick={() => setLang('en')}
        data-cursor="switch"
        className={`hover-target border-0 px-3 py-1 rounded-full font-mono text-[10px] transition-all
          ${lang === 'en' ? 'bg-ink text-white shadow-sm' : 'bg-transparent text-ink-3'}`}
      >
        EN
      </button>
    </div>
  );
}
