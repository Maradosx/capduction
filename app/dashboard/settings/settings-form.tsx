'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Save, CreditCard, LogOut, Check, Upload, Trash2, Loader2 } from 'lucide-react';
import { TONES, PLATFORMS, DURATIONS } from '@/types';
import { useT } from '@/lib/i18n';
import { updateProfileAction, updateSettingsAction } from '@/app/actions/settings';
import { uploadAvatarAction, removeAvatarAction } from '@/app/actions/avatar';

interface Defaults {
  full_name:        string;
  company_name:     string;
  default_platform: string;
  default_tone:     string;
  default_duration: string;
  brand_voice:      string;
}

export function SettingsForm({
  defaults, email, plan, avatarUrl, isDemoMode,
}: {
  defaults: Defaults;
  email: string;
  plan: string;
  avatarUrl: string | null;
  isDemoMode: boolean;
}) {
  const t = useT();
  const router = useRouter();
  const [d, setD] = useState<Defaults>(defaults);
  const [saving, setSaving] = useState(false);
  const [saved,  setSaved]  = useState(false);
  const [error,  setError]  = useState<string | null>(null);
  const [avatar, setAvatar] = useState<string | null>(avatarUrl);
  const [avatarBusy, setAvatarBusy] = useState<'upload' | 'remove' | null>(null);
  const [avatarErr, setAvatarErr]   = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleAvatarFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = '';  // allow re-selecting the same file
    if (!file) return;
    setAvatarErr(null);

    if (isDemoMode) {
      // Demo mode — local preview only
      setAvatarBusy('upload');
      const reader = new FileReader();
      reader.onload = () => {
        setAvatar(reader.result as string);
        setAvatarBusy(null);
      };
      reader.readAsDataURL(file);
      return;
    }

    setAvatarBusy('upload');
    const fd = new FormData();
    fd.set('avatar', file);
    const res = await uploadAvatarAction(fd);
    setAvatarBusy(null);
    if (res.error) { setAvatarErr(res.error); return; }
    if (res.url) {
      setAvatar(res.url);
      router.refresh();
    }
  }

  async function handleAvatarRemove() {
    setAvatarErr(null);
    if (isDemoMode) { setAvatar(null); return; }
    setAvatarBusy('remove');
    const res = await removeAvatarAction();
    setAvatarBusy(null);
    if (res.error) { setAvatarErr(res.error); return; }
    setAvatar(null);
    router.refresh();
  }

  const initial = (d.full_name || email).charAt(0).toUpperCase();

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setError(null); setSaving(true); setSaved(false);

    if (isDemoMode) {
      // Demo mode — just show saved animation
      setTimeout(() => { setSaving(false); setSaved(true); }, 600);
      setTimeout(() => setSaved(false), 2000);
      return;
    }

    const profileFd = new FormData();
    profileFd.set('full_name', d.full_name);
    const profRes = await updateProfileAction(profileFd);
    if (profRes.error) { setError(profRes.error); setSaving(false); return; }

    const settingsFd = new FormData();
    settingsFd.set('company_name',     d.company_name);
    settingsFd.set('default_platform', d.default_platform);
    settingsFd.set('default_tone',     d.default_tone);
    settingsFd.set('default_duration', d.default_duration);
    settingsFd.set('brand_voice',      d.brand_voice);
    const setRes = await updateSettingsAction(settingsFd);
    if (setRes.error) { setError(setRes.error); setSaving(false); return; }

    setSaving(false); setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <form onSubmit={handleSave} className="flex flex-col gap-6">
      {/* ── Avatar block ──────────────────────────── */}
      <Card title={t('set.avatar.title')}>
        <div className="flex items-center gap-5 flex-wrap">
          <div className="relative">
            <div
              className="w-24 h-24 rounded-full overflow-hidden flex items-center justify-center
                         bg-gradient-to-br from-pink to-violet text-white font-display
                         text-[42px] font-bold border-2 border-white/80
                         shadow-[0_12px_24px_-8px_rgba(124,58,237,0.4)]"
            >
              {avatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                initial
              )}
            </div>
            {avatarBusy && (
              <div className="absolute inset-0 rounded-full bg-ink/40 backdrop-blur-sm
                              flex items-center justify-center">
                <Loader2 size={20} className="text-white animate-spin" />
              </div>
            )}
          </div>

          <div className="flex flex-col gap-2 flex-1 min-w-[200px]">
            <div className="flex gap-2 flex-wrap">
              <button
                type="button"
                data-cursor="start"
                disabled={!!avatarBusy}
                onClick={() => fileRef.current?.click()}
                className="hover-target inline-flex items-center gap-2 px-4 py-2.5 rounded-[10px]
                           btn-grad text-white font-semibold text-[13px] border-0
                           disabled:opacity-60 lang-th:font-thai"
              >
                <Upload size={14} />
                {avatar ? t('set.avatar.change') : t('set.avatar.upload')}
              </button>
              {avatar && (
                <button
                  type="button"
                  data-cursor="start"
                  disabled={!!avatarBusy}
                  onClick={handleAvatarRemove}
                  className="hover-target inline-flex items-center gap-2 px-4 py-2.5 rounded-[10px]
                             bg-white/65 border border-white/80 text-ink-3 hover:text-rose-600
                             hover:bg-rose-50/70 hover:border-rose-200 font-semibold text-[13px]
                             disabled:opacity-60 transition-all lang-th:font-thai"
                >
                  <Trash2 size={14} />
                  {t('set.avatar.remove')}
                </button>
              )}
            </div>
            <p className="text-[11px] text-ink-3 lang-th:font-thai">{t('set.avatar.hint')}</p>
            {avatarErr && (
              <p className="text-[12px] text-rose-600 lang-th:font-thai">{avatarErr}</p>
            )}
          </div>

          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={handleAvatarFile}
            className="hidden"
          />
        </div>
      </Card>

      {/* ── Account block ─────────────────────────── */}
      <Card title={t('set.account')}>
        <Field label={t('set.email_ro')}>
          <input value={email} disabled className={inputCls + ' opacity-60'} />
        </Field>
        <Field label={t('set.display_name')}>
          <input
            value={d.full_name}
            onChange={(e) => setD({ ...d, full_name: e.target.value })}
            placeholder={t('set.display_name.ph')}
            className={inputCls}
          />
        </Field>
        <Field label={t('set.company')}>
          <input
            value={d.company_name}
            onChange={(e) => setD({ ...d, company_name: e.target.value })}
            placeholder={t('set.company.ph')}
            className={inputCls}
          />
        </Field>
      </Card>

      {/* ── Defaults block ────────────────────────── */}
      <Card title={t('set.defaults')}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Field label={t('set.platform')}>
            <select value={d.default_platform} onChange={(e) => setD({ ...d, default_platform: e.target.value })} className={inputCls}>
              {PLATFORMS.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          </Field>
          <Field label={t('set.tone')}>
            <select value={d.default_tone} onChange={(e) => setD({ ...d, default_tone: e.target.value })} className={inputCls}>
              {TONES.map((tone) => <option key={tone} value={tone}>{tone}</option>)}
            </select>
          </Field>
          <Field label={t('set.duration')}>
            <select value={d.default_duration} onChange={(e) => setD({ ...d, default_duration: e.target.value })} className={inputCls}>
              {DURATIONS.map((dr) => <option key={dr} value={dr}>{dr}</option>)}
            </select>
          </Field>
        </div>
      </Card>

      {/* ── Brand voice ───────────────────────────── */}
      <Card title={t('set.bv')}>
        <textarea
          rows={5}
          value={d.brand_voice}
          onChange={(e) => setD({ ...d, brand_voice: e.target.value })}
          placeholder={t('set.bv.ph')}
          className={`${inputCls} resize-none font-thai`}
        />
        <p className="text-[11px] text-ink-3 lang-th:font-thai">{t('set.bv.hint')}</p>
      </Card>

      {/* ── Save row ──────────────────────────────── */}
      {error && (
        <p className="text-[13px] text-rose-600 bg-rose-50/70 border border-rose-200 rounded-lg px-3 py-2 lang-th:font-thai">
          {error}
        </p>
      )}
      <div className="flex items-center gap-3 flex-wrap">
        <button
          type="submit"
          data-cursor="start"
          disabled={saving}
          className="hover-target btn-grad px-6 py-3 rounded-[12px] text-white font-semibold text-[14px] border-0 flex items-center gap-2 disabled:opacity-60 lang-th:font-thai"
        >
          {saved ? <><Check size={14} /> {t('set.saved')}</> : <><Save size={14} /> {t('set.save')}</>}
        </button>
        <Link
          href={plan === 'free' ? '/pricing' : '/api/billing/portal'}
          data-cursor="go"
          className="hover-target inline-flex items-center gap-2 px-5 py-3 rounded-[12px] bg-white/65 border border-white/80 text-ink-2 hover:bg-white/85 font-semibold text-[14px] no-underline transition-all lang-th:font-thai"
        >
          <CreditCard size={14} />
          {plan === 'free'
            ? t('set.upgrade_btn')
            : t('set.manage_billing', { plan: plan === 'studio' ? 'Studio' : 'Agency' })}
        </Link>
        {!isDemoMode && (
          <form action="/auth/signout" method="post" className="m-0 ml-auto">
            <button
              type="submit"
              data-cursor="start"
              className="hover-target inline-flex items-center gap-2 px-5 py-3 rounded-[12px] bg-rose-50/70 border border-rose-200 text-rose-700 hover:bg-rose-100/70 font-semibold text-[14px] transition-all lang-th:font-thai"
            >
              <LogOut size={14} />
              {t('set.logout')}
            </button>
          </form>
        )}
      </div>
    </form>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="glass-strong rounded-[18px] p-6 flex flex-col gap-4">
      <h2 className="font-mono text-[10px] tracking-[0.22em] uppercase text-ink-3 font-semibold lang-th:font-thai lang-th:normal-case lang-th:tracking-normal">
        — {title}
      </h2>
      {children}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block font-mono text-[10px] tracking-[0.18em] text-ink-3 uppercase mb-1.5 font-semibold lang-th:font-thai lang-th:normal-case lang-th:tracking-normal">
        {label}
      </span>
      {children}
    </label>
  );
}

const inputCls =
  'w-full px-4 py-2.5 rounded-[10px] bg-white/55 border border-white/70 text-ink text-[14px] ' +
  'placeholder:text-slate outline-none focus:ring-2 focus:ring-violet/40 focus:bg-white/75 transition-all lang-th:font-thai';
