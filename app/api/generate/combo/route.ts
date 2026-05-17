import { NextResponse } from 'next/server';
import { z } from 'zod';
import { buildComboPrompt } from '@/lib/prompts/combo';
import { generateCombo } from '@/lib/ai';
import {
  parseBody, authenticate, checkCredits, applyRateLimit,
  saveGenerationAndDecrement, isAdversarial, resolveBrandVoiceContext,
} from '@/lib/api-handler';
import { reportError } from '@/lib/error';
import { PLATFORMS, type ComboRequest } from '@/types';

const Schema = z.object({
  productName:     z.string().min(1).max(100).trim(),
  categories:      z.array(z.string().max(50).trim()).max(8).default([]),
  targetCustomers: z.array(z.string().max(100).trim()).max(8).default([]),
  tones:           z.array(z.string().max(30).trim()).min(1).max(6).default(['Persuasive']),
  platform:        z.enum(PLATFORMS).default('TikTok'),
  duration:        z.string().max(20).trim().default('30s'),
  details:         z.string().max(800).trim().default(''),
  variants:        z.number().int().min(1).max(3).default(1),
  projectId:       z.string().uuid().optional(),
  brandVoiceId:    z.string().uuid().optional(),
});

export async function POST(req: Request) {
  try {
    const parsed = await parseBody(req, Schema);
    if (!parsed.ok) return parsed.error;
    const body = parsed.data;

    const adversarialInputs: string[] = [body.productName, body.details, ...body.categories];
    if (adversarialInputs.some(isAdversarial)) {
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
    const combo = await generateCombo(prompt, auth.ctx.plan);

    await saveGenerationAndDecrement({
      ctx:            auth.ctx,
      studio:         'combo',
      productName:    body.productName,
      category:       body.categories.join(', '),
      targetCustomer: body.targetCustomers.join(', '),
      tone:           body.tones[0] ?? 'Persuasive',
      platform:       body.platform,
      duration:       body.duration,
      details:        body.details,
      projectId:      body.projectId,
      payload:        combo,
    });

    return NextResponse.json({ success: true, data: combo });
  } catch (err: any) {
    reportError(err, { scope: 'api/generate/combo' });
    return NextResponse.json(
      { success: false, error: 'เกิดข้อผิดพลาด กรุณาลองใหม่' },
      { status: 500 }
    );
  }
}
