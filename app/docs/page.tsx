import Link from 'next/link';
import {
  BookOpen, Sparkles, PenLine, Type, Layers,
  Mic, Hash, Settings2, MessageCircle,
} from 'lucide-react';
import { CapNav } from '@/components/cap-nav';
import { CapFooter } from '@/components/cap-footer';

export const metadata = {
  title: 'Documentation — Capduction',
  description:
    'How to use Capduction Studios — Script, Caption, Combo — plus tips for Thai short-form creators.',
};

const TOC = [
  { id: 'getting-started', label: 'Getting Started' },
  { id: 'script',          label: 'Script Studio' },
  { id: 'caption',         label: 'Caption Studio' },
  { id: 'combo',           label: 'Combo Mode' },
  { id: 'brand-voice',     label: 'Brand Voice' },
  { id: 'tips',            label: 'Tips for Thai creators' },
  { id: 'faq',             label: 'FAQ' },
];

export default function DocsPage() {
  return (
    <>
      <CapNav />

      <main className="max-w-[1100px] mx-auto px-6 pt-32 pb-24">
        {/* Header */}
        <header className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/60 border border-white/70 text-[11px] font-mono tracking-[0.18em] text-ink-3 uppercase mb-5">
            <BookOpen size={11} className="text-iridescent" />
            Documentation · v1.0 Beta
          </div>
          <h1 className="font-display font-bold text-[clamp(36px,5vw,60px)] text-ink mb-3 lang-th:font-thai">
            คู่มือการใช้ <span className="text-iridescent">Capduction</span>
          </h1>
          <p className="text-[15px] text-ink-3 max-w-[600px] mx-auto lang-th:font-thai">
            ทุกอย่างที่คุณต้องรู้ — ตั้งแต่ generation แรก ไปจนถึงเทคนิคขั้นสูงสำหรับครีเอเตอร์ไทย
          </p>
        </header>

        <div className="grid lg:grid-cols-[220px_1fr] gap-10">
          {/* TOC */}
          <aside className="hidden lg:block sticky top-28 self-start">
            <div className="font-mono text-[10px] tracking-[0.2em] text-ink-3 uppercase mb-3 font-semibold">
              ON THIS PAGE
            </div>
            <nav className="flex flex-col gap-1.5 text-[13px]">
              {TOC.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  data-cursor="go"
                  className="hover-target text-ink-3 hover:text-iridescent no-underline transition-colors"
                >
                  {item.label}
                </a>
              ))}
            </nav>
          </aside>

          {/* Content */}
          <article className="space-y-14">
            <DocSection id="getting-started" eyebrow="START HERE" title="Getting Started" icon={Sparkles}>
              <Step n={1} title="สมัครและรับ 10 เครดิตฟรี">
                ไปที่ <Link href="/signup" className="text-iridescent">/signup</Link> สมัครด้วยอีเมล หรือ
                Google · เครดิตเริ่มต้น 10 ครั้ง ไม่ต้องใช้บัตรเครดิต
              </Step>
              <Step n={2} title="เลือก Studio">
                Capduction มี 3 studio หลัก — <b>Script</b> (สำหรับวิดีโอ),
                <b> Caption</b> (สำหรับโพสต์), <b>Combo</b> (สคริปต์+แคปชั่นบน hook เดียวกัน)
              </Step>
              <Step n={3} title="กรอกข้อมูลสินค้า">
                ใส่ชื่อสินค้า · เลือกหมวด · ระบุกลุ่มเป้าหมาย · เลือกแพลตฟอร์ม · ตั้งโทน
                — ยิ่งระบุละเอียด ผลลัพธ์ยิ่งตรง
              </Step>
              <Step n={4} title="กด Generate · ใช้ทันที">
                ผลลัพธ์จะถูกบันทึกไว้ใน <Link href="/dashboard/history" className="text-iridescent">History</Link>{' '}
                · กดคัดลอกหรือ export เป็น .pdf ได้ทันที
              </Step>
              <CalloutTip>
                1 generation = 1 เครดิต · เลือก &quot;3 variants&quot; ใช้ 3 เครดิต แต่ได้สามทางเลือกในครั้งเดียว
              </CalloutTip>
            </DocSection>

            <DocSection id="script" eyebrow="STUDIO 1" title="Script Studio" icon={Mic}>
              <p>
                สร้างสคริปต์การพูดสำหรับวิดีโอสั้น 15–90 วินาที พร้อม <b>timing markers</b>
                ทุกวินาที <b>B-roll cues</b> และ <b>on-screen text</b> — เหมือนมี director ส่วนตัว
              </p>
              <h4>ใช้เมื่อไหร่</h4>
              <ul>
                <li>ต้องอัด TikTok / Reels / Shorts ที่มีคำพูด</li>
                <li>อยากได้ hook สามวินาทีแรกที่ดึงคนหยุดเลื่อน</li>
                <li>อยากรู้จังหวะการตัด B-roll ก่อนถ่าย ไม่ต้องคิดหน้างาน</li>
              </ul>
              <h4>โครงสร้างผลลัพธ์</h4>
              <ul>
                <li><b>HOOK (0-3s)</b> — ประโยคเปิดที่ทำให้ไม่เลื่อนผ่าน</li>
                <li><b>BODY</b> — เนื้อหาแบ่งเป็น beats พร้อม timestamp</li>
                <li><b>CTA</b> — ปิดด้วยการกระตุ้นให้กด follow / ซื้อ / คอมเมนต์</li>
                <li><b>B-ROLL</b> — แนะนำภาพประกอบในแต่ละช่วง</li>
              </ul>
            </DocSection>

            <DocSection id="caption" eyebrow="STUDIO 2" title="Caption Studio" icon={Type}>
              <p>
                สร้างแคปชั่นพร้อมโพสต์ — 5 แบบในครั้งเดียว · พร้อม hook ดึงสายตา ·
                hashtag ตรงเทรนด์ · CTA ปิดการขาย
              </p>
              <h4>ใช้เมื่อไหร่</h4>
              <ul>
                <li>ถ่ายวิดีโอเสร็จแล้ว ต้องการแคปชั่นเร็วๆ ก่อนโพสต์</li>
                <li>อยากเทียบหลายโทน (เป็นมิตร vs โน้มน้าว) ก่อนเลือก</li>
                <li>โพสต์ลง Instagram, Threads, Facebook, Lemon8</li>
              </ul>
              <CalloutTip>
                เลือก &quot;Viral&quot; tone ถ้าอยากได้แคปชั่นแบบสะดุดตา · เลือก &quot;Professional&quot;
                ถ้าโพสต์ในเพจธุรกิจ
              </CalloutTip>
            </DocSection>

            <DocSection id="combo" eyebrow="STUDIO 3" title="Combo Mode" icon={Layers}>
              <p>
                สร้าง <b>สคริปต์ + แคปชั่น</b> บน hook เดียวกันในไฟล์เดียว — เหมาะกับ campaign ใหญ่
                ที่ต้องให้ทุกช่องทางพูดเรื่องเดียวกัน
              </p>
              <h4>ทำไมต้องใช้ Combo</h4>
              <ul>
                <li>ประหยัดเวลา — generation เดียว ได้ทั้งสคริปต์และแคปชั่น</li>
                <li>เนื้อหา <b>สอดคล้อง</b> 100% — hook ของวิดีโอกับโพสต์ตรงกัน ไม่สับสน</li>
                <li>ใช้เครดิตเท่ากับการสร้าง script + caption แยกกัน (ประหยัดเวลาไม่ใช่เครดิต)</li>
              </ul>
            </DocSection>

            <DocSection id="brand-voice" eyebrow="OPTIONAL" title="Brand Voice" icon={PenLine}>
              <p>
                ตั้ง <b>brand voice</b> ของคุณครั้งเดียว — ทุก generation ต่อจากนี้จะใช้สไตล์
                การพูด คำต้องห้าม และ tone ที่คุณกำหนดอัตโนมัติ
              </p>
              <p>
                เหมาะสำหรับ <b>เอเจนซี่</b> หรือ <b>เจ้าของแบรนด์</b> ที่ต้องการความสม่ำเสมอข้ามทีม
              </p>
              <p className="text-ink-3">
                <i>เปิดตัวใน Q3 2026 — ตอนนี้สามารถใส่ tone ผ่านช่อง &quot;รายละเอียดเพิ่มเติม&quot; ได้</i>
              </p>
            </DocSection>

            <DocSection id="tips" eyebrow="PRO TIPS" title="Tips สำหรับครีเอเตอร์ไทย" icon={Hash}>
              <h4>1. ระบุชื่อสินค้าให้ชัด</h4>
              <p>
                แทนที่จะใส่ &quot;ลิปสติก&quot; ลองใส่ &quot;ลิปสติกแดงแมตต์ ติด 12 ชม. ไม่ลอก
                ราคา ฿299&quot; — โมเดลจะเขียน hook ได้แม่นกว่ามาก
              </p>

              <h4>2. ใช้ช่อง &quot;รายละเอียดเพิ่มเติม&quot; ให้เป็น</h4>
              <p>
                ใส่ promotion (&quot;ลด 30% เฉพาะ 50 คนแรก&quot;), constraint
                (&quot;ห้ามใช้คำว่า ราคาถูก&quot;), หรือ tone เฉพาะ (&quot;พูดเหมือนคุยกับเพื่อน&quot;)
              </p>

              <h4>3. ลอง 3 variants เมื่อโพสต์สำคัญ</h4>
              <p>
                สำหรับ campaign ใหญ่ ใช้ 3 เครดิตเพื่อได้ 3 ทางเลือก แล้วเลือกอันที่ตรงสุด —
                เร็วกว่าเขียนใหม่หลายรอบ
              </p>

              <h4>4. ปรับ tone ตามแพลตฟอร์ม</h4>
              <p>
                TikTok = Viral / Friendly · Lemon8 = Minimal / Luxury · Facebook = Professional ·
                เลือกให้ตรงกับ audience ของแต่ละช่อง
              </p>
            </DocSection>

            <DocSection id="faq" eyebrow="QUESTIONS" title="คำถามที่พบบ่อย" icon={Settings2}>
              <Faq q="เครดิตหมดแล้วต้องทำยังไง?">
                อัปเกรดที่ <Link href="/pricing" className="text-iridescent">/pricing</Link>
                — เริ่มต้น ฿199/เดือน ได้ 100 generations
              </Faq>
              <Faq q="คอนเทนต์ที่สร้างเก็บไว้ที่ไหน?">
                ทุก generation ถูกบันทึกใน{' '}
                <Link href="/dashboard/history" className="text-iridescent">/dashboard/history</Link>
                {' '}— ค้นหา · คัดลอก · export เป็น .pdf ได้
              </Faq>
              <Faq q="คอนเทนต์ของผมจะถูกนำไปเทรน AI ไหม?">
                ไม่ — Capduction ไม่นำคอนเทนต์ของผู้ใช้ไปเทรนโมเดล
                ทุกอย่างเก็บแบบ private ตาม Row Level Security ของ Supabase
              </Faq>
              <Faq q="รองรับภาษาอื่นนอกจากไทยและอังกฤษไหม?">
                ตอนนี้รองรับ TH + EN เท่านั้น · ภาษาอื่นๆ จะเพิ่มในอนาคต
              </Faq>
              <Faq q="ใช้กับ Threads / Lemon8 ได้ไหม?">
                ได้ · เลือกแพลตฟอร์มในฟอร์ม Caption Studio — ระบบจะปรับสไตล์ให้เข้ากับแต่ละแพลตฟอร์ม
              </Faq>
              <Faq q="ยกเลิกแผนได้เมื่อไหร่?">
                ได้ตลอด — ไปที่ <Link href="/dashboard/billing" className="text-iridescent">/dashboard/billing</Link>
                {' '}ไม่มีค่ายกเลิก · เครดิตที่ใช้ไปแล้วเป็นของคุณจนสิ้นรอบบิล
              </Faq>
            </DocSection>

            {/* Contact */}
            <div className="glass-strong rounded-[16px] p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <MessageCircle size={20} className="text-iridescent flex-shrink-0" />
              <div className="flex-1">
                <p className="text-[14px] text-ink mb-1 lang-th:font-thai font-semibold">
                  ยังไม่เจอคำตอบ?
                </p>
                <p className="text-[13px] text-ink-3 lang-th:font-thai">
                  ส่งอีเมลมาที่{' '}
                  <a href="mailto:hello@capduction.com" className="text-iridescent">
                    hello@capduction.com
                  </a>
                  {' '}— เราตอบทุกฉบับภายใน 24 ชั่วโมง
                </p>
              </div>
            </div>
          </article>
        </div>
      </main>

      <CapFooter />
    </>
  );
}

