'use client';

import { useState, useRef, useEffect } from 'react';
import { Check, Plus, X, ChevronDown } from 'lucide-react';

interface MultiSelectProps {
  /** Preset options shown as togglable chips */
  options: readonly string[] | string[];
  /** Currently selected values (subset of options + any custom strings) */
  value: string[];
  /** Called whenever the selection changes */
  onChange: (next: string[]) => void;
  /** Optional sub-label appearing next to each preset (e.g. Thai gloss) */
  optionSublabels?: Record<string, string>;
  /** Optional display label override per option (value still emits the canonical key) */
  optionLabels?: Record<string, string>;
  /** Allow users to add their own values via "+ Other" */
  allowCustom?: boolean;
  /** Placeholder for the custom-value input */
  customPlaceholder?: string;
  /** Label for the "+ add custom" button (default: 'อื่นๆ') */
  addLabel?: string;
  /** If set, only show this many presets initially with a "+N more" expand chip. Selected presets are always visible. */
  initialVisibleCount?: number;
}

/**
 * Pill-style multi-select. Each preset is a togglable chip; selected chips
 * get the iridescent gradient. With `allowCustom`, an "+ Other" chip reveals
 * an inline input so users can type their own value (rendered as a removable
 * chip alongside the presets).
 */
export function MultiSelect({
  options,
  value,
  onChange,
  optionSublabels,
  optionLabels,
  allowCustom = true,
  customPlaceholder = 'พิมพ์เอง...',
  addLabel = 'อื่นๆ',
  initialVisibleCount,
}: MultiSelectProps) {
  const [adding, setAdding]     = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [draft, setDraft]       = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { if (adding) inputRef.current?.focus(); }, [adding]);

  const presetSet = new Set(options);
  const presetSelected = value.filter((v) => presetSet.has(v));
  const custom = value.filter((v) => !presetSet.has(v));

  // Collapse mode: show the first N + any selected presets, hide the rest
  // behind a "+N more" chip until expanded.
  const collapseActive =
    typeof initialVisibleCount === 'number' &&
    !expanded &&
    options.length > initialVisibleCount;
  const visibleOptions = collapseActive
    ? options.filter((o, i) => i < initialVisibleCount! || presetSelected.includes(o))
    : options;
  const hiddenCount = options.length - visibleOptions.length;

  function toggle(opt: string) {
    if (value.includes(opt)) onChange(value.filter((v) => v !== opt));
    else onChange([...value, opt]);
  }

  function commitDraft() {
    const trimmed = draft.trim();
    if (trimmed && !value.includes(trimmed)) {
      onChange([...value, trimmed]);
    }
    setDraft('');
    setAdding(false);
  }

  return (
    <div className="flex flex-wrap gap-1.5">
      {visibleOptions.map((opt) => {
        const active = presetSelected.includes(opt);
        return (
          <button
            key={opt}
            type="button"
            data-cursor="switch"
            onClick={() => toggle(opt)}
            className={`hover-target inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full
                        text-[12px] font-semibold transition-all lang-th:font-thai border
                        ${active
                          ? 'btn-grad text-white border-transparent shadow-[0_3px_10px_-2px_rgba(124,58,237,0.35)]'
                          : 'bg-white/55 border-white/70 text-ink-3 hover:bg-white/80 hover:text-ink'}`}
          >
            {active && <Check size={11} />}
            <span>{optionLabels?.[opt] ?? opt}</span>
            {optionSublabels?.[opt] && (
              <span className={`text-[10px] ${active ? 'opacity-80' : 'opacity-60'}`}>
                · {optionSublabels[opt]}
              </span>
            )}
          </button>
        );
      })}

      {custom.map((c) => (
        <span
          key={c}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px]
                     font-semibold bg-gradient-to-br from-mint/60 to-teal/50
                     text-ink border border-teal/30 lang-th:font-thai"
        >
          <Check size={11} />
          {c}
          <button
            type="button"
            onClick={() => onChange(value.filter((v) => v !== c))}
            className="opacity-60 hover:opacity-100 -mr-1"
            aria-label={`Remove ${c}`}
          >
            <X size={11} />
          </button>
        </span>
      ))}

      {collapseActive && hiddenCount > 0 && (
        <button
          type="button"
          data-cursor="open"
          onClick={() => setExpanded(true)}
          className="hover-target inline-flex items-center gap-1 px-3 py-1.5 rounded-full
                     text-[12px] font-semibold bg-white/40 border border-white/70
                     text-ink-3 hover:bg-white/70 hover:text-ink transition-all lang-th:font-thai"
        >
          +{hiddenCount} <ChevronDown size={11} />
        </button>
      )}

      {allowCustom && !adding && (
        <button
          type="button"
          data-cursor="create"
          onClick={() => setAdding(true)}
          className="hover-target inline-flex items-center gap-1 px-3 py-1.5 rounded-full
                     text-[12px] font-semibold border border-dashed border-violet/35
                     text-violet hover:bg-violet/10 transition-all lang-th:font-thai"
        >
          <Plus size={11} /> {addLabel}
        </button>
      )}

      {allowCustom && adding && (
        <div className="inline-flex items-center gap-1 px-2 py-1 rounded-full
                        border border-violet/35 bg-white/85">
          <input
            ref={inputRef}
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') { e.preventDefault(); commitDraft(); }
              else if (e.key === 'Escape') { setDraft(''); setAdding(false); }
            }}
            onBlur={() => { if (!draft.trim()) setAdding(false); else commitDraft(); }}
            placeholder={customPlaceholder}
            className="bg-transparent border-0 outline-none text-[12px] text-ink
                       placeholder:text-slate w-32 lang-th:font-thai"
          />
          <button
            type="button"
            onClick={commitDraft}
            className="text-violet hover:text-pink"
            aria-label="Add"
          >
            <Check size={13} />
          </button>
        </div>
      )}
    </div>
  );
}
