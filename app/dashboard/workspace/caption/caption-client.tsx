'use client';

import { StudioShell } from '@/components/workspace/studio-shell';
import { CaptionResult } from '@/components/workspace/caption-result';
import { useT } from '@/lib/i18n';

export function CaptionStudioClient({ brandVoices }: { brandVoices: { id: string; name: string }[] }) {
  const t = useT();
  return (
    <StudioShell
      mode="caption"
      title="Caption Studio"
      description={t('ws.caption.desc')}
      brandVoices={brandVoices}
      renderResult={({ data, loading, onRegenerate }) => (
        <CaptionResult data={data} loading={loading} onRegenerate={onRegenerate} />
      )}
    />
  );
}
