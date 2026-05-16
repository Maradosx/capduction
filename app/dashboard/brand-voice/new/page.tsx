import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { BrandVoiceForm } from '../brand-voice-form';

export const metadata = { title: 'New Brand Voice — Capduction' };

export default function NewBrandVoicePage() {
  return (
    <div className="max-w-[680px] mx-auto flex flex-col gap-6">
      <Link
        href="/dashboard/brand-voice"
        data-cursor="go"
        className="hover-target inline-flex items-center gap-2 text-ink-3 hover:text-ink text-[13px] font-mono no-underline"
      >
        <ArrowLeft size={14} /> Back to voices
      </Link>

      <div>
        <h1 className="font-display font-bold text-[clamp(28px,3.5vw,42px)] tracking-[-0.025em] text-ink lang-th:font-thai">
          <span className="text-iridescent">Brand Voice</span> ใหม่
        </h1>
        <p className="text-ink-3 text-[15px] mt-1 lang-th:font-thai">
          สอน AI ให้รู้จักโทนของแบรนด์คุณ — ใส่ description + ตัวอย่างโพสต์จริง
        </p>
      </div>

      <BrandVoiceForm mode="create" />
    </div>
  );
}
