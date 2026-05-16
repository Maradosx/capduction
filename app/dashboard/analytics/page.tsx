import { BarChart3, Sparkles, TrendingUp, Trophy } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { getProfile } from '@/lib/db/profiles';
import {
  getGenerationCount,
  getGenerationsThisWeek,
  getTopPlatformAndTone,
} from '@/lib/db/generations';

export default async function AnalyticsPage() {
  const isDemoMode = !process.env.NEXT_PUBLIC_SUPABASE_URL;

  let total = 0, week = 0, scripts = 0, captions = 0, combos = 0, credits = 10;
  let plan = 'free' as 'free' | 'studio' | 'agency';
  let topPlatform: string | null = null, topTone: string | null = null;

  if (!isDemoMode) {
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const [t, w, s, c, co, prof, top] = await Promise.all([
          getGenerationCount(),
          getGenerationsThisWeek(),
          getGenerationCount('script'),
          getGenerationCount('caption'),
          getGenerationCount('combo'),
          getProfile(),
          getTopPlatformAndTone(),
        ]);
        total    = t; week = w; scripts = s; captions = c; combos = co;
        credits  = prof?.credits_remaining ?? 10;
        plan     = (prof?.plan ?? 'free') as typeof plan;
        topPlatform = top.platform;
        topTone     = top.tone;
      }
    } catch { /* swallow */ }
  }

  return (
    <div className="max-w-[1200px] mx-auto flex flex-col gap-6">
      <div>
        <h1 className="font-display font-bold text-[clamp(28px,3.5vw,42px)] tracking-[-0.025em] text-ink lang-th:font-thai">
          <span className="text-iridescent">Analytics</span>
        </h1>
        <p className="text-ink-3 text-[15px] mt-1 lang-th:font-thai">
          {isDemoMode
            ? 'Demo mode · ตัวเลขเป็นศูนย์ (ไม่ได้ตั้ง Supabase)'
            : 'ภาพรวมการใช้งานของคุณ'}
        </p>
      </div>

      {/* Big stat row */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="ทั้งหมด"        value={total.toLocaleString()}    accent="from-pink to-violet"  icon={<BarChart3 size={14} />} />
        <StatCard label="สัปดาห์นี้"     value={week.toLocaleString()}     accent="from-violet to-teal"  icon={<TrendingUp size={14} />} />
        <StatCard label="Credits คงเหลือ" value={String(credits)}            accent="from-peach to-pink"   icon={<Sparkles size={14} />} />
        <StatCard label="แผน"            value={plan === 'free' ? 'Free' : plan === 'studio' ? 'Studio' : 'Agency'} accent="from-mint to-teal" icon={<Trophy size={14} />} />
      </section>

      {/* Per-studio breakdown */}
      <section>
        <h2 className="font-mono text-[10px] tracking-[0.22em] uppercase text-ink-3 font-semibold mb-3">
          — แบ่งตามสตูดิโอ
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StudioStat label="Script"  count={scripts}  total={total} grad="from-pink to-rose" />
          <StudioStat label="Caption" count={captions} total={total} grad="from-violet to-pink" />
          <StudioStat label="Combo"   count={combos}   total={total} grad="from-teal to-violet" />
        </div>
      </section>

      {/* Favorites */}
      <section>
        <h2 className="font-mono text-[10px] tracking-[0.22em] uppercase text-ink-3 font-semibold mb-3">
          — ที่ใช้บ่อยที่สุด
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FavoriteCard label="แพลตฟอร์มยอดนิยม" value={topPlatform ?? '—'} />
          <FavoriteCard label="โทนยอดนิยม"       value={topTone ?? '—'} />
        </div>
      </section>
    </div>
  );
}

function StatCard({ label, value, accent, icon }: { label: string; value: string; accent: string; icon: React.ReactNode }) {
  return (
    <div className="glass rounded-[14px] p-4">
      <div className="flex items-center gap-1.5 mb-2 text-ink-3">
        {icon}
        <span className="font-mono text-[10px] tracking-wider uppercase">{label}</span>
      </div>
      <div className={`font-display font-bold text-[28px] leading-none bg-gradient-to-br ${accent} bg-clip-text text-transparent`}>
        {value}
      </div>
    </div>
  );
}

function StudioStat({ label, count, total, grad }: { label: string; count: number; total: number; grad: string }) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div className="glass rounded-[16px] p-5">
      <div className="flex items-baseline justify-between mb-2">
        <span className="font-display font-bold text-[18px] text-ink lang-th:font-thai">{label}</span>
        <span className={`font-display font-bold text-[24px] bg-gradient-to-br ${grad} bg-clip-text text-transparent`}>
          {count}
        </span>
      </div>
      <div className="w-full h-2 bg-white/55 rounded-full overflow-hidden">
        <div className={`h-full bg-gradient-to-r ${grad} transition-all`} style={{ width: `${pct}%` }} />
      </div>
      <div className="mt-1.5 text-[10px] font-mono text-ink-3 tracking-wider">{pct}% OF TOTAL</div>
    </div>
  );
}

function FavoriteCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="glass rounded-[14px] p-5">
      <div className="font-mono text-[10px] tracking-[0.18em] uppercase text-ink-3 font-semibold mb-2 lang-th:font-thai lang-th:normal-case">
        {label}
      </div>
      <div className="font-display font-bold text-[22px] text-iridescent">{value}</div>
    </div>
  );
}
