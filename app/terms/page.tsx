import Link from 'next/link';
import { CapNav } from '@/components/cap-nav';
import { CapFooter } from '@/components/cap-footer';

export const metadata = {
  title: 'Terms of Service — Capduction',
  description: 'Terms governing use of the Capduction service.',
};

export default function TermsPage() {
  return (
    <>
      <CapNav />

      <main className="max-w-[820px] mx-auto px-6 pt-32 pb-24">
        <header className="mb-10">
          <div className="font-mono text-[10px] tracking-[0.22em] text-ink-3 uppercase mb-2">
            ✦ TERMS OF SERVICE
          </div>
          <h1 className="font-display font-bold text-[clamp(32px,5vw,52px)] text-ink mb-2 lang-th:font-thai">
            ข้อกำหนดการใช้งาน
          </h1>
          <p className="text-[13px] font-mono text-ink-3">Last updated · 2026-05-17</p>
        </header>

        <article className="prose prose-sm max-w-none text-ink-3 leading-[1.7]
          [&_p]:text-[14px] [&_p]:mb-3
          [&_h2]:text-ink [&_h2]:font-bold [&_h2]:text-[20px] [&_h2]:mt-8 [&_h2]:mb-3
          [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-3 [&_li]:text-[14px] [&_li]:mb-1
          [&_b]:text-ink [&_b]:font-semibold
          [&_a]:text-iridescent [&_a]:no-underline [&_a:hover]:underline
          lang-th:[&_p]:font-thai lang-th:[&_li]:font-thai lang-th:[&_h2]:font-thai">

          <p>
            การสมัครและใช้บริการ Capduction (capduction.com) ถือว่าคุณยอมรับข้อกำหนดเหล่านี้.
            ถ้าไม่ยอมรับ กรุณาหยุดใช้บริการ
          </p>

          <h2>1. บริการที่เราให้</h2>
          <p>
            Capduction ให้บริการ <b>AI studio</b> สำหรับสร้างสคริปต์, แคปชั่น, hook, hashtag
            สำหรับวิดีโอสั้น โดยใช้ Large Language Models (เช่น OpenAI GPT-4o) เป็น engine.
            บริการให้แบบ <b>SaaS subscription</b> รายเดือน · ไม่มีสัญญาผูกมัดระยะยาว
          </p>

          <h2>2. การสมัครและบัญชี</h2>
          <ul>
            <li>คุณต้องมีอายุ <b>13 ปีขึ้นไป</b> เพื่อสมัครใช้บริการ</li>
            <li>ข้อมูลที่ให้ตอนสมัครต้องเป็นความจริง · 1 บัญชีต่อ 1 บุคคล/นิติบุคคล</li>
            <li>คุณรับผิดชอบในการเก็บรักษารหัสผ่านและการเข้าถึงบัญชี</li>
            <li>ห้ามแชร์บัญชีกับผู้อื่นในแผน Free และ Studio (Agency plan รองรับการใช้งานในทีมตามที่อธิบายไว้)</li>
          </ul>

          <h2>3. แผนและการชำระเงิน</h2>
          <ul>
            <li><b>Free:</b> 10 generations ให้ทดลอง · ไม่ต้องใช้บัตรเครดิต</li>
            <li><b>Creator:</b> ฿199/เดือน · 100 generations/เดือน · เหมาะกับครีเอเตอร์เริ่มต้น</li>
            <li><b>Studio:</b> ฿549/เดือน · 500 generations/เดือน · Brand Voice + Projects · เครดิต reset ทุกรอบบิล (ไม่สะสม)</li>
            <li><b>Agency:</b> ฿1,890/เดือน · 3,000 generations/เดือน (ประมาณ 100 ครั้ง/วัน) · brand voice ไม่จำกัด · สำหรับเอเจนซี่ดูแลหลายแบรนด์</li>
            <li>การชำระเงินผ่าน <b>Stripe</b> · เรียกเก็บอัตโนมัติทุกเดือนจนกว่าจะยกเลิก</li>
            <li>ราคาเป็น THB · ยังไม่รวม VAT (จะแยกแสดงในใบเสร็จเมื่อใช้บัญชีนิติบุคคล)</li>
          </ul>

          <h2>4. การยกเลิกและการคืนเงิน</h2>
          <ul>
            <li>ยกเลิก subscription ได้ตลอดผ่าน Settings → Billing · มีผลทันทีสิ้นรอบบิลปัจจุบัน (ยังใช้ได้ถึงวันที่จ่ายไว้)</li>
            <li>ไม่มีการคืนเงิน partial month สำหรับการยกเลิกกลางรอบ</li>
            <li>ถ้าระบบมีปัญหาทำให้ใช้งานไม่ได้เกิน 24 ชั่วโมงต่อเนื่อง ติดต่อขอ credit ชดเชยได้</li>
          </ul>

          <h2>5. ความเป็นเจ้าของในเนื้อหา</h2>
          <ul>
            <li><b>เนื้อหาที่คุณใส่ (input)</b> เป็นของคุณ — เราใช้เพื่อสร้างผลลัพธ์เท่านั้น</li>
            <li><b>เนื้อหาที่ AI สร้าง (output)</b> เป็นของคุณ — คุณสามารถใช้, แก้ไข, เผยแพร่, และขายในเชิงพาณิชย์ได้โดยอิสระ</li>
            <li>คุณรับทราบว่า AI อาจสร้างเนื้อหาที่คล้ายกับของผู้อื่นที่ใช้ prompt คล้ายกัน — เราไม่รับประกัน uniqueness</li>
            <li>คุณรับผิดชอบในการตรวจสอบเนื้อหาก่อนเผยแพร่ (ข้อเท็จจริง, ความถูกต้องของราคา, การอ้างสรรพคุณ ฯลฯ)</li>
          </ul>

          <h2>6. การใช้งานที่ห้าม</h2>
          <p>ห้ามใช้บริการเพื่อ:</p>
          <ul>
            <li>สร้างเนื้อหาที่ผิดกฎหมายไทย (พนัน, ยาเสพติด, อาวุธ, สื่อลามก, เนื้อหาที่ละเมิดสถาบัน)</li>
            <li>หลอกลวง, ฟิชชิ่ง, scam ลูกค้า</li>
            <li>สร้างเนื้อหาที่ละเมิดลิขสิทธิ์/เครื่องหมายการค้าของผู้อื่น</li>
            <li>โจมตี, reverse engineer, scrape, หรือ overload ระบบของเรา</li>
            <li>resell บริการของเราในรูปแบบ wrapper / clone</li>
            <li>หลีกเลี่ยงระบบ rate-limit หรือสร้างหลายบัญชีเพื่อใช้ free tier ซ้ำ</li>
          </ul>
          <p>การละเมิดอาจทำให้เราระงับบัญชีโดยไม่คืนเงิน</p>

          <h2>7. ข้อจำกัดความรับผิด</h2>
          <ul>
            <li>บริการให้แบบ <b>&quot;as-is&quot;</b> · เราไม่รับประกันว่า output จะถูกใจ ขายดี หรือปราศจากข้อผิดพลาด</li>
            <li>เราไม่รับผิดต่อความเสียหายทางอ้อม (lost revenue, lost data, brand damage) จากการใช้/ไม่สามารถใช้บริการ</li>
            <li>ความรับผิดสูงสุดของเราในทุกกรณี = ค่าบริการที่คุณจ่ายให้เราใน 12 เดือนล่าสุด</li>
          </ul>

          <h2>8. การเปลี่ยนแปลงบริการและราคา</h2>
          <p>
            เราอาจเพิ่ม/ลด/เปลี่ยนฟีเจอร์ได้ตลอด · ถ้ามีการขึ้นราคา จะแจ้งล่วงหน้าทางอีเมล
            อย่างน้อย 30 วัน · คุณสามารถยกเลิกได้ก่อนราคาใหม่มีผล
          </p>

          <h2>9. ความเป็นส่วนตัว</h2>
          <p>
            การใช้บริการอยู่ภายใต้{' '}
            <Link href="/privacy">นโยบายความเป็นส่วนตัว</Link> ของเราด้วย
          </p>

          <h2>10. กฎหมายที่ใช้บังคับ</h2>
          <p>
            ข้อตกลงนี้อยู่ภายใต้กฎหมายไทย · ข้อพิพาทใดๆ ขึ้นศาลในเขตอำนาจของกรุงเทพมหานคร
          </p>

          <h2>11. ติดต่อเรา</h2>
          <p>
            คำถาม ข้อร้องเรียน หรือคำขอใช้สิทธิ ส่งมาที่{' '}
            <a href="mailto:hello@capduction.com">hello@capduction.com</a>
          </p>
        </article>

        <div className="mt-10 text-center">
          <Link href="/" data-cursor="go" className="hover-target text-ink-3 hover:text-iridescent text-[13px] font-mono no-underline">
            ← Back to home
          </Link>
        </div>
      </main>

      <CapFooter />
    </>
  );
}
