'use client';

import { StudioShell } from '@/components/workspace/studio-shell';
import { CaptionResult } from '@/components/workspace/caption-result';
import { VariantTabs, isVariantsPayload } from '@/components/workspace/variant-tabs';
import type { CaptionContent } from '@/types';
import { useT } from '@/lib/i18n';

const CAPTION_ANGLES = ['EMOTIONAL', 'PROBLEM-SOLUTION', 'SOCIAL-PROOF'];

export function CaptionStudioClient({ brandVoices }: { brandVoices: { id: string; name: string }[] }) {
  const t = useT();
  return (
    <StudioShell
      mode="caption"
      title="Caption Studio"
      description={t('ws.caption.desc')}
      brandVoices={brandVoices}
      renderResult={({ data, loading, onRegenerate }) => {
        if (isVariantsPayload<CaptionContent>(data)) {
          return (
            <VariantTabs<CaptionContent>
              data={data.variants}
              labels={CAPTION_ANGLES}
              renderVariant={(v) => (
                <CaptionResult data={v} loading={loading} onRegenerate={onRegenerate} />
              )}
            />
          );
        }
        return (
          <CaptionResult
            data={data as CaptionContent | null}
            loading={loading}
            onRegenerate={onRegenerate}
          />
        );
      }}
    />
  );
}
