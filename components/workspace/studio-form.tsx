'use client';

import { useState } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
import {
  TONES, PLATFORMS, DURATIONS,
  TARGET_PRESETS, CATEGORY_PRESETS, VARIANT_COUNTS,
  type Platform, type StudioMode,
} from '@/types';
import { useT, useI18n } from '@/lib/i18n';
import { MultiSelect } from '@/components/ui/multi-select';

export interface StudioFormData {
  productName: string;
  categories: string[];
  targetCustomers: string[];
  tones: string[];
  platform: Platform;
  /** Preset like '30s' or custom like '45s' */
  duration: string;
  details: string;
  variants: number;
}

interface StudioFormProps {
  mode: StudioMode;
  defaults?: Partial<StudioFormData>;
  loading?: boolean;
  error?: string | null;
  onSubmit: (data: StudioFormData) => void;
}

const TONE_SUBLABELS: Record<'th' | 'en', Record<string, string>> = {
  th: { Friendly: 'เป็นมิตร', Professional: 'มืออาชีพ', Luxury: 'หรูหรา', Viral: 'ไวรัล', Persuasive: 'โน้มน้าว', Minimal: 'มินิมอล' },
  en: { Friendly: 'warm',     Professional: 'pro',      Luxury: 'premium', Viral: 'high-energy', Persuasive: 'sales',  Minimal: 'clean' },
};

// Canonical labels (sent to backend) → display labels per language.
// Only TH localizes English-canonical labels; EN view keeps canonical as-is
// (so the LLM still receives consistent strings regardless of UI language).
const CATEGORY_LABELS_TH: Record<string, string> = {
  Beauty: 'ความงาม', Fashion: 'แฟชั่น', 'Food & Drink': 'อาหาร & เครื่องดื่ม',
  Health: 'สุขภาพ', Tech: 'เทคโนโลยี', Home: 'ของใช้ในบ้าน',
  Fitness: 'ฟิตเนส', Travel: 'ท่องเที่ยว', Education: 'การศึกษา',
  Pet: 'สัตว์เลี้ยง', 'Baby & Kids': 'เด็ก & แม่และเด็ก',
};

const TARGET_LABELS_EN: Record<string, string> = {
  'นักศึกษา': 'University students',
  'แม่บ้าน': 'Homemakers',
  'พ่อแม่มือใหม่': 'New parents',
  'ผู้ชายสายเทค': 'Tech-savvy men',
  'ผู้หญิงสายบิวตี้': 'Beauty-conscious women',
};

const DURATION_PRESET_LABELS: Record<'th' | 'en', Record<string, string>> = {
  th: { '15s': '15 วินาที', '30s': '30 วินาที', '60s': '1 นาที', '90s': '1.5 นาที', long: 'Long-form (>90s)' },
  en: { '15s': '15 sec',    '30s': '30 sec',    '60s': '1 min',  '90s': '1.5 min',  long: 'Long-form (>90s)' },
};

