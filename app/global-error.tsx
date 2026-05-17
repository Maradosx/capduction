'use client';

import { useEffect } from 'react';

/**
 * Last-resort error boundary — catches errors in the root layout itself.
 * Lives outside the i18n provider, so all copy is bilingual + minimal.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[GLOBAL_ERROR]', JSON.stringify({
      message: error.message,
      digest: error.digest,
      stack: error.stack?.split('\n').slice(0, 8).join(' | '),
      url: typeof window !== 'undefined' ? window.location.href : null,
      ts: new Date().toISOString(),
    }));
  }, [error]);

  return (
    <html>
      <body style={{
        margin: 0, padding: 0, minHeight: '100vh',
        background: 'linear-gradient(135deg, #fef3f8 0%, #f5f3ff 100%)',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <div style={{
          maxWidth: 480, padding: '36px 32px',
          background: 'rgba(255,255,255,0.7)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.8)',
          borderRadius: 20,
          boxShadow: '0 24px 48px -12px rgba(124,58,237,0.15)',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>✦</div>
          <h1 style={{ fontSize: 24, fontWeight: 800, margin: '0 0 8px', color: '#1f1235' }}>
            Something broke
          </h1>
          <p style={{ fontSize: 14, color: '#6b6080', margin: '0 0 8px', lineHeight: 1.6 }}>
            มีข้อผิดพลาดเกิดขึ้น · เราได้บันทึกไว้แล้วและจะแก้ไขให้
          </p>
          <p style={{ fontSize: 14, color: '#6b6080', margin: '0 0 24px', lineHeight: 1.6 }}>
            Something went wrong. We logged it and are on it.
          </p>
          {error.digest && (
            <p style={{
              fontSize: 11, fontFamily: 'monospace', color: '#9b8fbd',
              marginBottom: 24, opacity: 0.7,
            }}>
              Error ID · {error.digest}
            </p>
          )}
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={reset}
              style={{
                padding: '11px 22px', borderRadius: 10,
                background: 'linear-gradient(135deg, #b58fff 0%, #ff8fb5 100%)',
                color: 'white', fontWeight: 600, fontSize: 13,
                border: 0, cursor: 'pointer',
              }}
            >
              Try again
            </button>
            <a
              href="/"
              style={{
                padding: '11px 22px', borderRadius: 10,
                background: 'rgba(255,255,255,0.65)',
                border: '1px solid rgba(255,255,255,0.8)',
                color: '#1f1235', fontWeight: 600, fontSize: 13,
                textDecoration: 'none', display: 'inline-block',
              }}
            >
              Back home
            </a>
          </div>
          <p style={{ fontSize: 11, color: '#9b8fbd', marginTop: 28 }}>
            ติดอยู่? <a href="mailto:hello@capduction.com" style={{ color: '#b58fff' }}>hello@capduction.com</a>
          </p>
        </div>
      </body>
    </html>
  );
}
