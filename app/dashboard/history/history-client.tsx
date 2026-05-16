'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { FileText, Type, Wand2, Search, Trash2, ExternalLink } from 'lucide-react';
import type { Generation, StudioMode } from '@/types';
import { useT } from '@/lib/i18n';

const STUDIO_META: Record<StudioMode, { label: string; icon: typeof Wand2; grad: string }> = {
  script:  { label: 'Script',  icon: FileText, grad: 'from-pink to-rose' },
  caption: { label: 'Caption', icon: Type,     grad: 'from-violet to-pink' },
  combo:   { label: 'Combo',   icon: Wand2,    grad: 'from-teal to-violet' },
};

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins  = Math.floor(diff / 60_000);
  const hours = Math.floor(diff / 3_600_000);
  const days  = Math.floor(diff / 86_400_000);
  if (mins < 60)  return `${mins}m`;
  if (hours < 24) return `${hours}h`;
  return `${days}d`;
}

export function HistoryClient({ items: initialItems }: { items: Generation[] }) {
  const t = useT();
  const FILTERS: Array<{ value: StudioMode | 'all'; label: string }> = [
    { value: 'all',     label: t('hs.filter.all') },
    { value: 'script',  label: 'Script' },
    { value: 'caption', label: 'Caption' },
    { value: 'combo',   label: 'Combo' },
  ];
  const [items,   setItems]   = useState<Generation[]>(initialItems);
  const [filter,  setFilter]  = useState<StudioMode | 'all'>('all');
  const [query,   setQuery]   = useState('');

  const filtered = useMemo(() => {
    return items
      .filter((g) => filter === 'all' || g.studio === filter)
      .filter((g) =>
        !query.trim() ||
        g.product_name.toLowerCase().includes(query.toLowerCase()) ||
        g.platform.toLowerCase().includes(query.toLowerCase())
      );
  }, [items, filter, query]);

  async function handleDelete(id: string) {
    if (!confirm(t('hs.delete.confirm'))) return;
    // Optimistic UI
    setItems((prev) => prev.filter((g) => g.id !== id));
    try {
      await fetch(`/api/history/${id}`, { method: 'DELETE' });
    } catch { /* swallow */ }
  }

  return (
    <>
      {/* Filter + search */}
      <div className="glass rounded-[14px] p-3 flex flex-col md:flex-row gap-3 items-stretch md:items-center">
        <div className="flex gap-1 flex-wrap">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              data-cursor="switch"
              onClick={() => setFilter(f.value)}
              className={`hover-target px-3.5 py-2 rounded-full font-mono text-[11px] tracking-wider uppercase font-semibold transition-all lang-th:font-thai lang-th:normal-case
                ${filter === f.value ? 'btn-grad text-white' : 'text-ink-3 hover:bg-white/55 hover:text-ink'}`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="flex-1 flex items-center gap-2 px-3 py-2 bg-white/60 border border-white/80 rounded-full">
          <Search size={14} className="text-ink-3" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('hs.search.ph')}
            className="flex-1 bg-transparent border-0 outline-none text-[13px] text-ink placeholder:text-slate lang-th:font-thai"
          />
        </div>
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="glass rounded-[14px] p-10 text-center text-ink-3 text-[14px] lang-th:font-thai">
          {t('hs.no_match')}
        </div>
      ) : (
        <div className="glass rounded-[18px] overflow-hidden">
          {filtered.map((g, i) => {
            const meta = STUDIO_META[g.studio as StudioMode];
            const Icon = meta?.icon ?? FileText;
            return (
              <div
                key={g.id}
                id={g.id}
                className={`flex items-center gap-4 px-5 py-4 hover:bg-white/55 transition-all
                  ${i !== filtered.length - 1 ? 'border-b border-[var(--line)]' : ''}`}
              >
                <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${meta?.grad ?? 'from-pink to-violet'} flex items-center justify-center flex-shrink-0
                                 shadow-[0_2px_8px_rgba(181,143,255,0.4)]`}>
                  <Icon size={14} className="text-white drop-shadow-sm" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[14px] font-semibold text-ink truncate lang-th:font-thai">{g.product_name}</div>
                  <div className="text-[11px] text-ink-3 flex items-center gap-2 mt-0.5 font-mono">
                    <span>{meta?.label ?? g.studio}</span>
                    <span className="w-0.5 h-0.5 rounded-full bg-ink-3" />
                    <span>{g.platform}</span>
                    <span className="w-0.5 h-0.5 rounded-full bg-ink-3" />
                    <span>{g.tone}</span>
                    {g.duration && <>
                      <span className="w-0.5 h-0.5 rounded-full bg-ink-3" />
                      <span>{g.duration}</span>
                    </>}
                  </div>
                </div>
                <span className="text-[11px] text-ink-3 font-mono flex-shrink-0 hidden md:inline">
                  {timeAgo(g.created_at)}
                </span>
                <button
                  onClick={() => handleDelete(g.id)}
                  data-cursor="open"
                  className="hover-target w-8 h-8 flex items-center justify-center rounded-md text-ink-3 hover:text-rose-600 hover:bg-rose-50/60 transition-all"
                  aria-label="Delete"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