export function StudioForm({ mode, defaults, loading, error, onSubmit }: StudioFormProps) {
  const t = useT();
  const { lang } = useI18n();
  const [data, setData] = useState<StudioFormData>({
    productName:     defaults?.productName     ?? '',
    categories:      defaults?.categories      ?? [],
    targetCustomers: defaults?.targetCustomers ?? [],
    tones:           defaults?.tones           ?? [mode === 'caption' ? 'Friendly' : 'Persuasive'],
    platform:        defaults?.platform        ?? 'TikTok',
    duration:        defaults?.duration        ?? '30s',
    details:         defaults?.details         ?? '',
    variants:        defaults?.variants        ?? 1,
  });

  const showDuration = mode === 'script' || mode === 'combo';

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!data.productName.trim()) return;
    if (data.tones.length === 0) {
      // Ensure we always submit at least one tone
      onSubmit({ ...data, tones: [mode === 'caption' ? 'Friendly' : 'Persuasive'] });
      return;
    }
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

      <Field label={t('wf.category')}>
        <MultiSelect
          options={CATEGORY_PRESETS}
          value={data.categories}
          onChange={(v) => setData({ ...data, categories: v })}
          optionLabels={lang === 'th' ? CATEGORY_LABELS_TH : undefined}
          customPlaceholder={lang === 'th' ? 'หมวดอื่น...' : 'Other category...'}
          addLabel={lang === 'th' ? 'อื่นๆ' : 'Other'}
          initialVisibleCount={6}
        />
      </Field>

      <Field label={t('wf.target')}>
        <MultiSelect
          options={TARGET_PRESETS}
          value={data.targetCustomers}
          onChange={(v) => setData({ ...data, targetCustomers: v })}
          optionLabels={lang === 'en' ? TARGET_LABELS_EN : undefined}
          customPlaceholder={lang === 'th' ? 'กลุ่มอื่น...' : 'Other audience...'}
          addLabel={lang === 'th' ? 'อื่นๆ' : 'Other'}
          initialVisibleCount={6}
        />
      </Field>

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
        <MultiSelect
          options={TONES}
          value={data.tones}
          onChange={(v) => setData({ ...data, tones: v })}
          optionSublabels={TONE_SUBLABELS[lang]}
          customPlaceholder={lang === 'th' ? 'โทนอื่น...' : 'Other tone...'}
          addLabel={lang === 'th' ? 'อื่นๆ' : 'Other'}
        />
      </Field>

      {showDuration && (
        <Field label={t('wf.duration')}>
          <MultiSelect
            options={DURATIONS as unknown as readonly string[]}
            value={[data.duration]}
            onChange={(v) => setData({ ...data, duration: v[v.length - 1] ?? '30s' })}
            optionSublabels={DURATION_PRESET_LABELS[lang]}
            customPlaceholder={lang === 'th' ? 'เช่น 45 วินาที' : 'e.g. 45s'}
            addLabel={lang === 'th' ? 'อื่นๆ' : 'Other'}
            allowCustom
          />
          <p className="text-[10px] text-ink-3 mt-1.5 lang-th:font-thai">
            {lang === 'th'
              ? 'เลือกได้ทีละค่า · กด "อื่นๆ" เพื่อพิมพ์เอง'
              : 'Pick one · tap "อื่นๆ" to enter a custom length'}
          </p>
        </Field>
      )}

      <Field label={t('wf.variants')}>
        <div className="flex gap-2">
          {VARIANT_COUNTS.map((n) => (
            <button
              key={n}
              type="button"
              data-cursor="switch"
              onClick={() => setData({ ...data, variants: n })}
              className={`hover-target flex-1 py-2 rounded-[10px] font-semibold text-[13px] transition-all lang-th:font-thai
                          ${data.variants === n
                            ? 'btn-grad text-white shadow-[0_4px_12px_-2px_rgba(124,58,237,0.4)]'
                            : 'bg-white/55 border border-white/70 text-ink-3 hover:bg-white/80 hover:text-ink'}`}
            >
              {lang === 'th' ? `${n} แบบ` : `${n} variant${n > 1 ? 's' : ''}`}
            </button>
          ))}
        </div>
      </Field>

      <Field label={t('wf.details')}>
        <textarea
          rows={4}
          maxLength={800}
          value={data.details}
          onChange={(e) => setData({ ...data, details: e.target.value })}
          placeholder={lang === 'th'
            ? `${t('wf.details.ph')}\n— ใส่คำขอเพิ่มได้ เช่น "แคปชั่นสั้น 2 ประโยค", "เน้นอารมณ์ตลก", "หลีกเลี่ยงคำว่า ราคาถูก"`
            : `${t('wf.details.ph')}\n— Add any custom request: "short 2-sentence captions", "humorous tone", "avoid certain words"`}
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
            {/* Cost-clarity: tell user exactly how many credits this will burn */}
            {t('wf.generate')} · {t('wf.cost', { n: data.variants })}
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
      <span className="block font-mono text-[10px] tracking-[0.18em] text-ink-3 uppercase mb-1.5 font-semibold lang-th:font-thai lang-th:normal-case lang-th:tracking-normal">
        {label} {required && <span className="text-pink">*</span>}
      </span>
      {children}
    </label>
  );
}
