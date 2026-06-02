/**
 * Capduction — unified AI generator
 * - Wraps OpenAI GPT-4o chat completions with JSON response_format
 * - Falls back to mock data when OPENAI_API_KEY is absent (demo mode)
 */

import type { ScriptContent, CaptionContent, ComboContent, OutputLanguage } from '@/types';

/** Prompt builders return this so we can ship system + user as separate
 *  messages to OpenAI — maximises automatic prompt-cache hits on the
 *  static `system` prefix (~50% off cached input tokens). */
export type PromptInput = string | { system: string; user: string };

const OPENAI_URL = 'https://api.openai.com/v1/chat/completions';

/** Default model for paid tiers — quality moat of the product.
 *  Env `OPENAI_MODEL_PAID` overrides without redeploy. */
const MODEL_PAID = process.env.OPENAI_MODEL_PAID || 'gpt-4o';

/** Cheaper model for free tier — acquisition cost saver.
 *  Env `OPENAI_MODEL_FREE` overrides without redeploy. */
const MODEL_FREE = process.env.OPENAI_MODEL_FREE || 'gpt-4o-mini';

/** Hard cap to avoid Vercel killing the function uncontrolled at ~60s. */
const OPENAI_TIMEOUT_MS = 45_000;

/** Pick the right model for the caller's plan. */
function modelForPlan(plan: string | undefined): string {
  return (plan === 'free' || !plan) ? MODEL_FREE : MODEL_PAID;
}

class MissingApiKeyError extends Error {
  constructor() {
    super('MISSING_API_KEY');
    this.name = 'MissingApiKeyError';
  }
}

async function callOpenAI<T>(prompt: PromptInput, model: string = MODEL_PAID): Promise<T> {
  const key = process.env.OPENAI_API_KEY;
  if (!key || key === 'sk-proj-yourapikeyhere' || key.includes('REPLACE')) {
    throw new MissingApiKeyError();
  }

  // Build messages array — split system/user gives much better cache hit
  // because OpenAI sees the static system prefix is identical across calls.
  const messages = typeof prompt === 'string'
    ? [{ role: 'user' as const, content: prompt }]
    : [
        { role: 'system' as const, content: prompt.system },
        { role: 'user'   as const, content: prompt.user   },
      ];

  let res: Response;
  try {
    res = await fetch(OPENAI_URL, {
      method: 'POST',
      headers: {
        'Content-Type':  'application/json',
        Authorization:   `Bearer ${key}`,
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: 0.75,
        response_format: { type: 'json_object' },
      }),
      signal: AbortSignal.timeout(OPENAI_TIMEOUT_MS),
    });
  } catch (e: any) {
    if (e?.name === 'TimeoutError' || e?.name === 'AbortError') {
      throw new Error('AI request timed out — please try again');
    }
    throw e;
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message || `OpenAI HTTP ${res.status}`);
  }

  const data = await res.json();
  const text = data.choices?.[0]?.message?.content;
  try {
    return JSON.parse(text) as T;
  } catch {
    throw new Error('AI returned malformed JSON');
  }
}

// ─── Public generators (with mock fallback) ──────────────────────────────────
// Optional `plan` controls model selection — pass user's plan from the route.
// Optional `lang` only affects the DEMO mock (no API key) so local/demo runs
// preview the right language; the real output language is driven by the prompt.

export async function generateScript(prompt: PromptInput, plan?: string, lang: OutputLanguage = 'th'): Promise<ScriptContent> {
  try {
    return await callOpenAI<ScriptContent>(prompt, modelForPlan(plan));
  } catch (e) {
    if (e instanceof MissingApiKeyError) return mockScript(lang);
    throw e;
  }
}

export async function generateCaption(prompt: PromptInput, plan?: string, lang: OutputLanguage = 'th'): Promise<CaptionContent> {
  try {
    return await callOpenAI<CaptionContent>(prompt, modelForPlan(plan));
  } catch (e) {
    if (e instanceof MissingApiKeyError) return mockCaption(lang);
    throw e;
  }
}

export async function generateCombo(prompt: PromptInput, plan?: string, lang: OutputLanguage = 'th'): Promise<ComboContent> {
  try {
    return await callOpenAI<ComboContent>(prompt, modelForPlan(plan));
  } catch (e) {
    if (e instanceof MissingApiKeyError) return mockCombo(lang);
    throw e;
  }
}

// ─── DEMO MODE MOCKS ─────────────────────────────────────────────────────────

