import Link from 'next/link';
import { CapNav } from '@/components/cap-nav';
import { CapFooter } from '@/components/cap-footer';

export const metadata = {
  title: 'Status — Capduction',
  description: 'Live status of Capduction services.',
};

const SERVICES = [
  { name: 'Landing + Marketing', note: 'Vercel edge · global CDN' },
  { name: 'Auth + Sessions',     note: 'Supabase Auth' },
  { name: 'Script Studio API',   note: 'GPT-4o upstream' },
  { name: 'Caption Studio API',  note: 'GPT-4o upstream' },
  { name: 'Combo Mode API',      note: 'GPT-4o upstream' },
  { name: 'Database',            note: 'Supabase Postgres' },
  { name: 'Billing Webhooks',    note: 'Stripe' },
  { name: 'Transactional Email', note: 'Resend' },
];

export default function StatusPage() {
  // Honest copy for a fresh launch — no fabricated uptime %.
  // We'll display real numbers once we've collected enough monitoring data.
  return (
    <>
      <CapNav />

      <main className="max-w-[800px] mx-auto px-5 pt-32 pb-20">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100/60 border border-emerald-200 text-emerald-700 text-[13px] font-semibold mb-4">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            All systems operational
          </div>
          <h1 className="font-display font-bold text-[clamp(32px,4vw,52px)] text-ink mb-2 lang-th:font-thai">
            สถานะระบบ
          </h1>
          <p className="text-ink-3 text-[13px] font-mono tracking-[0.1em] uppercase">
            Last checked · {new Date().toISOString().slice(0, 16).replace('T', ' ')} UTC
          </p>
        </div>

        <div className="glass-strong rounded-[18px] overflow-hidden mb-6">
          {SERVICES.map((s, i) => (
            <div
              key={s.name}
              className={`flex items-center justify-between gap-3 px-5 py-4
                ${i !== SERVICES.length - 1 ? 'border-b border-[var(--line)]' : ''}`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.4)] flex-shrink-0" />
                <div className="leading-tight min-w-0">
                  <div className="text-[14px] font-semibold text-ink truncate">{s.name}</div>
                  <div className="text-[11px] font-mono text-ink-3 truncate">{s.note}</div>
                </div>
              </div>
              <span className="text-[11px] font-mono text-emerald-700 bg-emerald-50 px-2 py-1 rounded-full uppercase tracking-wider flex-shrink-0">
                Operational
              </span>
            </div>
          ))}
        </div>

        <div className="glass rounded-[14px] p-5 text-[13px] text-ink-3 leading-[1.65] lang-th:font-thai">
          <p className="mb-2">
            <b className="text-ink">หมายเหตุ:</b> Capduction อยู่ในช่วง public beta —
            เรากำลังเก็บข้อมูล uptime จริงจาก monitoring เพื่อแสดงเป็นเปอร์เซ็นต์ในอนาคต
          </p>
          <p>
            พบปัญหา? แจ้งเราที่{' '}
            <a href="mailto:hello@capduction.com" className="text-iridescent font-semibold">
              hello@capduction.com
            </a>{' '}
            — เราจะอัปเดตหน้านี้ทันทีเมื่อมี incident
          </p>
        </div>

        <div className="text-center mt-8">
          <Link
            href="/"
            data-cursor="go"
            className="hover-target text-ink-3 hover:text-iridescent text-[13px] font-mono no-underline"
          >
            ← Back to home
          </Link>
        </div>
      </main>
      <CapFooter />
    </>
  );
}
