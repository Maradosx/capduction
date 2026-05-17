'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { MessageSquarePlus, Bug, Lightbulb, Heart, HelpCircle, X, Check } from 'lucide-react';
import { useT } from '@/lib/i18n';

type FeedbackType = 'bug' | 'idea' | 'praise' | 'question';

interface TypeOption {
  key: FeedbackType;
  icon: React.ElementType;
  labelKey: 'fb.type.bug' | 'fb.type.idea' | 'fb.type.praise' | 'fb.type.question';
  hint:    'fb.type.bug.hint' | 'fb.type.idea.hint' | 'fb.type.praise.hint' | 'fb.type.question.hint';
  accent: string;
}

const TYPES: TypeOption[] = [
  { key: 'bug',      icon: Bug,         labelKey: 'fb.type.bug',      hint: 'fb.type.bug.hint',      accent: 'from-rose-100 to-rose-50 border-rose-200 text-rose-700' },
  { key: 'idea',     icon: Lightbulb,   labelKey: 'fb.type.idea',     hint: 'fb.type.idea.hint',     accent: 'from-amber-100 to-amber-50 border-amber-200 text-amber-700' },
  { key: 'praise',   icon: Heart,       labelKey: 'fb.type.praise',   hint: 'fb.type.praise.hint',   accent: 'from-pink-100 to-pink-50 border-pink-200 text-pink-700' },
  { key: 'question', icon: HelpCircle,  labelKey: 'fb.type.question', hint: 'fb.type.question.hint', accent: 'from-violet-100 to-violet-50 border-violet-200 text-violet-700' },
];

/**
 * Floating feedback button + modal. Mounts inside the dashboard layout
 * so it shows on every authenticated page.
 *
 * Beta-stage purpose: founder wants to read real user voice as they
 * onboard friends and family testers. Submissions land in the
 * `feedback` table and (if RESEND_API_KEY is set) trigger an email
 * notification to hello@capduction.com.
 */