function mockScript(lang: OutputLanguage = 'th'): ScriptContent {
  if (lang === 'en') return mockScriptEN();
  return {
    beats: [
      {
        timecode: '00:00',
        role: 'HOOK',
        spoken: '"ริมฝีปากแดงที่คนหันมามอง — ติด 12 ชั่วโมง ไม่ต้องแตะเลย"',
        broll: 'Close-up of model applying lipstick, mirror reflection',
        onScreenText: '12 ชั่วโมง · ไม่หลุด',
      },
      {
        timecode: '00:05',
        role: 'BODY',
        spoken: '"เนื้อแมตต์ เนียนไม่กินผิว สีคลาสสิคที่ใส่กับชุดอะไรก็ได้ ลองทาช่วงเช้า เที่ยงยังอยู่ เย็นยังสวย"',
        broll: 'Texture demo on hand swatch + outfit changes timelapse',
        onScreenText: 'แมตต์ × ติดทน × ไม่ทำให้ผิดหวัง',
      },
      {
        timecode: '00:18',
        role: 'PROOF',
        spoken: '"รีวิวล้นจาก 2,000+ ลูกค้า ส่งฟรีทั่วประเทศ"',
        broll: 'Quick montage of customer reviews / 5-star screenshots',
        onScreenText: '2,000+ รีวิว ★★★★★',
      },
      {
        timecode: '00:25',
        role: 'CTA',
        spoken: '"กดลิงก์ในโปรไฟล์ สั่งวันนี้ลด 20% เฉพาะ 50 คนแรก"',
        broll: 'Phone screen showing checkout',
        onScreenText: 'ลด 20% · 50 คนแรกเท่านั้น',
      },
    ],
    totalSeconds: 30,
    thumbnailCopy: 'ลิปแดง 12 ชม. ไม่ต้องแตะ',
    postingChecklist: [
      'ใส่ลิงก์สินค้าใน bio',
      'ตั้งเวลาโพสต์ 19:00-21:00',
      'ตอบคอมเมนต์ 30 นาทีแรกหลังโพสต์',
      'เตรียม FAQ ตอบลูกค้าเรื่องสี/ราคา',
    ],
  };
}

