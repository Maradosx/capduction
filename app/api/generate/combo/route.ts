import { NextResponse } from 'next/server';
import { z } from 'zod';
import { buildComboPrompt } from '@/lib/prompts/combo';
import { generateCombo } from '@/lib/ai';
import {
  parseBody, authenticate, checkCredits, applyRateLimit,
  saveGenerationAndDecrement, isAdversarial, resolveBrandVoiceContext,
} from '@/lib/api-handler';
import { TONES, PLATFORMS, DURATIONS, type ComboRequest } from '@/types';

const Schema = z.object({
  productName:    z.string().min(1).max(100).trim(),
  category:       z.string().max(50).trim().default(''),
  targetCustomer: z.string().max(100).trim().default(''),
  tone:           z.enum(TONES).default('Persuasive'),
  platform:       z.enum(PLATFORMS).default('TikTok'),
  duration:       z.enum(DURATIONS).default('30s'),
  details:        z.string().max(500).trim().default(''),
  projectId:      z.string().uuid().optional(),
  brandVoiceId:   z.string().uuid().optional(),
});

export async function POST(req: Request) {
  try {
    const parsed = await parseBody(req, Schema);
    if (!parsed.ok) return parsed.error;
    const body = parsed.data;

    if ([body.productName, body.details, body.category].some(isAdversarial)) {
      return NextResponse.json(
        { success: false, error: 'Input contains disallowed content.' },
        { status: 400 }
      );
    }

    const auth = await authenticate(req);
    if (!auth.ok) return auth.error;

    const creditsErr = await checkCredits(auth.ctx);
    if (creditsErr) return creditsErr;

    const rlErr = await applyRateLimit(auth.ctx);
    if (rlErr) return rlErr;

    const bvContext = await resolveBrandVoiceContext(body.brandVoiceId);
    const prompt = buildComboPrompt(body as ComboRequest, bvContext);
    const combo = await generateCombo(prompt);

    await saveGenerationAndDecrement({
      ctx:            auth.ctx,
      studio:         'combo',
      productName:    body.productName,
      category:       body.category,
      targetCustomer: body.targetCustomer,
      tone:           body.tone,
      platform:       body.platform,
      duration:       body.duration,
      details:        body.details,
      projectId:      body.projectId,
      payload:        combo,
    });

    return NextResponse.json({ success: true, data: combo });
  } catch (err: any) {
    console.error('[API_GENERATE_COMBO]', err?.message ?? err);
    return NextResponse.json(
      { success: false, error: 'เกิดข้อผิดพลาด กรุณาลองใหม่' },
      { status: 500 }
    );
  }
}
