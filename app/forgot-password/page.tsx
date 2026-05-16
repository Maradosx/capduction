'use client';

import { useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { useT } from '@/lib/i18n';
import {
  AuthCard, AuthLabel, AuthInput, AuthButton,
} from '@/components/auth/auth-card';

export default function ForgotPasswordPage() {
  const t = useT();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const { error: authErr } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (authErr) {
      setError(authErr.message);
      setLoading(false);
      return;
    }
    setSent(true);
    setLoading(false);
  }

  if (sent) {
    return (
      <AuthCard
        title="✦ ส่งลิงก์รีเซ็ตแล้ว"
        subtitle={`ส่งลิงก์รีเซ็ตรหัสผ่านไปที่ ${email} — กดในอีเมลเพื่อตั้งรหัสใหม่`}
        footer={
          <Link href="/login" data-cursor="go" className="hover-target text-iridescent font-semibold no-underline hover:underline">
            ← {t('auth.submit.login')}
          </Link>
        }
      >
        <div className="text-center py-6">
          <div
            className="orb-chrome w-20 h-20 rounded-full mx-auto mb-5"
            style={{
              background: 'radial-gradient(circle at 35% 28%, white, var(--peach) 30%, var(--rose) 70%, var(--pink))',
            }}
          />
          <p className="text-ink-3 text-[14px] leading-relaxed lang-th:font-thai">
            ลิงก์จะหมดอายุใน <strong className="text-ink">1 ชั่วโมง</strong>
          </p>
        </div>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      title="ลืมรหัสผ่าน?"
      subtitle="ใส่อีเมลที่ใช้สมัคร — เราจะส่งลิงก์รีเซ็ตให้"
      footer={
        <>
          จำได้แล้ว?{' '}
          <Link href="/login" data-cursor="go" className="hover-target text-iridescent font-semibold no-underline hover:underline">
            {t('auth.submit.login')}
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <AuthLabel htmlFor="email">{t('auth.email')}</AuthLabel>
          <AuthInput
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            autoComplete="email"
          />
        </div>

        {error && (
          <p className="text-[12px] text-rose-600 bg-rose-50/70 border border-rose-200 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        <AuthButton type="submit" loading={loading}>
          ส่งลิงก์รีเซ็ต
        </AuthButton>
      </form>
    </AuthCard>
  );
}