function mockCaption(lang: OutputLanguage = 'th'): CaptionContent {
  if (lang === 'en') return mockCaptionEN();
  return {
    captions: [
      `🚨 Must Have ลิปแดงตัวที่ลูกค้าตามหาเยอะที่สุด!\n\nใครกำลังเบื่อลิปสีเดิมๆ ต้องลองตัวนี้ค่า 💖 เนื้อแมตต์ ติด 12 ชั่วโมง ใส่กับชุดอะไรก็ปัง\n\n✅ ไม่กินผิว ไม่ลอกเป็นแผ่น\n✅ สีคลาสสิคใส่ได้ทุกโอกาส\n✅ รีวิว 5 ดาวจาก 2,000+ ลูกค้า\n\n🔥 โปรนี้มีจำกัด ลด 20% เฉพาะ 50 คนแรก รีบทักด่วน!`,
      `📢 Restock แล้วค่า! รอบที่แล้วหมดใน 2 ชั่วโมง 🔥\n\nลิปแดงแมตต์ Best Seller ที่ลูกค้าทักมาตามทุกวัน ตอนนี้ของเข้าใหม่ 100 ชิ้นเท่านั้น\n\nสีแดงคลาสสิคที่จะทำให้คุณดูเปล่งปลั่งทันที ไม่ว่าจะใส่กับชุดทำงานหรือไปเที่ยว\n\nอย่ารอช้านะคะ กดสั่งได้เลย 👇`,
      `รีวิวพลีชีพ! 💄 ลิปติดทน 12 ชั่วโมงที่ไม่ต้องแตะเลย\n\nทดลองทาตั้งแต่ 8 โมงเช้า ดื่มกาแฟ กินข้าวเที่ยง คุยลูกค้าทั้งวัน — สีคงสภาพเดิม ไม่ลอก ไม่หลุดติดแก้ว\n\nคนที่บอกว่า "ลิปแมตต์ทำริมปากแห้ง" — ตัวนี้ไม่ใช่ค่า เนื้อนุ่ม ลื่น สบายปาก\n\nกดลิงก์ในโปรไฟล์เลย`,
      `ทำไมลิปตัวนี้ขายดีจนต้อง restock ทุกเดือน? 🤔\n\nคำตอบสั้นๆ คือ: มันใช้แล้วลืมเปลี่ยน เพราะติดทนจริง สีสวยจริง\n\n💎 เนื้อแมตต์เนียนไม่ลอก\n💎 ติดทน 12 ชั่วโมง\n💎 ส่งฟรีทั่วประเทศ\n💎 ราคา ฿299 ลด 20% สำหรับ 50 คนแรก\n\nกดลิงก์โปรไฟล์ทักแชทเลยจ้า`,
      `เคล็ดลับริมฝีปากสวยที่อินฟลูฯ ไม่ค่อยบอก 💋\n\nไม่ใช่เพราะเค้าใช้ลิปแบรนด์เนม — แต่ใช้ลิปที่ติดทนพอที่จะไม่ต้องเติมระหว่างวัน\n\nลิปตัวนี้คือคำตอบค่า ฿299 ลดเหลือ ฿239 (เฉพาะ 50 คนแรก) ส่งฟรี\n\nทักแชทแล้วบอก code "VIRAL20" รับส่วนลดทันที`,
    ],
    hooks: [
      'หยุดไถฟีด 1 วิ! ถ้าคุณกำลังหาลิปติดทนจริงๆ 🛑',
      'รีวิวพลีชีพ — 12 ชั่วโมงผ่านไปสีไม่หาย 💄',
      'ของเข้าใหม่! รอบที่แล้วหมดใน 2 ชั่วโมง 🔥',
      'ทำไมใครๆ ก็พูดถึงลิปแมตต์ตัวนี้? 🤫',
      'จ่ายแพงทำไม? ในเมื่อตัวนี้ดีกว่าหลายเท่า 😱',
    ],
    hashtags: [
      '#ลิปสติก', '#ลิปแดง', '#mattelip', '#รีวิวลิป',
      '#ลิปติดทน', '#แต่งหน้า', '#TikTokShop',
      '#ของมันต้องมี', '#ลิปไทย', '#freeshipping',
    ],
    cta: [
      'ทักแชทเลย แอดมินตอบไวมาก!',
      'สั่งวันนี้ ลด 20% เฉพาะ 50 คนแรก',
      'กดใส่ตะกร้าก่อนของหมดอีกรอบ',
      'คลิกลิงก์ในโปรไฟล์ทักรับโค้ดส่วนลด',
      'คอมเมนต์ "1" รับลิงก์สั่งซื้อทาง DM',
    ],
    angles: [
      'Emotional: ปัญหาริมฝีปากแห้ง/สีหลุดเร็ว → ลิปนี้แก้ทุกความผิดหวัง',
      'Problem Solving: ทดลอง 12 ชม.ในชีวิตจริง → ยังสวยเหมือนเดิม',
      'Premium Positioning: คุณภาพระดับแบรนด์เนม ราคาเข้าถึงได้',
      'Social Proof: รีวิว 2,000+ ลูกค้า / Best Seller / ขายดีต้อง restock',
    ],
    contentIdeas: [
      'Unbox/Swatch: โชว์สี-เนื้อ-กลิ่น พร้อม ASMR แกะกล่อง',
      'POV: ใส่ตอนเช้า → ไปทำงาน → ดูสีตอนเย็น (timelapse)',
      'Before/After: ก่อนทา vs หลังทา 12 ชม. คอนเทนต์เปรียบเทียบตรงๆ',
      'ตอบรีวิวลูกค้า: หยิบ DM/คอมเมนต์จริงมาเล่าเป็น story',
    ],
  };
}

function mockCombo(lang: OutputLanguage = 'th'): ComboContent {
  if (lang === 'en') {
    return {
      sharedHook: 'The red lip everyone turns to look at — 12 hours, zero touch-ups.',
      script: mockScriptEN(),
      caption: mockCaptionEN(),
    };
  }
  return {
    sharedHook: 'ริมฝีปากแดงที่คนหันมามอง — ติด 12 ชั่วโมง ไม่ต้องแตะเลย',
    script: mockScript(),
    caption: mockCaption(),
  };
}

// ─── English demo mocks ──────────────────────────────────────────────────────

