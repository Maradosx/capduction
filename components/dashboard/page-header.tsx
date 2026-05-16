'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useT, type DictKey } from '@/lib/i18n';

/**
 * Reusable header for sub-pages that need:
 *   - Back link
 *   - Iridescent title
 *   - Optional subtitle
 *
 * All text comes from i18n dict keys so it switches with the language toggle.
 */
export function PageHeader({
  backHref, backKey, titleKey, subKey,
}: {
  backHref?: string;
  backKey?: DictKey;
  titleKey: DictKey;
  subKey?:  DictKey;
}) {
  const t = useT();
  return (
    <>
      {backHref && backKey && (
        <Link
          href={backHref}
          data-cursor="go"
          className="hover-target inline-flex items-center gap-2 text-ink-3 hover:text-ink text-[13px] font-mono no-underline lang-th:font-thai"
        >
          <ArrowLeft size={14} />
          {t(backKey)}
        </Link>
      )}
      <div>
        <h1 className="font-display font-bold text-[clamp(28px,3.5vw,42px)] tracking-[-0.025em] text-ink lang-th:font-thai">
          <span className="text-iridescent">{t(titleKey)}</span>
        </h1>
        {subKey && (
          <p className="text-ink-3 text-[15px] mt-1 lang-th:font-thai">{t(subKey)}</p>
        )}
      </div>
    </>
  );
}
