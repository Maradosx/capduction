'use client';

import { useState, useTransition } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Bug, Lightbulb, Heart, HelpCircle, MessageSquare, Search, Copy, Check } from 'lucide-react';

export interface FeedbackRow {
  id:         string;
  created_at: string;
  type:       'bug' | 'idea' | 'praise' | 'question' | 'other';
  email:      string | null;
  message:    string;
  page:       string | null;
  user_agent: string | null;
  metadata:   Record<string, unknown> | null;
  user_id:    string | null;
}

const TYPE_META: Record<FeedbackRow['type'], { label: string; icon: React.ElementType; cls: string }> = {
  bug:      { label: 'Bug',      icon: Bug,         cls: 'bg-rose-100 text-rose-700 border-rose-200' },
  idea:     { label: 'Idea',     icon: Lightbulb,   cls: 'bg-amber-100 text-amber-700 border-amber-200' },
  praise:   { label: 'Praise',   icon: Heart,       cls: 'bg-pink-100 text-pink-700 border-pink-200' },
  question: { label: 'Question', icon: HelpCircle,  cls: 'bg-violet-100 text-violet-700 border-violet-200' },
  other:    { label: 'Other',    icon: MessageSquare, cls: 'bg-slate-100 text-slate-700 border-slate-200' },
};

interface Props {
  rows:       FeedbackRow[];
  counts:     Record<string, number>;
  activeType: string;
  query:      string;
  error:      string | null;
}

export function FeedbackInbox({ rows, counts, activeType, query, error }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [pending, startTransition] = useTransition();
  const [searchInput, setSearchInput] = useState(query);

  function navigate(updates: Record<string, string | undefined>) {
    const next = new URLSearchParams(params?.toString());
    for (const [k, v] of Object.entries(updates)) {
      if (!v || v === 'all' || v === '') next.delete(k);
      else next.set(k, v);
    }
    startTransition(() => {
      router.push(`${pathname}${next.toString() ? `?${next}` : ''}`);
    });
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    navigate({ q: searchInput.trim() });
  }

  const types = ['all', 'bug', 'idea', 'praise', 'question', 'other'] as const;

  return (
    <div className="max-w-[1100px] mx-auto flex flex-col gap-6">
      <header>
        <h1 className="font-display font-bold text-[clamp(28px,3.5vw,42px)] tracking-[-0.025em] text-ink lang-th:font-thai">
          Feedback Inbox
        </h1>
        <p className="text-ink-3 text-[14px] mt-1">
          {counts.all ?? 0} total · {rows.length} shown
        </p>
      </header>

      {/* Filter chips */}
      <div className="flex flex-wrap gap-2 items-center">
        {types.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => navigate({ type: t })}
            data-cursor="switch"
            disabled={pending}
            className={`hover-target inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-semibold transition-all border
              ${activeType === t
                ? 'btn-grad text-white border-transparent shadow-[0_3px_10px_-2px_rgba(124,58,237,0.35)]'
                : 'bg-white/55 border-white/70 text-ink-3 hover:bg-white/80 hover:text-ink'}`}
          >
            <span className="capitalize">{t}</span>
            {counts[t] !== undefined && (
              <span className="font-mono text-[10px] opacity-75">{counts[t]}</span>
            )}
          </button>
        ))}

        {/* Search */}
        <form onSubmit={handleSearch} className="ml-auto inline-flex items-center gap-2">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/60 border border-white/80 rounded-[10px] focus-within:ring-2 focus-within:ring-violet/40">
            <Search size={13} className="text-ink-3" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search message or email..."
              className="bg-transparent border-0 outline-none text-[12px] text-ink min-w-[200px] placeholder:text-slate"
            />
          </div>
          {query && (
            <button
              type="button"
              onClick={() => { setSearchInput(''); navigate({ q: undefined }); }}
              className="text-[11px] text-ink-3 hover:text-ink"
            >
              Clear
            </button>
          )}
        </form>
      </div>

      {error && (
        <div className="glass rounded-[14px] p-4 text-[13px] text-rose-700 bg-rose-50/70 border border-rose-200">
          Failed to load: {error}
        </div>
      )}

      {/* Rows */}
      {rows.length === 0 ? (
        <div className="glass rounded-[18px] p-12 text-center">
          <MessageSquare size={28} className="mx-auto mb-3 text-ink-3 opacity-50" />
          <p className="text-ink-3 text-[14px]">
            {counts.all === 0 ? 'No feedback yet — share Capduction with testers and watch this fill up.' : 'No matches for current filter.'}
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {rows.map((row) => (
            <FeedbackCard key={row.id} row={row} />
          ))}
        </div>
      )}
    </div>
  );
}

function FeedbackCard({ row }: { row: FeedbackRow }) {
  const meta = TYPE_META[row.type] ?? TYPE_META.other;
  const [copied, setCopied] = useState(false);

  function copyEmail() {
    if (!row.email) return;
    navigator.clipboard?.writeText(row.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  }

  const plan    = (row.metadata as any)?.plan ?? null;
  const credits = (row.metadata as any)?.credits ?? null;

  return (
    <article className="glass rounded-[14px] p-5 flex flex-col gap-3">
      {/* Header line */}
      <div className="flex items-start gap-3 flex-wrap">
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono font-bold tracking-wider border flex-shrink-0 ${meta.cls}`}>
          <meta.icon size={11} />
          {meta.label.toUpperCase()}
        </span>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap text-[12px] text-ink-3">
            {row.email ? (
              <button
                type="button"
                onClick={copyEmail}
                className="hover-target inline-flex items-center gap-1 text-ink font-semibold hover:text-iridescent"
                title="Copy email"
              >
                {row.email}
                {copied ? <Check size={11} /> : <Copy size={11} className="opacity-50" />}
              </button>
            ) : (
              <span className="italic">anonymous</span>
            )}
            <span className="opacity-50">·</span>
            <time className="font-mono">{formatTime(row.created_at)}</time>
            {plan && (
              <>
                <span className="opacity-50">·</span>
                <span className="font-mono uppercase tracking-wider opacity-75">{String(plan)}{credits !== null ? ` · ${credits}c` : ''}</span>
              </>
            )}
            {row.page && (
              <>
                <span className="opacity-50">·</span>
                <code className="font-mono text-[11px] opacity-75 truncate">{row.page}</code>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Message */}
      <div className="text-[14px] text-ink leading-relaxed whitespace-pre-wrap font-thai">
        {row.message}
      </div>

      {/* UA collapsed */}
      {row.user_agent && (
        <details className="text-[10px] text-ink-3 font-mono">
          <summary className="cursor-pointer opacity-60 hover:opacity-100">user-agent</summary>
          <code className="block mt-1 opacity-75 break-all">{row.user_agent}</code>
        </details>
      )}
    </article>
  );
}

function formatTime(iso: string): string {
  const d = new Date(iso);
  const diff = Date.now() - d.getTime();
  const mins  = Math.floor(diff / 60_000);
  const hours = Math.floor(diff / 3_600_000);
  const days  = Math.floor(diff / 86_400_000);
  if (mins  < 1)   return 'just now';
  if (mins  < 60)  return `${mins}m ago`;
  if (hours < 24)  return `${hours}h ago`;
  if (days  < 7)   return `${days}d ago`;
  return d.toLocaleString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
}
