'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useT } from '@/lib/i18n';
import {
  AuthCard, AuthLabel, AuthInput, AuthButton, AuthDivider, AuthOAuthButton,
} from '@/components/auth/auth-card';

type Method = 'magic' | 'password';

export default function SignupClient() {
  const t = useT();
  const search = useSearchParams();

  const [method, setMethod]   = useState<Method>('magic');
  const [email, setEmail]     = useState(search.get('email') ?? '');
  const [password, setPwd]    = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);
  const [sent, setSent]       = useState(false);

  async function handleMagic(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const supabase = createClient();
    const { error: authErr } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
        shouldCreateUser: true,
      },
    });
    setLoading(false);
    if (authErr) { setError(authErr.message); return; }
    setSent(true);
  }

  async function handlePassword(e: React.FormEvent) {
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
    setLoading(false);
    if (authErr) { setError(authErr.message); return; }
    setSent(true);
  }

  async function handleGoogle() {
    setLoading(true);
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  }

  if (sent) {
    return (
      <AuthCard
        title={t('auth.magic.sent.title')}
        subtitle={t('auth.magic.sent.sub').replace('{email}', email)}
        footer={
          <Link href="/login" data-cursor="go" className="hover-target text-iridescent font-semibold no-underline hover:underline">
            ← {t('auth.submit.login')}
          </Link>
        }
      >
        <div className="text-center py-6">
          <div className="mx-auto mb-5 w-20 h-20 rounded-[20px] flex items-center justify-center"
               style={{
                 background: 'linear-gradient(135deg, #C4B5FD 0%, #F0ABFC 50%, #FBA98C 100%)',
                 boxShadow: '0 20px 40px -10px rgba(124,58,237,0.35)',
               }}>
            <span className="text-white text-[36px]">✉︎</span>
          </div>
          <p className="text-ink-3 text-[13px] leading-relaxed lang-th:font-thai">
            {t('auth.check_spam')}
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
      <div className="grid grid-cols-2 gap-1 p-1 bg-white/40 rounded-[12px] mb-5 border border-white/60">
        <MethodTab active={method === 'magic'} onClick={() => setMethod('magic')}>
          ✦ {t('auth.method.magic')}
        </MethodTab>
        <MethodTab active={method === 'password'} onClick={() => setMethod('password')}>
          {t('auth.method.password')}
        </MethodTab>
      </div>

      {method === 'magic' ? (
        <form onSubmit={handleMagic} className="flex flex-col gap-4">
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
            <p className="text-[11px] text-ink-3 mt-2 lang-th:font-thai leading-relaxed">
              {t('auth.magic.hint')}
            </p>
          </div>
          {error && <ErrorBox>{error}</ErrorBox>}
          <AuthButton type="submit" loading={loading}>
            ✦ {t('auth.magic.send')}
          </AuthButton>
        </form>
      ) : (
        <form onSubmit={handlePassword} className="flex flex-col gap-4">
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
              onChange={(e) => setPwd(e.target.value)}
              placeholder="อย่างน้อย 8 ตัวอักษร"
              autoComplete="new-password"
            />
          </div>
          {error && <ErrorBox>{error}</ErrorBox>}
          <AuthButton type="submit" loading={loading}>
            {t('auth.submit.signup')}
          </AuthButton>
        </form>
      )}

      <AuthDivider label={t('auth.or')} />

      <AuthOAuthButton provider="google" onClick={handleGoogle} type="button">
        {t('auth.google')}
      </AuthOAuthButton>

      <p className="text-[11px] text-ink-3 text-center mt-4 lang-th:font-thai">
        กด {t('auth.submit.signup')} = ยอมรับ{' '}
        <Link href="/terms" data-cursor="read" className="hover-target underline">Terms</Link>{' '}
        และ{' '}
        <Link href="/privacy" data-cursor="read" className="hover-target underline">Privacy Policy</Link>
      </p>
    </AuthCard>
  );
}

function MethodTab({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      data-cursor="go"
      className={`hover-target py-2.5 rounded-[9px] text-[13px] font-semibold transition-all lang-th:font-thai
        ${active
          ? 'btn-grad text-white shadow-[0_4px_12px_-2px_rgba(124,58,237,0.4)]'
          : 'text-ink-3 hover:text-ink hover:bg-white/55 bg-transparent'}`}
    >
      {children}
    </button>
  );
}

function ErrorBox({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[12px] text-rose-600 bg-rose-50/70 border border-rose-200 rounded-lg px-3 py-2">
      {children}
    </p>
  );
}
