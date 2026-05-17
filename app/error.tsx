'use client';

import { useEffect } from 'react';
import Link from 'next/link';

/**
 * Page-level error boundary. Catches client errors that escape route handlers
 * and renders a styled fallback within the existing root layout (i18n + nav still mount).
 */
export default function PageError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[PAGE_ERROR]', JSON.stringify({
      message: error.message,
      digest: error.digest,
      stack: error.stack?.split('\n').slice(0, 8).join(' | '),
      url: typeof window !== 'undefined' ? window.location.href : null,
      ts: new Date().toISOString(),
    }));
  }, [error]);

  return (
    <main className="min-h-[70vh] flex items-center justify-center px-6 py-20">
      <div className="glass-strong rounded-[20px] p-8 max-w-[480px] w-full text-center">
        <div className="text-iridescent text-[48px] mb-3 leading-none">✦</div>
        <h1 className="font-display font-bold text-[24px] text-ink mb-2 lang-th:font-thai">
          มีบางอย่างผิดพลาด
        </h1>
        <p className="text-[14px] text-ink-3 leading-relaxed mb-6 lang-th:font-thai">
          เราได้บันทึก error ไว้แล้ว · ลองอีกครั้งได้ หรือถ้ายังเจอ
          ติดต่อ <a href="mailto:hello@capduction.com" className="text-iridescent hover:underline">hello@capduction.com</a>
        </p>

        {error.digest && (
          <p className="font-mono text-[10px] text-ink-3 opacity-70 mb-6 tracking-wider">
            Error ID · {error.digest}
          </p>
        )}

        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={reset}
            data-cursor="start"
            className="hover-target btn-grad px-6 py-2.5 rounded-[10px] text-white font-semibold text-[13px] border-0"
          >
            ลองอีกครั้ง
          </button>
          <Link
            href="/"
            data-cursor="go"
            className="hover-target px-6 py-2.5 rounded-[10px] bg-white/65 border border-white/80 text-ink font-semibold text-[13px] no-underline hover:bg-white/85"
          >
            กลับหน้าแรก
          </Link>
        </div>
      </div>
    </main>
  );
}