export function FeedbackWidget() {
  const t = useT();
  const pathname = usePathname();
  const [open, setOpen]       = useState(false);
  const [type, setType]       = useState<FeedbackType>('idea');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent]       = useState(false);
  const [error, setError]     = useState<string | null>(null);

  // Keep the modal accessible — close on Escape.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') close(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  function close() {
    setOpen(false);
    // Wait for close animation; then reset state so a re-open is fresh.
    setTimeout(() => { setSent(false); setMessage(''); setError(null); setType('idea'); }, 300);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!message.trim()) return;
    setSending(true);
    setError(null);
    try {
      const res = await fetch('/api/feedback', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ type, message: message.trim(), page: pathname ?? undefined }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || 'Failed');
      setSent(true);
    } catch (e: any) {
      setError(e?.message ?? 'Failed');
    } finally {
      setSending(false);
    }
  }

  return (
    <>
      {/* Floating launcher — sits above mobile bottom nav, hides nothing important */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        data-cursor="open"
        aria-label={t('fb.button.aria')}
        className="hover-target fixed bottom-5 right-5 z-40 inline-flex items-center gap-2 px-4 py-3 rounded-full btn-grad text-white font-semibold text-[13px] shadow-[0_10px_30px_-5px_rgba(124,58,237,0.5)] border-0 lang-th:font-thai"
      >
        <MessageSquarePlus size={15} />
        <span className="hidden sm:inline">{t('fb.button.label')}</span>
      </button>

      {/* Modal */}
      {open && (
        <div
          className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-6 bg-ink/40 backdrop-blur-sm"
          onClick={close}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="feedback-title"
            onClick={(e) => e.stopPropagation()}
            className="glass-strong w-full sm:max-w-[520px] rounded-t-[20px] sm:rounded-[20px] p-5 sm:p-6 flex flex-col gap-4 max-h-[92vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="font-mono text-[10px] tracking-[0.22em] text-iridescent uppercase font-semibold mb-1">
                  ✦ {t('fb.eye')}
                </div>
                <h2 id="feedback-title" className="font-display font-bold text-[20px] text-ink lang-th:font-thai">
                  {sent ? t('fb.sent.title') : t('fb.title')}
                </h2>
                {!sent && (
                  <p className="text-[12px] text-ink-3 mt-1 leading-relaxed lang-th:font-thai">
                    {t('fb.subtitle')}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={close}
                aria-label="Close"
                className="w-8 h-8 rounded-full bg-white/60 hover:bg-white/80 flex items-center justify-center text-ink-3 hover:text-ink flex-shrink-0"
              >
                <X size={15} />
              </button>
            </div>

            {sent ? (
              <SentState onClose={close} />
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                {/* Type picker — 2x2 grid */}
                <div className="grid grid-cols-2 gap-2">
                  {TYPES.map((opt) => {
                    const active = type === opt.key;
                    return (
                      <button
                        key={opt.key}
                        type="button"
                        onClick={() => setType(opt.key)}
                        data-cursor="switch"
                        className={`hover-target flex flex-col items-start text-left p-3 rounded-[12px] border transition-all lang-th:font-thai
                          ${active
                            ? `bg-gradient-to-br ${opt.accent} font-semibold shadow-sm`
                            : 'bg-white/55 border-white/70 text-ink-3 hover:bg-white/80 hover:text-ink'}`}
                      >
                        <opt.icon size={16} className="mb-1.5" />
                        <span className="text-[13px] font-semibold">{t(opt.labelKey)}</span>
                        <span className="text-[11px] opacity-75 leading-snug mt-0.5">{t(opt.hint)}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Message */}
                <label className="block">
                  <span className="block font-mono text-[10px] tracking-[0.18em] text-ink-3 uppercase mb-1.5 font-semibold lang-th:font-thai lang-th:normal-case lang-th:tracking-normal">
                    {t('fb.message.label')}
                  </span>
                  <textarea
                    required
                    rows={4}
                    maxLength={4000}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={t('fb.message.ph')}
                    className="w-full px-3.5 py-2.5 rounded-[10px] bg-white/55 border border-white/70 text-ink text-[13px] outline-none focus:ring-2 focus:ring-violet/40 focus:bg-white/75 resize-none lang-th:font-thai"
                  />
                  <div className="text-right text-[10px] text-ink-3 font-mono mt-1">
                    {message.length} / 4000
                  </div>
                </label>

                {error && (
                  <p className="text-[12px] text-rose-600 bg-rose-50/70 border border-rose-200 rounded-lg px-3 py-2 lang-th:font-thai">
                    {error}
                  </p>
                )}

                <div className="flex items-center justify-between gap-3">
                  <p className="text-[11px] text-ink-3 lang-th:font-thai">
                    {t('fb.privacy')}
                  </p>
                  <button
                    type="submit"
                    disabled={sending || !message.trim()}
                    data-cursor="start"
                    className="hover-target btn-grad px-5 py-2.5 rounded-[10px] text-white font-semibold text-[13px] border-0 disabled:opacity-50 disabled:cursor-not-allowed lang-th:font-thai whitespace-nowrap"
                  >
                    {sending ? t('fb.submit.sending') : t('fb.submit.send')}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}

function SentState({ onClose }: { onClose: () => void }) {
  const t = useT();
  return (
    <div className="text-center py-6">
      <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-gradient-to-br from-mint/30 to-teal/30 flex items-center justify-center">
        <Check size={28} className="text-teal-700" />
      </div>
      <p className="text-[14px] text-ink-3 leading-relaxed lang-th:font-thai mb-5">
        {t('fb.sent.body')}
      </p>
      <button
        type="button"
        onClick={onClose}
        data-cursor="go"
        className="hover-target btn-grad px-5 py-2.5 rounded-[10px] text-white font-semibold text-[13px] border-0 lang-th:font-thai"
      >
        {t('fb.sent.close')}
      </button>
    </div>
  );
}
