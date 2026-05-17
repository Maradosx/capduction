import Link from 'next/link';
import { Sparkles, Heart, Globe, Zap, Shield, MessageCircle } from 'lucide-react';
import { CapNav } from '@/components/cap-nav';
import { CapFooter } from '@/components/cap-footer';
import { BrandMark } from '@/components/brand-mark';

export const metadata = {
  title: 'About — Capduction',
  description:
    'Capduction is an AI studio between idea and upload — built in Bangkok for Thai short-form creators.',
};

export default function AboutPage() {
  return (
    <>
      <CapNav />

      <main className="max-w-[860px] mx-auto px-6 pt-32 pb-24">
        {/* Hero */}
        <section className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/60 border border-white/70 text-[11px] font-mono tracking-[0.18em] text-ink-3 uppercase mb-6">
            <Sparkles size={11} className="text-iridescent" />
            About Capduction
          </div>

          <h1 className="font-display font-bold text-[clamp(40px,6vw,76px)] leading-[1.05] tracking-[-0.025em] text-ink mb-5 lang-th:font-thai">
            <span className="font-serif italic font-normal text-chrome">Between</span>{' '}
            <span className="text-iridescent">idea</span>
            <br />
            and <span className="text-iridescent">upload.</span>
          </h1>

          <p className="text-[17px] text-ink-3 leading-[1.6] max-w-[600px] mx-auto lang-th:font-thai">
            Capduction คือสตูดิโอ AI สำหรับครีเอเตอร์วิดีโอสั้นไทย — เปลี่ยนไอเดียให้กลายเป็นสคริปต์
            และแคปชั่นที่ขายของได้ ภายในไม่กี่วินาที
          </p>
        </section>

        {/* Why */}
        <Section title="ทำไมต้อง Capduction" eyebrow="WHY">
          <p>
            ครีเอเตอร์ไทยมีจังหวะการเล่าเรื่องที่ไม่เหมือนใคร — hook แรงในสามวินาทีแรก ภาษาเข้าถึงง่าย
            แต่มีลีลา และ CTA ที่ปิดการขายแบบไม่ดูยัดเยียด เครื่องมือ AI ส่วนใหญ่ในตลาดถูกฝึกมาด้วย
            ตัวอย่างภาษาอังกฤษ พอแปลกลับเป็นไทยจึงออกมาแข็ง ไม่เข้าหู ไม่ตรงกับวิธีที่คนไทยจริงๆ พูด
            บนหน้า TikTok หรือ Reels
          </p>
          <p>
            Capduction ถูกออกแบบตั้งแต่ prompt ไปจนถึง interface ให้เข้าใจสไตล์การสื่อสารแบบไทย
            — เพื่อให้ทุกสคริปต์ที่ออกมาฟังดูเหมือนคุณเขียนเอง ไม่ใช่เหมือน AI แปลมา
          </p>
        </Section>

        {/* Principles */}
        <Section title="หลักการที่เรายึด" eyebrow="PRINCIPLES">
          <div className="grid sm:grid-cols-2 gap-3 not-prose">
            <Principle icon={Heart} title="ภาษาไทยที่ฟังเป็นมนุษย์">
              ทุก prompt ถูกปรับให้รุ่นโมเดลเข้าใจ tone, สแลง, และจังหวะวรรคแบบไทย
              — ไม่ใช่แค่แปลตรงตัวจาก template ภาษาอังกฤษ
            </Principle>
            <Principle icon={Zap} title="เร็วกว่าการเขียนเอง">
              จากกรอกข้อมูลถึงสคริปต์พร้อมใช้ ไม่เกิน 15 วินาที — เร็วพอที่จะลองหลายเวอร์ชั่นก่อนถ่าย
            </Principle>
            <Principle icon={Globe} title="เข้าใจหลายแพลตฟอร์ม">
              TikTok, Reels, YouTube Shorts, Lemon8, Threads — ระบบปรับสไตล์การเขียนตามแพลตฟอร์มอัตโนมัติ
            </Principle>
            <Principle icon={Shield} title="งานของคุณคือของคุณ">
              เราไม่นำคอนเทนต์ที่คุณสร้างไปเทรน AI · ทุกอย่างเก็บแบบ private ตาม RLS ของ Supabase
            </Principle>
          </div>
        </Section>

        {/* Story */}
        <Section title="เริ่มต้นจากที่ไหน" eyebrow="STORY">
          <p>
            Capduction เริ่มจากปัญหาที่ทีมเจอเอง — ใช้เวลาเขียน hook สามวินาทีแรกนานกว่าตัดวิดีโอ
            ลองให้ ChatGPT ช่วย แต่ผลที่ออกมาฟังเหมือนคนเมืองนอกแปลมา ใส่คำว่า &quot;จงตื่นเต้น&quot;
            กับ &quot;นี่คือสิ่งที่คุณรอคอย&quot; ที่ไม่มีครีเอเตอร์ไทยคนไหนพูดจริง
          </p>
          <p>
            เราเลยตัดสินใจสร้างเครื่องมือของเราเอง — ที่เข้าใจจังหวะการเล่าแบบไทย รู้ว่า hook
            สำหรับลิปสติกควรเริ่มต่างจาก hook สำหรับคอร์สเรียน และพูดคำว่า &quot;ของมันต้องมี&quot;
            กับ &quot;ลองดู&quot; ได้ถูกที่ถูกเวลา
          </p>
          <p>
            ตอนนี้ Capduction ยังเป็น Beta — เราเปิดให้ใช้ฟรี 10 ครั้งแรก เพื่อให้คุณลองว่า
            มันเข้ากับสไตล์ของคุณจริงไหม
          </p>
        </Section>

        {/* Contact */}
        <Section title="ติดต่อทีม" eyebrow="CONTACT">
          <div className="not-prose glass-strong rounded-[18px] p-6 flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <BrandMark className="w-14 h-14 flex-shrink-0" />
            <div className="flex-1 leading-relaxed">
              <p className="text-[15px] text-ink mb-2 lang-th:font-thai">
                เจอบั๊ก อยากแนะนำฟีเจอร์ หรืออยากคุยเรื่องความร่วมมือ?
                ส่งอีเมลถึงเราได้ตลอด
              </p>
              <a
                href="mailto:hello@capduction.com"
                data-cursor="go"
                className="hover-target inline-flex items-center gap-2 text-iridescent font-semibold no-underline"
              >
                <MessageCircle size={15} />
                hello@capduction.com
              </a>
            </div>
          </div>
        </Section>

        {/* CTA */}
        <div className="mt-16 text-center">
          <Link
            href="/signup"
            data-cursor="start"
            className="hover-target btn-grad inline-flex items-center gap-2 px-7 py-3.5 rounded-[12px] text-white font-semibold text-[15px] no-underline lang-th:font-thai"
          >
            <Sparkles size={16} />
            เริ่มใช้ฟรี 10 ครั้ง
          </Link>
          <p className="text-[11px] font-mono text-ink-3 mt-4 tracking-[0.14em] uppercase">
            No credit card · Cancel anytime
          </p>
        </div>
      </main>

      <CapFooter />
    </>
  );
}

function Section({
  title,
  eyebrow,
  children,
}: {
  title: string;
  eyebrow: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-16">
      <div className="font-mono text-[10px] tracking-[0.22em] text-ink-3 uppercase mb-2">
        ✦ {eyebrow}
      </div>
      <h2 className="font-display font-bold text-[26px] md:text-[32px] text-ink mb-5 lang-th:font-thai">
        {title}
      </h2>
      <div className="prose prose-sm max-w-none text-ink-3 leading-[1.7] [&_p]:mb-4 [&_p]:text-[15px] lang-th:[&_p]:font-thai">
        {children}
      </div>
    </section>
  );
}

function Principle({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="glass rounded-[14px] p-5">
      <div className="flex items-center gap-2.5 mb-2">
        <span className="w-8 h-8 rounded-full bg-gradient-to-br from-pink/20 to-violet/20 flex items-center justify-center text-iridescent">
          <Icon size={14} />
        </span>
        <h3 className="text-[14px] font-bold text-ink lang-th:font-thai">{title}</h3>
      </div>
      <p className="text-[13px] text-ink-3 leading-[1.6] lang-th:font-thai">{children}</p>
    </div>
  );
}
