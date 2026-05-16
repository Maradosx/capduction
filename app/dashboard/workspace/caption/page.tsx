import { createClient } from '@/lib/supabase/server';
import { listBrandVoices } from '@/lib/db/brand-voices';
import { CaptionStudioClient } from './caption-client';

export const dynamic = 'force-dynamic';

export default async function CaptionStudioPage() {
  const isDemoMode = !process.env.NEXT_PUBLIC_SUPABASE_URL;
  let voices: { id: string; name: string }[] = [];

  if (!isDemoMode) {
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) voices = (await listBrandVoices()).map((v) => ({ id: v.id, name: v.name }));
    } catch { /* swallow */ }
  } else {
    voices = [{ id: 'demo-bv-1', name: 'พี่สาวที่ปรึกษาผิว' }];
  }

  return <CaptionStudioClient brandVoices={voices} />;
}
