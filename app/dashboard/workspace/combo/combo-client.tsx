'use client';

import { StudioShell } from '@/components/workspace/studio-shell';
import { ComboResult } from '@/components/workspace/combo-result';
import { VariantTabs, isVariantsPayload } from '@/components/workspace/variant-tabs';
import type { ComboContent } from '@/types';
import { useT } from '@/lib/i18n';

const COMBO_ANGLES = ['EMOTIONAL', 'PROBLEM-LED', 'PROOF-LED'];

export function ComboStudioClient({ brandVoices }: { brandVoices: { id: string; name: string }[] }) {
  const t = useT();
  return (
    <StudioShell
      mode="combo"
      title="Combo Mode"
      description={t('ws.combo.desc')}
      brandVoices={brandVoices}
      renderResult={({ data, loading, onRegenerate }) => {
        if (isVariantsPayload<ComboContent>(data)) {
          return (
            <VariantTabs<ComboContent>
              data={data.variants}
              labels={COMBO_ANGLES}
              renderVariant={(v) => (
                <ComboResult data={v} loading={loading} onRegenerate={onRegenerate} />
              )}
            />
          );
        }
        return (
          <ComboResult
            data={data as ComboContent | null}
            loading={loading}
            onRegenerate={onRegenerate}
          />
        );
      }}
    />
  );
}
