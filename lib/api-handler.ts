/**
 * Shared API handler logic for /api/generate/*
 * - Zod validation
 * - Prompt-injection guard
 * - Supabase auth + credit check (or demo mode bypass)
 * - Upstash rate limit (optional)
 * - Save generation + decrement credit (atomic via RPC)
 */

import { NextResponse } from 'next/server';
import { z } from 'zod';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { createClient } from '@/lib/supabase/server';
import { brandVoiceToContext } from '@/lib/db/brand-voices';
import type { StudioMode } from '@/types';

// ─── Rate limiter (lazy init) ────────────────────────────────────────────────
let ratelimit: Ratelimit | null = null;
function getRateLimiter(): Ratelimit | null {
  if (ratelimit) return ratelimit;
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    return null;
  }
  const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  });
  ratelimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(10, '1 m'),
    analytics: true,
    prefix: 'capduction:rl',
  });
  return ratelimit;
}

// ─── Prompt-injection guard ──────────────────────────────────────────────────
// Match phrasal patterns that real injection attempts use, not single English
// words. Earlier version blocked any product description containing
// "instruction" or "bypass" — Thai marketers writing "ลิปบาล์มที่ bypass
// ปัญหาริมฝีปากแห้ง" or "follow the instructions on the box" were rejected.
const BLOCKED_PATTERNS = [
  /ignore\s+(?:all\s+)?(?:previous|prior|above)/i,
  /disregard\s+(?:all\s+)?(?:previous|prior|above|instructions)/i,
  /system\s*prompt\s*[:=]/i,
  /you\s+are\s+now\s+(?:a|an|the)\s/i,
  /forget\s+(?:everything|all|your)\s/i,
  /jailbreak/i,
  /<\s*script[\s>]/i,        // XSS attempt, not the word "script"
  /\bDAN\b.*(?:mode|prompt)/i,
];
export function isAdversarial(text: string): boolean {
  return BLOCKED_PATTERNS.some((p) => p.test(text));
}

// ─── Helpers for routes ──────────────────────────────────────────────────────

export async function parseBody<S extends z.ZodTypeAny>(req: Request, schema: S): Promise<
  | { ok: true; data: z.infer<S> }
  | { ok: false; error: NextResponse }
> {
  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return {
      ok: false,
      error: NextResponse.json({ success: false, error: 'Invalid JSON body.' }, { status: 400 }),
    };
  }
  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false,
      error: NextResponse.json(
        { success: false, error: parsed.error.errors[0].message },
        { status: 400 }
      ),
    };
  }
  return { ok: true, data: parsed.data };
}

export interface AuthContext {
  userId: string | null;
  userEmail: string | null;
  identifier: string;        // for rate limiting (userId or IP)
  isDemoMode: boolean;       // true when Supabase isn't configured
  /** Populated by checkCredits() — used to pick AI model tier. */
  plan?: string;
}

export async function authenticate(req: Request): Promise<
  | { ok: true; ctx: AuthContext }
  | { ok: false; error: NextResponse }
> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!supabaseUrl) {
    // Demo mode — identify by IP
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'demo-ip';
    return { ok: true, ctx: { userId: null, userEmail: null, identifier: ip, isDemoMode: true } };
  }

  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return {
      ok: false,
      error: NextResponse.json(
        { success: false, error: 'กรุณาเข้าสู่ระบบก่อนใช้งาน (Unauthorized)' },
        { status: 401 }
      ),
    };
  }
  return {
    ok: true,
    ctx: {
      userId: user.id,
      userEmail: user.email ?? null,
      identifier: user.id,
      isDemoMode: false,
    },
  };
}

/**
 * @deprecated Prefer `reserveCredits()`. This is a non-atomic pre-flight read:
 * it reports "no credits" nicely but does NOT reserve anything, so two
 * concurrent requests can both pass it. Kept only for callers that just need
 * the friendly check + plan stash without charging.
 */
export async function checkCredits(
  ctx: AuthContext,
  required: number = 1,
): Promise<NextResponse | null> {
  if (ctx.isDemoMode || !ctx.userId) return null;

  const supabase = createClient();
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('credits_remaining, plan')
    .eq('id', ctx.userId)
    .single();

  if (error || !profile) {
    // Auto-create profile (trigger race)
    await supabase.from('profiles').upsert({
      id: ctx.userId,
      email: ctx.userEmail!,
      credits_remaining: 10,
      plan: 'free',
    });
    ctx.plan = 'free';
    return null;
  }

  // Stash plan on ctx so downstream code can pick the right AI model tier.
  ctx.plan = profile.plan ?? 'free';

  // Block if the user can't afford the requested run (e.g. 3 variants but
  // only 2 credits left). Better than half-generating and refunding.
  if (profile.credits_remaining < required) {
    await supabase.from('usage_events').insert({
      user_id: ctx.userId,
      event_type: 'generation_rejected_no_credits',
      metadata: { required, available: profile.credits_remaining },
    });
    return creditsExhaustedResponse(required, profile.credits_remaining);
  }
  return null;
}

