import { createClient } from '@/lib/supabase/server';
import { listBrandVoices } from '@/lib/db/brand-voices';
import { ScriptStudioClient } from './script-client';

export const dynamic = 'force-dynamic';

export default async function ScriptStudioPage() {
  const isDemoMode = !process.env.NEXT_PUBLIC_SUPABASE_URL;
  let voices: { id: string; name: string }[] = [];

  if (!isDemoMode) {
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const all = await listBrandVoices();
        voices = all.map((v) => ({ id: v.id, name: v.name }));
      }
    } catch { /* swallow */ }
  } else {
    voices = [{ id: 'demo-bv-1', name: 'พี่สาวที่ปรึกษาผิว' }];
  }

  return <ScriptStudioClient brandVoices={voices} />;
}
