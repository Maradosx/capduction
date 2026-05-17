'use client';

import Link from 'next/link';
import { useT } from '@/lib/i18n';
import { BrandMark } from '@/components/brand-mark';

/**
 * Rotated frosted-glass workspace mockup — non-interactive preview
 * Matches Mix 1 mockup design exactly
 */
export function DashboardPreview() {
  const t = useT();

  return (
    <section
      id="dashboard-preview"
      className="relative z-[2] px-8 pt-10 pb-[100px]"
      style={{ perspective: '2200px' }}
    >
      <div className="text-center mb-7 font-mono text-[11px] tracking-[0.22em] uppercase text-ink-3 flex justify-center items-center gap-3.5">
        <span className="text-iridescent text-[14px]">✦</span>
        {t('dash.preview.eye')}
        <span className="text-iridescent text-[14px]">✦</span>
      </div>

      <div
        className="max-w-[1500px] mx-auto hidden md:block"
        style={{ transform: 'rotateX(6deg)', transformOrigin: 'center top' }}
      >
        <div className="glass-strong rounded-[22px] overflow-hidden">
          {/* Top bar */}
          <div className="px-[22px] py-3.5 border-b border-[var(--line)] flex items-center gap-4 bg-white/35">
            <div className="flex items-center gap-2.5">
              <BrandMark className="w-[30px] h-[30px]" />
              <div className="leading-[1.1]">
                <strong className="text-sm font-bold text-ink">
                  Capduction{' '}
                  <span className="inline-block px-1.5 py-px btn-grad rounded text-[9px] font-mono tracking-wider ml-1 align-middle font-semibold">
                    Beta
                  </span>
                </strong>
                <span className="text-[10px] text-slate font-mono block">AI Script Studio</span>
              </div>
            </div>
            <div className="text-sm font-semibold text-ink pl-4 border-l border-[var(--line)] ml-1 lang-th:font-thai">
              {t('dash.title')}
            </div>
            <div className="flex-1 max-w-[360px] mx-auto flex items-center gap-2 px-3.5 py-2.5 bg-white/60 border border-white/80 rounded-[10px] font-mono text-xs text-ink-3">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <span>Search anywhere</span>
              <span className="ml-auto px-1.5 py-0.5 bg-violet/10 rounded text-[10px]">⌘K</span>
            </div>
            <div className="flex items-center gap-3.5">
              <IconBtn>
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </IconBtn>
              <IconBtn>
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              </IconBtn>
              <div className="flex items-center gap-2.5 pl-3.5 border-l border-[var(--line)]">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink to-violet shadow-[0_2px_8px_rgba(181,143,255,0.4)]" />
                <div className="leading-[1.1]">
                  <strong className="text-[13px] font-semibold text-ink">Alex Smith</strong>
                  <span className="text-[10px] text-slate font-mono block">New User</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-[220px_1fr] min-h-[440px]">
            {/* Sidebar */}
            <aside className="p-[18px] px-3 border-r border-[var(--line)] bg-white/30">
              <h6 className="font-mono text-[9px] tracking-[0.2em] text-slate uppercase mx-2 mb-3 font-semibold">
                STUDIOS
              </h6>
              <SidebarItem active label={t('dash.combo')} badge="NEW" />
              <SidebarItem label={t('dash.script')} />
              <SidebarItem label={t('dash.caption')} />
              <div className="h-px bg-[var(--line)] mx-2 my-3.5" />
              <h6 className="font-mono text-[9px] tracking-[0.2em] text-slate uppercase mx-2 mb-3 font-semibold">
                PROJECTS
              </h6>
              <SidebarItem label="ลิปสติกแดงแมตต์" />
              <SidebarItem label="แคมเปญฤดูร้อน" />
              <div className="h-px bg-[var(--line)] mx-2 my-3.5" />
              <h6 className="font-mono text-[9px] tracking-[0.2em] text-slate uppercase mx-2 mb-3 font-semibold">
                RESOURCES
              </h6>
              <SidebarItem label={t('dash.brand_voice')} />
              <SidebarItem label={t('dash.history')} />
            </aside>

            {/* Main panel */}
            <main className="p-7 px-8">
              <div className="flex justify-between items-center mb-6">
                <h4 className="text-[18px] font-bold text-ink lang-th:font-thai">
                  {t('dash.section')}
                </h4>
                <span className="btn-grad px-3 py-1.5 rounded-full font-mono text-[10px] tracking-wider font-semibold inline-flex items-center gap-1.5 text-white">
                  <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                  Demo
                </span>
              </div>
              <div className="inline-flex p-1 gap-1 bg-white/55 border border-white/70 rounded-[12px] mb-6">
                <Tab active>Script</Tab>
                <Tab>Caption</Tab>
                <Tab>Combo</Tab>
                <Tab>Other</Tab>
              </div>

              <h5 className="text-[15px] font-bold text-ink mb-1.5 lang-th:font-thai">
                {t('dash.h5')}
              </h5>
              <p className="text-[13px] text-ink-3 mb-[18px] lang-th:font-thai">{t('dash.p')}</p>

              <div className="glass rounded-[16px] p-5 flex items-center gap-4 mb-4 transition-all hover:-translate-y-0.5 hover:shadow-glass-lg">
                <div
                  className="w-[46px] h-[46px] rounded-full flex-shrink-0 relative"
                  style={{
                    background:
                      'radial-gradient(circle at 35% 28%, white, var(--peach) 30%, var(--rose) 70%, var(--pink))',
                    boxShadow:
                      '0 0 0 1px rgba(255,255,255,0.6), 0 6px 18px rgba(255,143,181,0.4)',
                  }}
                >
                  <div
                    className="absolute top-1.5 left-[11px] w-3.5 h-1.5 rounded-full -rotate-[25deg]"
                    style={{ background: 'rgba(255,255,255,0.7)' }}
                  />
                </div>
                <div className="flex-1 leading-[1.2]">
                  <strong className="block text-sm font-bold text-ink mb-0.5 lang-th:font-thai">
                    {t('dash.card.title')}
                  </strong>
                  <span className="text-xs text-ink-3 lang-th:font-thai">{t('dash.card.sub')}</span>
                </div>
                {/* Honest label — this is a preview, not a live console.
                    Routes to signup but the verb sets the expectation. */}
                <Link
                  href="/signup"
                  data-cursor="go"
                  className="hover-target btn-grad px-5 py-2.5 rounded-[10px] text-white font-semibold text-[13px] border-0 inline-flex items-center gap-1.5 lang-th:font-thai no-underline opacity-90"
                >
                  {t('dash.preview.cta')}
                  <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M5 12h14m-6-6 6 6-6 6" />
                  </svg>
                </Link>
              </div>

              <div className="flex gap-3 mt-5 pt-4 border-t border-[var(--line)] font-mono text-[10px] text-ink-3 tracking-[0.12em] uppercase flex-wrap">
                <span>15S—90S SCRIPTS</span>
                <span>·</span>
                <span>7 PLATFORMS</span>
                <span>·</span>
                <span>BRAND VOICE MEMORY</span>
                <span>·</span>
                <span>EXPORT .PDF</span>
              </div>
            </main>
          </div>
        </div>
      </div>

      {/* Mobile-only simplified mockup */}
      <div className="md:hidden max-w-[420px] mx-auto px-2">
        <div className="glass-strong rounded-[20px] p-4 flex flex-col gap-3">
          <div className="flex items-center gap-2.5 pb-3 border-b border-[var(--line)]">
            <BrandMark className="w-7 h-7" />
            <div className="leading-[1.15]">
              <strong className="text-[13px] font-bold text-ink">Capduction</strong>
              <span className="text-[9px] text-slate font-mono block">AI Script Studio</span>
            </div>
            <span className="ml-auto px-2 py-0.5 btn-grad rounded-full text-[9px] font-mono tracking-wider text-white font-semibold">
              LIVE
            </span>
          </div>

          {[
            { label: 'Combo Mode', badge: 'NEW', grad: 'from-teal to-violet' },
            { label: 'Script Studio',                grad: 'from-pink to-rose' },
            { label: 'Caption Studio',               grad: 'from-violet to-pink' },
          ].map((s) => (
            <div key={s.label} className="glass rounded-[12px] p-3 flex items-center gap-3">
              <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${s.grad} shadow-[0_2px_8px_rgba(124,58,237,0.3)]`} />
              <div className="flex-1">
                <div className="text-[13px] font-bold text-ink lang-th:font-thai">{s.label}</div>
                <div className="text-[10px] text-ink-3 font-mono">Ready · ฿0 / 10 credits</div>
              </div>
              {s.badge && (
                <span className="btn-grad text-white px-2 py-px rounded-full text-[9px] font-mono tracking-wider font-semibold">
                  {s.badge}
                </span>
              )}
            </div>
          ))}

          <div className="text-center text-[10px] text-ink-3 font-mono mt-1 lang-th:font-thai">
            ✦ {t('dash.preview.eye').replace(/^—\s*/, '')} ✦
          </div>
        </div>
      </div>
    </section>
  );
}

function SidebarItem({
  label,
  active,
  badge,
}: {
  label: string;
  active?: boolean;
  badge?: string;
}) {
  return (
    <div
      data-cursor="open"
      className={`hover-target p-2.5 px-3.5 rounded-[10px] text-[13px] flex items-center gap-2.5 mb-0.5 transition-all lang-th:font-thai
        ${
          active
            ? 'bg-gradient-to-br from-pink/15 to-violet/15 text-ink font-semibold border border-violet/25'
            : 'text-ink-3 hover:bg-white/55 hover:text-ink'
        }`}
    >
      <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" className="opacity-70">
        <circle cx="12" cy="12" r="9" />
      </svg>
      <span className="flex-1">{label}</span>
      {badge && (
        <span className="btn-grad text-white px-2 py-px rounded-full text-[9px] tracking-wider font-semibold">
          {badge}
        </span>
      )}
    </div>
  );
}

function Tab({ children, active }: { children: React.ReactNode; active?: boolean }) {
  return (
    <div
      data-cursor="switch"
      className={`hover-target px-4 py-2 rounded-[8px] text-xs font-medium transition-all
        ${active ? 'bg-white text-ink font-semibold shadow-sm' : 'text-ink-3'}`}
    >
      {children}
    </div>
  );
}

function IconBtn({ children }: { children: React.ReactNode }) {
  return (
    <span className="w-8 h-8 flex items-center justify-center text-ink-3 rounded-lg bg-white/40">
      <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
        {children}
      </svg>
    </span>
  );
}
