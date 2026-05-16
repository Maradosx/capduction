'use client';

import { StudioShell } from '@/components/workspace/studio-shell';
import { ScriptResult } from '@/components/workspace/script-result';
import { useT } from '@/lib/i18n';

export function ScriptStudioClient({ brandVoices }: { brandVoices: { id: string; name: string }[] }) {
  const t = useT();
  return (
    <StudioShell
      mode="script"
      title="Script Studio"
      description={t('ws.script.desc')}
      brandVoices={brandVoices}
      renderResult={({ data, loading, onRegenerate }) => (
        <ScriptResult data={data} loading={loading} onRegenerate={onRegenerate} />
      )}
    />
  );
}
