'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Save, Trash2 } from 'lucide-react';
import { createProjectAction, updateProjectAction, deleteProjectAction } from '@/app/actions/projects';
import { PROJECT_COLORS } from '@/app/actions/projects-shared';

interface ProjectFormProps {
  mode: 'create' | 'edit';
  initial?: {
    id?: string;
    name?: string;
    description?: string;
    cover_color?: string;
  };
}

export function ProjectForm({ mode, initial }: ProjectFormProps) {
  const router = useRouter();
  const [name,        setName]        = useState(initial?.name ?? '');
  const [description, setDescription] = useState(initial?.description ?? '');
  const [color,       setColor]       = useState(initial?.cover_color ?? PROJECT_COLORS[0]);
  const [loading,     setLoading]     = useState(false);
  const [error,       setError]       = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null); setLoading(true);
    const fd = new FormData();
    fd.set('name', name);
    fd.set('description', description);
    fd.set('cover_color', color);
    if (mode === 'edit' && initial?.id) fd.set('id', initial.id);

    try {
      const res = mode === 'create'
        ? await createProjectAction(fd)
        : await updateProjectAction(fd);
      if (res?.error) {
        setError(res.error);
        setLoading(false);
        return;
      }
      // Create action redirects; edit just refreshes
      if (mode === 'edit') {
        router.refresh();
        setLoading(false);
      }
    } catch (err: any) {
      // NEXT_REDIRECT errors are normal — let them propagate
      if (err?.digest?.startsWith?.('NEXT_REDIRECT')) throw err;
      setError(err?.message ?? 'Error');
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!initial?.id) return;
    if (!confirm('ลบโปรเจกต์นี้? (Generations จะคงอยู่ แต่จะไม่ผูกกับโปรเจกต์)')) return;
    const fd = new FormData();
    fd.set('id', initial.id);
    try {
      await deleteProjectAction(fd);
    } catch (err: any) {
      if (err?.digest?.startsWith?.('NEXT_REDIRECT')) throw err;
    }
  }

  return (
    <form onSubmit={handleSubmit} className="glass-strong rounded-[20px] p-6 md:p-7 flex flex-col gap-5">
      <Field label="ชื่อโปรเจกต์" required>
        <input
          type="text"
          required
          maxLength={60}
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="เช่น ลิปสติกแดงแมตต์ Q3"
          className={inputCls}
        />
      </Field>

      <Field label="คำอธิบาย (ทางเลือก)">
        <textarea
          rows={3}
          maxLength={300}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="แคมเปญลอนช์สีใหม่ — script + caption ทุก channel"
          className={`${inputCls} resize-none`}
        />
      </Field>

      <Field label="สีประจำโปรเจกต์">
        <div className="flex gap-2.5 flex-wrap">
          {PROJECT_COLORS.map((c) => (
            <button
              key={c}
              type="button"
              data-cursor="switch"
              onClick={() => setColor(c)}
              className={`hover-target w-10 h-10 rounded-full transition-all border-2
                ${color === c ? 'border-ink scale-110 shadow-md' : 'border-white/70 hover:scale-105'}`}
              style={{ background: `radial-gradient(circle at 35% 28%, white, ${c} 60%, rgba(94,79,138,0.6))` }}
              aria-label={c}
            />
          ))}
        </div>
      </Field>

      {error && (
        <p className="text-[13px] text-rose-600 bg-rose-50/70 border border-rose-200 rounded-lg px-3 py-2 lang-th:font-thai">
          {error}
        </p>
      )}

      <div className="flex items-center gap-3 flex-wrap">
        <button
          type="submit"
          data-cursor="start"
          disabled={loading || !name.trim()}
          className="hover-target btn-grad px-6 py-3 rounded-[12px] text-white font-semibold text-[14px] border-0 flex items-center gap-2 disabled:opacity-60 lang-th:font-thai"
        >
          <Save size={14} />
          {mode === 'create' ? 'สร้างโปรเจกต์' : 'บันทึก'}
        </button>

        {mode === 'edit' && (
          <button
            type="button"
            onClick={handleDelete}
            data-cursor="open"
            className="hover-target ml-auto inline-flex items-center gap-2 px-4 py-3 rounded-[12px] bg-rose-50/70 border border-rose-200 text-rose-700 hover:bg-rose-100/70 font-semibold text-[13px] transition-all lang-th:font-thai"
          >
            <Trash2 size={14} />
            ลบโปรเจกต์
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
