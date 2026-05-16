'use client';

import { StudioShell } from '@/components/workspace/studio-shell';
import { CaptionResult } from '@/components/workspace/caption-result';

export function CaptionStudioClient({ brandVoices }: { brandVoices: { id: string; name: string }[] }) {
  return (
    <StudioShell
      mode="caption"
      title="Caption Studio"
      description="แคปชั่น 5 variants พร้อมใช้ + hooks + hashtags ตรงเทรนด์ + CTAs ปิดการขาย"
      brandVoices={brandVoices}
      renderResult={({ data, loading, onRegenerate }) => (
        <CaptionResult data={data} loading={loading} onRegenerate={onRegenerate} />
      )}
    />
  );
}
