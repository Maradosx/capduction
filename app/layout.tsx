import type { Metadata } from 'next';
import './globals.css';
import { LanguageProvider } from '@/lib/i18n';
import { CapCursor } from '@/components/cap-cursor';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? 'https://capduction.app'),
  title:       'Capduction — AI Studio for Thai short-form video creators',
  description: 'สตูดิโอ AI สำหรับครีเอเตอร์วิดีโอสั้นไทย ปั้นสคริปต์การพูดและแคปชั่นหน้าจอที่เข้าใจสไตล์ไทย ครบในไฟล์เดียว',
  keywords: [
    'AI script generator',
    'สคริปต์ AI',
    'แคปชั่นไทย',
    'TikTok script',
    'Capduction',
    'AI สำหรับ creator ไทย',
  ],
  icons: {
    icon: [{ url: '/favicon.svg', type: 'image/svg+xml' }],
    apple: [{ url: '/favicon.svg', type: 'image/svg+xml' }],
    shortcut: ['/favicon.svg'],
  },
  manifest: '/manifest.webmanifest',
  openGraph: {
    title:       'Capduction — Smart Scripts, Built By Creators',
    description: 'AI studio between idea and upload — for Thai short-form creators.',
    type:        'website',
    locale:      'th_TH',
    siteName:    'Capduction',
  },
  twitter: {
    card:        'summary_large_image',
    title:       'Capduction — Smart Scripts, Built By Creators',
    description: 'AI studio between idea and upload — for Thai short-form creators.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th" suppressHydrationWarning>
      <body className="antialiased min-h-screen">
        <LanguageProvider>
          <CapCursor />
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
