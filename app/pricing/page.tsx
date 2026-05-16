import Link from 'next/link';
import { Check, ArrowLeft } from 'lucide-react';
import { CapNav } from '@/components/cap-nav';
import { CapFooter } from '@/components/cap-footer';
import { createClient } from '@/lib/supabase/server';
import { getProfile } from '@/lib/db/profiles';

interface Plan {
  id: 'free' | 'studio' | 'agency';
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  featured?: boolean;
  ctaLabel: string;
}

const PLANS: Plan[] = [
  {
    id: 'free',
    name: 'Free',
    price: '฿0',
    period: '/mo',
    description: 'ทดลองทุก studio ก่อนตัดสินใจ — ไม่ต้องใส่บัตรเครดิต',
    features: [
      '10 generations / เดือน',
      'ทุก studio · ทุกแพลตฟอร์ม',
      'ประวัติย้อนหลัง 7 วัน',
      'Community support',
    ],
    ctaLabel: 'เริ่มฟรี',
  },
  {
    id: 'studio',
    name: 'Studio',
    price: '฿349',
    period: '/mo',
    description: 'สำหรับครีเอเตอร์และร้านค้าที่โพสต์ทุกวัน · คุ้มที่สุดในเซต',
    features: [
      '500 generations / เดือน',
      'Brand Voice Memory',
      'Project workspaces',
      'Export pack (.pdf .txt)',
      'ประวัติไม่จำกัด',
      'Priority support · ตอบใน 4 ชม.',
    ],
    featured: true,
    ctaLabel: 'อัปเกรดเป็น Studio',
  },
  {
    id: 'agency',
    name: 'Agency',
    price: '฿1,290',
    period: '/mo',
    description: 'สำหรับเอเจนซี่และทีมที่ดูแลหลายแบรนด์พร้อมกัน',
    features: [
      'Unlimited generations',
      '10 brand voices',
      'Team workspace · 5 seats',
      'API access',
      'White-label export',
      'Dedicated CSM',
    ],
    ctaLabel: 'ติดต่อทีมขาย',
  },
];

export const metadata = {
  title: 'Pricing — Capduction',
  description: 'แผนราคา Capduction — Free, Studio, Agency',
};

export default async function PricingPage() {
  const isDemoMode = !process.env.NEXT_PUBLIC_SUPABASE_URL;
  let isLoggedIn = false;
  let currentPlan: string | null = null;

  if (!isDemoMode) {
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        isLoggedIn = true;
        const profile = await getProfile();
        currentPlan = profile?.plan ?? null;
      }
    } catch { /* swallow */ }
  }

  return (
    <>
      <CapNav active="/pricing" />
      <main className="pt-[120px] px-5 pb-20">
        {/* Header */}
        <header className="max-w-[800px] mx-auto text-center mb-12">
          <div className="font-mono text-[11px] tracking-[0.22em] uppercase text-ink-3 mb-4 inline-flex items-center gap-3">
            <span className="text-iridescent text-[14px]">✦</span>
            PRICING · CAPDUCTION
            <span className="text-iridescent text-[14px]">✦</span>
          </div>
          <h1 className="font-display font-bold text-[clamp(40px,5.5vw,72px)] tracking-[-0.03em] leading-[1.05] text-ink mb-4 lang-th:font-thai">
            ราคา <span className="text-iridescent">ตรงไปตรงมา</span>
          </h1>
          <p className="text-ink-3 text-[16px] lang-th:font-thai">
            เริ่มฟรี 10 ครั้ง · อัปเกรดเมื่อพร้อม · ยกเลิกได้ตลอดเวลา
          </p>
        </header>

        {/* Plans grid */}
        <section className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-5">
          {PLANS.map((plan) => {
            const isCurrent = isLoggedIn && currentPlan === plan.id;
            return (
              <div
                key={plan.id}
                className={`relative rounded-[24px] p-7 flex flex-col transition-all hover:-translate-y-1.5
                  ${plan.featured
                    ? 'bg-gradient-to-b from-white/85 to-violet-50/70 backdrop-blur-[28px] border-2 border-violet/40 shadow-[0_24px_56px_rgba(181,143,255,0.25)]'
                    : 'glass'}`}
              >
                {plan.featured && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 btn-grad px-3.5 py-1 rounded-full text-white font-mono text-[10px] tracking-wider font-semibold">
                    ★ RECOMMENDED
                  </div>
                )}
                <div className="font-mono text-[11px] tracking-[0.22em] uppercase text-ink-3 mb-3 font-semibold">
                  {plan.name.toUpperCase()}
                </div>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="font-display font-bold text-[48px] leading-none text-ink">{plan.price}</span>
                  <span className="text-ink-3 text-[14px] font-mono">{plan.period}</span>
                </div>
                <p className="text-[14px] text-ink-3 leading-relaxed mb-6 lang-th:font-thai">{plan.description}</p>

                <ul className="flex flex-col gap-2.5 flex-1 mb-6">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-[13px] text-ink-2 lang-th:font-thai">
                      <Check size={14} className="text-iridescent flex-shrink-0 mt-0.5" />
                      {f}
                    </li>
                  ))}
                </ul>

                {isCurrent ? (
                  <div className="text-center py-3 px-4 rounded-[12px] bg-emerald-100/60 text-emerald-700 font-semibold text-[13px] border border-emerald-200 lang-th:font-thai">
                    ✓ แผนปัจจุบัน
                  </div>
                ) : (
                  <Link
                    href={
                      plan.id === 'free'
                        ? (isLoggedIn ? '/dashboard' : '/signup')
                        : plan.id === 'agency'
                        ? 'mailto:hello@capduction.app'
                        : '/api/billing/checkout?plan=studio'
                    }
                    data-cursor="start"
                    className={`hover-target block text-center py-3 px-4 rounded-[12px] font-semibold text-[13px] no-underline transition-all lang-th:font-thai
                      ${plan.featured
                        ? 'btn-grad text-white'
                        : 'bg-white/65 border border-white/80 text-ink hover:bg-white/85'}`}
                  >
                    {plan.ctaLabel}
                  </Link>
                )}
              </div>
            );
          })}
        </section>

        {/* FAQ teaser */}
        <section className="max-w-[800px] mx-auto mt-20 glass-strong rounded-[20px] p-8 text-center">
          <h2 className="font-display font-bold text-[22px] text-ink mb-2 lang-th:font-thai">มีคำถาม?</h2>
          <p className="text-ink-3 text-[14px] mb-4 lang-th:font-thai">
            ติดต่อทีม support — ตอบทุกช่องทาง email · LINE · TikTok DM
          </p>
          <Link
            href="mailto:hello@capduction.app"
            data-cursor="go"
            className="hover-target inline-flex items-center gap-2 text-iridescent font-semibold text-[14px] no-underline hover:underline"
          >
            hello@capduction.app →
          </Link>
        </section>

        {/* Back link */}
        <div className="text-center mt-12">
          <Link
            href={isLoggedIn ? '/dashboard' : '/'}
            data-cursor="go"
            className="hover-target inline-flex items-center gap-2 text-ink-3 hover:text-ink text-[13px] font-mono no-underline"
          >
            <ArrowLeft size={14} />
            {isLoggedIn ? 'กลับไป Dashboard' : 'กลับหน้าหลัก'}
          </Link>
        </div>
      </main>
      <CapFooter />
    </>
  );
}
