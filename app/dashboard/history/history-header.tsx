'use client';

import Link from 'next/link';
import { Clock } from 'lucide-react';
import { useT } from '@/lib/i18n';

export function HistoryHeader({ isDemoMode, count }: { isDemoMode: boolean; count: number }) {
  const t = useT();
  return (
    <div>
      <h1 className="font-display font-bold text-[clamp(28px,3.5vw,42px)] tracking-[-0.025em] text-ink lang-th:font-thai">
        <span className="text-iridescent">{t('hs.title')}</span>
      </h1>
      <p className="text-ink-3 text-[15px] mt-1 lang-th:font-thai">
        {isDemoMode ? t('hs.demo') : t('hs.count', { n: count })}
      </p>
    </div>
  );
}

export function HistoryEmpty() {
  const t = useT();
  return (
    <div className="glass rounded-[18px] p-12 text-center">
      <Clock size={32} className="mx-auto mb-3 text-ink-3 opacity-40" />
      <p className="text-ink-3 text-[14px] mb-4 lang-th:font-thai">{t('hs.empty')}</p>
      <div className="flex flex-wrap justify-center gap-2">
        <Link href="/dashboard/workspace/script" data-cursor="start" className="hover-target btn-grad px-4 py-2 rounded-full text-white font-semibold text-[13px] no-underline lang-th:font-thai">
          Script Studio
        </Link>
        <Link href="/dashboard/workspace/caption" data-cursor="start" className="hover-target btn-grad px-4 py-2 rounded-full text-white font-semibold text-[13px] no-underline lang-th:font-thai">
          Caption Studio
        </Link>
        <Link href="/dashboard/workspace/combo" data-cursor="start" className="hover-target btn-grad px-4 py-2 rounded-full text-white font-semibold text-[13px] no-underline lang-th:font-thai">
          Combo Mode
        </Link>
      </div>
    </div>
  );
}