function creditsExhaustedResponse(required: number, remaining: number): NextResponse {
  return NextResponse.json(
    {
      success: false,
      error: required > 1
        ? `ต้องการ ${required} เครดิตแต่เหลือ ${remaining} — ลดจำนวน variants หรืออัปเกรดแพลน`
        : 'เครดิตหมดแล้ว กรุณาอัปเกรดแพลน (No credits remaining)',
      code: 'CREDITS_EXHAUSTED',
      creditsRemaining: Math.max(0, remaining),
      required,
    },
    { status: 402 }
  );
}

/**
 * Atomically RESERVE `required` credits BEFORE the (costly) generation runs.
 *
 * This is the authoritative, race-safe credit gate. It calls the conditional
 * `decrement_credit` RPC, which only subtracts when `credits_remaining >=
 * required` and returns -1 otherwise. Because the decrement is a single atomic
 * UPDATE, N concurrent requests from a user with C credits will have at most C
 * of them succeed — closing the TOCTOU window where everyone passed a plain
 * read-then-check and got free AI runs.
 *
 * Side effects:
 *  - Stashes the user's plan on `ctx.plan` (for AI model tier selection).
 *  - Auto-creates the profile row on first use (trigger race fallback).
 *
 * MUST be paired with `refundCredits()` on the failure path so users aren't
 * charged for generations that error out.
 *
 * Returns a 402 NextResponse when the user can't afford the run, else null.
 */
export async function reserveCredits(
  ctx: AuthContext,
  required: number = 1,
): Promise<NextResponse | null> {
  if (ctx.isDemoMode || !ctx.userId) return null;

  const amount = Math.max(1, required);
  const supabase = createClient();

  // Fetch plan for model tier + ensure the profile exists. We don't gate on
  // this read (that would re-introduce the race) — the RPC below is the gate.
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('plan')
    .eq('id', ctx.userId)
    .single();

  if (error || !profile) {
    // First login before the create-profile trigger fired: seed 10 free credits.
    await supabase.from('profiles').upsert({
      id: ctx.userId,
      email: ctx.userEmail!,
      credits_remaining: 10,
      plan: 'free',
    });
    ctx.plan = 'free';
  } else {
    ctx.plan = profile.plan ?? 'free';
  }

  // Atomic conditional reserve. `remaining` is the new balance, or -1 sentinel.
  const { data: remaining, error: rpcErr } = await supabase
    .rpc('decrement_credit', { p_user_id: ctx.userId, p_amount: amount });

  if (rpcErr) {
    // Fail-CLOSED on the money path. `decrement_credit` is a trivial atomic RPC;
    // if it errors, that's a real (and rare) backend fault we want surfaced, not
    // papered over by handing out free GPT-4o runs. Blocking briefly with a
    // retryable 503 beats giving away paid AI compute (or letting an attacker
    // farm free generations by inducing RPC errors). The user simply retries.
    console.error('[reserveCredits] decrement_credit rpc error:', rpcErr.message);
    return NextResponse.json(
      { success: false, error: 'ระบบไม่ว่างชั่วคราว กรุณาลองใหม่อีกครั้ง' },
      { status: 503 }
    );
  }

  if (typeof remaining === 'number' && remaining < 0) {
    await supabase.from('usage_events').insert({
      user_id: ctx.userId,
      event_type: 'generation_rejected_no_credits',
      metadata: { required: amount },
    });
    return creditsExhaustedResponse(amount, 0);
  }

  return null;
}

/**
 * Refund `amount` credits that `reserveCredits()` took, when the generation
 * later failed. Uses the service-role admin client because the atomic
 * `increment_credit` RPC is intentionally NOT granted to the `authenticated`
 * role (otherwise any logged-in user could top up their own credits).
 *
 * Never throws (so it can't mask the original generation error), but it is NOT
 * fire-and-forget: it retries once, and if the refund still fails it writes a
 * durable `refund_failed` row to `usage_events` so the owed credit is auditable
 * and recoverable instead of silently lost. Requires migration 008
 * (increment_credit) to be applied.
 */
