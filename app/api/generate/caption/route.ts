import { NextResponse } from 'next/server';
import { z } from 'zod';
import { buildCaptionPrompt } from '@/lib/prompts/caption';
import { generateCaption } from '@/lib/ai';
import {
  parseBody, authenticate, checkCredits, applyRateLimit,
  saveGenerationAndDecrement, isAdversarial, resolveBrandVoiceContext,
} from '@/lib/api-handler';
import { TONES, PLATFORMS, type CaptionRequest } from '@/types';

const Schema = z.object({
  productName:    z.string().min(1).max(100).trim(),
  category:       z.string().max(50).trim().default(''),
  targetCustomer: z.string().max(100).trim().default(''),
  tone:           z.enum(TONES).default('Friendly'),
  platform:       z.enum(PLATFORMS).default('General'),
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
    const prompt = buildCaptionPrompt(body as CaptionRequest, bvContext);
    const caption = await generateCaption(prompt);

    await saveGenerationAndDecrement({
      ctx:            auth.ctx,
      studio:         'caption',
      productName:    body.productName,
      category:       body.category,
      targetCustomer: body.targetCustomer,
      tone:           body.tone,
      platform:       body.platform,
      details:        body.details,
      projectId:      body.projectId,
      payload:        caption,
    });

    return NextResponse.json({ success: true, data: caption });
  } catch (err: any) {
    console.error('[API_GENERATE_CAPTION]', err?.message ?? err);
    return NextResponse.json(
      { success: false, error: 'เกิดข้อผิดพลาด กรุณาลองใหม่' },
      { status: 500 }
    );
  }
}
