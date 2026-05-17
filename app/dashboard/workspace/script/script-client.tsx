'use client';

import { StudioShell } from '@/components/workspace/studio-shell';
import { ScriptResult } from '@/components/workspace/script-result';
import { VariantTabs, isVariantsPayload } from '@/components/workspace/variant-tabs';
import type { ScriptContent } from '@/types';
import { useT } from '@/lib/i18n';

const SCRIPT_ANGLES = ['PROOF-led', 'PROBLEM-led', 'CURIOSITY-led'];

export function ScriptStudioClient({ brandVoices }: { brandVoices: { id: string; name: string }[] }) {
  const t = useT();
  return (
    <StudioShell
      mode="script"
      title="Script Studio"
      description={t('ws.script.desc')}
      brandVoices={brandVoices}
      renderResult={({ data, loading, onRegenerate }) => {
        if (isVariantsPayload<ScriptContent>(data)) {
          return (
            <VariantTabs<ScriptContent>
              data={data.variants}
              labels={SCRIPT_ANGLES}
              renderVariant={(v) => (
                <ScriptResult data={v} loading={loading} onRegenerate={onRegenerate} />
              )}
            />
          );
        }
        return (
          <ScriptResult
            data={data as ScriptContent | null}
            loading={loading}
            onRegenerate={onRegenerate}
          />
        );
      }}
    />
  );
}
