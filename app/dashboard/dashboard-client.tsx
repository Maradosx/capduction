'use client';

import Link from 'next/link';
import { ArrowRight, Wand2, FileText, Type, Clock, Sparkles, AlertCircle, Zap } from 'lucide-react';
import { useT } from '@/lib/i18n';
import type { Generation } from '@/types';

const STUDIO_META: Record<string, { label: string; icon: typeof Wand2; href: string }> = {
  script:  { label: 'Script',  icon: FileText, href: '/dashboard/workspace/script' },
  caption: { label: 'Caption', icon: Type,     href: '/dashboard/workspace/caption' },
  combo:   { label: 'Combo',   icon: Wand2,    href: '/dashboard/workspace/combo' },
};

interface Props {
  displayName: string;
  credits:     number;
  plan:        string;
  total:       number;
  recent:      Generation[];
  isDemoMode:  boolean;
}

export function DashboardClient({ displayName, credits, plan, total, recent, isDemoMode }: Props) {
  const t = useT();
  const lowOnCredits = credits > 0 && credits <= 3;
  const outOfCredits = credits === 0;

  return (
    <div className="max-w-[1200px] mx-auto flex flex-col gap-8">
      {/* ─── Welcome ─────────────────────────────────────── */}
      <div className="flex flex-col gap-2">
        <h1 className="font-display font-bold text-[clamp(28px,3.5vw,42px)] tracking-[-0.025em] text-ink lang-th:font-thai">
          {t('dh.welcome')}, <span className="text-iridescent">{displayName}</span>
        </h1>
        <p className="text-ink-3 text-[15px] lang-th:font-thai">{t('dh.subtitle')}</p>
      </div>

      {/* ─── Banners ─────────────────────────────────────── */}
      {isDemoMode && (
        <Banner color="amber" icon={Sparkles}>
          <strong>Demo mode</strong> · {t('dh.demo').replace(/^Demo mode · /, '')}
        </Banner>
      )}
      {outOfCredits && !isDemoMode && (
        <Banner color="rose" icon={AlertCircle} action={{ href: '/pricing', label: '↑ Upgrade' }}>
          {t('dh.credits.out')}
        </Banner>
      )}
      {lowOnCredits && !outOfCredits && plan === 'free' && (
        <Banner color="violet" icon={Zap}>
          {t('dh.credits.low', { n: credits })}
        </Banner>
      )}

      {/* ─── Quick start: 3 studios ─────────────────────── */}
      <section>
        <h2 className="font-mono text-[10px] tracking-[0.22em] text-ink-3 uppercase mb-4 font-semibold lang-th:font-thai lang-th:normal-case lang-th:tracking-normal">
          {t('dh.section')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StudioQuickCard
            href="/dashboard/workspace/script"
            label="Script Studio"
            description={t('dh.script.desc')}
            openLabel={t('dh.open')}
            icon={<FileText size={20} />}
            orbGrad="radial-gradient(circle at 35% 28%, white, var(--peach) 25%, var(--rose) 60%, var(--pink))"
          />
          <StudioQuickCard
            href="/dashboard/workspace/caption"
            label="Caption Studio"
            description={t('dh.caption.desc')}
            openLabel={t('dh.open')}
            icon={<Type size={20} />}
            orbGrad="radial-gradient(circle at 35% 28%, white, var(--lav) 25%, var(--violet) 60%, var(--ink-3))"
          />
          <StudioQuickCard
            href="/dashboard/workspace/combo"
            label="Combo Mode"
            description={t('dh.combo.desc')}
            openLabel={t('dh.open')}
            icon={<Wand2 size={20} />}
            orbGrad="radial-gradient(circle at 35% 28%, white, var(--mint) 25%, var(--teal) 60%, #2A7B82)"
            badge="NEW"
          />
        </div>
      </section>

      {/* ─── Stats row ─────────────────────────────────── */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label={t('dh.stat.total')}   value={total.toLocaleString()} accent="from-pink to-violet" />
        <StatCard label={t('dh.stat.credits')} value={String(credits)}        accent="from-violet to-teal" />
        <StatCard
          label={t('dh.stat.plan')}
          value={plan === 'free' ? 'Free' : plan === 'studio' ? 'Studio' : 'Agency'}
          accent="from-peach to-pink"
        />
        <StatCard
          label={t('dh.stat.week')}
          value={recent.filter(r => Date.now() - new Date(r.created_at).getTime() < 7*86400000).length.toString()}
          accent="from-mint to-teal"
        />
      </section>

      {/* ─── Recent activity ─────────────────────────── */}
      <section>
        <div className="flex justify-between items-baseline mb-4">
          <h2 className="font-mono text-[10px] tracking-[0.22em] text-ink-3 uppercase font-semibold lang-th:font-thai lang-th:normal-case lang-th:tracking-normal">
            {t('dh.recent')}
          </h2>
          <Link href="/dashboard/history" data-cursor="go" className="hover-target text-[12px] text-ink-3 hover:text-iridescent transition-colors lang-th:font-thai">
            {t('dh.view_all')}
          </Link>
        </div>

        {recent.length === 0 ? (
          <div className="glass rounded-[18px] p-10 text-center">
            <Clock size={28} className="mx-auto mb-3 text-ink-3 opacity-50" />
            <p className="text-ink-3 text-[14px] lang-th:font-thai">{t('dh.empty')}</p>
            <Link
              href="/dashboard/workspace/script"
              data-cursor="start"
              className="hover-target inline-flex items-center gap-2 mt-4 btn-grad px-5 py-2.5 rounded-full text-white font-semibold text-[13px] no-underline lang-th:font-thai"
            >
              {t('dh.start')} <ArrowRight size={14} />
            </Link>
          </div>
        ) : (
          <div className="glass rounded-[18px] overflow-hidden">
            {recent.map((g, idx) => {
              const meta = STUDIO_META[g.studio];
              const Icon = meta?.icon ?? FileText;
              return (
                <Link
                  key={g.id}
                  href={`/dashboard/history#${g.id}`}
                  data-cursor="open"
                  className={`hover-target flex items-center gap-4 px-5 py-4 hover:bg-white/55 transition-all no-underline lang-th:font-thai
                    ${idx !== recent.length - 1 ? 'border-b border-[var(--line)]' : ''}`}
                >
                  <div className="w-10 h-10 rounded-full orb-chrome flex items-center justify-center flex-shrink-0">
                    <Icon size={16} className="text-white drop-shadow-sm" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[14px] font-semibold text-ink truncate">{g.product_name}</div>
                    <div className="text-[11px] text-ink-3 flex items-center gap-2 mt-0.5 font-mono">
                      <span>{meta?.label ?? g.studio}</span>
                      <span className="w-0.5 h-0.5 rounded-full bg-ink-3" />
                      <span>{g.platform}</span>
                      <span className="w-0.5 h-0.5 rounded-full bg-ink-3" />
                      <span>{g.tone}</span>
                    </div>
                  </div>
                  <span className="text-[11px] text-ink-3 font-mono flex-shrink-0">
                    {timeAgo(g.created_at, t)}
                  </span>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

function timeAgo(dateStr: string, _t: (k: any) => string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins  = Math.floor(diff / 60_000);
  const hours = Math.floor(diff / 3_600_000);
  const days  = Math.floor(diff / 86_400_000);
  if (mins < 60)  return `${mins}m`;
  if (hours < 24) return `${hours}h`;
  return `${days}d`;
}

function StudioQuickCard({
  href, label, description, icon, orbGrad, badge, openLabel,
}: {
  href: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  orbGrad: string;
  badge?: string;
  openLabel: string;
}) {
  return (
    <Link
      href={href}
      data-cursor="open"
      className="hover-target relative glass rounded-[18px] p-6 no-underline group transition-all hover:-translate-y-1 hover:shadow-glass-lg"
    >
      {badge && (
        <span className="absolute top-3 right-3 btn-grad text-white px-2 py-0.5 rounded-full text-[9px] font-mono tracking-wider font-semibold">
          {badge}
        </span>
      )}
      <div
        className="w-12 h-12 rounded-full mb-4 flex items-center justify-center"
        style={{
          background: orbGrad,
          boxShadow: '0 0 0 1px rgba(255,255,255,0.6), 0 8px 20px rgba(94,79,138,0.2)',
        }}
      >
        <span className="text-white drop-shadow-sm">{icon}</span>
      </div>
      <div className="font-display font-bold text-ink text-[17px] mb-1 lang-th:font-thai">{label}</div>
      <p className="text-[13px] text-ink-3 leading-relaxed lang-th:font-thai">{description}</p>
      <div className="mt-3 flex items-center gap-1 text-[12px] font-mono text-ink-3 group-hover:text-iridescent transition-colors lang-th:font-thai">
        {openLabel} <ArrowRight size={12} />
      </div>
    </Link>
  );
}

function StatCard({
  label, value, accent,
}: {
  label: string;
  value: string;
  accent: string;
}) {
  return (
    <div className="glass rounded-[14px] p-4">
      <div className={`font-display font-bold text-[28px] leading-none bg-gradient-to-br ${accent} bg-clip-text text-transparent`}>
        {value}
      </div>
      <div className="mt-1 text-[11px] text-ink-3 font-mono uppercase tracking-wider lang-th:font-thai lang-th:normal-case lang-th:tracking-normal">
        {label}
      </div>
    </div>
  );
}

function Banner({
  color, icon: Icon, action, children,
}: {
  color: 'amber' | 'rose' | 'violet';
  icon: typeof Wand2;
  action?: { href: string; label: string };
  children: React.ReactNode;
}) {
  const styles = {
    amber:  'bg-amber-50/80 border-amber-200 text-amber-900',
    rose:   'bg-rose-50/80 border-rose-200 text-rose-900',
    violet: 'bg-violet-50/80 border-violet-200 text-violet-900',
  }[color];
  return (
    <div className={`flex items-center gap-3 rounded-[14px] border px-4 py-3 ${styles}`}>
      <Icon size={18} className="flex-shrink-0" />
      <div className="flex-1 text-[13px] lang-th:font-thai">{children}</div>
      {action && (
        <Link
          href={action.href}
          data-cursor="start"
          className="hover-target text-[12px] font-semibold underline whitespace-nowrap"
        >
          {action.label}
        </Link>
      )}
    </div>
  );
}
