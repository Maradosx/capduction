import { ComingSoon } from '@/components/coming-soon';
export const metadata = { title: 'API — Capduction' };
export default function Page() {
  return (
    <ComingSoon
      title="API Reference"
      description="Public API สำหรับ Agency plan · POST /api/generate/{script,caption,combo} พร้อม API key authentication"
      eta="Agency plan beta"
    />
  );
}
