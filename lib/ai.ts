/**
 * Capduction — unified AI generator
 * - Wraps OpenAI GPT-4o chat completions with JSON response_format
 * - Falls back to mock data when OPENAI_API_KEY is absent (demo mode)
 */

import type { ScriptContent, CaptionContent, ComboContent } from '@/types';

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

export async function generateScript(prompt: PromptInput, plan?: string): Promise<ScriptContent> {
  try {
    return await callOpenAI<ScriptContent>(prompt, modelForPlan(plan));
  } catch (e) {
    if (e instanceof MissingApiKeyError) return mockScript();
    throw e;
  }
}

export async function generateCaption(prompt: PromptInput, plan?: string): Promise<CaptionContent> {
  try {
    return await callOpenAI<CaptionContent>(prompt, modelForPlan(plan));
  } catch (e) {
    if (e instanceof MissingApiKeyError) return mockCaption();
    throw e;
  }
}

export async function generateCombo(prompt: PromptInput, plan?: string): Promise<ComboContent> {
  try {
    return await callOpenAI<ComboContent>(prompt, modelForPlan(plan));
  } catch (e) {
    if (e instanceof MissingApiKeyError) return mockCombo();
    throw e;
  }
}

// ─── DEMO MODE MOCKS ─────────────────────────────────────────────────────────

function mockScript(): ScriptContent {
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

function mockCaption(): CaptionContent {
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

function mockCombo(): ComboContent {
  return {
    sharedHook: 'ริมฝีปากแดงที่คนหันมามอง — ติด 12 ชั่วโมง ไม่ต้องแตะเลย',
    script: mockScript(),
    caption: mockCaption(),
  };
}
