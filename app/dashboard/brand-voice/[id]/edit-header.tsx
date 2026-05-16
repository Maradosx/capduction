'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useT } from '@/lib/i18n';

export function EditHeader({ name }: { name: string }) {
  const t = useT();
  return (
    <>
      <Link
        href="/dashboard/brand-voice"
        data-cursor="go"
        className="hover-target inline-flex items-center gap-2 text-ink-3 hover:text-ink text-[13px] font-mono no-underline lang-th:font-thai"
      >
        <ArrowLeft size={14} /> {t('bv.back_all')}
      </Link>

      <div>
        <h1 className="font-display font-bold text-[clamp(28px,3.5vw,42px)] tracking-[-0.025em] text-ink lang-th:font-thai">
          <span className="text-iridescent">{name}</span>
        </h1>
        <p className="text-ink-3 text-[15px] mt-1 lang-th:font-thai">{t('bv.edit.sub')}</p>
      </div>
    </>
  );
}
