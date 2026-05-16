import { ComingSoon } from '@/components/coming-soon';
export const metadata = { title: 'Changelog — Capduction' };
export default function Page() {
  return (
    <ComingSoon
      title="Changelog"
      description="ทุก update + feature ที่ออกใหม่ จะรวมที่นี่ · v1.0 launching soon"
      eta="v1.0 launch"
    />
  );
}
