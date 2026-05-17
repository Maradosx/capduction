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

export async function checkCredits(ctx: AuthContext): Promise<NextResponse | null> {
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

  if (profile.credits_remaining <= 0) {
    await supabase.from('usage_events').insert({
      user_id: ctx.userId,
      event_type: 'generation_rejected_no_credits',
      metadata: {},
    });
    return NextResponse.json(
      {
        success: false,
        error: 'เครดิตหมดแล้ว กรุณาอัปเกรดแพลน (No credits remaining)',
        code: 'CREDITS_EXHAUSTED',
        creditsRemaining: 0,
      },
      { status: 402 }
    );
  }
  return null;
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

export async function saveGenerationAndDecrement(input: SaveGenerationInput): Promise<void> {
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

  // Atomic credit decrement via RPC (defined in migration 004)
  await supabase.rpc('decrement_credit', { p_user_id: input.ctx.userId });

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
