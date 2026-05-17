import { NextResponse } from 'next/server';
import { z } from 'zod';
import { buildScriptPrompt } from '@/lib/prompts/script';
import { generateScript } from '@/lib/ai';
import {
  parseBody, authenticate, checkCredits, applyRateLimit,
  saveGenerationAndDecrement, isAdversarial, resolveBrandVoiceContext,
} from '@/lib/api-handler';
import { reportError } from '@/lib/error';
import { PLATFORMS, type ScriptRequest } from '@/types';

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

    // Prompt-injection guard
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

    // Variants > 1 → N parallel OpenAI calls → cost N× → charge N credits.
    const creditsErr = await checkCredits(auth.ctx, variantCount);
    if (creditsErr) return creditsErr;

    const rlErr = await applyRateLimit(auth.ctx);
    if (rlErr) return rlErr;

    const bvContext = await resolveBrandVoiceContext(body.brandVoiceId);

    // Variants > 1: fan out in parallel so each script gets full model attention
    // and a distinct opening angle (PROOF / PROBLEM / CURIOSITY).
    const scripts = await Promise.all(
      Array.from({ length: variantCount }, (_, i) => {
        const prompt = buildScriptPrompt(
          body as ScriptRequest,
          bvContext,
          variantCount > 1 ? i : null,
        );
        return generateScript(prompt, auth.ctx.plan);
      })
    );

    // Payload shape: keep single-script shape for variants=1 (backward compat),
    // wrap as { variants: [...] } when fan-out occurred.
    const payload = variantCount === 1 ? scripts[0] : { variants: scripts };

    await saveGenerationAndDecrement({
      ctx:            auth.ctx,
      studio:         'script',
      productName:    body.productName,
      category:       body.categories.join(', '),
      targetCustomer: body.targetCustomers.join(', '),
      tone:           body.tones[0] ?? 'Persuasive',
      platform:       body.platform,
      duration:       body.duration,
      details:        body.details,
      projectId:      body.projectId,
      payload,
      credits:        variantCount,
    });

    return NextResponse.json({ success: true, data: payload });
  } catch (err: any) {
    reportError(err, { scope: 'api/generate/script' });
    return NextResponse.json(
      { success: false, error: 'เกิดข้อผิดพลาด กรุณาลองใหม่' },
      { status: 500 }
    );
  }
}
