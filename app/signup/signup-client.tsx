'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useT } from '@/lib/i18n';
import {
  AuthCard, AuthLabel, AuthInput, AuthButton, AuthDivider, AuthOAuthButton,
} from '@/components/auth/auth-card';

export default function SignupClient() {
  const t = useT();
  const router = useRouter();
  const search = useSearchParams();

  const [email, setEmail] = useState(search.get('email') ?? '');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    setLoading(true);

    const supabase = createClient();
    const { error: authErr } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    });

    if (authErr) {
      setError(authErr.message);
      setLoading(false);
      return;
    }
    setSuccess(true);
    setLoading(false);
  }

  async function handleGoogle() {
    setLoading(true);
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  }

  if (success) {
    return (
      <AuthCard
        title="✦ ตรวจอีเมลของคุณ"
        subtitle={`ส่งลิงก์ยืนยันไปที่ ${email} แล้ว — กดในอีเมลเพื่อยืนยันบัญชี`}
        footer={
          <Link href="/login" data-cursor="go" className="hover-target text-iridescent font-semibold no-underline hover:underline">
            ← กลับไปเข้าสู่ระบบ
          </Link>
        }
      >
        <div className="text-center py-8">
          <div
            className="orb-chrome w-20 h-20 rounded-full mx-auto mb-5"
            style={{
              background: 'radial-gradient(circle at 35% 28%, white, var(--mint) 30%, var(--teal) 70%, #2A7B82)',
            }}
          />
          <p className="text-ink-3 text-[14px] leading-relaxed lang-th:font-thai">
            ถ้าไม่เห็นในกล่องจดหมาย ลองเช็คใน <strong className="text-ink">Spam / Junk</strong>
          </p>
        </div>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      title={t('auth.signup.title')}
      subtitle={t('auth.signup.sub')}
      footer={
        <>
          {t('auth.have_account')}{' '}
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

        <div>
          <AuthLabel htmlFor="password">{t('auth.password')}</AuthLabel>
          <AuthInput
            id="password"
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="อย่างน้อย 8 ตัวอักษร"
            autoComplete="new-password"
          />
        </div>

        {error && (
          <p className="text-[12px] text-rose-600 bg-rose-50/70 border border-rose-200 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        <AuthButton type="submit" loading={loading}>
          {t('auth.submit.signup')}
        </AuthButton>

        <AuthDivider label={t('auth.or')} />

        <AuthOAuthButton provider="google" onClick={handleGoogle} type="button">
          {t('auth.google')}
        </AuthOAuthButton>

        <p className="text-[11px] text-ink-3 text-center mt-2 lang-th:font-thai">
          กด {t('auth.submit.signup')} = ยอมรับ{' '}
          <Link href="/terms" data-cursor="read" className="hover-target underline">Terms</Link>{' '}
          และ{' '}
          <Link href="/privacy" data-cursor="read" className="hover-target underline">Privacy Policy</Link>
        </p>
      </form>
    </AuthCard>
  );
}
