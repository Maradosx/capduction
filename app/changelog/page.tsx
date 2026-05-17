import Link from 'next/link';
import { Sparkles, Bug, Zap, Lock, Type } from 'lucide-react';
import { CapNav } from '@/components/cap-nav';
import { CapFooter } from '@/components/cap-footer';

export const metadata = {
  title: 'Changelog — Capduction',
  description: 'What\'s new in Capduction. Updates, fixes, and feature ships.',
};

type Tag = 'new' | 'fix' | 'perf' | 'security' | 'i18n';

interface Entry {
  date: string;
  version: string;
  items: { tag: Tag; text: string }[];
}

const TAG_META: Record<Tag, { label: string; icon: React.ElementType; cls: string }> = {
  new:      { label: 'NEW',      icon: Sparkles, cls: 'bg-violet/15 text-violet border-violet/30' },
  fix:      { label: 'FIX',      icon: Bug,      cls: 'bg-rose-100 text-rose-700 border-rose-200' },
  perf:     { label: 'PERF',     icon: Zap,      cls: 'bg-amber-100 text-amber-700 border-amber-200' },
  security: { label: 'SECURITY', icon: Lock,     cls: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  i18n:     { label: 'I18N',     icon: Type,     cls: 'bg-sky-100 text-sky-700 border-sky-200' },
};

const ENTRIES: Entry[] = [
  {
    date: '2026-05-17',
    version: 'v1.0 Beta',
    items: [
      { tag: 'security', text: 'Stripe webhook ใช้ service-role client ที่ bypass RLS ได้ถูกต้อง · กรณีจ่ายเงินแล้วเครดิตไม่ขึ้นจะไม่เกิดอีก' },
      { tag: 'security', text: 'webhook ไม่ reset เครดิตทุก event แล้ว — เฉพาะ activation/renewal/upgrade เท่านั้น' },
      { tag: 'security', text: 'OAuth callback sanitize ?next param · ป้องกัน open-redirect' },
      { tag: 'security', text: 'DELETE history endpoint ตรวจสอบ session + user_id ก่อนลบ' },
      { tag: 'new',      text: 'Script Studio รองรับ variants 2-3 แบบ ด้วย parallel fan-out (PROOF / PROBLEM / CURIOSITY angle)' },
      { tag: 'new',      text: 'นโยบายความเป็นส่วนตัว + ข้อกำหนดการใช้งาน เปิดออนไลน์แล้ว ตาม PDPA ของไทย' },
      { tag: 'new',      text: 'หน้า About + Documentation เต็มเวอร์ชั่น · พร้อม FAQ 6 ข้อ' },
      { tag: 'i18n',     text: 'Chip preset (หมวดหมู่/กลุ่มเป้าหมาย/Other) translate ตามภาษาแล้ว' },
      { tag: 'i18n',     text: 'หน้าสมัครสมาชิก + ลืมรหัสผ่าน แปลครบทุก string' },
      { tag: 'perf',     text: 'OpenAI request มี 45s timeout · ไม่ปล่อยให้ Vercel kill silently' },
      { tag: 'fix',      text: 'AI response viewer ไม่ crash เมื่อ JSON output ผิด format · แสดงเท่าที่มี' },
      { tag: 'fix',      text: 'ฟอร์ม Combo workspace ลดความรกของ chips · แสดง 6 ตัวแรก + "+N more"' },
    ],
  },
  {
    date: '2026-05-16',
    version: 'v0.9',
    items: [
      { tag: 'new',  text: 'Multi-select fields ทั้ง category, target, tone · พิมพ์เองได้ผ่าน "+ อื่นๆ"' },
      { tag: 'new',  text: 'Duration custom · พิมพ์เอง เช่น 45s, 2 min' },
      { tag: 'new',  text: 'เลือกจำนวน variants 1-3 ก่อน generate' },
      { tag: 'new',  text: 'Google OAuth login (เพิ่มจาก email + magic link)' },
      { tag: 'new',  text: 'Resend SMTP จาก capduction.com domain · อีเมล transactional ทำงานครบ' },
      { tag: 'fix',  text: 'Reset password flow · จัดการ PKCE token + race condition ครบ' },
      { tag: 'fix',  text: 'Topbar avatar dropdown · คลิก Settings/Sign out ได้แล้ว' },
      { tag: 'fix',  text: 'Topbar search bar ใช้งานได้จริง · นำไปหน้า History' },
      { tag: 'i18n', text: 'ครอบคลุม dashboard, settings, workspace, pricing 200+ keys' },
    ],
  },
  {
    date: '2026-05-15',
    version: 'v0.5',
    items: [
      { tag: 'new', text: 'Public beta launch ที่ capduction.com' },
      { tag: 'new', text: '3 Studios พร้อมใช้: Script · Caption · Combo' },
      { tag: 'new', text: 'Brand Voice Memory · บันทึก voice พร้อม sample posts' },
      { tag: 'new', text: 'Projects · จัดกลุ่มงานแบ่งสี' },
      { tag: 'new', text: 'Generation History พร้อม search + filter' },
      { tag: 'new', text: 'Analytics dashboard · เห็น usage breakdown' },
      { tag: 'new', text: 'Stripe billing (Free / Studio / Agency)' },
    ],
  },
];

export default function ChangelogPage() {
  return (
    <>
      <CapNav />

      <main className="max-w-[780px] mx-auto px-6 pt-32 pb-24">
        <header className="mb-12">
          <div className="font-mono text-[10px] tracking-[0.22em] text-ink-3 uppercase mb-2">
            ✦ CHANGELOG
          </div>
          <h1 className="font-display font-bold text-[clamp(32px,4.5vw,52px)] text-ink mb-3 lang-th:font-thai">
            What&apos;s <span className="text-iridescent">new</span>
          </h1>
          <p className="text-[14px] text-ink-3 lang-th:font-thai">
            ทุก update ของ Capduction รวมที่นี่ · เรียงจากใหม่ → เก่า
          </p>
        </header>

        <div className="flex flex-col gap-10">
          {ENTRIES.map((entry) => (
            <section key={entry.date} className="relative pl-7 border-l-2 border-[var(--line)]">
              <div className="absolute -left-[7px] top-1.5 w-3 h-3 rounded-full btn-grad shadow-[0_0_0_4px_var(--bg)]" />
              <div className="flex items-baseline gap-3 mb-4 flex-wrap">
                <h2 className="font-display font-bold text-[22px] text-ink">{entry.version}</h2>
                <span className="font-mono text-[11px] text-ink-3 tracking-wider">{entry.date}</span>
              </div>

              <ul className="flex flex-col gap-2.5">
                {entry.items.map((item, i) => {
                  const meta = TAG_META[item.tag];
                  return (
                    <li key={i} className="flex items-start gap-3 glass rounded-[12px] p-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-wider border flex-shrink-0 ${meta.cls}`}>
                        <meta.icon size={9} />
                        {meta.label}
                      </span>
                      <span className="text-[13px] text-ink leading-relaxed lang-th:font-thai">{item.text}</span>
                    </li>
                  );
                })}
              </ul>
            </section>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-[13px] text-ink-3 mb-4 lang-th:font-thai">
            อยากเห็น feature อะไรต่อ? บอกเรา
          </p>
          <Link
            href="/contact"
            data-cursor="go"
            className="hover-target inline-flex items-center gap-2 px-5 py-2.5 rounded-[10px] bg-white/65 border border-white/80 text-ink font-semibold text-[13px] no-underline hover:bg-white/85"
          >
            ส่ง feedback →
          </Link>
        </div>
      </main>

      <CapFooter />
    </>
  );
}
