/**
 * Capduction — Combo Mode prompt builder
 * Generates script AND caption sharing the same hook
 */

import type { ComboRequest, Duration } from '@/types';

const DURATION_BEATS: Record<Duration, number> = {
  '15s': 3, '30s': 4, '60s': 5, '90s': 6, 'long': 8,
};

export function buildComboPrompt(req: ComboRequest, brandVoiceContext = ''): string {
  const beatCount = DURATION_BEATS[req.duration];

  return `You are an elite Thai short-form video director AND caption strategist. Your job is to generate BOTH a spoken video script AND a post caption that share the SAME core hook — perfectly aligned for one cohesive content package.

═══════════ CRITICAL RULES ═══════════
1. ONE HOOK, TWO USES: the sharedHook is the emotional pull. Both script's first beat and caption opening must echo it.
2. NATURAL THAI throughout. Mix English marketing words naturally.
3. Tone: ${req.tone}. Platform: ${req.platform}. Duration: ${req.duration}.

═══════════ PRODUCT ═══════════
Name:     ${req.productName}
Category: ${req.category || 'Not specified'}
Audience: ${req.targetCustomer || 'General'}
Details:  ${req.details || 'None'}

${brandVoiceContext ? `═══════════ BRAND VOICE ═══════════\n${brandVoiceContext}\n` : ''}
═══════════ YOUR TASK ═══════════

Generate THREE things in ONE response:

1. sharedHook — single Thai sentence (under 80 chars) that captures the core emotional pull
2. script — ${beatCount} beats with timecode/role/spoken/broll/onScreenText, totalSeconds, thumbnailCopy, postingChecklist
3. caption — 5 captions, 5 hooks (variant), 10 hashtags, 5 CTAs, 4 angles, 4 video ideas

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
    "captions":     ["...", "...", "...", "...", "..."],
    "hooks":        ["...", "...", "...", "...", "..."],
    "hashtags":     ["#tag1", "..."],
    "cta":          ["...", "...", "...", "...", "..."],
    "angles":       ["...", "...", "...", "..."],
    "contentIdeas": ["...", "...", "...", "..."]
  }
}

WARNING: ONLY the raw JSON. No \`\`\`, no preamble.`;
}