function mockScriptEN(): ScriptContent {
  return {
    beats: [
      {
        timecode: '00:00',
        role: 'HOOK',
        spoken: '"The red lip everyone turns to look at — 12 hours, zero touch-ups."',
        broll: 'Close-up of model applying lipstick, mirror reflection',
        onScreenText: '12 hours · no touch-ups',
      },
      {
        timecode: '00:05',
        role: 'BODY',
        spoken: '"A matte finish that never dries you out, in a classic shade for any outfit. Swipe it on at 8am — still flawless by dinner."',
        broll: 'Texture demo on hand swatch + outfit changes timelapse',
        onScreenText: 'Matte × long-wear × never lets you down',
      },
      {
        timecode: '00:18',
        role: 'PROOF',
        spoken: '"Over 2,000 five-star reviews · free shipping nationwide."',
        broll: 'Quick montage of customer reviews / 5-star screenshots',
        onScreenText: '2,000+ reviews ★★★★★',
      },
      {
        timecode: '00:25',
        role: 'CTA',
        spoken: '"Tap the link in bio — 20% off today, first 50 only."',
        broll: 'Phone screen showing checkout',
        onScreenText: '20% off · first 50 only',
      },
    ],
    totalSeconds: 30,
    thumbnailCopy: 'Red lip · 12hr · no touch-ups',
    postingChecklist: [
      'Add the product link in your bio',
      'Schedule the post for 7-9pm',
      'Reply to comments in the first 30 minutes',
      'Prep an FAQ for shade/price questions',
    ],
  };
}

function mockCaptionEN(): CaptionContent {
  return {
    captions: [
      `🚨 The Must-Have red lip our customers keep coming back for!\n\nBored of the same old shades? You need this one 💖 Matte finish, 12-hour wear, pairs with any outfit.\n\n✅ Won't dry out or flake\n✅ A classic shade for every occasion\n✅ 5-star rated by 2,000+ customers\n\n🔥 Limited drop — 20% off, first 50 only. DM us fast!`,
      `📢 Restocked! Last drop sold out in 2 hours 🔥\n\nOur Best-Seller matte red that customers DM us for every day — only 100 units back in stock.\n\nA classic red that makes you glow instantly, whether it's a work day or a night out.\n\nDon't sleep on it — tap to order 👇`,
      `Honest 12-hour wear test 💄 a lip that truly doesn't budge.\n\nPut it on at 8am — coffee, lunch, back-to-back calls all day. Color stayed put. No flaking, no transfer onto the cup.\n\nThink matte means dry lips? Not this one. Soft, smooth, comfortable all day.\n\nTap the link in bio.`,
      `Why does this lip sell out enough to restock every month? 🤔\n\nShort answer: people use it and forget to switch — because it actually lasts and the color is genuinely beautiful.\n\n💎 Matte, smooth, no flaking\n💎 12-hour wear\n💎 Free shipping nationwide\n💎 $9 — 20% off for the first 50\n\nTap the link in bio and DM us`,
      `The lip-perfection trick influencers don't talk about 💋\n\nIt's not a luxury brand — it's a lip that lasts long enough that you never re-apply mid-day.\n\nThis is the one. $9, now $7 (first 50 only), free shipping.\n\nDM us the code "VIRAL20" for your discount`,
    ],
    hooks: [
      'Stop scrolling if you actually want a lip that lasts 🛑',
      'Honest 12-hour wear test — color never moved 💄',
      'Back in stock — last drop sold out in 2 hours 🔥',
      'Why is everyone talking about this matte lip? 🤫',
      'Why pay premium when this one beats it? 😱',
    ],
    hashtags: [
      '#lipstick', '#redlip', '#mattelip', '#lipreview',
      '#longwearlip', '#makeup', '#TikTokShop',
      '#musthave', '#beautytok', '#freeshipping',
    ],
    cta: [
      'DM us — our team replies fast!',
      'Order today, 20% off first 50',
      'Add to cart before it sells out again',
      'Tap the link in bio for your discount code',
      'Comment "1" and we\'ll DM you the link',
    ],
    angles: [
      'Emotional: dry lips / color fading fast → this lip fixes every letdown',
      'Problem Solving: a real 12-hour day → still looks fresh',
      'Premium Positioning: luxury-level quality at an accessible price',
      'Social Proof: 2,000+ reviews / Best-Seller / sells out and restocks',
    ],
    contentIdeas: [
      'Unbox/Swatch: show color-texture-scent with ASMR unboxing',
      'POV: apply in the morning → go to work → check color at night (timelapse)',
      'Before/After: bare lips vs after 12 hours — a direct comparison',
      'React to reviews: turn real DMs/comments into a story',
    ],
  };
}
