'use client';

import type { CaptionContent } from '@/types';
import {
  ResultHeader, CopyBtn, Section, EmptyResult, ResultSkeleton,
  copyText, downloadText,
} from './script-result';
import { useT } from '@/lib/i18n';

interface CaptionResultProps {
  data: CaptionContent | null;
  loading?: boolean;
  onRegenerate?: () => void;
}

export function CaptionResult({ data, loading, onRegenerate }: CaptionResultProps) {
  const t = useT();
  if (loading) return <ResultSkeleton label={t('rs.caption.loading')} />;
  if (!data)   return <EmptyResult />;

  // Defensive: AI sometimes omits keys despite json_object format.
  const captions = Array.isArray(data.captions) ? data.captions : [];
  const hooks = Array.isArray(data.hooks) ? data.hooks : [];
  const hashtags = Array.isArray(data.hashtags) ? data.hashtags : [];
  const cta = Array.isArray(data.cta) ? data.cta : [];
  const angles = Array.isArray(data.angles) ? data.angles : [];
  const contentIdeas = Array.isArray(data.contentIdeas) ? data.contentIdeas : [];

  return (
    <div className="glass-strong rounded-[20px] p-6 md:p-7 flex flex-col gap-5">
      <ResultHeader
        title={`Caption · ${captions.length} variants`}
        onCopyAll={() => copyText(formatCaptionForCopy(data))}
        onRegenerate={onRegenerate}
        onExport={() => downloadText(formatCaptionForCopy(data), 'capduction-caption.txt')}
      />

      <Section label={t('rs.section.captions', { n: captions.length })}>
        <div className="flex flex-col gap-3">
          {captions.map((c, i) => (
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

      <Section label={t('rs.section.hooks', { n: hooks.length })}>
        <div className="flex flex-col gap-2">
          {hooks.map((h, i) => (
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

      <Section label={t('rs.section.hashtags', { n: hashtags.length })}>
        <div className="glass rounded-[12px] p-4">
          <div className="flex flex-wrap gap-2">
            {hashtags.map((tag, i) => (
              <span key={i} className="font-mono text-[12px] px-2.5 py-1 bg-white/55 border border-white/70 rounded-md text-ink-2">
                {tag}
              </span>
            ))}
          </div>
          <div className="mt-3 pt-3 border-t border-[var(--line)] flex justify-between items-center">
            <span className="font-mono text-[10px] text-ink-3">{t('rs.hash.oneline')}</span>
            <CopyBtn text={hashtags.join(' ')} />
          </div>
        </div>
      </Section>

      <Section label={t('rs.section.cta', { n: cta.length })}>
        <div className="flex flex-col gap-2">
          {cta.map((c, i) => (
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

      <Section label={t('rs.section.angles', { n: angles.length })}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {angles.map((a, i) => (
            <div key={i} className="glass rounded-[12px] p-4">
              <span className="font-mono text-[10px] text-iridescent tracking-wider font-semibold block mb-1.5">
                ANGLE {i + 1}
              </span>
              <p className="text-[13px] text-ink leading-relaxed font-thai">{a}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section label={t('rs.section.ideas', { n: contentIdeas.length })}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {contentIdeas.map((idea, i) => (
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
