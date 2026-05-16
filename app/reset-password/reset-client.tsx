'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import {
  AuthCard, AuthLabel, AuthInput, AuthButton,
} from '@/components/auth/auth-card';

type Stage = 'verifying' | 'ready' | 'invalid' | 'success';

export default function ResetClient() {
  const router = useRouter();
  const search = useSearchParams();
  const [stage, setStage]       = useState<Stage>('verifying');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm]   = useState('');
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState<string | null>(null);

  // Establish a session from the recovery link before showing the form.
  // Supabase strips query strings from redirect_to, so the PKCE 'code' lands
  // here directly — we exchange it ourselves.
  useEffect(() => {
    // Demo mode (no Supabase env locally) — just show the form so the page
    // is browsable.
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      setStage('ready');
      return;
    }

    let cancelled = false;
    let settled = false;          // true once we've decided ready or invalid
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    const supabase = createClient();

    function finalise(ready: boolean) {
      if (cancelled || settled) return;   // ← never override a prior decision
      settled = true;
      if (timeoutId) { clearTimeout(timeoutId); timeoutId = null; }
      if (typeof window !== 'undefined' && window.location.hash.includes('access_token')) {
        history.replaceState(null, '', window.location.pathname);
      }
      setStage(ready ? 'ready' : 'invalid');
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'PASSWORD_RECOVERY' || (event === 'SIGNED_IN' && session)) {
          finalise(true);
        }
      },
    );

    (async () => {
      // Manual hash-token rescue for non-PKCE redirects.
      if (typeof window !== 'undefined' && window.location.hash.includes('access_token')) {
        const hashParams = new URLSearchParams(window.location.hash.slice(1));
        const access_token  = hashParams.get('access_token');
        const refresh_token = hashParams.get('refresh_token');
        if (access_token && refresh_token) {
          await supabase.auth.setSession({ access_token, refresh_token }).catch(() => {});
        }
      }
      const { data: { session } } = await supabase.auth.getSession();
      if (session) finalise(true);
    })();

    timeoutId = setTimeout(() => finalise(false), 4000);

    return () => {
      cancelled = true;
      subscription.unsubscribe();
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [search]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError('รหัสผ่านต้องอย่างน้อย 8 ตัวอักษร');
      return;
    }
    if (password !== confirm) {
      setError('รหัสผ่านไม่ตรงกัน');
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { error: authErr } = await supabase.auth.updateUser({ password });
    if (authErr) {
      setError(authErr.message);
      setLoading(false);
      return;
    }
    setStage('success');
    setTimeout(() => router.push('/dashboard'), 1500);
  }

  if (stage === 'verifying') {
    return (
      <AuthCard title="กำลังตรวจสอบลิงก์..." subtitle="โปรดรอสักครู่">
        <div className="text-center py-10">
          <div className="w-12 h-12 mx-auto rounded-full border-2 border-violet/30 border-t-violet animate-spin" />
        </div>
      </AuthCard>
    );
  }

  if (stage === 'invalid') {
    return (
      <AuthCard
        title="ลิงก์ไม่ถูกต้องหรือหมดอายุ"
        subtitle="ลิงก์รีเซ็ตใช้ได้ครั้งเดียวและหมดอายุใน 1 ชั่วโมง — ลองขอใหม่อีกครั้ง"
        footer={
          <Link href="/login" data-cursor="go" className="hover-target text-iridescent font-semibold no-underline hover:underline">
            ← เข้าสู่ระบบ
          </Link>
        }
      >
        <div className="text-center py-6">
          <Link
            href="/forgot-password"
            data-cursor="start"
            className="hover-target inline-block btn-grad text-white font-semibold px-6 py-3 rounded-[12px] no-underline lang-th:font-thai"
          >
            ขอลิงก์ใหม่
          </Link>
        </div>
      </AuthCard>
    );
  }

  if (stage === 'success') {
    return (
      <AuthCard title="✦ รีเซ็ตเรียบร้อย" subtitle="กำลังพาคุณไปหน้า dashboard...">
        <div className="text-center py-10">
          <div
            className="w-20 h-20 rounded-full mx-auto mb-5 animate-pulse"
            style={{
              background: 'radial-gradient(circle at 35% 28%, white, var(--mint) 30%, var(--teal) 70%, #2A7B82)',
              boxShadow: '0 12px 30px -8px rgba(110,231,199,0.4)',
            }}
          />
        </div>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      title="ตั้งรหัสผ่านใหม่"
      subtitle="เลือกรหัสที่จำง่ายแต่เดายาก — อย่างน้อย 8 ตัวอักษร"
      footer={
        <Link href="/login" data-cursor="go" className="hover-target text-ink-3 hover:text-iridescent transition-colors no-underline">
          ← กลับไปเข้าสู่ระบบ
        </Link>
      }
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <AuthLabel htmlFor="password">รหัสผ่านใหม่</AuthLabel>
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
        <div>
          <AuthLabel htmlFor="confirm">ยืนยันรหัสผ่าน</AuthLabel>
          <AuthInput
            id="confirm"
            type="password"
            required
            minLength={8}
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="พิมพ์รหัสซ้ำ"
            autoComplete="new-password"
          />
        </div>

        {error && (
          <p className="text-[12px] text-rose-600 bg-rose-50/70 border border-rose-200 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        <AuthButton type="submit" loading={loading}>
          บันทึกรหัสผ่านใหม่
        </AuthButton>
      </form>
    </AuthCard>
  );
}