function DocSection({
  id, eyebrow, title, icon: Icon, children,
}: {
  id: string;
  eyebrow: string;
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-28">
      <div className="font-mono text-[10px] tracking-[0.22em] text-ink-3 uppercase mb-2">
        ✦ {eyebrow}
      </div>
      <h2 className="font-display font-bold text-[26px] md:text-[30px] text-ink mb-5 flex items-center gap-2.5 lang-th:font-thai">
        <Icon size={20} className="text-iridescent" />
        {title}
      </h2>
      <div className="prose prose-sm max-w-none text-ink-3 leading-[1.7]
        [&_p]:text-[14px] [&_p]:mb-3
        [&_h4]:text-ink [&_h4]:font-bold [&_h4]:text-[15px] [&_h4]:mt-5 [&_h4]:mb-2
        [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-3 [&_li]:text-[14px] [&_li]:mb-1
        [&_b]:text-ink [&_b]:font-semibold
        [&_a]:no-underline [&_a:hover]:underline
        lang-th:[&_p]:font-thai lang-th:[&_li]:font-thai lang-th:[&_h4]:font-thai">
        {children}
      </div>
    </section>
  );
}

function Step({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-4 not-prose mb-4">
      <div className="flex-shrink-0 w-8 h-8 rounded-full btn-grad text-white font-bold text-[13px] flex items-center justify-center">
        {n}
      </div>
      <div className="flex-1">
        <h4 className="text-[15px] font-bold text-ink mb-1 lang-th:font-thai">{title}</h4>
        <p className="text-[14px] text-ink-3 leading-[1.65] lang-th:font-thai">{children}</p>
      </div>
    </div>
  );
}

function CalloutTip({ children }: { children: React.ReactNode }) {
  return (
    <div className="not-prose my-4 rounded-[12px] bg-gradient-to-br from-mint/15 to-teal/10 border border-teal/25 p-4 text-[13px] text-ink leading-[1.6] lang-th:font-thai">
      <b className="text-teal-700">💡 Tip · </b>
      {children}
    </div>
  );
}

function Faq({ q, children }: { q: string; children: React.ReactNode }) {
  return (
    <details className="not-prose group glass rounded-[12px] mb-2.5 overflow-hidden">
      <summary className="hover-target cursor-pointer px-4 py-3 text-[14px] font-semibold text-ink flex items-center justify-between gap-3 list-none lang-th:font-thai">
        {q}
        <span className="text-ink-3 text-[18px] leading-none group-open:rotate-45 transition-transform">+</span>
      </summary>
      <div className="px-4 pb-4 text-[13px] text-ink-3 leading-[1.65] lang-th:font-thai">
        {children}
      </div>
    </details>
  );
}
