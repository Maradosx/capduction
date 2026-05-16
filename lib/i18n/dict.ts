/**
 * Capduction — Bilingual dictionary (TH/EN)
 * Flat dot-notation keys. Add entries as new pages/components need them.
 */

export type Lang = 'th' | 'en';

export const DICT = {
  // ─── NAV ───────────────────────────────────────────────────
  'nav.home':     { th: 'หน้าแรก',     en: 'Home' },
  'nav.studios':  { th: 'สตูดิโอ',     en: 'Studios' },
  'nav.pricing':  { th: 'ราคา',        en: 'Pricing' },
  'nav.showcase': { th: 'ตัวอย่าง',    en: 'Showcase' },
  'nav.faq':      { th: 'คำถามพบบ่อย', en: 'FAQ' },
  'nav.cta':      { th: 'เริ่มเลย',    en: 'Get started' },
  'nav.login':    { th: 'เข้าสู่ระบบ', en: 'Log in' },

  // ─── HERO ──────────────────────────────────────────────────
  'hero.h.serif':    { th: 'Smart Scripts,',          en: 'Smart Scripts,' },
  'hero.h.iri':      { th: 'Built By Creators',       en: 'Built By Creators' },
  'hero.sub': {
    th: 'สตูดิโอ AI สำหรับครีเอเตอร์วิดีโอสั้นไทย — ปั้น<strong>สคริปต์การพูด</strong>และ<strong>แคปชั่นหน้าจอ</strong>ที่เข้าใจสไตล์ไทย ครบในไฟล์เดียว',
    en: 'An AI studio for Thai short-form creators — craft <strong>spoken scripts</strong> and <strong>on-screen captions</strong> that understand Thai style. All in one file.',
  },
  'hero.cta':        { th: 'เริ่มฟรี →',              en: 'Start free →' },
  'hero.trust':      { th: 'creators · สัปดาห์นี้',   en: 'creators · joined this week' },
  'hero.email.placeholder': { th: 'อีเมลของคุณ',      en: 'your@email.com' },

  // ─── DASHBOARD PREVIEW (on landing) ────────────────────────
  'dash.preview.eye':       { th: '— LIVE PREVIEW · WORKSPACE',          en: '— LIVE PREVIEW · WORKSPACE' },
  'dash.title':             { th: 'เวิร์กสเปซ',                          en: 'Workspace' },
  'dash.combo':             { th: 'Combo Mode',                          en: 'Combo Mode' },
  'dash.script':            { th: 'Script Studio',                       en: 'Script Studio' },
  'dash.caption':           { th: 'Caption Studio',                      en: 'Caption Studio' },
  'dash.brand_voice':       { th: 'Brand Voice',                         en: 'Brand Voice' },
  'dash.history':           { th: 'ประวัติ',                             en: 'History' },
  'dash.projects':          { th: 'โปรเจกต์',                            en: 'Projects' },
  'dash.section':           { th: 'เลือก studio ตามจังหวะของคุณ',         en: 'Pick the studio for your moment' },
  'dash.h5':                { th: 'เริ่มจากศูนย์',                       en: 'From Scratch' },
  'dash.p':                 {
    th: 'สร้างจาก scratch เพื่อปรับ creator experience ในแบบที่คุณต้องการ 100%',
    en: 'Begin from the ground up for a fully personalized creator experience.',
  },
  'dash.card.title':        { th: 'Real-Time Script Generator',          en: 'Real-Time Script Generator' },
  'dash.card.sub':          {
    th: 'Assistant ที่ทำงาน 24 × 7 ให้คอนเทนต์คุณ',
    en: 'An assistant who works 24 × 7 for your content',
  },
  'dash.create':            { th: 'สร้าง',                                en: 'Create' },

  // ─── STUDIOS section ───────────────────────────────────────
  'st.eye':       { th: 'THREE STUDIOS · ONE WORKFLOW',          en: 'THREE STUDIOS · ONE WORKFLOW' },
  'st.h.left':    { th: 'เครื่องมือ',                              en: 'Tools for' },
  'st.h.iri':     { th: 'ครบทุกขั้น',                              en: 'every step' },
  'st.h.right':   { th: 'ของการผลิตคอนเทนต์',                       en: 'of production' },
  'st.p': {
    th: 'เลือกใช้ทีละโหมด หรือเรียก Combo Mode เพื่อปั้น script + caption ใน hook เดียวกัน ความหมายเดียวกัน',
    en: 'Use modes individually, or call Combo Mode to align script and caption on one hook.',
  },
  'st.1.name': { th: 'Script Studio',  en: 'Script Studio' },
  'st.1.tag':  { th: 'SPOKEN · TIMED · CUED', en: 'SPOKEN · TIMED · CUED' },
  'st.1.desc': {
    th: 'สคริปต์การพูดสำหรับวิดีโอสั้น พร้อม timing markers ทุกวินาที B-roll cues และข้อความหน้าจอ — director\'s plan ฉบับเต็ม',
    en: 'Spoken video scripts with per-second timing markers, B-roll cues, and on-screen text — a complete director\'s plan.',
  },
  'st.2.name': { th: 'Caption Studio', en: 'Caption Studio' },
  'st.2.tag':  { th: 'POSTS · HOOKS · TAGS', en: 'POSTS · HOOKS · TAGS' },
  'st.2.desc': {
    th: 'แคปชั่น 5 variants, hooks ดึงสายตา, hashtags ตรงเทรนด์, CTA ปิดการขาย — ปรับโทนตามแพลตฟอร์มอัตโนมัติ',
    en: '5 caption variants, scroll-stopping hooks, trend-matched hashtags, closing CTAs — tone auto-tunes per platform.',
  },
  'st.3.name': { th: 'Combo Mode',     en: 'Combo Mode' },
  'st.3.tag':  { th: 'ALIGNED · PACKAGED · READY', en: 'ALIGNED · PACKAGED · READY' },
  'st.3.desc': {
    th: 'ปั้น script และ caption ใช้ hook เดียวกัน package พร้อมโพสต์ครบในไฟล์เดียว เหมาะกับ campaign ใหญ่',
    en: 'Script and caption on the same hook — ready-to-post package in one file. Built for major campaigns.',
  },

  // ─── BOTTOM CTA ────────────────────────────────────────────
  'bcta.h.serif': { th: 'Build the future.', en: 'Build the future.' },
  'bcta.h.iri':   { th: 'Built by you.',     en: 'Built by you.' },
  'bcta.p': {
    th: 'เริ่มต้นใช้ Capduction ฟรี 10 ครั้ง · ไม่ต้องใช้บัตรเครดิต · ยกเลิกได้ทุกเมื่อ',
    en: 'Try Capduction free for 10 generations · no credit card · cancel anytime.',
  },
  'bcta.btn': { th: 'เริ่มเลย →', en: 'Get started →' },

  // ─── FOOTER ────────────────────────────────────────────────
  'ft.tag': {
    th: 'สตูดิโอ AI ระหว่างไอเดียกับการกดอัปโหลด — สร้างในบางกอก เพื่อ creator ไทยทั่วประเทศ',
    en: 'The AI studio between idea and upload — built in Bangkok, for Thai creators everywhere.',
  },

  // ─── SIDEBAR / DASHBOARD ───────────────────────────────────
  'sidebar.analytics': { th: 'Analytics',  en: 'Analytics' },
  'sidebar.settings':  { th: 'ตั้งค่า',     en: 'Settings' },

  // ─── AUTH ──────────────────────────────────────────────────
  'auth.login.title':    { th: 'ยินดีต้อนรับกลับ',  en: 'Welcome back' },
  'auth.login.sub':      { th: 'เข้าสู่บัญชี Capduction ของคุณ', en: 'Sign in to your Capduction account' },
  'auth.signup.title':   { th: 'สร้างบัญชีใหม่',     en: 'Create your account' },
  'auth.signup.sub':     { th: 'เริ่มฟรี 10 ครั้ง ไม่ต้องใส่บัตรเครดิต', en: 'Start with 10 free generations · no credit card required' },
  'auth.email':          { th: 'อีเมล',              en: 'Email' },
  'auth.password':       { th: 'รหัสผ่าน',           en: 'Password' },
  'auth.submit.login':   { th: 'เข้าสู่ระบบ',         en: 'Sign in' },
  'auth.submit.signup':  { th: 'สร้างบัญชี',          en: 'Create account' },
  'auth.forgot':         { th: 'ลืมรหัสผ่าน?',         en: 'Forgot password?' },
  'auth.have_account':   { th: 'มีบัญชีอยู่แล้ว?',    en: 'Already have an account?' },
  'auth.no_account':     { th: 'ยังไม่มีบัญชี?',       en: 'Don\'t have an account?' },
  'auth.or':             { th: 'หรือ',                en: 'or' },
  'auth.google':         { th: 'เข้าสู่ระบบด้วย Google', en: 'Continue with Google' },
  'auth.method.magic':   { th: 'Magic Link',          en: 'Magic Link' },
  'auth.method.password':{ th: 'รหัสผ่าน',            en: 'Password' },
  'auth.magic.send':     { th: 'ส่ง Magic Link',       en: 'Send Magic Link' },
  'auth.magic.hint':     { th: 'ไม่ต้องจำรหัสผ่าน — เราจะส่งลิงก์เข้าสู่ระบบไปที่อีเมลของคุณ',
                          en: "No password needed — we'll email you a one-tap sign-in link" },
  'auth.magic.sent.title':{ th: '✦ ตรวจอีเมลของคุณ',  en: '✦ Check your email' },
  'auth.magic.sent.sub': { th: 'ส่งลิงก์เข้าสู่ระบบไปที่ {email} แล้ว — กดลิงก์ในอีเมลเพื่อเข้าสู่ระบบ',
                          en: 'A sign-in link was sent to {email} — tap it to continue' },
  'auth.magic.resend':   { th: '← ส่งลิงก์อีกครั้ง',    en: '← Send another link' },
  'auth.check_spam':     { th: 'ไม่เห็นในกล่องจดหมาย? ลองดูใน Spam / Junk',
                          en: "Don't see it? Check Spam / Junk" },
} as const;

export type DictKey = keyof typeof DICT;
