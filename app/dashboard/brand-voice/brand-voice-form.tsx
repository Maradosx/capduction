'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Save, Trash2, Mic2 } from 'lucide-react';
import {
  createBrandVoiceAction,
  updateBrandVoiceAction,
  deleteBrandVoiceAction,
} from '@/app/actions/brand-voices';
import { useT } from '@/lib/i18n';

interface BrandVoiceFormProps {
  mode: 'create' | 'edit';
  initial?: {
    id?: string;
    name?: string;
    description?: string;
    sample_posts?: string[];
  };
}

export function BrandVoiceForm({ mode, initial }: BrandVoiceFormProps) {
  const t = useT();
  const router = useRouter();
  const [name,        setName]        = useState(initial?.name ?? '');
  const [description, setDescription] = useState(initial?.description ?? '');
  const [samples,     setSamples]     = useState<string[]>(() => {
    const arr = initial?.sample_posts ?? [];
    return [arr[0] ?? '', arr[1] ?? '', arr[2] ?? ''];
  });
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState<string | null>(null);

  function updateSample(i: number, v: string) {
    const next = [...samples];
    next[i] = v;
    setSamples(next);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null); setLoading(true);
    const fd = new FormData();
    fd.set('name', name);
    fd.set('description', description);
    samples.forEach((s, i) => fd.set(`sample_${i}`, s));
    if (mode === 'edit' && initial?.id) fd.set('id', initial.id);

    try {
      const res = mode === 'create'
        ? await createBrandVoiceAction(fd)
        : await updateBrandVoiceAction(fd);
      if (res?.error) {
        setError(res.error); setLoading(false); return;
      }
      if (mode === 'edit') {
        router.refresh();
        setLoading(false);
      }
    } catch (err: any) {
      if (err?.digest?.startsWith?.('NEXT_REDIRECT')) throw err;
      setError(err?.message ?? 'Error');
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!initial?.id) return;
    if (!confirm('ลบ brand voice นี้?')) return;
    const fd = new FormData();
    fd.set('id', initial.id);
    try { await deleteBrandVoiceAction(fd); }
    catch (err: any) { if (err?.digest?.startsWith?.('NEXT_REDIRECT')) throw err; }
  }

  return (
    <form onSubmit={handleSubmit} className="glass-strong rounded-[20px] p-6 md:p-7 flex flex-col gap-5">
      <Field label={t('bv.f.name')} required>
        <input
          type="text"
          required
          maxLength={60}
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={t('bv.f.name.ph')}
          className={inputCls}
        />
      </Field>

      <Field label={t('bv.f.desc')} required>
        <textarea
          rows={5}
          required
          maxLength={600}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder={t('set.bv.ph')}
          className={`${inputCls} resize-none font-thai`}
        />
        <p className="text-[11px] text-ink-3 mt-1.5 lang-th:font-thai">{t('bv.f.desc.hint')}</p>
      </Field>

      <div>
        <div className="flex items-center gap-2 mb-3">
          <Mic2 size={14} className="text-iridescent" />
          <span className="font-mono text-[10px] tracking-[0.18em] text-ink-3 uppercase font-semibold lang-th:font-thai lang-th:normal-case lang-th:tracking-normal">
            {t('bv.f.samples')}
          </span>
        </div>
        <div className="flex flex-col gap-3">
          {samples.map((s, i) => (
            <div key={i} className="flex items-start gap-2">
              <span className="font-mono text-[11px] text-iridescent font-bold pt-3 w-6 flex-shrink-0">
                {i + 1}
              </span>
              <textarea
                rows={2}
                maxLength={400}
                value={s}
                onChange={(e) => updateSample(i, e.target.value)}
                placeholder={t('bv.f.sample.ph', { i: i + 1 })}
                className={`${inputCls} resize-none font-thai flex-1`}
              />
            </div>
          ))}
        </div>
      </div>

      {error && (
        <p className="text-[13px] text-rose-600 bg-rose-50/70 border border-rose-200 rounded-lg px-3 py-2 lang-th:font-thai">
          {error}
        </p>
      )}

      <div className="flex items-center gap-3 flex-wrap">
        <button
          type="submit"
          data-cursor="start"
          disabled={loading || !name.trim() || !description.trim()}
          className="hover-target btn-grad px-6 py-3 rounded-[12px] text-white font-semibold text-[14px] border-0 flex items-center gap-2 disabled:opacity-60 lang-th:font-thai"
        >
          <Save size={14} />
          {mode === 'create' ? t('bv.f.create') : t('bv.f.save')}
        </button>

        {mode === 'edit' && (
          <button
            type="button"
            onClick={handleDelete}
            data-cursor="open"
            className="hover-target ml-auto inline-flex items-center gap-2 px-4 py-3 rounded-[12px] bg-rose-50/70 border border-rose-200 text-rose-700 hover:bg-rose-100/70 font-semibold text-[13px] transition-all lang-th:font-thai"
          >
            <Trash2 size={14} />
            {t('bv.f.delete')}
          </button>
        )}
      </div>
    </form>
  );
}

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

const inputCls =
  'w-full px-4 py-2.5 rounded-[10px] bg-white/55 border border-white/70 text-ink text-[14px] ' +
  'placeholder:text-slate outline-none focus:ring-2 focus:ring-violet/40 focus:bg-white/75 transition-all lang-th:font-thai';
