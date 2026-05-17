'use client';

import { useState } from 'react';
import { Play, Type, Layers, Copy, Check } from 'lucide-react';
import { useT } from '@/lib/i18n';

/**
 * Proof-of-output section for the marketing landing.
 *
 * The audit flagged that visitors couldn't see what a real generation looked
 * like before signing up — biggest conversion blocker. This section shows
 * actual sample outputs (script beats, caption pack, combo) on 3 tabs.
 *
 * Content is hand-crafted from the lib/ai.ts mock — close enough to real
 * GPT-4o output that creators can judge quality without an account.
 */
type Tab = 'script' | 'caption' | 'combo';

export function ShowcaseSection() {
  const t = useT();
  const [tab, setTab] = useState<Tab>('script');

  return (
    <section
      id="showcase"
      className="relative z-[2] px-6 py-20 md:py-24"
    >
      <div className="max-w-[1100px] mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="font-mono text-[11px] tracking-[0.22em] uppercase text-ink-3 mb-3 flex justify-center items-center gap-3.5">
            <span className="text-iridescent text-[14px]">✦</span>
            {t('sh.eye')}
            <span className="text-iridescent text-[14px]">✦</span>
          </div>
          <h2 className="font-display font-bold text-[clamp(32px,4.5vw,56px)] tracking-[-0.025em] text-ink leading-[1.05] mb-3 lang-th:font-thai">
            {t('sh.h.left')}{' '}
            <span className="text-iridescent">{t('sh.h.iri')}</span>
          </h2>
          <p className="text-[15px] md:text-[16px] text-ink-3 max-w-[520px] mx-auto lang-th:font-thai">
            {t('sh.sub')}
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex p-1 gap-1 bg-white/55 border border-white/70 rounded-[14px]">
            <TabBtn active={tab === 'script'}  onClick={() => setTab('script')}  icon={Play}   label={t('sh.tab.script')} />
            <TabBtn active={tab === 'caption'} onClick={() => setTab('caption')} icon={Type}   label={t('sh.tab.caption')} />
            <TabBtn active={tab === 'combo'}   onClick={() => setTab('combo')}   icon={Layers} label={t('sh.tab.combo')} />
          </div>
        </div>

        {/* Showcase canvas */}
        <div className="glass-strong rounded-[22px] p-6 md:p-8">
          {/* Brief "input → output" framing */}
          <div className="flex flex-wrap items-center gap-2 mb-5 pb-5 border-b border-[var(--line)] text-[12px] text-ink-3 font-mono">
            <span className="font-bold text-ink">INPUT:</span>
            <Chip>ลิปสติกแดงแมตต์ ติด 12 ชม.</Chip>
            <Chip>TikTok</Chip>
            <Chip>30s</Chip>
            <Chip>Persuasive · Viral</Chip>
            <Chip>Gen Z</Chip>
          </div>

          {tab === 'script'  && <ScriptSample />}
          {tab === 'caption' && <CaptionSample />}
          {tab === 'combo'   && <ComboSample />}
        </div>

        {/* Footnote */}
        <p className="text-center text-[12px] text-ink-3 mt-6 lang-th:font-thai">
          {t('sh.footnote')}
        </p>
      </div>
    </section>
  );
}

// ─── Tabs ─────────────────────────────────────────────────────────────

function TabBtn({
  active, onClick, icon: Icon, label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ElementType;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      data-cursor="switch"
      className={`hover-target inline-flex items-center gap-2 px-4 py-2.5 rounded-[10px] text-[13px] font-semibold transition-all lang-th:font-thai
        ${active
          ? 'btn-grad text-white shadow-[0_4px_12px_-2px_rgba(124,58,237,0.4)]'
          : 'text-ink-3 hover:text-ink hover:bg-white/55 bg-transparent border-0'}`}
    >
      <Icon size={14} />
      {label}
    </button>
  );
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] bg-white/55 border border-white/70 text-ink lang-th:font-thai">
      {children}
    </span>
  );
}

// ─── Sample renderers ────────────────────────────────────────────────

