import Link from 'next/link';
import { CapNav } from '@/components/cap-nav';
import { CapFooter } from '@/components/cap-footer';

export const metadata = { title: 'Status — Capduction' };

const SERVICES = [
  { name: 'Landing + Marketing', status: 'operational', uptime: '99.98%' },
  { name: 'Auth + Sessions',     status: 'operational', uptime: '99.97%' },
  { name: 'Script Studio API',   status: 'operational', uptime: '99.95%' },
  { name: 'Caption Studio API',  status: 'operational', uptime: '99.96%' },
  { name: 'Combo Mode API',      status: 'operational', uptime: '99.94%' },
  { name: 'OpenAI Upstream',     status: 'operational', uptime: '99.92%' },
  { name: 'Database (Supabase)', status: 'operational', uptime: '99.99%' },
  { name: 'Stripe Webhooks',     status: 'operational', uptime: '99.97%' },
];

export default function StatusPage() {
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
          <p className="text-ink-3 text-[14px] font-mono">
            UPDATED · {new Date().toISOString().slice(0, 16).replace('T', ' ')} UTC
          </p>
        </div>

        <div className="glass-strong rounded-[18px] overflow-hidden">
          {SERVICES.map((s, i) => (
            <div
              key={s.name}
              className={`flex items-center justify-between px-5 py-4
                ${i !== SERVICES.length - 1 ? 'border-b border-[var(--line)]' : ''}`}
            >
              <div className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
                <span className="text-[14px] font-semibold text-ink">{s.name}</span>
              </div>
              <div className="text-[12px] font-mono text-ink-3">
                <span className="text-emerald-600">● </span>
                {s.uptime} · 30d
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link href="/" data-cursor="go" className="hover-target text-ink-3 hover:text-iridescent text-[13px] font-mono no-underline">
            ← Back to home
          </Link>
        </div>
      </main>
      <CapFooter />
    </>
  );
}