export async function refundCredits(ctx: AuthContext, amount: number = 1): Promise<void> {
  if (ctx.isDemoMode || !ctx.userId) return;
  const amt = Math.max(1, amount);
  const { createAdminClient } = await import('@/lib/supabase/admin');
  const supabase = createAdminClient();

  // Retry once — most failures here are transient.
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const { error } = await supabase.rpc('increment_credit', {
        p_user_id: ctx.userId,
        p_amount: amt,
      });
      if (!error) return; // refunded
      console.error(`[refundCredits] attempt ${attempt}/2 failed:`, error.message);
    } catch (e: any) {
      console.error(`[refundCredits] attempt ${attempt}/2 threw:`, e?.message ?? e);
    }
  }

  // Both attempts failed → record the debt durably so it isn't silently lost.
  try {
    await supabase.from('usage_events').insert({
      user_id: ctx.userId,
      event_type: 'refund_failed',
      metadata: { amount: amt, at: new Date().toISOString() },
    });
    console.error(`[refundCredits] DURABLE refund_failed recorded for user=${ctx.userId} amount=${amt}`);
  } catch (e: any) {
    console.error('[refundCredits] could not record refund_failed:', e?.message ?? e);
  }
}

export async function applyRateLimit(ctx: AuthContext): Promise<NextResponse | null> {
  const rl = getRateLimiter();
  if (!rl) return null;
  const { success, limit, reset, remaining } = await rl.limit(ctx.identifier);
  if (!success) {
    return NextResponse.json(
      { success: false, error: 'คุณส่งคำขอเร็วเกินไป กรุณารอสักครู่ (Rate limit exceeded)' },
      {
        status: 429,
        headers: {
          'X-RateLimit-Limit':     limit.toString(),
          'X-RateLimit-Remaining': remaining.toString(),
          'X-RateLimit-Reset':     reset.toString(),
          'Retry-After':           Math.ceil((reset - Date.now()) / 1000).toString(),
        },
      }
    );
  }
  return null;
}

export interface SaveGenerationInput {
  ctx: AuthContext;
  studio: StudioMode;
  productName: string;
  category?: string;
  targetCustomer?: string;
  tone: string;
  platform: string;
  duration?: string;
  details?: string;
  projectId?: string;
  payload: unknown;
  /** Number of credits to deduct (1 per variant). Default 1. */
  credits?: number;
}

/**
 * Look up a brand voice by id (owner-scoped via RLS) and return it as a
 * plain-text context block ready to inject into the prompt.
 * Returns empty string if id missing, voice not found, or in demo mode.
 */
export async function resolveBrandVoiceContext(brandVoiceId?: string): Promise<string> {
  if (!brandVoiceId) return '';
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return '';
  try {
    const supabase = createClient();
    const { data } = await supabase
      .from('brand_voices')
      .select('*')
      .eq('id', brandVoiceId)
      .single();
    if (!data) return '';
    return brandVoiceToContext(data as any);
  } catch {
    return '';
  }
}

/**
 * Persist the generation row + success usage event. Does NOT touch credits —
 * the new flow reserves credits up front via `reserveCredits()`, so charging
 * here would double-bill. Use this in routes that call `reserveCredits()`.
 */
export async function saveGeneration(input: SaveGenerationInput): Promise<void> {
  if (input.ctx.isDemoMode || !input.ctx.userId) return;

  const supabase = createClient();
  const { data: genRow, error: genErr } = await supabase
    .from('generations')
    .insert({
      user_id:           input.ctx.userId,
      project_id:        input.projectId ?? null,
      studio:            input.studio,
      product_name:      input.productName,
      category:          input.category ?? null,
      target_customer:   input.targetCustomer ?? null,
      tone:              input.tone,
      platform:          input.platform,
      duration:          input.duration ?? null,
      additional_details: input.details ?? null,
      payload:           input.payload,
    })
    .select('id')
    .single();

  if (genErr) {
    console.error('[saveGeneration] failed:', genErr.message);
  }

  await supabase.from('usage_events').insert({
    user_id:    input.ctx.userId,
    event_type: 'generation_success',
    metadata: {
      generation_id: genRow?.id ?? null,
      studio:        input.studio,
      platform:      input.platform,
      tone:          input.tone,
      product_name:  input.productName,
    },
  });
}

/**
 * @deprecated Legacy "charge after success" path. Decrements credits AFTER the
 * generation already ran, which leaks free AI runs under concurrency (the
 * decrement is atomic but the costly work already happened). Prefer the
 * `reserveCredits()` → generate → `saveGeneration()` (+`refundCredits()` on
 * error) flow. Retained for any out-of-tree callers.
 */
export async function saveGenerationAndDecrement(input: SaveGenerationInput): Promise<void> {
  if (input.ctx.isDemoMode || !input.ctx.userId) return;
  const supabase = createClient();
  await saveGeneration(input);
  const amount = Math.max(1, input.credits ?? 1);
  await supabase.rpc('decrement_credit', { p_user_id: input.ctx.userId, p_amount: amount });
}
