'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { StudioForm, type StudioFormData } from './studio-form';
import type { StudioMode, ScriptContent, CaptionContent, ComboContent, BrandVoice } from '@/types';

interface StudioShellProps {
  mode: StudioMode;
  title: string;
  description: string;
  /** Brand voices the user has — passed from server */
  brandVoices?: Array<Pick<BrandVoice, 'id' | 'name'>>;
  /** Result viewer — pass a render-prop that receives `data` */
  renderResult: (state: {
    data: any;
    loading: boolean;
    onRegenerate: () => void;
  }) => React.ReactNode;
}

const ENDPOINT: Record<StudioMode, string> = {
  script:  '/api/generate/script',
  caption: '/api/generate/caption',
  combo:   '/api/generate/combo',
};

export function StudioShell({ mode, title, description, brandVoices = [], renderResult }: StudioShellProps) {
  const search = useSearchParams();
  const projectId = search.get('projectId') ?? undefined;

  const [brandVoiceId, setBrandVoiceId] = useState<string>(search.get('brandVoiceId') ?? '');
  const [data,    setData]    = useState<ScriptContent | CaptionContent | ComboContent | null>(null);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState<string | null>(null);
  const [lastForm, setLastForm] = useState<StudioFormData | null>(null);

  async function callApi(form: StudioFormData) {
    setLoading(true);
    setError(null);

    // Build body — drop duration if caption (API ignores it but cleaner)
    const body: Record<string, unknown> = {
      productName:    form.productName,
      category:       form.category    || undefined,
      targetCustomer: form.targetCustomer || undefined,
      tone:           form.tone,
      platform:       form.platform,
      details:        form.details     || undefined,
    };
    if (mode !== 'caption') body.duration = form.duration;
    if (projectId)    body.projectId    = projectId;
    if (brandVoiceId) body.brandVoiceId = brandVoiceId;

    try {
      const res = await fetch(ENDPOINT[mode], {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(body),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        if (json.code === 'CREDITS_EXHAUSTED') {
          setError('เครดิตหมดแล้ว — กรุณาอัปเกรดแผน');
        } else if (res.status === 401) {
          setError('กรุณาเข้าสู่ระบบก่อนสร้างคอนเทนต์');
        } else if (res.status === 429) {
          setError('คุณส่งคำขอเร็วเกินไป — กรุณารอสักครู่');
        } else {
          setError(json.error || 'เกิดข้อผิดพลาด กรุณาลองใหม่');
        }
        setData(null);
      } else {
        setData(json.data);
        // Smooth scroll to result on mobile (where it's stacked below)
        setTimeout(() => {
          document.getElementById('result-anchor')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 50);
      }
    } catch (e: any) {
      setError(e?.message ?? 'Network error');
      setData(null);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-[1400px] mx-auto flex flex-col gap-6">
      {/* Page header */}
      <div>
        <h1 className="font-display font-bold text-[clamp(28px,3.5vw,42px)] tracking-[-0.025em] text-ink lang-th:font-thai">
          {title}
        </h1>
        <p className="text-ink-3 text-[15px] mt-1 lang-th:font-thai">{description}</p>
        <div className="mt-3 flex flex-wrap gap-2 items-center">
          {projectId && (
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet/10 border border-violet/25 font-mono text-[11px] tracking-wider text-ink-2 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-violet animate-pulse" />
              จะบันทึกในโปรเจกต์ที่เลือก
            </span>
          )}
          {brandVoices.length > 0 && (
            <label className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/55 border border-white/70 font-mono text-[11px] tracking-wider text-ink-3 font-semibold">
              <span>BRAND VOICE</span>
              <select
                value={brandVoiceId}
                onChange={(e) => setBrandVoiceId(e.target.value)}
                className="bg-transparent border-0 outline-none text-ink font-semibold cursor-pointer font-mono"
              >
                <option value="">— ไม่ใช้ —</option>
                {brandVoices.map((bv) => (
                  <option key={bv.id} value={bv.id}>{bv.name}</option>
                ))}
              </select>
            </label>
          )}
        </div>
      </div>

      {/* Form (left) + result (right) — stacked on mobile */}
      <div className="grid grid-cols-1 lg:grid-cols-[480px_1fr] gap-6">
        <div>
          <StudioForm
            mode={mode}
            loading={loading}
            error={error}
            onSubmit={(d) => {
              setLastForm(d);
              callApi(d);
            }}
          />
        </div>
        <div id="result-anchor">
          {renderResult({
            data,
            loading,
            onRegenerate: () => lastForm && callApi(lastForm),
          })}
        </div>
      </div>
    </div>
  );
}
