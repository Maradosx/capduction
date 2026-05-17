'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useT } from '@/lib/i18n';
import {
  AuthCard, AuthLabel, AuthInput, AuthButton, AuthDivider, AuthOAuthButton,
} from '@/components/auth/auth-card';

type Method = 'magic' | 'password';

/** Only allow same-origin paths for the ?next= redirect. */
function safeNext(raw: string | null): string {
  if (!raw) return '/dashboard';
  if (!raw.startsWith('/') || raw.startsWith('//') || raw.startsWith('/\\')) {
    return '/dashboard';
  }
  return raw;
}

export default function LoginClient() {
  const t = useT();
  const router = useRouter();
  const search = useSearchParams();
  const next = safeNext(search.get('next'));

  const [method, setMethod]   = useState<Method>('magic');
  const [email, setEmail]     = useState(search.get('email') ?? '');
  const [password, setPwd]    = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);
  const [magicSent, setSent]  = useState(false);

  async function handlePassword(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const supabase = createClient();
    const { error: authErr } = await supabase.auth.signInWithPassword({ email, password });
    if (authErr) { setError(authErr.message); setLoading(false); return; }
    router.push(next);
    router.refresh();
  }

  async function handleMagic(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const supabase = createClient();
    // Forward `next` through the magic-link callback so deep-link lands right.
    const callbackUrl = new URL('/auth/callback', window.location.origin);
    if (next !== '/dashboard') callbackUrl.searchParams.set('next', next);
    const { error: authErr } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: callbackUrl.toString() },
    });
    setLoading(false);
    if (authErr) { setError(authErr.message); return; }
    setSent(true);
  }

  async function handleGoogle() {
    setLoading(true);
    try {
      const supabase = createClient();
      const callbackUrl = new URL('/auth/callback', window.location.origin);
      if (next !== '/dashboard') callbackUrl.searchParams.set('next', next);
      const { error: oauthErr } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: callbackUrl.toString() },
      });
      // If OAuth dispatch failed (popup blocked, network, etc), surface it.
      // On success the browser navigates away and this code never runs.
      if (oauthErr) setError(oauthErr.message);
    } finally {
      // Always reset — if user cancels/closes popup or navigation is blocked,
      // the button must come back to life.
      setLoading(false);
    }
  }

  if (magicSent) {
    return (
      <MagicSentPanel
        email={email}
        onResend={() => setSent(false)}
        next={next}
      />
    );
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
      {/* Method tabs */}
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
              onChange={(e) => setPwd(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </div>
          {error && <ErrorBox>{error}</ErrorBox>}
          <AuthButton type="submit" loading={loading}>
            {t('auth.submit.login')}
          </AuthButton>
        </form>
      )}

      <AuthDivider label={t('auth.or')} />

      <AuthOAuthButton provider="google" onClick={handleGoogle} type="button">
        {t('auth.google')}
      </AuthOAuthButton>
    </AuthCard>
  );
}

/**
 * Magic-link confirmation panel.
 *
 * Edge case it handles: macOS opens email links in the system default browser
 * (often Chrome) — even if the user clicked "send" from Safari. The session
 * ends up in the wrong browser and the original tab sits forever.
 *
 * Fix: poll for a session in *this* browser (works if user opens the link
 * here), AND offer a paste-the-link fallback for the cross-browser case —
 * extracts ?code= and exchanges it locally.
 */
function MagicSentPanel({ email, onResend, next }: { email: string; onResend: () => void; next: string }) {
  const t = useT();
  const router = useRouter();
  const [pasted, setPasted] = useState('');
  const [exchanging, setExchanging] = useState(false);
  const [pasteErr, setPasteErr] = useState<string | null>(null);

  // Auto-detect if the user clicks the email link in THIS browser: poll for a
  // session. If one appears, redirect immediately.
  useEffect(() => {
    let cancelled = false;
    const supabase = createClient();
    const tick = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (cancelled) return;
      if (session) {
        router.push(next);
        router.refresh();
      }
    };
    const id = setInterval(tick, 2000);
    return () => { cancelled = true; clearInterval(id); };
  }, [router, next]);

  async function handlePaste(e: React.FormEvent) {
    e.preventDefault();
    setPasteErr(null);
    let code: string | null = null;
    try {
      const url = new URL(pasted.trim());
      code = url.searchParams.get('code');
    } catch {
      setPasteErr(t('auth.paste.invalid'));
      return;
    }
    if (!code) {
      setPasteErr(t('auth.paste.no_code'));
      return;
    }
    setExchanging(true);
    const supabase = createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    setExchanging(false);
    if (error) {
      setPasteErr(error.message);
      return;
    }
    router.push(next);
    router.refresh();
  }

  return (
    <AuthCard
      title={t('auth.magic.sent.title')}
      subtitle={t('auth.magic.sent.sub').replace('{email}', email)}
      footer={
        <button
          type="button"
          onClick={onResend}
          data-cursor="go"
          className="hover-target text-iridescent font-semibold no-underline hover:underline bg-transparent border-0 cursor-pointer"
        >
          {t('auth.magic.resend')}
        </button>
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

      {/* Cross-browser fallback — paste the link from email to sign in here */}
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
            placeholder="https://capduction.com/auth/callback?code=..."
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
