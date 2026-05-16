import { createClient } from '@/lib/supabase/server';
import { listBrandVoices } from '@/lib/db/brand-voices';
import type { BrandVoice } from '@/types';
import { BrandVoiceClient } from './brand-voice-client';

export const metadata = { title: 'Brand Voice — Capduction' };

const DEMO_VOICES: BrandVoice[] = [
  {
    id: 'demo-bv-1',
    user_id: 'demo',
    name: 'พี่สาวที่ปรึกษาผิว',
    description: 'พูดเหมือนพี่สาวที่ปรึกษาเรื่องผิว ใช้ภาษาน่ารัก ใส่ ✨ บางครั้ง อย่าใส่ศัพท์เทคนิคหนักๆ จบประโยคด้วย "ค่า"',
    sample_posts: [
      'ลิปแมตต์ตัวนี้ดีมากๆ ค่า ✨ ใช้แล้วไม่ทำริมปากแห้งเลย',
      'น้องๆ ที่กำลังหา serum สำหรับผิวมัน พี่แนะนำตัวนี้',
      'พรุ่งนี้มี live สาธิตการแต่งหน้าน้า อย่าพลาด',
    ],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export default async function BrandVoicePage() {
  const isDemoMode = !process.env.NEXT_PUBLIC_SUPABASE_URL;
  let voices: BrandVoice[] = [];

  if (!isDemoMode) {
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) voices = await listBrandVoices();
    } catch { /* swallow */ }
  } else {
    voices = DEMO_VOICES;
  }

  return <BrandVoiceClient voices={voices} isDemoMode={isDemoMode} />;
}
