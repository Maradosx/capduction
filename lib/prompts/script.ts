/**
 * Capduction — Script Studio prompt builder
 * Generates spoken video scripts with per-second timing + B-roll cues
 *
 * Returns { system, user } so OpenAI's automatic prompt caching can hit
 * the longest static prefix (the `system` portion is identical across
 * every script call regardless of product/audience).
 */

import type { ScriptRequest } from '@/types';

const DURATION_BEATS_PRESET: Record<string, { count: number; secondsPerBeat: string }> = {
  '15s':  { count: 3, secondsPerBeat: '~5 seconds each' },
  '30s':  { count: 4, secondsPerBeat: '~7 seconds each' },
  '60s':  { count: 5, secondsPerBeat: '~12 seconds each' },
  '90s':  { count: 6, secondsPerBeat: '~15 seconds each' },
  'long': { count: 8, secondsPerBeat: 'flexible' },
};

/** Pick a beat count from a duration string. Supports presets ('15s'..'90s',
 * 'long') and custom values like '45s', '2 min'. */
function beatsFor(duration: string): { count: number; secondsPerBeat: string } {
  if (DURATION_BEATS_PRESET[duration]) return DURATION_BEATS_PRESET[duration];
  const secMatch = duration.match(/(\d+)\s*s?$/i);
  if (secMatch) {
    const s = parseInt(secMatch[1], 10);
    if (s <= 20)  return { count: 3, secondsPerBeat: `~${Math.round(s/3)}s each` };
    if (s <= 45)  return { count: 4, secondsPerBeat: `~${Math.round(s/4)}s each` };
    if (s <= 75)  return { count: 5, secondsPerBeat: `~${Math.round(s/5)}s each` };
    if (s <= 120) return { count: 6, secondsPerBeat: `~${Math.round(s/6)}s each` };
  }
  return { count: 6, secondsPerBeat: 'flexible' };
}

const joinOr = (arr?: string[], fallback = 'Not specified') =>
  arr && arr.length > 0 ? arr.join(', ') : fallback;

/** Identical for every script call → OpenAI caches this prefix (50% off). */
const SYSTEM_PROMPT = `You are an elite Thai short-form video director and scriptwriter. Your job is to write a spoken video script that sells effectively to Thai online buyers.

═══════════ CRITICAL LANGUAGE RULES ═══════════
1. NATURAL THAI: Use conversational, native Thai phrasing — like top Thai TikTok/Reels sellers. Never robotic, never translated-feeling.
2. ENGLISH MIX: Naturally mix common marketing English (Best Seller, Must Have, Unbox, Review, Sold Out) where Thai sellers actually do.
3. Reference TONE styles you can mix:
   - Friendly: warm, polite particles "นะคะ/ครับ/ค่า"
   - Professional: clear, authoritative, less slang
   - Luxury: elegant, premium-positioning, exclusive feel
   - Viral: high energy, dramatic, sensational hooks
   - Persuasive: hard-selling, deep triggers, objection handling
   - Minimal: clean, calm, aesthetic restraint
   (If the user lists a custom tone, honor it literally.)

═══════════ STRUCTURE ═══════════
A complete spoken video script broken into timed beats:
- BEAT 1: HOOK (first 1-3 seconds — must stop the scroll)
- MIDDLE BEATS: BODY / PROOF / OBJECTION
- LAST BEAT: CTA (clear next step)

For each beat provide:
- timecode: "MM:SS" mark when beat starts (00:00, 00:05, 00:18, etc.)
- role: one word — HOOK | BODY | PROOF | OBJECTION | CTA
- spoken: the exact Thai words the creator says (natural, ready to read aloud)
- broll: optional shot/B-roll cue in English (e.g., "close-up of product", "POV unboxing")
- onScreenText: optional Thai text overlay that appears on screen during this beat

Also provide:
- totalSeconds: integer total estimated duration
- thumbnailCopy: 1 short Thai phrase (under 30 chars) for video cover text
- postingChecklist: array of 3-5 Thai action items to remember when posting (e.g., "ใส่ link ในโปรไฟล์", "ตั้งเวลาโพสต์ 19:00")

═══════════ OUTPUT FORMAT ═══════════
Return STRICTLY this JSON schema (no markdown, no commentary):
{
  "beats": [
    {
      "timecode": "00:00",
      "role": "HOOK",
      "spoken": "...",
      "broll": "...",
      "onScreenText": "..."
    }
  ],
  "totalSeconds": 30,
  "thumbnailCopy": "...",
  "postingChecklist": ["...", "..."]
}

WARNING: ONLY the raw JSON. No \`\`\`, no preamble.`;

export interface PromptMessages {
  system: string;
  user: string;
}

export function buildScriptPrompt(
  req: ScriptRequest,
  brandVoiceContext = '',
  variantIndex: number | null = null,
): PromptMessages {
  const beatSpec = beatsFor(req.duration);
  const tonesText = joinOr(req.tones, 'Friendly');
  const variants  = Math.max(1, Math.min(3, req.variants ?? 1));

  // When server-side parallel-fanout is used, variantIndex picks a
  // diversification angle so each script feels distinct.
  const ANGLES = [
    'Lead with PROOF — start with a result/before-after that demonstrates the product works.',
    'Lead with PROBLEM — open by surfacing a pain the audience has tried to solve and failed.',
    'Lead with CURIOSITY — open with a surprising statement or contrarian take that demands explanation.',
  ];
  const angleHint = variantIndex !== null && variants > 1
    ? `\n⚠ This is variant ${variantIndex + 1} of ${variants}. ${ANGLES[variantIndex] ?? ''}`
    : '';

  const user = `═══════════ THIS REQUEST ═══════════
Audience:   ${joinOr(req.targetCustomers, 'General Thai shoppers')}
Tone blend: ${tonesText}

Product:    ${req.productName}
Categories: ${joinOr(req.categories)}
Platform:   ${req.platform}
Duration:   ${req.duration} (${beatSpec.count} beats, ${beatSpec.secondsPerBeat})
Details:    ${req.details || 'None'}
${brandVoiceContext ? `\n═══════════ BRAND VOICE ═══════════\n${brandVoiceContext}\n` : ''}${angleHint}

Generate a complete script with exactly ${beatSpec.count} beats following the structure and output format above.`;

  return { system: SYSTEM_PROMPT, user };
}
