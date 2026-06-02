import { NextResponse } from 'next/server';
import { z } from 'zod';
import { buildCaptionPrompt } from '@/lib/prompts/caption';
import { generateCaption } from '@/lib/ai';
import {
  parseBody, authenticate, reserveCredits, refundCredits, applyRateLimit,
  saveGeneration, isAdversarial, resolveBrandVoiceContext,
} from '@/lib/api-handler';
import { reportError } from '@/lib/error';
import { PLATFORMS, type CaptionRequest } from '@/types';

const Schema = z.object({
  productName:     z.string().min(1).max(100).trim(),
  categories:      z.array(z.string().max(50).trim()).max(8).default([]),
  targetCustomers: z.array(z.string().max(100).trim()).max(8).default([]),
  tones:           z.array(z.string().max(30).trim()).min(1).max(6).default(['Friendly']),
  platform:        z.enum(PLATFORMS).default('General'),
  details:         z.string().max(800).trim().default(''),
  variants:        z.number().int().min(1).max(3).default(1),
  outputLanguage:  z.enum(['th', 'en']).default('th'),
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

    const variantCount = Math.max(1, Math.min(3, body.variants ?? 1));

    // Rate-limit BEFORE charging so throttled requests never spend credits.
    const rlErr = await applyRateLimit(auth.ctx);
    if (rlErr) return rlErr;

    // Atomic reserve up front closes the concurrency race (no free AI runs).
    const creditsErr = await reserveCredits(auth.ctx, variantCount);
    if (creditsErr) return creditsErr;

    let payload: unknown;
    try {
      const bvContext = await resolveBrandVoiceContext(body.brandVoiceId);

      // Fan-out for variants > 1 — each call gets a distinct angle
      // (EMOTIONAL / PROBLEM-SOLUTION / SOCIAL-PROOF) so the tabs show
      // genuinely different captions, not 3 copies of the same vibe.
      const captions = await Promise.all(
        Array.from({ length: variantCount }, (_, i) => {
          const prompt = buildCaptionPrompt(
            body as CaptionRequest,
            bvContext,
            variantCount > 1 ? i : null,
          );
          return generateCaption(prompt, auth.ctx.plan, body.outputLanguage);
        })
      );

      payload = variantCount === 1 ? captions[0] : { variants: captions };
    } catch (genErr) {
      await refundCredits(auth.ctx, variantCount);
      throw genErr;
    }

    await saveGeneration({
      ctx:            auth.ctx,
      studio:         'caption',
      productName:    body.productName,
      category:       body.categories.join(', '),
      targetCustomer: body.targetCustomers.join(', '),
      tone:           body.tones[0] ?? 'Friendly',
      platform:       body.platform,
      details:        body.details,
      projectId:      body.projectId,
      payload,
      credits:        variantCount,
    });

    return NextResponse.json({ success: true, data: payload });
  } catch (err: any) {
    reportError(err, { scope: 'api/generate/caption' });
    return NextResponse.json(
      { success: false, error: 'เกิดข้อผิดพลาด กรุณาลองใหม่' },
      { status: 500 }
    );
  }
}
