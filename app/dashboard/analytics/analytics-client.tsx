'use client';

import { BarChart3, Sparkles, TrendingUp, Trophy } from 'lucide-react';
import { useT } from '@/lib/i18n';

interface Props {
  isDemoMode: boolean;
  total: number;
  week: number;
  credits: number;
  plan: 'free' | 'studio' | 'agency';
  scripts: number;
  captions: number;
  combos: number;
  topPlatform: string | null;
  topTone: string | null;
}

export function AnalyticsClient(p: Props) {
  const t = useT();

  return (
    <div className="max-w-[1200px] mx-auto flex flex-col gap-6">
      <div>
        <h1 className="font-display font-bold text-[clamp(28px,3.5vw,42px)] tracking-[-0.025em] text-ink lang-th:font-thai">
          <span className="text-iridescent">{t('an.title')}</span>
        </h1>
        <p className="text-ink-3 text-[15px] mt-1 lang-th:font-thai">
          {p.isDemoMode ? t('an.demo') : t('an.sub')}
        </p>
      </div>

      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label={t('an.stat.total')}   value={p.total.toLocaleString()} accent="from-pink to-violet"  icon={<BarChart3 size={14} />} />
        <StatCard label={t('an.stat.week')}    value={p.week.toLocaleString()}  accent="from-violet to-teal"  icon={<TrendingUp size={14} />} />
        <StatCard label={t('an.stat.credits')} value={String(p.credits)}        accent="from-peach to-pink"   icon={<Sparkles size={14} />} />
        <StatCard
          label={t('an.stat.plan')}
          value={p.plan === 'free' ? 'Free' : p.plan === 'studio' ? 'Studio' : 'Agency'}
          accent="from-mint to-teal"
          icon={<Trophy size={14} />}
        />
      </section>

      <section>
        <h2 className="font-mono text-[10px] tracking-[0.22em] uppercase text-ink-3 font-semibold mb-3 lang-th:font-thai lang-th:normal-case lang-th:tracking-normal">
          {t('an.by_studio')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StudioStat label="Script"  count={p.scripts}  total={p.total} grad="from-pink to-rose" />
          <StudioStat label="Caption" count={p.captions} total={p.total} grad="from-violet to-pink" />
          <StudioStat label="Combo"   count={p.combos}   total={p.total} grad="from-teal to-violet" />
        </div>
      </section>

      <section>
        <h2 className="font-mono text-[10px] tracking-[0.22em] uppercase text-ink-3 font-semibold mb-3 lang-th:font-thai lang-th:normal-case lang-th:tracking-normal">
          {t('an.faves')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FavoriteCard label={t('an.fave.platform')} value={p.topPlatform ?? '—'} />
          <FavoriteCard label={t('an.fave.tone')}     value={p.topTone ?? '—'} />
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
        <span className="font-mono text-[10px] tracking-wider uppercase lang-th:font-thai lang-th:normal-case lang-th:tracking-normal">{label}</span>
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
      <div className="font-mono text-[10px] tracking-[0.18em] uppercase text-ink-3 font-semibold mb-2 lang-th:font-thai lang-th:normal-case lang-th:tracking-normal">
        {label}
      </div>
      <div className="font-display font-bold text-[22px] text-iridescent">{value}</div>
    </div>
  );
}
