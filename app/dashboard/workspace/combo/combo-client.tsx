'use client';

import { StudioShell } from '@/components/workspace/studio-shell';
import { ComboResult } from '@/components/workspace/combo-result';

export function ComboStudioClient({ brandVoices }: { brandVoices: { id: string; name: string }[] }) {
  return (
    <StudioShell
      mode="combo"
      title="Combo Mode"
      description="Script + Caption บน hook เดียวกัน · package พร้อมโพสต์ครบในไฟล์เดียว"
      brandVoices={brandVoices}
      renderResult={({ data, loading, onRegenerate }) => (
        <ComboResult data={data} loading={loading} onRegenerate={onRegenerate} />
      )}
    />
  );
}
