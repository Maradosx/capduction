'use client';

import { useState } from 'react';
import { StudioShell } from '@/components/workspace/studio-shell';
import { ScriptResult } from '@/components/workspace/script-result';
import type { ScriptContent } from '@/types';
import { useT } from '@/lib/i18n';

type ScriptVariantsPayload = { variants: ScriptContent[] };
type ScriptPayload = ScriptContent | ScriptVariantsPayload | null;

function isVariantsPayload(p: ScriptPayload): p is ScriptVariantsPayload {
  return !!p && typeof p === 'object' && 'variants' in p && Array.isArray((p as any).variants);
}

export function ScriptStudioClient({ brandVoices }: { brandVoices: { id: string; name: string }[] }) {
  const t = useT();
  return (
    <StudioShell
      mode="script"
      title="Script Studio"
      description={t('ws.script.desc')}
      brandVoices={brandVoices}
      renderResult={({ data, loading, onRegenerate }) => (
        <ScriptResultRouter data={data as ScriptPayload} loading={loading} onRegenerate={onRegenerate} />
      )}
    />
  );
}

function ScriptResultRouter({
  data, loading, onRegenerate,
}: { data: ScriptPayload; loading?: boolean; onRegenerate?: () => void }) {
  const [active, setActive] = useState(0);

  if (!data || !isVariantsPayload(data)) {
    return <ScriptResult data={data as ScriptContent | null} loading={loading} onRegenerate={onRegenerate} />;
  }

  const total = data.variants.length;
  const ANGLE_LABELS = ['PROOF-led', 'PROBLEM-led', 'CURIOSITY-led'];
  const idx = Math.min(active, total - 1);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2 flex-wrap">
        <span className="font-mono text-[10px] tracking-[0.2em] text-ink-3 uppercase mr-1">
          {total} Variants
        </span>
        {data.variants.map((_, i) => (
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
            #{i + 1} · {ANGLE_LABELS[i] ?? `Variant ${i + 1}`}
          </button>
        ))}
      </div>

      <ScriptResult data={data.variants[idx]} loading={loading} onRegenerate={onRegenerate} />
    </div>
  );
}
