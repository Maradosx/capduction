'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import {
  AuthCard, AuthLabel, AuthInput, AuthButton,
} from '@/components/auth/auth-card';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

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
    setSuccess(true);
    setLoading(false);
    setTimeout(() => router.push('/dashboard'), 2000);
  }

  if (success) {
    return (
      <AuthCard
        title="✦ รีเซ็ตเรียบร้อย"
        subtitle="กำลังพาคุณไปหน้า dashboard..."
      >
        <div className="text-center py-8">
          <div
            className="orb-chrome w-20 h-20 rounded-full mx-auto mb-5 animate-pulse"
            style={{
              background: 'radial-gradient(circle at 35% 28%, white, var(--mint) 30%, var(--teal) 70%, #2A7B82)',
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
