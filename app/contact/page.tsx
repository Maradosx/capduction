import Link from 'next/link';
import { Mail, MessageCircle, Bug, Lightbulb, Building2 } from 'lucide-react';
import { CapNav } from '@/components/cap-nav';
import { CapFooter } from '@/components/cap-footer';

export const metadata = {
  title: 'Contact — Capduction',
  description: 'Get in touch with the Capduction team — feedback, support, partnerships.',
};

const CHANNELS = [
  {
    icon: Bug,
    title: 'เจอบั๊ก / ใช้งานไม่ได้',
    titleEn: 'Bug report / Need help',
    desc: 'ส่งอีเมลพร้อม screenshot — เราตอบใน 24 ชั่วโมง',
    descEn: 'Email us with a screenshot — we reply within 24 hours.',
    href: 'mailto:hello@capduction.com?subject=Bug%20report',
    cta: 'hello@capduction.com',
  },
  {
    icon: Lightbulb,
    title: 'แนะนำฟีเจอร์ใหม่',
    titleEn: 'Feature request',
    desc: 'อยากให้เพิ่มอะไร? บอกได้เลย — เราอ่านทุกฉบับ',
    descEn: 'What should we build next? Tell us — we read every one.',
    href: 'mailto:hello@capduction.com?subject=Feature%20request',
    cta: 'hello@capduction.com',
  },
  {
    icon: Building2,
    title: 'ความร่วมมือ / Enterprise',
    titleEn: 'Partnerships / Enterprise',
    desc: 'เอเจนซี่ที่ดูแลหลายแบรนด์ · brand ที่ต้องการ custom — คุยกันได้',
    descEn: 'Agencies, custom integrations, brand deals — let\'s talk.',
    href: 'mailto:hello@capduction.com?subject=Partnership',
    cta: 'hello@capduction.com',
  },
];

export default function ContactPage() {
  return (
    <>
      <CapNav />

      <main className="max-w-[860px] mx-auto px-6 pt-32 pb-24">
        <header className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/60 border border-white/70 text-[11px] font-mono tracking-[0.18em] text-ink-3 uppercase mb-5">
            <MessageCircle size={11} className="text-iridescent" />
            Contact
          </div>
          <h1 className="font-display font-bold text-[clamp(36px,5vw,60px)] text-ink mb-3 lang-th:font-thai">
            <span className="text-iridescent">คุยกัน</span> ได้ตลอด
          </h1>
          <p className="text-[15px] text-ink-3 max-w-[520px] mx-auto lang-th:font-thai">
            จากบั๊กเล็กๆ ถึงไอเดียใหญ่ๆ — ทีม Capduction (เล็กแต่ตั้งใจ) ตอบทุกอีเมล
          </p>
        </header>

        {/* Channel cards */}
        <div className="grid sm:grid-cols-3 gap-4 mb-12">
          {CHANNELS.map((c) => (
            <a
              key={c.title}
              href={c.href}
              data-cursor="go"
              className="hover-target glass rounded-[16px] p-5 transition-all hover:-translate-y-0.5 hover:shadow-glass-lg no-underline group"
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink/20 to-violet/20 flex items-center justify-center text-iridescent mb-3.5">
                <c.icon size={16} />
              </div>
              <h3 className="text-[14px] font-bold text-ink mb-1.5 lang-th:font-thai">{c.title}</h3>
              <p className="text-[12px] text-ink-3 leading-relaxed mb-3 lang-th:font-thai">
                {c.desc}
              </p>
              <div className="text-[11px] font-mono text-iridescent group-hover:underline truncate">
                {c.cta} →
              </div>
            </a>
          ))}
        </div>

        {/* Primary email card */}
        <div className="glass-strong rounded-[18px] p-7 text-center mb-8">
          <Mail size={24} className="text-iridescent mx-auto mb-3" />
          <h2 className="text-[18px] font-bold text-ink mb-1.5 lang-th:font-thai">
            ช่องทางหลัก
          </h2>
          <p className="text-[13px] text-ink-3 mb-4 lang-th:font-thai">
            ถ้าไม่แน่ใจว่าจะส่งหา channel ไหน — ส่งที่นี่ได้เลย
          </p>
          <a
            href="mailto:hello@capduction.com"
            data-cursor="go"
            className="hover-target inline-flex items-center gap-2 btn-grad px-6 py-3 rounded-[12px] text-white font-semibold text-[14px] no-underline"
          >
            <Mail size={15} />
            hello@capduction.com
          </a>
          <p className="text-[11px] font-mono text-ink-3 mt-4 tracking-[0.1em] uppercase">
            Response within 24 hours · Mon–Fri
          </p>
        </div>

        {/* FAQ shortcut */}
        <div className="text-center text-[13px] text-ink-3 lang-th:font-thai">
          คำถามที่พบบ่อย? อ่านได้ที่{' '}
          <Link href="/docs#faq" className="text-iridescent font-semibold no-underline hover:underline">
            Documentation → FAQ
          </Link>
        </div>
      </main>

      <CapFooter />
    </>
  );
}
