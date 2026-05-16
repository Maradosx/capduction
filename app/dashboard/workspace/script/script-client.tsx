'use client';

import { StudioShell } from '@/components/workspace/studio-shell';
import { ScriptResult } from '@/components/workspace/script-result';

export function ScriptStudioClient({ brandVoices }: { brandVoices: { id: string; name: string }[] }) {
  return (
    <StudioShell
      mode="script"
      title="Script Studio"
      description="สคริปต์การพูดสำหรับวิดีโอสั้น พร้อม timing markers ทุกวินาที B-roll cues และข้อความหน้าจอ"
      brandVoices={brandVoices}
      renderResult={({ data, loading, onRegenerate }) => (
        <ScriptResult data={data} loading={loading} onRegenerate={onRegenerate} />
      )}
    />
  );
}
