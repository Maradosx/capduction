'use client';

import { useState } from 'react';
import { Copy, Check, RefreshCw, Download, Film, Mic, Eye, Image as ImageIcon } from 'lucide-react';
import type { ScriptContent } from '@/types';
import { useT } from '@/lib/i18n';

interface ScriptResultProps {
  data: ScriptContent | null;
  loading?: boolean;
  onRegenerate?: () => void;
}

export function ScriptResult({ data, loading, onRegenerate }: ScriptResultProps) {
  const t = useT();
  if (loading) return <ResultSkeleton label={t('rs.script.loading')} />;
  if (!data)   return <EmptyResult />;

  return (
    <div className="glass-strong rounded-[20px] p-6 md:p-7 flex flex-col gap-5">
      <ResultHeader
        title={`Script · ${data.beats.length} beats · ${data.totalSeconds}s`}
        onCopyAll={() => copyText(formatScriptForCopy(data))}
        onRegenerate={onRegenerate}
        onExport={() => downloadText(formatScriptForCopy(data), 'capduction-script.txt')}
      />

      {/* Beats list */}
      <div className="flex flex-col gap-3">
        {data.beats.map((beat, i) => (
          <BeatCard key={i} index={i + 1} {...beat} />
        ))}
      </div>

      {/* Thumbnail copy */}
      {data.thumbnailCopy && (
        <Section label="THUMBNAIL COPY">
          <div className="glass rounded-[12px] p-4 flex items-start gap-3">
            <ImageIcon size={16} className="text-iridescent flex-shrink-0 mt-0.5" />
            <p className="flex-1 text-[14px] text-ink font-thai">{data.thumbnailCopy}</p>
            <CopyBtn text={data.thumbnailCopy} />
          </div>
        </Section>
      )}

      {/* Posting checklist */}
      {data.postingChecklist?.length > 0 && (
        <Section label="POSTING CHECKLIST">
          <div className="glass rounded-[12px] p-4">
            <ul className="flex flex-col gap-2">
              {data.postingChecklist.map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-[13px] text-ink font-thai">
                  <span className="text-iridescent font-bold leading-none mt-0.5">✶</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </Section>
      )}
    </div>
  );
}

// ─── Beat card ─────────────────────────────────────────────────────
function BeatCard({
  index, timecode, role, spoken, broll, onScreenText,
}: { index: number } & ScriptContent['beats'][0]) {
  return (
    <div className="glass rounded-[14px] p-4">
      <div className="flex items-center gap-3 mb-3">
        <div className="font-mono text-[11px] text-iridescent font-bold tracking-wider">{timecode}</div>
        <div className="px-2 py-0.5 rounded-md bg-ink text-paper font-mono text-[9px] tracking-wider font-semibold">
          {role}
        </div>
        <div className="font-mono text-[10px] text-ink-3">BEAT {index}</div>
        <div className="ml-auto">
          <CopyBtn text={spoken} />
        </div>
      </div>

      <div className="flex items-start gap-2.5 mb-3">
        <Mic size={14} className="text-iridescent flex-shrink-0 mt-1" />
        <p className="flex-1 text-[15px] text-ink leading-relaxed font-thai">{spoken}</p>
      </div>

      {broll && (
        <div className="flex items-start gap-2.5 mb-2 pt-3 border-t border-[var(--line)]">
          <Film size={13} className="text-ink-3 flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-mono text-[9px] tracking-wider text-ink-3 uppercase block mb-0.5">B-Roll</span>
            <p className="text-[13px] text-ink-3">{broll}</p>
          </div>
        </div>
      )}

      {onScreenText && (
        <div className="flex items-start gap-2.5 pt-2">
          <Eye size={13} className="text-ink-3 flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-mono text-[9px] tracking-wider text-ink-3 uppercase block mb-0.5">On-Screen Text</span>
            <p className="text-[13px] text-ink font-thai font-semibold">{onScreenText}</p>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Shared bits ──────────────────────────────────────────────────
export function ResultHeader({
  title, onCopyAll, onRegenerate, onExport,
}: {
  title: string;
  onCopyAll?: () => void;
  onRegenerate?: () => void;
  onExport?: () => void;
}) {
  const t = useT();
  return (
    <div className="flex items-center justify-between flex-wrap gap-3">
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-pink animate-pulse" />
        <h2 className="font-display font-bold text-[18px] text-ink lang-th:font-thai">{title}</h2>
      </div>
      <div className="flex items-center gap-2">
        {onCopyAll && <SmallBtn icon={<Copy size={13} />} label={t('rs.copy_all')} onClick={onCopyAll} />}
        {onExport   && <SmallBtn icon={<Download size={13} />} label="Export .txt" onClick={onExport} />}
        {onRegenerate && <SmallBtn icon={<RefreshCw size={13} />} label={t('rs.regen')} onClick={onRegenerate} />}
      </div>
    </div>
  );
}

export function CopyBtn({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      data-cursor="open"
      onClick={() => {
        copyText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
      className="hover-target w-7 h-7 flex items-center justify-center rounded-md
                 bg-white/55 hover:bg-white/85 text-ink-3 hover:text-ink transition-all"
      aria-label="Copy"
    >
      {copied ? <Check size={13} className="text-emerald-600" /> : <Copy size={13} />}
    </button>
  );
}

function SmallBtn({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <button
      data-cursor="open"
      onClick={onClick}
      className="hover-target inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full
                 bg-white/55 hover:bg-white/85 text-ink-3 hover:text-ink
                 font-mono text-[11px] tracking-wider uppercase transition-all lang-th:font-thai lang-th:normal-case"
    >
      {icon}
      {label}
    </button>
  );
}

export function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="font-mono text-[10px] tracking-[0.2em] uppercase text-ink-3 font-semibold mb-2">
        — {label}
      </h3>
      {children}
    </div>
  );
}

export function EmptyResult() {
  const t = useT();
  return (
    <div className="glass rounded-[20px] p-12 text-center flex flex-col items-center justify-center min-h-[400px]">
      <div
        className="w-16 h-16 rounded-full orb-chrome mb-4 flex items-center justify-center"
      >
        <Mic size={20} className="text-white drop-shadow-sm" />
      </div>
      <h3 className="font-display font-bold text-[18px] text-ink mb-2 lang-th:font-thai">
        {t('rs.empty.title')}
      </h3>
      <p className="text-[14px] text-ink-3 max-w-[280px] mx-auto lang-th:font-thai">
        {t('rs.empty.msg')}
      </p>
    </div>
  );
}

export function ResultSkeleton({ label }: { label: string }) {
  return (
    <div className="glass rounded-[20px] p-12 text-center flex flex-col items-center justify-center min-h-[400px]">
      <div className="w-12 h-12 rounded-full border-2 border-violet/30 border-t-violet animate-spin mb-4" />
      <p className="text-[14px] text-ink-3 font-thai">{label}</p>
      <p className="text-[11px] text-ink-3 font-mono mt-2 opacity-70">~1.4s avg</p>
    </div>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────
export function copyText(text: string) {
  if (typeof navigator !== 'undefined' && navigator.clipboard) {
    navigator.clipboard.writeText(text).catch(() => {});
  }
}

export function downloadText(text: string, filename: string) {
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function formatScriptForCopy(s: ScriptContent): string {
  const beats = s.beats.map(
    (b) => `[${b.timecode}] ${b.role}\n${b.spoken}${b.broll ? `\n  → B-roll: ${b.broll}` : ''}${b.onScreenText ? `\n  → On-screen: ${b.onScreenText}` : ''}`,
  ).join('\n\n');
  const checklist = s.postingChecklist?.length
    ? `\n\n--- POSTING CHECKLIST ---\n${s.postingChecklist.map((c) => `✶ ${c}`).join('\n')}`
    : '';
  const thumb = s.thumbnailCopy ? `\n\n--- THUMBNAIL ---\n${s.thumbnailCopy}` : '';
  return `=== CAPDUCTION SCRIPT · ${s.totalSeconds}s ===\n\n${beats}${thumb}${checklist}`;
}
