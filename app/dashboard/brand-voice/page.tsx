import Link from 'next/link';
import { Mic2, Plus } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { listBrandVoices } from '@/lib/db/brand-voices';
import type { BrandVoice } from '@/types';

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

  return (
    <div className="max-w-[1200px] mx-auto flex flex-col gap-6">
      <div className="flex justify-between items-end flex-wrap gap-4">
        <div>
          <h1 className="font-display font-bold text-[clamp(28px,3.5vw,42px)] tracking-[-0.025em] text-ink lang-th:font-thai">
            <span className="text-iridescent">Brand Voice</span> Memory
          </h1>
          <p className="text-ink-3 text-[15px] mt-1 lang-th:font-thai">
            สอน AI ให้รู้จักโทนแบรนด์คุณ — ใส่ตัวอย่างไม่กี่โพสต์ มันจะเขียนในเสียงคุณตลอดไป
            {isDemoMode && ' · Demo mode'}
          </p>
        </div>
        <Link
          href="/dashboard/brand-voice/new"
          data-cursor="create"
          className="hover-target btn-grad px-5 py-3 rounded-[12px] text-white font-semibold text-[14px] no-underline inline-flex items-center gap-2 lang-th:font-thai"
        >
          <Plus size={16} /> สร้าง voice ใหม่
        </Link>
      </div>

      {voices.length === 0 ? (
        <div className="glass rounded-[18px] p-12 text-center">
          <Mic2 size={32} className="mx-auto mb-3 text-ink-3 opacity-40" />
          <p className="text-ink-3 text-[14px] mb-4 lang-th:font-thai">
            ยังไม่มี brand voice — สอน AI ในแบบของแบรนด์คุณได้เลย
          </p>
          <Link
            href="/dashboard/brand-voice/new"
            data-cursor="create"
            className="hover-target btn-grad px-5 py-2.5 rounded-full text-white font-semibold text-[13px] no-underline inline-flex items-center gap-2 lang-th:font-thai"
          >
            <Plus size={14} /> สร้าง voice แรก
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {voices.map((v) => (
            <Link
              key={v.id}
              href={`/dashboard/brand-voice/${v.id}`}
              data-cursor="open"
              className="hover-target glass rounded-[18px] p-5 no-underline transition-all hover:-translate-y-1 hover:shadow-glass-lg block"
            >
              <div className="flex items-start gap-3 mb-3">
                <div className="orb-chrome w-12 h-12 rounded-[14px] flex items-center justify-center flex-shrink-0">
                  <Mic2 size={18} className="text-white drop-shadow-sm" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-display font-bold text-[17px] text-ink truncate lang-th:font-thai">{v.name}</div>
                  <div className="text-[11px] text-ink-3 font-mono mt-0.5">
                    {(v.sample_posts?.length ?? 0)} sample{v.sample_posts?.length !== 1 ? 's' : ''} · Updated {new Date(v.updated_at).toLocaleDateString('th-TH', { day: 'numeric', month: 'short' })}
                  </div>
                </div>
              </div>
              <p className="text-[13px] text-ink-3 leading-relaxed line-clamp-3 lang-th:font-thai">
                {v.description}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
