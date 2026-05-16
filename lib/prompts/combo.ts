/**
 * Capduction — Combo Mode prompt builder
 * Generates script AND caption sharing the same hook
 */

import type { ComboRequest } from '@/types';

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

export function buildComboPrompt(req: ComboRequest, brandVoiceContext = ''): string {
  const beatCount = beatsFor(req.duration);
  const tonesText = joinOr(req.tones, 'Friendly');
  const variants  = Math.max(1, Math.min(3, req.variants ?? 1));
  const captionCount  = 5 * variants;
  const hookCount     = 5 * variants;

  return `You are an elite Thai short-form video director AND caption strategist. Your job is to generate BOTH a spoken video script AND a post caption that share the SAME core hook — perfectly aligned for one cohesive content package.

═══════════ CRITICAL RULES ═══════════
1. ONE HOOK, TWO USES: the sharedHook is the emotional pull. Both script's first beat and caption opening must echo it.
2. NATURAL THAI throughout. Mix English marketing words naturally.
3. TONE — blend these styles: ${tonesText}. (Honor any custom tone literally.)
4. Platform: ${req.platform}. Duration: ${req.duration}.

═══════════ PRODUCT ═══════════
Name:       ${req.productName}
Categories: ${joinOr(req.categories)}
Audience:   ${joinOr(req.targetCustomers, 'General')}
Details:    ${req.details || 'None'}
${variants > 1 ? `\n⚠ The user requested ${variants} content variants — scale caption count and angle variety accordingly.` : ''}

${brandVoiceContext ? `═══════════ BRAND VOICE ═══════════\n${brandVoiceContext}\n` : ''}
═══════════ YOUR TASK ═══════════

Generate THREE things in ONE response:

1. sharedHook — single Thai sentence (under 80 chars) that captures the core emotional pull
2. script — ${beatCount} beats with timecode/role/spoken/broll/onScreenText, totalSeconds, thumbnailCopy, postingChecklist
3. caption — ${captionCount} captions, ${hookCount} hooks (variant), 10 hashtags, 5 CTAs, 4 angles, 4 video ideas

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
}
