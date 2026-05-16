'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useT } from '@/lib/i18n';
import {
  AuthCard, AuthLabel, AuthInput, AuthButton, AuthDivider, AuthOAuthButton,
} from '@/components/auth/auth-card';

export default function LoginClient() {
  const t = useT();
  const router = useRouter();
  const search = useSearchParams();

  const [email, setEmail] = useState(search.get('email') ?? '');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const { error: authErr } = await supabase.auth.signInWithPassword({ email, password });

    if (authErr) {
      setError(authErr.message);
      setLoading(false);
      return;
    }
    router.push('/dashboard');
    router.refresh();
  }

  async function handleGoogle() {
    setLoading(true);
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  }

  return (
    <AuthCard
      title={t('auth.login.title')}
      subtitle={t('auth.login.sub')}
      footer={
        <>
          {t('auth.no_account')}{' '}
          <Link href="/signup" data-cursor="go" className="hover-target text-iridescent font-semibold no-underline hover:underline">
            {t('auth.submit.signup')}
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
          <div className="flex justify-between items-baseline mb-2">
            <AuthLabel htmlFor="password">{t('auth.password')}</AuthLabel>
            <Link
              href="/forgot-password"
              data-cursor="go"
              className="hover-target text-[11px] text-ink-3 hover:text-iridescent transition-colors lang-th:font-thai no-underline"
            >
              {t('auth.forgot')}
            </Link>
          </div>
          <AuthInput
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            autoComplete="current-password"
          />
        </div>

        {error && (
          <p className="text-[12px] text-rose-600 bg-rose-50/70 border border-rose-200 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        <AuthButton type="submit" loading={loading}>
          {t('auth.submit.login')}
        </AuthButton>

        <AuthDivider label={t('auth.or')} />

        <AuthOAuthButton provider="google" onClick={handleGoogle} type="button">
          {t('auth.google')}
        </AuthOAuthButton>
      </form>
    </AuthCard>
  );
}
