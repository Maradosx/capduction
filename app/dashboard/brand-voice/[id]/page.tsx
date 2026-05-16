import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getBrandVoice } from '@/lib/db/brand-voices';
import { BrandVoiceForm } from '../brand-voice-form';
import { EditHeader } from './edit-header';
import type { BrandVoice } from '@/types';

const DEMO_BV: BrandVoice = {
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
};

export default async function BrandVoiceDetailPage({ params }: { params: { id: string } }) {
  const isDemoMode = !process.env.NEXT_PUBLIC_SUPABASE_URL;
  let bv: BrandVoice | null = null;

  if (isDemoMode) {
    if (params.id !== 'demo-bv-1') notFound();
    bv = DEMO_BV;
  } else {
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) notFound();
      bv = await getBrandVoice(params.id);
      if (!bv) notFound();
    } catch { notFound(); }
  }

  if (!bv) notFound();

  return (
    <div className="max-w-[680px] mx-auto flex flex-col gap-6">
      <EditHeader name={bv.name} />

      <BrandVoiceForm
        mode="edit"
        initial={{
          id:           bv.id,
          name:         bv.name,
          description:  bv.description,
          sample_posts: bv.sample_posts ?? [],
        }}
      />
    </div>
  );
}
