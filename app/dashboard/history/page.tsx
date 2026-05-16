import Link from 'next/link';
import { Clock, FileText, Type, Wand2, Filter } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { getRecentGenerations } from '@/lib/db/generations';
import type { Generation } from '@/types';
import { HistoryClient } from './history-client';

const STUDIO_META: Record<string, { label: string; icon: typeof Wand2; href: string }> = {
  script:  { label: 'Script',  icon: FileText, href: '/dashboard/workspace/script' },
  caption: { label: 'Caption', icon: Type,     href: '/dashboard/workspace/caption' },
  combo:   { label: 'Combo',   icon: Wand2,    href: '/dashboard/workspace/combo' },
};

export default async function HistoryPage() {
  const isDemoMode = !process.env.NEXT_PUBLIC_SUPABASE_URL;
  let items: Generation[] = [];

  if (!isDemoMode) {
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) items = await getRecentGenerations(100);
    } catch { /* swallow */ }
  }

  return (
    <div className="max-w-[1200px] mx-auto flex flex-col gap-6">
      <div>
        <h1 className="font-display font-bold text-[clamp(28px,3.5vw,42px)] tracking-[-0.025em] text-ink lang-th:font-thai">
          ประวัติ <span className="text-iridescent">Generation</span>
        </h1>
        <p className="text-ink-3 text-[15px] mt-1 lang-th:font-thai">
          {isDemoMode
            ? 'Demo mode · ไม่มีข้อมูลให้แสดง (ไม่ได้ตั้ง Supabase)'
            : `ทั้งหมด ${items.length} รายการ`}
        </p>
      </div>

      {items.length === 0 ? (
        <div className="glass rounded-[18px] p-12 text-center">
          <Clock size={32} className="mx-auto mb-3 text-ink-3 opacity-40" />
          <p className="text-ink-3 text-[14px] mb-4 lang-th:font-thai">
            ยังไม่มีกิจกรรม — เริ่มสร้างคอนเทนต์แรกได้เลย
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            <Link href="/dashboard/workspace/script" data-cursor="start" className="hover-target btn-grad px-4 py-2 rounded-full text-white font-semibold text-[13px] no-underline lang-th:font-thai">
              Script Studio
            </Link>
            <Link href="/dashboard/workspace/caption" data-cursor="start" className="hover-target btn-grad px-4 py-2 rounded-full text-white font-semibold text-[13px] no-underline lang-th:font-thai">
              Caption Studio
            </Link>
            <Link href="/dashboard/workspace/combo" data-cursor="start" className="hover-target btn-grad px-4 py-2 rounded-full text-white font-semibold text-[13px] no-underline lang-th:font-thai">
              Combo Mode
            </Link>
          </div>
        </div>
      ) : (
        <HistoryClient items={items} />
      )}
    </div>
  );
}
