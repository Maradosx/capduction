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
      // The /reset-password page itself exchanges the PKCE code (Supabase
      // strips query strings from redirect_to, so we can't route through
      // /auth/callback?next=… — the destination page has to handle the
      // exchange directly).
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
        title={t('auth.forgot.sent.title')}
        subtitle={t('auth.forgot.sent.sub').replace('{email}', email)}
        footer={
          <Link href="/login" data-cursor="go" className="hover-target text-iridescent font-semibold no-underline hover:underline">
            {t('auth.back_to_login')}
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
        </div>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      title={t('auth.forgot.title')}
      subtitle={t('auth.forgot.sub')}
      footer={
        <Link href="/login" data-cursor="go" className="hover-target text-iridescent font-semibold no-underline hover:underline">
          {t('auth.back_to_login')}
        </Link>
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
          {t('auth.forgot.send')}
        </AuthButton>
      </form>
    </AuthCard>
  );
}