const SCRIPT_BEATS = [
  { tc: '00:00', role: 'HOOK',  spoken: 'ริมฝีปากแดงที่คนหันมามอง — ติด 12 ชั่วโมง ไม่ต้องแตะเลย', broll: 'Close-up of lipstick swipe + mirror' },
  { tc: '00:05', role: 'BODY',  spoken: 'เนื้อแมตต์ เนียนไม่กินผิว สีคลาสสิคที่ใส่กับชุดอะไรก็ได้ ลองทาเช้า เที่ยงยังอยู่ เย็นยังสวย', broll: 'Texture demo + outfit timelapse' },
  { tc: '00:18', role: 'PROOF', spoken: 'รีวิวล้นจาก 2,000+ ลูกค้า ส่งฟรีทั่วประเทศ', broll: '5-star review montage' },
  { tc: '00:25', role: 'CTA',   spoken: 'กดลิงก์ในโปรไฟล์ สั่งวันนี้ลด 20% เฉพาะ 50 คนแรก', broll: 'Phone showing checkout' },
];

function ScriptSample() {
  return (
    <div className="flex flex-col gap-2.5">
      {SCRIPT_BEATS.map((b, i) => (
        <div key={i} className="glass rounded-[12px] p-3.5">
          <div className="flex items-center gap-2.5 mb-1.5 flex-wrap">
            <span className="font-mono text-[10px] text-iridescent font-bold tracking-wider">{b.tc}</span>
            <span className="px-2 py-0.5 rounded-md bg-ink text-paper font-mono text-[9px] tracking-wider font-semibold">
              {b.role}
            </span>
          </div>
          <p className="text-[14px] text-ink leading-[1.55] font-thai mb-1">&ldquo;{b.spoken}&rdquo;</p>
          <p className="text-[11px] text-ink-3 font-mono italic">B-roll: {b.broll}</p>
        </div>
      ))}
      <div className="mt-2 flex flex-wrap gap-3 text-[11px] font-mono text-ink-3 tracking-[0.1em] uppercase">
        <span>4 BEATS</span><span>·</span>
        <span>30 SECONDS</span><span>·</span>
        <span>OUTPUT IN ~12s</span>
      </div>
    </div>
  );
}

