'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
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
      setError(t('auth.pwd.min'));
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
    try {
      const supabase = createClient();
      const { error: oauthErr } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: `${window.location.origin}/auth/callback` },
      });
      if (oauthErr) setError(oauthErr.message);
    } finally {
      // Reset so the button comes back to life if the popup is closed/blocked.
      setLoading(false);
    }
  }

  if (sent) {
    return <SignupSentPanel email={email} />;
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
              placeholder={t("hero.email.placeholder")}
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
              placeholder={t("hero.email.placeholder")}
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
              placeholder={t('auth.pwd.ph')}
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

      <TermsConsent />
    </AuthCard>
  );
}

/**
 * Magic-link sent confirmation for signup. Mirrors login's MagicSentPanel
 * — polls for a session (auto-login if email is clicked in this browser)
 * and offers a paste-the-link fallback for the cross-browser case (macOS
 * opens links in default browser, often Chrome, even if you clicked send
 * from Safari).
 */
function SignupSentPanel({ email }: { email: string }) {
  const t = useT();
  const router = useRouter();
  const [pasted, setPasted] = useState('');
  const [exchanging, setExchanging] = useState(false);
  const [pasteErr, setPasteErr] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const supabase = createClient();
    const tick = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (cancelled) return;
      if (session) {
        router.push('/dashboard');
        router.refresh();
      }
    };
    const id = setInterval(tick, 2000);
    return () => { cancelled = true; clearInterval(id); };
  }, [router]);

  async function handlePaste(e: React.FormEvent) {
    e.preventDefault();
    setPasteErr(null);

    let url: URL;
    try {
      url = new URL(pasted.trim());
    } catch {
      setPasteErr(t('auth.paste.invalid'));
      return;
    }

    // Two URL shapes (see login-client for the full rationale):
    //  1. Supabase verify URL (...supabase.co/auth/v1/verify?token=…)
    //     → navigate, let Supabase redirect → /auth/callback runs PKCE exchange.
    //  2. Our own callback URL (?code=…) → exchange directly.
    const allowed =
      url.hostname.endsWith('.supabase.co') ||
      url.hostname === window.location.hostname;
    if (!allowed) {
      setPasteErr(t('auth.paste.invalid'));
      return;
    }

    const code = url.searchParams.get('code');
    if (code) {
      setExchanging(true);
      const supabase = createClient();
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      setExchanging(false);
      if (error) {
        setPasteErr(error.message);
        return;
      }
      router.push('/dashboard');
      router.refresh();
      return;
    }

    setExchanging(true);
    window.location.href = url.toString();
  }

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
      <div className="text-center py-4">
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

      <details className="mt-5 group glass rounded-[12px] overflow-hidden">
        <summary className="hover-target cursor-pointer px-4 py-3 text-[12px] font-semibold text-ink-3 flex items-center justify-between gap-3 list-none lang-th:font-thai">
          <span>{t('auth.paste.title')}</span>
          <span className="text-ink-3 text-[18px] leading-none group-open:rotate-45 transition-transform">+</span>
        </summary>
        <form onSubmit={handlePaste} className="px-4 pb-4 pt-1 flex flex-col gap-2.5">
          <p className="text-[11px] text-ink-3 leading-relaxed lang-th:font-thai">
            {t('auth.paste.hint')}
          </p>
          <input
            type="url"
            value={pasted}
            onChange={(e) => setPasted(e.target.value)}
            placeholder="https://...supabase.co/auth/v1/verify?token=..."
            className="w-full px-3 py-2 rounded-[8px] bg-white/55 border border-white/70 text-ink text-[12px] font-mono outline-none focus:ring-2 focus:ring-violet/40"
          />
          {pasteErr && (
            <p className="text-[11px] text-rose-600 lang-th:font-thai">{pasteErr}</p>
          )}
          <button
            type="submit"
            disabled={exchanging || !pasted.trim()}
            data-cursor="start"
            className="hover-target btn-grad px-4 py-2 rounded-[8px] text-white font-semibold text-[12px] border-0 disabled:opacity-50 lang-th:font-thai"
          >
            {exchanging ? t('auth.paste.signing_in') : t('auth.paste.signin')}
          </button>
        </form>
      </details>
    </AuthCard>
  );
}

function TermsConsent() {
  const t = useT();
  // Build "By creating an account... {terms} and {privacy}" with real links inline
  const template = t('auth.terms_consent');
  const parts = template.split(/\{terms\}|\{privacy\}/);
  return (
    <p className="text-[11px] text-ink-3 text-center mt-4 lang-th:font-thai">
      {parts[0]}
      <Link href="/terms" data-cursor="read" className="hover-target underline">{t('auth.terms_link')}</Link>
      {parts[1]}
      <Link href="/privacy" data-cursor="read" className="hover-target underline">{t('auth.privacy_link')}</Link>
      {parts[2]}
    </p>
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
