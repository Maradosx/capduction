'use client';

import { useT } from '@/lib/i18n';

export function SettingsHeader({ isDemoMode }: { isDemoMode: boolean }) {
  const t = useT();
  return (
    <div>
      <h1 className="font-display font-bold text-[clamp(28px,3.5vw,42px)] tracking-[-0.025em] text-ink lang-th:font-thai">
        {t('set.title')}
      </h1>
      <p className="text-ink-3 text-[15px] mt-1 lang-th:font-thai">
        {isDemoMode ? t('set.sub.demo') : t('set.sub')}
      </p>
    </div>
  );
}