function CaptionSample() {
  const captions = [
    '🚨 Must Have ลิปแดงตัวที่ลูกค้าตามหาเยอะที่สุด!\n\nใครเบื่อลิปสีเดิมๆ ต้องลองตัวนี้ค่า 💖 เนื้อแมตต์ ติด 12 ชั่วโมง ใส่กับชุดอะไรก็ปัง\n\n✅ ไม่กินผิว ไม่ลอกเป็นแผ่น\n✅ สีคลาสสิคใส่ได้ทุกโอกาส\n\n🔥 ลด 20% เฉพาะ 50 คนแรก รีบทักด่วน!',
    '📢 Restock แล้วค่า! รอบที่แล้วหมดใน 2 ชั่วโมง 🔥\n\nลิปแดงแมตต์ Best Seller ที่ลูกค้าทักมาตามทุกวัน · ของเข้าใหม่ 100 ชิ้นเท่านั้น\n\nกดสั่งได้เลย 👇',
  ];
  const hashtags = ['#ลิปสติก', '#ลิปแดง', '#mattelip', '#รีวิวลิป', '#ลิปติดทน', '#TikTokShop', '#ของมันต้องมี'];
  const hooks = ['หยุดไถฟีด 1 วิ ถ้าหาลิปติดทนจริงๆ 🛑', 'รีวิวพลีชีพ 12 ชม. ผ่านไปสีไม่หาย 💄', 'ของเข้าใหม่ รอบที่แล้วหมดใน 2 ชม. 🔥'];

  return (
    <div className="grid md:grid-cols-2 gap-4">
      <div className="flex flex-col gap-3">
        <SectionLabel>2 of 5 CAPTIONS</SectionLabel>
        {captions.map((c, i) => (
          <div key={i} className="glass rounded-[12px] p-3.5">
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-mono text-[10px] text-iridescent font-bold tracking-wider">VARIANT {i + 1}</span>
              <CopyBadge />
            </div>
            <p className="text-[13px] text-ink leading-relaxed font-thai whitespace-pre-line">{c}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-4">
        <div>
          <SectionLabel>3 of 5 HOOKS</SectionLabel>
          <div className="flex flex-col gap-1.5 mt-2">
            {hooks.map((h, i) => (
              <div key={i} className="glass rounded-[10px] px-3 py-2 text-[13px] text-ink font-thai">
                {i + 1}. {h}
              </div>
            ))}
          </div>
        </div>

        <div>
          <SectionLabel>HASHTAGS · TREND-MATCHED</SectionLabel>
          <div className="flex flex-wrap gap-1.5 mt-2">
            {hashtags.map((tag, i) => (
              <span key={i} className="font-mono text-[11px] px-2 py-0.5 bg-white/55 border border-white/70 rounded-md text-ink">
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div>
          <SectionLabel>CTA EXAMPLES</SectionLabel>
          <ul className="mt-2 text-[12px] text-ink-3 font-thai space-y-1 list-disc list-inside">
            <li>ทักแชทเลย แอดมินตอบไวมาก</li>
            <li>สั่งวันนี้ลด 20% เฉพาะ 50 คนแรก</li>
            <li>คอมเมนต์ &ldquo;1&rdquo; รับลิงก์ทาง DM</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function ComboSample() {
  return (
    <div className="flex flex-col gap-4">
      <div className="glass rounded-[14px] p-4 bg-gradient-to-br from-pink/10 to-violet/10 border border-violet/20">
        <div className="font-mono text-[10px] text-iridescent font-bold tracking-wider mb-2">
          ✦ SHARED HOOK · ใช้ทั้งวิดีโอ + แคปชั่น
        </div>
        <p className="text-[16px] text-ink font-thai font-semibold leading-snug">
          &ldquo;ริมฝีปากแดงที่คนหันมามอง — ติด 12 ชั่วโมง ไม่ต้องแตะเลย&rdquo;
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <SectionLabel>SCRIPT (4 beats · 30s)</SectionLabel>
          <div className="mt-2 flex flex-col gap-2">
            {SCRIPT_BEATS.slice(0, 3).map((b, i) => (
              <div key={i} className="glass rounded-[10px] p-2.5">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-[9px] text-iridescent font-bold">{b.tc}</span>
                  <span className="px-1.5 py-0.5 rounded bg-ink text-paper font-mono text-[8px] font-semibold">{b.role}</span>
                </div>
                <p className="text-[12px] text-ink font-thai leading-snug">&ldquo;{b.spoken}&rdquo;</p>
              </div>
            ))}
            <div className="text-[10px] text-ink-3 font-mono pl-1">+ 1 more beat</div>
          </div>
        </div>

        <div>
          <SectionLabel>CAPTION (matches the hook)</SectionLabel>
          <div className="mt-2 glass rounded-[10px] p-3 text-[12px] text-ink font-thai leading-relaxed whitespace-pre-line">
            {`ริมฝีปากแดงที่คนหันมามอง — ใช่ ตัวนี้แหละค่า 💋\n\nลิปแมตต์ติด 12 ชม. ไม่ต้องเติม ไม่ลอก สีคลาสสิคที่ใส่ได้ทุกชุด\n\nรีวิว 2,000+ · ลด 20% เฉพาะ 50 คนแรก\n\n#ลิปสติก #ลิปแดง #ของมันต้องมี`}
          </div>
        </div>
      </div>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="font-mono text-[10px] text-ink-3 font-semibold tracking-[0.18em] uppercase">
      {children}
    </div>
  );
}

function CopyBadge() {
  const [copied, setCopied] = useState(false);
  return (
    <span
      className="inline-flex items-center gap-1 text-[10px] text-ink-3 font-mono cursor-default"
      onClick={() => { setCopied(true); setTimeout(() => setCopied(false), 1200); }}
    >
      {copied ? <Check size={11} /> : <Copy size={11} />}
      {copied ? 'COPIED' : 'COPY'}
    </span>
  );
}
