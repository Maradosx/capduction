'use client';

import type { CaptionContent } from '@/types';
import {
  ResultHeader, CopyBtn, Section, EmptyResult, ResultSkeleton,
  copyText, downloadText,
} from './script-result';

interface CaptionResultProps {
  data: CaptionContent | null;
  loading?: boolean;
  onRegenerate?: () => void;
}

export function CaptionResult({ data, loading, onRegenerate }: CaptionResultProps) {
  if (loading) return <ResultSkeleton label="กำลังปั้นแคปชั่น..." />;
  if (!data)   return <EmptyResult />;

  return (
    <div className="glass-strong rounded-[20px] p-6 md:p-7 flex flex-col gap-5">
      <ResultHeader
        title={`Caption · ${data.captions.length} variants`}
        onCopyAll={() => copyText(formatCaptionForCopy(data))}
        onRegenerate={onRegenerate}
        onExport={() => downloadText(formatCaptionForCopy(data), 'capduction-caption.txt')}
      />

      <Section label={`CAPTIONS · ${data.captions.length} VARIANTS`}>
        <div className="flex flex-col gap-3">
          {data.captions.map((c, i) => (
            <div key={i} className="glass rounded-[14px] p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-[10px] text-iridescent tracking-wider font-semibold">
                  VARIANT {i + 1}
                </span>
                <CopyBtn text={c} />
              </div>
              <p className="text-[14px] text-ink leading-relaxed font-thai whitespace-pre-line">{c}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section label={`HOOKS · ${data.hooks.length}`}>
        <div className="flex flex-col gap-2">
          {data.hooks.map((h, i) => (
            <div key={i} className="glass rounded-[12px] px-4 py-2.5 flex items-start gap-3">
              <span className="font-mono text-[10px] text-iridescent tracking-wider font-semibold pt-0.5 w-6">
                {String(i + 1).padStart(2, '0')}
              </span>
              <p className="flex-1 text-[14px] text-ink font-thai">{h}</p>
              <CopyBtn text={h} />
            </div>
          ))}
        </div>
      </Section>

      <Section label={`HASHTAGS · ${data.hashtags.length}`}>
        <div className="glass rounded-[12px] p-4">
          <div className="flex flex-wrap gap-2">
            {data.hashtags.map((t, i) => (
              <span key={i} className="font-mono text-[12px] px-2.5 py-1 bg-white/55 border border-white/70 rounded-md text-ink-2">
                {t}
              </span>
            ))}
          </div>
          <div className="mt-3 pt-3 border-t border-[var(--line)] flex justify-between items-center">
            <span className="font-mono text-[10px] text-ink-3">All in one line:</span>
            <CopyBtn text={data.hashtags.join(' ')} />
          </div>
        </div>
      </Section>

      <Section label={`CTA · ${data.cta.length} ตัวเลือก`}>
        <div className="flex flex-col gap-2">
          {data.cta.map((c, i) => (
            <div key={i} className="glass rounded-[12px] px-4 py-2.5 flex items-start gap-3">
              <span className="font-mono text-[10px] text-iridescent tracking-wider font-semibold pt-0.5 w-6">
                {String(i + 1).padStart(2, '0')}
              </span>
              <p className="flex-1 text-[14px] text-ink font-thai">{c}</p>
              <CopyBtn text={c} />
            </div>
          ))}
        </div>
      </Section>

      <Section label={`SELLING ANGLES · ${data.angles.length}`}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {data.angles.map((a, i) => (
            <div key={i} className="glass rounded-[12px] p-4">
              <span className="font-mono text-[10px] text-iridescent tracking-wider font-semibold block mb-1.5">
                ANGLE {i + 1}
              </span>
              <p className="text-[13px] text-ink leading-relaxed font-thai">{a}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section label={`VIDEO CONTENT IDEAS · ${data.contentIdeas.length}`}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {data.contentIdeas.map((idea, i) => (
            <div key={i} className="glass rounded-[12px] p-4">
              <span className="font-mono text-[10px] text-iridescent tracking-wider font-semibold block mb-1.5">
                IDEA {i + 1}
              </span>
              <p className="text-[13px] text-ink leading-relaxed font-thai">{idea}</p>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}

function formatCaptionForCopy(c: CaptionContent): string {
  return [
    '=== CAPDUCTION CAPTION PACK ===\n',
    '--- CAPTIONS ---',
    c.captions.map((x, i) => `\n[${i + 1}] ${x}`).join('\n'),
    '\n\n--- HOOKS ---',
    c.hooks.map((x, i) => `[${i + 1}] ${x}`).join('\n'),
    '\n--- HASHTAGS ---',
    c.hashtags.join(' '),
    '\n\n--- CTA ---',
    c.cta.map((x, i) => `[${i + 1}] ${x}`).join('\n'),
    '\n--- ANGLES ---',
    c.angles.map((x, i) => `[${i + 1}] ${x}`).join('\n'),
    '\n--- VIDEO IDEAS ---',
    c.contentIdeas.map((x, i) => `[${i + 1}] ${x}`).join('\n'),
  ].join('\n');
}
