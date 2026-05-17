import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { reportError } from '@/lib/error';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const Schema = z.object({
  type:    z.enum(['bug', 'idea', 'praise', 'question', 'other']),
  message: z.string().min(1).max(4000).trim(),
  page:    z.string().max(500).optional(),
  email:   z.string().email().max(254).optional(),
});

/**
 * POST /api/feedback
 * Accepts feedback from the in-app floating widget. Works whether the
 * user is authenticated or anonymous (RLS allows public INSERT).
 *
 * Side-effects:
 *  - row in `public.feedback`
 *  - email notification to hello@capduction.com via Resend (best-effort)
 */
export async function POST(req: Request) {
  try {
    const raw = await req.json().catch(() => null);
    const parsed = Schema.safeParse(raw);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: 'ข้อมูลไม่ถูกต้อง (Invalid payload)' },
        { status: 400 }
      );
    }
    const body = parsed.data;

    // Best-effort identify the logged-in user (anonymous = null).
    let userId: string | null = null;
    let userEmail: string | null = body.email ?? null;
    let plan: string | null = null;
    let credits: number | null = null;

    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          userId = user.id;
          userEmail = userEmail ?? user.email ?? null;
          const { data: profile } = await supabase
            .from('profiles')
            .select('plan, credits_remaining')
            .eq('id', user.id)
            .single();
          plan    = profile?.plan ?? null;
          credits = profile?.credits_remaining ?? null;
        }
      } catch { /* anonymous path */ }
    }

    const userAgent = req.headers.get('user-agent')?.slice(0, 500) ?? null;

    // Insert via service-role so anonymous submissions don't trip RLS edge cases.
    const admin = createAdminClient();
    const { error: insertErr } = await admin.from('feedback').insert({
      user_id:    userId,
      email:      userEmail,
      type:       body.type,
      message:    body.message,
      page:       body.page ?? null,
      user_agent: userAgent,
      metadata:   { plan, credits, lang: req.headers.get('accept-language')?.split(',')[0] ?? null },
    });
    if (insertErr) {
      reportError(insertErr, { scope: 'api/feedback', context: { type: body.type } });
      return NextResponse.json(
        { success: false, error: 'บันทึกไม่สำเร็จ ลองอีกครั้ง (Save failed, try again)' },
        { status: 500 }
      );
    }

    // Fire-and-forget email notification — never block the user's response.
    sendFeedbackEmail({
      type:    body.type,
      message: body.message,
      page:    body.page,
      email:   userEmail,
      userId,
      plan,
    }).catch((e) => reportError(e, { scope: 'api/feedback/email' }));

    return NextResponse.json({ success: true });
  } catch (err: any) {
    reportError(err, { scope: 'api/feedback' });
    return NextResponse.json(
      { success: false, error: 'เกิดข้อผิดพลาด' },
      { status: 500 }
    );
  }
}

interface NotifyInput {
  type:    string;
  message: string;
  page?:   string;
  email:   string | null;
  userId:  string | null;
  plan:    string | null;
}

async function sendFeedbackEmail(input: NotifyInput): Promise<void> {
  const key = process.env.RESEND_API_KEY;
  if (!key) return;  // no-op when SMTP not configured (e.g. local dev)

  const subject = `[Capduction · ${input.type.toUpperCase()}] feedback from ${input.email ?? 'anonymous'}`;
  const html = `
    <div style="font-family: ui-sans-serif, system-ui, sans-serif; max-width: 580px;">
      <h2 style="color: #1f1235; margin: 0 0 16px;">
        New ${input.type} feedback
      </h2>
      <table style="border-collapse: collapse; font-size: 13px; color: #6b6080; margin-bottom: 16px;">
        <tr><td style="padding-right: 12px;">From:</td><td><strong>${escape(input.email ?? 'anonymous')}</strong></td></tr>
        <tr><td style="padding-right: 12px;">Plan:</td><td>${escape(input.plan ?? '—')}</td></tr>
        <tr><td style="padding-right: 12px;">Page:</td><td><code>${escape(input.page ?? '—')}</code></td></tr>
        <tr><td style="padding-right: 12px;">User ID:</td><td><code>${escape(input.userId ?? '—')}</code></td></tr>
      </table>
      <div style="background: #f5f3ff; border-left: 3px solid #b58fff; padding: 14px 18px; border-radius: 8px; white-space: pre-wrap; font-size: 14px; color: #1f1235; line-height: 1.55;">${escape(input.message)}</div>
      <p style="font-size: 11px; color: #9b8fbd; margin-top: 20px;">
        Sent automatically by Capduction. Reply directly to this thread does not reach the user — contact them at the email above.
      </p>
    </div>
  `;

  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization:  `Bearer ${key}`,
    },
    body: JSON.stringify({
      from:    'Capduction Feedback <feedback@capduction.com>',
      to:      ['hello@capduction.com'],
      reply_to: input.email ? [input.email] : undefined,
      subject,
      html,
    }),
  });
}

function escape(s: string | null | undefined): string {
  if (!s) return '';
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
