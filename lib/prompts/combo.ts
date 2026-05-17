/**
 * Capduction — Combo Mode prompt builder
 * Generates script AND caption sharing the same hook
 *
 * Returns { system, user } for OpenAI prompt-cache prefix matching.
 */

import type { ComboRequest } from '@/types';
import type { PromptMessages } from './script';

const DURATION_BEATS_PRESET: Record<string, number> = {
  '15s': 3, '30s': 4, '60s': 5, '90s': 6, 'long': 8,
};

function beatsFor(duration: string): number {
  if (DURATION_BEATS_PRESET[duration]) return DURATION_BEATS_PRESET[duration];
  const m = duration.match(/(\d+)\s*s?$/i);
  if (m) {
    const s = parseInt(m[1], 10);
    if (s <= 20)  return 3;
    if (s <= 45)  return 4;
    if (s <= 75)  return 5;
    if (s <= 120) return 6;
  }
  return 6;
}

const joinOr = (arr?: string[], fallback = 'Not specified') =>
  arr && arr.length > 0 ? arr.join(', ') : fallback;

/** Static system prompt — identical for every combo call → cached. */
const SYSTEM_PROMPT = `You are an elite Thai short-form video director AND caption strategist. Your job is to generate BOTH a spoken video script AND a post caption that share the SAME core hook — perfectly aligned for one cohesive content package.

═══════════ CRITICAL RULES ═══════════
1. ONE HOOK, TWO USES: the sharedHook is the emotional pull. Both script's first beat and caption opening must echo it.
2. NATURAL THAI throughout. Mix English marketing words naturally.
3. Reference TONE styles (honor any custom tone literally):
   - Friendly: warm, polite particles
   - Luxury: elegant, premium, exclusive
   - Viral: high energy, sensational
   - Persuasive: hard-sell, deep triggers
   - Minimal: clean, soft, aesthetic
   - Professional: clear, authoritative

═══════════ STRUCTURE ═══════════
Three things in ONE response:

1. sharedHook — single Thai sentence (under 80 chars) that captures the core emotional pull
2. script — beats with timecode/role/spoken/broll/onScreenText, plus totalSeconds, thumbnailCopy, postingChecklist
3. caption — captions, hooks, hashtags, CTAs, angles, video ideas

The script's first beat (HOOK) MUST be a direct expansion of sharedHook.
The first caption variant MUST open with words from sharedHook.

═══════════ OUTPUT FORMAT ═══════════
Return STRICTLY this JSON (no markdown, no commentary):
{
  "sharedHook": "...",
  "script": {
    "beats": [
      { "timecode": "00:00", "role": "HOOK", "spoken": "...", "broll": "...", "onScreenText": "..." }
    ],
    "totalSeconds": 30,
    "thumbnailCopy": "...",
    "postingChecklist": ["...", "..."]
  },
  "caption": {
    "captions":     ["...", "..."],
    "hooks":        ["...", "..."],
    "hashtags":     ["#tag1", "..."],
    "cta":          ["...", "..."],
    "angles":       ["...", "..."],
    "contentIdeas": ["...", "..."]
  }
}

WARNING: ONLY the raw JSON. No \`\`\`, no preamble.`;

export function buildComboPrompt(req: ComboRequest, brandVoiceContext = ''): PromptMessages {
  const beatCount = beatsFor(req.duration);
  const tonesText = joinOr(req.tones, 'Friendly');
  const variants  = Math.max(1, Math.min(3, req.variants ?? 1));
  const captionCount  = 5 * variants;
  const hookCount     = 5 * variants;

  const user = `═══════════ THIS REQUEST ═══════════
Audience:   ${joinOr(req.targetCustomers, 'General Thai shoppers')}
Tone blend: ${tonesText}

Product:    ${req.productName}
Categories: ${joinOr(req.categories)}
Platform:   ${req.platform}
Duration:   ${req.duration}
Details:    ${req.details || 'None'}
${brandVoiceContext ? `\n═══════════ BRAND VOICE ═══════════\n${brandVoiceContext}\n` : ''}
${variants > 1 ? `\n⚠ The user requested ${variants} content variants — scale caption count and angle variety accordingly.` : ''}

═══════════ COUNTS ═══════════
- script: ${beatCount} beats
- caption: ${captionCount} captions, ${hookCount} hooks, 10 hashtags, 5 CTAs, 4 angles, 4 video ideas

Deliver sharedHook + script + caption per the output format above.`;

  return { system: SYSTEM_PROMPT, user };
}
