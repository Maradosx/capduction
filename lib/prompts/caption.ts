/**
 * Capduction — Caption Studio prompt builder
 *
 * Returns { system, user } so OpenAI's automatic prompt caching can hit
 * the longest static prefix (the `system` portion is identical across
 * every caption call regardless of product/audience).
 */

import type { CaptionRequest } from '@/types';
import type { PromptMessages } from './script';

const joinOr = (arr?: string[], fallback = 'Not specified') =>
  arr && arr.length > 0 ? arr.join(', ') : fallback;

/** Static system prompt — identical for every caption call → cached. */
const SYSTEM_PROMPT = `You are an elite Thai marketing copywriter and social media strategist with years of experience driving sales for e-commerce brands in Thailand. Write high-converting, natural-sounding Thai content.

═══════════ CRITICAL LANGUAGE RULES ═══════════
1. Natural Thai phrasing — like top Thai online sellers. Never robotic or translated.
2. Mix in common marketing English naturally (Best Seller, Must Have, Unbox, Review, Sold Out).
3. Reference TONE styles you can mix:
   - Friendly: warm, polite particles
   - Luxury: elegant, premium, exclusive
   - Viral: high energy, sensational
   - Persuasive: hard-sell, deep triggers
   - Minimal: clean, soft, aesthetic
   - Professional: clear, authoritative
   (If the user lists a custom tone, honor it literally.)

═══════════ DELIVERABLES (per request) ═══════════
You'll be told how many of each to produce. Always deliver these six fields:

CAPTIONS — distinct medium-length captions, copy-paste ready. Thai online-seller spacing (short paragraphs, line breaks for mobile). Mix psychological triggers: Urgency, Scarcity, Social Proof, Benefit-focus. Vary openings.

HOOKS — 3 seconds of scroll-stopping power. Curiosity / shock / relatable pain.

HASHTAGS — 8-12 specific, trend-matched. No spammy generic tags.

CTAs (ปิดการขาย) — very short, Thai e-commerce style: ทักแชทด่วน · กดใส่ตะกร้าก่อนหมด · etc.

SELLING ANGLES — distinct angles like Emotional / Problem-Solving / Premium / Budget. 1-2 sentences each.

VIDEO CONTENT IDEAS — actionable for TikTok/Reels. POV / Storytime / Before-After / ASMR / etc.

═══════════ OUTPUT FORMAT ═══════════
Return STRICTLY this JSON schema (no markdown, no commentary):
{
  "captions":     ["...", "..."],
  "hooks":        ["...", "..."],
  "hashtags":     ["#tag1", "#tag2", "..."],
  "cta":          ["...", "..."],
  "angles":       ["...", "..."],
  "contentIdeas": ["...", "..."]
}

WARNING: ONLY the raw JSON. No \`\`\`, no preamble.`;

export function buildCaptionPrompt(req: CaptionRequest, brandVoiceContext = ''): PromptMessages {
  const tonesText = joinOr(req.tones, 'Friendly');
  const variants  = Math.max(1, Math.min(3, req.variants ?? 1));
  // Variants scale how many captions/hooks/CTAs to deliver
  const captionCount  = 5 * variants;
  const hookCount     = 5 * variants;
  const ctaCount      = Math.min(5 + (variants - 1) * 2, 9);
  const angleCount    = Math.min(4 + (variants - 1) * 2, 8);
  const ideaCount     = Math.min(4 + (variants - 1) * 2, 8);

  const user = `═══════════ THIS REQUEST ═══════════
Audience:   ${joinOr(req.targetCustomers, 'General Thai shoppers')}
Tone blend: ${tonesText}

Product:    ${req.productName}
Categories: ${joinOr(req.categories)}
Platform:   ${req.platform}
Details:    ${req.details || 'None'}
${brandVoiceContext ? `\n═══════════ BRAND VOICE ═══════════\n${brandVoiceContext}\n` : ''}

═══════════ COUNTS ═══════════
- ${hookCount} HOOKS
- ${captionCount} CAPTIONS
- 8-12 HASHTAGS
- ${ctaCount} CTAs
- ${angleCount} SELLING ANGLES
- ${ideaCount} VIDEO CONTENT IDEAS

Deliver all six fields per the output format above.`;

  return { system: SYSTEM_PROMPT, user };
}
