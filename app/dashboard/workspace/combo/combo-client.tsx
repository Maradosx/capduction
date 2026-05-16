'use client';

import { StudioShell } from '@/components/workspace/studio-shell';
import { ComboResult } from '@/components/workspace/combo-result';
import { useT } from '@/lib/i18n';

export function ComboStudioClient({ brandVoices }: { brandVoices: { id: string; name: string }[] }) {
  const t = useT();
  return (
    <StudioShell
      mode="combo"
      title="Combo Mode"
      description={t('ws.combo.desc')}
      brandVoices={brandVoices}
      renderResult={({ data, loading, onRegenerate }) => (
        <ComboResult data={data} loading={loading} onRegenerate={onRegenerate} />
      )}
    />
  );
}
