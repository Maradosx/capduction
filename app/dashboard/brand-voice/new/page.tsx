import { BrandVoiceForm } from '../brand-voice-form';
import { PageHeader } from '@/components/dashboard/page-header';

export const metadata = { title: 'New Brand Voice — Capduction' };

export default function NewBrandVoicePage() {
  return (
    <div className="max-w-[680px] mx-auto flex flex-col gap-6">
      <PageHeader
        backHref="/dashboard/brand-voice"
        backKey="bv.back_all"
        titleKey="bv.new.title"
        subKey="bv.new.sub"
      />
      <BrandVoiceForm mode="create" />
    </div>
  );
}
