'use client';

import { useState } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
import { TONES, PLATFORMS, DURATIONS, type Tone, type Platform, type Duration, type StudioMode } from '@/types';
import { useT, useI18n } from '@/lib/i18n';

export interface StudioFormData {
  productName: string;
  category: string;
  targetCustomer: string;
  tone: Tone;
  platform: Platform;
  duration: Duration;
  details: string;
}

interface StudioFormProps {
  mode: StudioMode;
  defaults?: Partial<StudioFormData>;
  loading?: boolean;
  error?: string | null;
  onSubmit: (data: StudioFormData) => void;
}

const TONE_LABELS: Record<'th' | 'en', Record<Tone, string>> = {
  th: { Friendly: 'เป็นมิตร', Professional: 'มืออาชีพ', Luxury: 'หรูหรา', Viral: 'ไวรัล', Persuasive: 'โน้มน้าว', Minimal: 'มินิมอล' },
  en: { Friendly: 'Friendly',  Professional: 'Professional', Luxury: 'Luxury', Viral: 'Viral', Persuasive: 'Persuasive', Minimal: 'Minimal' },
};

const DURATION_LABELS: Record<'th' | 'en', Record<Duration, string>> = {
  th: { '15s': '15 วินาที', '30s': '30 วินาที', '60s': '1 นาที', '90s': '1.5 นาที', long: 'Long-form (>90s)' },
  en: { '15s': '15 sec',    '30s': '30 sec',    '60s': '1 min',  '90s': '1.5 min',  long: 'Long-form (>90s)' },
};

export function StudioForm({ mode, defaults, loading, error, onSubmit }: StudioFormProps) {
  const t = useT();
  const { lang } = useI18n();
  const [data, setData] = useState<StudioFormData>({
    productName:    defaults?.productName    ?? '',
    category:       defaults?.category       ?? '',
    targetCustomer: defaults?.targetCustomer ?? '',
    tone:           defaults?.tone           ?? (mode === 'caption' ? 'Friendly' : 'Persuasive'),
    platform:       defaults?.platform       ?? 'TikTok',
    duration:       defaults?.duration       ?? '30s',
    details:        defaults?.details        ?? '',
  });

  const showDuration = mode === 'script' || mode === 'combo';

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!data.productName.trim()) return;
    onSubmit(data);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="glass-strong rounded-[20px] p-6 md:p-7 flex flex-col gap-5"
    >
      <div className="flex items-center gap-2 mb-1">
        <Sparkles size={16} className="text-iridescent" />
        <h2 className="font-mono text-[10px] tracking-[0.22em] uppercase text-ink-3 font-semibold">
          PRODUCT INPUT
        </h2>
      </div>

      <Field label={t('wf.product')} required>
        <input
          type="text"
          required
          maxLength={100}
          value={data.productName}
          onChange={(e) => setData({ ...data, productName: e.target.value })}
          placeholder={t('wf.product.ph')}
          className={inputCls}
        />
      </Field>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label={t('wf.category')}>
          <input
            type="text"
            maxLength={50}
            value={data.category}
            onChange={(e) => setData({ ...data, category: e.target.value })}
            placeholder="Beauty / Fashion / Food..."
            className={inputCls}
          />
        </Field>
        <Field label={t('wf.target')}>
          <input
            type="text"
            maxLength={100}
            value={data.targetCustomer}
            onChange={(e) => setData({ ...data, targetCustomer: e.target.value })}
            placeholder={t('wf.target.ph')}
            className={inputCls}
          />
        </Field>
      </div>

      <div className={`grid grid-cols-1 ${showDuration ? 'md:grid-cols-3' : 'md:grid-cols-2'} gap-4`}>
        <Field label={t('wf.platform')}>
          <select
            value={data.platform}
            onChange={(e) => setData({ ...data, platform: e.target.value as Platform })}
            className={inputCls}
          >
            {PLATFORMS.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
        </Field>
        <Field label={t('wf.tone')}>
          <select
            value={data.tone}
            onChange={(e) => setData({ ...data, tone: e.target.value as Tone })}
            className={inputCls}
          >
            {TONES.map((tone) => (
              <option key={tone} value={tone}>{tone} · {TONE_LABELS[lang][tone]}</option>
            ))}
          </select>
        </Field>
        {showDuration && (
          <Field label={t('wf.duration')}>
            <select
              value={data.duration}
              onChange={(e) => setData({ ...data, duration: e.target.value as Duration })}
              className={inputCls}
            >
              {DURATIONS.map((d) => (
                <option key={d} value={d}>{DURATION_LABELS[lang][d]}</option>
              ))}
            </select>
          </Field>
        )}
      </div>

      <Field label={t('wf.details')}>
        <textarea
          rows={3}
          maxLength={500}
          value={data.details}
          onChange={(e) => setData({ ...data, details: e.target.value })}
          placeholder={t('wf.details.ph')}
          className={`${inputCls} resize-none`}
        />
      </Field>

      {error && (
        <p className="text-[13px] text-rose-600 bg-rose-50/70 border border-rose-200 rounded-lg px-3 py-2 lang-th:font-thai">
          {error}
        </p>
      )}

      <button
        type="submit"
        data-cursor="start"
        disabled={loading || !data.productName.trim()}
        className="hover-target btn-grad px-6 py-3.5 rounded-[12px] text-white font-semibold text-[15px]
                   border-0 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 lang-th:font-thai"
      >
        {loading ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            {t('wf.generating')}
          </>
        ) : (
          <>
            <Sparkles size={16} />
            {t('wf.generate')}
          </>
        )}
      </button>
    </form>
  );
}

const inputCls =
  'w-full px-4 py-2.5 rounded-[10px] bg-white/55 border border-white/70 text-ink text-[14px] ' +
  'placeholder:text-slate outline-none focus:ring-2 focus:ring-violet/40 focus:bg-white/75 transition-all lang-th:font-thai';

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block font-mono text-[10px] tracking-[0.18em] text-ink-3 uppercase mb-1.5 font-semibold">
        {label} {required && <span className="text-pink">*</span>}
      </span>
      {children}
    </label>
  );
}
