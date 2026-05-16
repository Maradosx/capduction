import Link from 'next/link';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { CapNav } from '@/components/cap-nav';
import { CapFooter } from '@/components/cap-footer';

interface ComingSoonProps {
  title: string;
  description: string;
  /** Optional ETA badge — e.g. "Q3 2026" */
  eta?: string;
}

export function ComingSoon({ title, description, eta }: ComingSoonProps) {
  return (
    <>
      <CapNav />
      <main className="min-h-[80vh] flex items-center justify-center px-5 pt-32 pb-16">
        <div className="max-w-[560px] text-center">
          <div className="orb-chrome w-20 h-20 rounded-[24px] mx-auto mb-7 flex items-center justify-center">
            <Sparkles size={28} className="text-white drop-shadow-sm" />
          </div>
          {eta && (
            <div className="inline-block font-mono text-[10px] tracking-[0.22em] uppercase btn-grad text-white px-3 py-1.5 rounded-full mb-4 font-semibold">
              {eta}
            </div>
          )}
          <h1 className="font-display font-bold text-[clamp(32px,4vw,52px)] tracking-[-0.025em] text-ink mb-3 lang-th:font-thai">
            {title}
          </h1>
          <p className="text-ink-3 text-[16px] leading-relaxed mb-8 lang-th:font-thai">{description}</p>
          <Link
            href="/"
            data-cursor="go"
            className="hover-target inline-flex items-center gap-2 text-iridescent font-semibold text-[14px] no-underline hover:underline"
          >
            <ArrowLeft size={14} />
            กลับหน้าหลัก
          </Link>
        </div>
      </main>
      <CapFooter />
    </>
  );
}
