'use client';

import { useState } from 'react';
import { Sparkles } from 'lucide-react';
import type { ComboContent } from '@/types';
import { ScriptResult } from './script-result';
import { CaptionResult } from './caption-result';
import { ResultSkeleton, EmptyResult, CopyBtn } from './script-result';
import { useT } from '@/lib/i18n';

interface ComboResultProps {
  data: ComboContent | null;
  loading?: boolean;
  onRegenerate?: () => void;
}

export function ComboResult({ data, loading, onRegenerate }: ComboResultProps) {
  const t = useT();
  const [tab, setTab] = useState<'script' | 'caption'>('script');

  if (loading) return <ResultSkeleton label={t('rs.combo.loading')} />;
  if (!data)   return <EmptyResult />;

  return (
    <div className="flex flex-col gap-4">
      {/* Shared hook callout */}
      <div className="glass-strong rounded-[20px] p-6">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles size={14} className="text-iridescent" />
          <span className="font-mono text-[10px] tracking-[0.22em] uppercase text-iridescent font-semibold">
            SHARED HOOK
          </span>
        </div>
        <div className="flex items-start gap-3">
          <p className="flex-1 font-display font-bold text-[20px] leading-snug text-ink font-thai">
            &ldquo;{data.sharedHook}&rdquo;
          </p>
          <CopyBtn text={data.sharedHook} />
        </div>
      </div>

      {/* Tab switcher */}
      <div className="glass rounded-[14px] p-1 inline-flex self-start">
        <TabBtn active={tab === 'script'}  onClick={() => setTab('script')}>Script</TabBtn>
        <TabBtn active={tab === 'caption'} onClick={() => setTab('caption')}>Caption</TabBtn>
      </div>

      {/* Active tab content */}
      {tab === 'script'
        ? <ScriptResult  data={data.script}  onRegenerate={onRegenerate} />
        : <CaptionResult data={data.caption} onRegenerate={onRegenerate} />}
    </div>
  );
}

function TabBtn({ children, active, onClick }: { children: React.ReactNode; active: boolean; onClick: () => void }) {
  return (
    <button
      data-cursor="switch"
      onClick={onClick}
      className={`hover-target px-5 py-2 rounded-[10px] text-[13px] font-semibold transition-all
        ${active ? 'bg-white text-ink shadow-sm' : 'text-ink-3 hover:text-ink'}`}
    >
      {children}
    </button>
  );
}
