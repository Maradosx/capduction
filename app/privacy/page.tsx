import Link from 'next/link';
import { CapNav } from '@/components/cap-nav';
import { CapFooter } from '@/components/cap-footer';

export const metadata = {
  title: 'Privacy Policy — Capduction',
  description: 'How Capduction collects, uses, and protects your data.',
};

export default function PrivacyPage() {
  return (
    <>
      <CapNav />

      <main className="max-w-[820px] mx-auto px-6 pt-32 pb-24">
        <header className="mb-10">
          <div className="font-mono text-[10px] tracking-[0.22em] text-ink-3 uppercase mb-2">
            ✦ PRIVACY POLICY
          </div>
          <h1 className="font-display font-bold text-[clamp(32px,5vw,52px)] text-ink mb-2 lang-th:font-thai">
            นโยบายความเป็นส่วนตัว
          </h1>
          <p className="text-[13px] font-mono text-ink-3">Last updated · 2026-05-17</p>
        </header>

        <article className="prose prose-sm max-w-none text-ink-3 leading-[1.7]
          [&_p]:text-[14px] [&_p]:mb-3
          [&_h2]:text-ink [&_h2]:font-bold [&_h2]:text-[20px] [&_h2]:mt-8 [&_h2]:mb-3
          [&_h3]:text-ink [&_h3]:font-semibold [&_h3]:text-[16px] [&_h3]:mt-5 [&_h3]:mb-2
          [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-3 [&_li]:text-[14px] [&_li]:mb-1
          [&_b]:text-ink [&_b]:font-semibold
          [&_a]:text-iridescent [&_a]:no-underline [&_a:hover]:underline
          lang-th:[&_p]:font-thai lang-th:[&_li]:font-thai lang-th:[&_h2]:font-thai lang-th:[&_h3]:font-thai">

          <p>
            Capduction (&quot;เรา&quot;) ให้บริการ AI studio สำหรับสร้างคอนเทนต์วิดีโอสั้น
            ที่ capduction.com. นโยบายนี้อธิบายว่าเราเก็บข้อมูลอะไร ใช้อย่างไร และปกป้องอย่างไร
            สอดคล้องกับ <b>พ.ร.บ. คุ้มครองข้อมูลส่วนบุคคล (PDPA)</b> ของประเทศไทย
          </p>

          <h2>1. ข้อมูลที่เราเก็บ</h2>
          <h3>1.1 ข้อมูลที่คุณให้กับเราโดยตรง</h3>
          <ul>
            <li><b>ข้อมูลบัญชี:</b> อีเมล, ชื่อแสดง, รูปโปรไฟล์ (ถ้าอัพโหลด)</li>
            <li><b>เนื้อหาที่คุณสร้าง:</b> ชื่อสินค้า, หมวดหมู่, กลุ่มเป้าหมาย, รายละเอียดที่กรอกในฟอร์ม + ผลลัพธ์ที่ AI สร้างให้</li>
            <li><b>Brand Voice:</b> sample posts และคำอธิบายที่คุณบันทึก</li>
            <li><b>ข้อมูลการชำระเงิน:</b> ไม่ได้เก็บไว้ในระบบเรา — Stripe เป็นผู้ประมวลผลและเก็บข้อมูลบัตร</li>
          </ul>

          <h3>1.2 ข้อมูลที่เก็บอัตโนมัติ</h3>
          <ul>
            <li><b>Usage logs:</b> เวลาที่เข้าใช้, IP address, browser, device · เก็บ 90 วัน</li>
            <li><b>Generation events:</b> studio ที่ใช้, จำนวน credit ที่หัก · เก็บเพื่อ analytics + billing audit</li>
            <li><b>Cookies:</b> เฉพาะ session cookies จาก Supabase Auth · ไม่ใช้ third-party tracking cookies</li>
          </ul>

          <h2>2. เราใช้ข้อมูลเพื่ออะไร</h2>
          <ul>
            <li>ส่งคำสั่ง prompt + บริบทของคุณไปยัง OpenAI เพื่อสร้างคอนเทนต์</li>
            <li>บันทึก generation history เพื่อให้คุณค้นหา/คัดลอกได้ในภายหลัง</li>
            <li>คิดค่าบริการตามแผนที่เลือก (ผ่าน Stripe)</li>
            <li>ส่งอีเมล transactional (welcome, reset password, payment receipt) ผ่าน Resend</li>
            <li>วิเคราะห์การใช้งานเพื่อปรับปรุงผลิตภัณฑ์ (aggregate stats เท่านั้น)</li>
          </ul>

          <h2>3. เราไม่นำคอนเทนต์ของคุณไปเทรน AI</h2>
          <p>
            เนื้อหาที่คุณสร้างหรือบันทึก (รวมถึง brand voice, generation outputs)
            <b>ไม่ถูกนำไปฝึกสอนโมเดล AI ของเราเองหรือของ OpenAI</b> — เราใช้ OpenAI API
            ภายใต้นโยบายของ OpenAI สำหรับ business customers ที่ไม่ opt-in training โดยอัตโนมัติ
          </p>

          <h2>4. เราแชร์ข้อมูลกับใคร</h2>
          <p>เราใช้ผู้ให้บริการเหล่านี้เพื่อรันระบบ (sub-processors):</p>
          <ul>
            <li><b>Supabase</b> (database + auth · servers in Singapore)</li>
            <li><b>Vercel</b> (hosting · global edge)</li>
            <li><b>OpenAI</b> (LLM API · US/EU regions)</li>
            <li><b>Stripe</b> (payment processing · US/IE)</li>
            <li><b>Resend</b> (email delivery · US)</li>
            <li><b>Google</b> (OAuth login เท่านั้น ถ้าคุณเลือกใช้)</li>
          </ul>
          <p>
            เรา <b>ไม่ขาย</b> หรือ <b>แลกเปลี่ยน</b> ข้อมูลของคุณกับ third party
            เพื่อการตลาดของบริษัทอื่น
          </p>

          <h2>5. สิทธิของคุณตาม PDPA</h2>
          <ul>
            <li><b>ดู:</b> ขอข้อมูลทั้งหมดที่เราเก็บเกี่ยวกับคุณได้ตลอด</li>
            <li><b>แก้ไข:</b> อัพเดตชื่อ/อีเมล/รูปได้ใน Settings</li>
            <li><b>ลบ:</b> ลบบัญชีและข้อมูลทั้งหมดของคุณได้ — ส่งคำขอที่ <a href="mailto:hello@capduction.com">hello@capduction.com</a></li>
            <li><b>ถอน consent:</b> ยกเลิก subscription ได้ตลอดผ่าน Settings → Billing</li>
            <li><b>คัดค้าน:</b> ปฏิเสธการประมวลผลข้อมูลเพื่อ analytics ได้ (ส่งอีเมล)</li>
          </ul>

          <h2>6. ระยะเวลาที่เก็บข้อมูล</h2>
          <ul>
            <li>บัญชีที่ active: เก็บตลอดที่ยังใช้งาน</li>
            <li>บัญชีที่ inactive (ไม่ login เกิน 2 ปี): แจ้งเตือนทางอีเมล จากนั้นลบใน 30 วัน</li>
            <li>Generation history: เก็บตลอดที่บัญชี active · ลบเมื่อคุณลบทีละ row หรือลบบัญชี</li>
            <li>Usage logs: 90 วัน</li>
            <li>Billing records: 7 ปี (ตามกฎหมายภาษีไทย)</li>
          </ul>

          <h2>7. ความปลอดภัย</h2>
          <ul>
            <li>เข้ารหัส in-transit ด้วย TLS 1.2+ ทุกการเชื่อมต่อ</li>
            <li>ฐานข้อมูลใช้ Row Level Security (RLS) — ทุก query ถูก scope ไปที่ user_id ของคุณ</li>
            <li>รหัสผ่านเก็บแบบ hash ผ่าน bcrypt (Supabase Auth)</li>
            <li>เราไม่เก็บข้อมูลบัตรเครดิตในระบบเรา</li>
          </ul>

          <h2>8. เด็กอายุต่ำกว่า 13 ปี</h2>
          <p>
            บริการนี้ไม่ได้ออกแบบสำหรับเด็กอายุต่ำกว่า 13 ปี ถ้าคุณเชื่อว่าเด็กในความดูแลของคุณ
            ได้สมัครโดยไม่ได้รับอนุญาต ติดต่อเราเพื่อลบบัญชีได้ทันที
          </p>

          <h2>9. การเปลี่ยนแปลงนโยบาย</h2>
          <p>
            ถ้ามีการเปลี่ยนแปลงสาระสำคัญ เราจะแจ้งทางอีเมลและแสดงประกาศใน dashboard
            อย่างน้อย 30 วันก่อนมีผล
          </p>

          <h2>10. ติดต่อเรา</h2>
          <p>
            <b>Data Controller:</b> Capduction · <a href="mailto:hello@capduction.com">hello@capduction.com</a><br/>
            ถ้าคุณรู้สึกว่าสิทธิตาม PDPA ของคุณถูกละเมิด สามารถยื่นเรื่องที่{' '}
            <b>สำนักงานคณะกรรมการคุ้มครองข้อมูลส่วนบุคคล (สคส.)</b> ได้
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
