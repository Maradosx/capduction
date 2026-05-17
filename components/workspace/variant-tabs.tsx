'use client';

import { useState } from 'react';

/**
 * Shared tab switcher for studios that fan-out into N parallel variants.
 * The result payload is `{ variants: T[] }` — this component shows the
 * tab bar and yields the currently selected variant to `renderVariant`.
 *
 * Used by script-client / caption-client / combo-client so the variant UX
 * is identical across studios.
 */

export interface VariantsPayload<T> {
  variants: T[];
}

export function isVariantsPayload<T>(p: unknown): p is VariantsPayload<T> {
  return !!p && typeof p === 'object'
    && 'variants' in (p as any)
    && Array.isArray((p as any).variants);
}

interface Props<T> {
  data: T[];
  /** Labels per variant — defaults to "#1 #2 #3" if not provided. */
  labels?: string[];
  renderVariant: (variant: T, index: number) => React.ReactNode;
}

export function VariantTabs<T>({ data, labels, renderVariant }: Props<T>) {
  const [active, setActive] = useState(0);
  const total = data.length;
  const idx = Math.min(active, total - 1);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2 flex-wrap">
        <span className="font-mono text-[10px] tracking-[0.2em] text-ink-3 uppercase mr-1">
          {total} Variants
        </span>
        {data.map((_, i) => (
          <button
            key={i}
            type="button"
            data-cursor="switch"
            onClick={() => setActive(i)}
            className={`hover-target px-3 py-1.5 rounded-full text-[12px] font-semibold transition-all
              ${i === idx
                ? 'btn-grad text-white shadow-[0_3px_10px_-2px_rgba(124,58,237,0.35)]'
                : 'bg-white/55 border border-white/70 text-ink-3 hover:bg-white/80 hover:text-ink'}`}
          >
            #{i + 1}{labels?.[i] ? ` · ${labels[i]}` : ''}
          </button>
        ))}
      </div>

      {renderVariant(data[idx], idx)}
    </div>
  );
}
