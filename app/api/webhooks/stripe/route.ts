import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import Stripe from 'stripe';
import { stripe, planFromPriceId } from '@/lib/stripe';
import { updateBillingStatus, getProfileByCustomerId } from '@/lib/db/billing';
import { PLAN_CREDITS } from '@/types';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * POST /api/webhooks/stripe
 * Stripe webhook handler. Verifies signature then processes events:
 *  - checkout.session.completed   → activate subscription + set initial credits
 *  - customer.subscription.updated → sync plan + status + period end
 *  - customer.subscription.deleted → downgrade to free
 *  - invoice.paid                  → monthly cycle: refresh credits
 *
 * Logs every event to billing_events for idempotency + audit.
 */
export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get('stripe-signature');
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret || !signature) {
    console.error('[stripe-webhook] missing STRIPE_WEBHOOK_SECRET or signature');
    return NextResponse.json({ error: 'Webhook not configured.' }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: any) {
    console.error('[stripe-webhook] signature verification failed:', err.message);
    return NextResponse.json({ error: 'Invalid signature.' }, { status: 400 });
  }

  console.log(`[stripe-webhook] ${event.type} (${event.id})`);

  try {
    switch (event.type) {
      // ── Initial subscription ─────────────────────────────────────
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        if (session.mode !== 'subscription') break;

        const userId = session.metadata?.supabase_user_id;
        const plan   = session.metadata?.plan as 'creator' | 'studio' | 'agency' | undefined;
        const customerId = typeof session.customer === 'string' ? session.customer : null;
        if (!userId || !plan || !customerId) {
          console.error('[stripe-webhook] checkout missing metadata');
          break;
        }

        const subscriptionId = typeof session.subscription === 'string' ? session.subscription : null;
        let periodEnd: string | null = null;
        let priceId:   string | null = null;
        if (subscriptionId) {
          const sub = await stripe.subscriptions.retrieve(subscriptionId);
          periodEnd = new Date((sub as any).current_period_end * 1000).toISOString();
          priceId   = sub.items.data[0]?.price.id ?? null;
        }

        // updateBillingStatus returns {success, error} — log loudly if it
        // fails so silent DB rejections (CHECK constraints, RLS, bad keys)
        // surface in Vercel logs instead of being lost to the outer catch.
        const billingRes = await updateBillingStatus(userId, {
          plan,
          subscription_status: 'active',
          billing_customer_id: customerId,
          stripe_price_id:     priceId,
          current_period_end:  periodEnd,
        }, event.id);
        if (!billingRes.success) {
          console.error(`[stripe-webhook] DB WRITE FAILED for user=${userId} plan=${plan}: ${billingRes.error}`);
        }

        // First-time activation: refresh credits to plan allocation
        await refreshCreditsForPlan(userId, plan);
        break;
      }

      // ── Plan upgrade / downgrade / status change ────────────────
      case 'customer.subscription.updated': {
        const sub = event.data.object as Stripe.Subscription;
        const customerId = typeof sub.customer === 'string' ? sub.customer : null;
        if (!customerId) break;

        const profile = await getProfileByCustomerId(customerId);
        if (!profile) {
          console.warn('[stripe-webhook] no profile for customer', customerId);
          break;
        }

        const priceId   = sub.items.data[0]?.price.id ?? null;
        const newPlan   = priceId ? (planFromPriceId(priceId) ?? 'free') : 'free';
        const periodEnd = new Date((sub as any).current_period_end * 1000).toISOString();

        const statusMap: Record<string, string> = {
          active:              'active',
          past_due:            'past_due',
          canceled:            'canceled',
          trialing:            'trialing',
          incomplete:          'inactive',
          incomplete_expired:  'inactive',
          unpaid:              'past_due',
        };

        await updateBillingStatus(profile.id, {
          plan: newPlan as 'free' | 'creator' | 'studio' | 'agency',
          subscription_status: statusMap[sub.status] ?? 'inactive',
          stripe_price_id: priceId,
          current_period_end: periodEnd,
        }, event.id);

        // Plan upgrade: top up credits to new plan allocation
        if (newPlan !== 'free' && newPlan !== profile.plan) {
          await refreshCreditsForPlan(profile.id, newPlan as 'creator' | 'studio' | 'agency');
        }
        break;
      }

      // ── Cancellation ────────────────────────────────────────────
      case 'customer.subscription.deleted': {
        const sub = event.data.object as Stripe.Subscription;
        const customerId = typeof sub.customer === 'string' ? sub.customer : null;
        if (!customerId) break;

        const profile = await getProfileByCustomerId(customerId);
        if (!profile) break;

        await updateBillingStatus(profile.id, {
          plan: 'free',
          subscription_status: 'canceled',
          stripe_price_id:     null,
          current_period_end:  null,
        }, event.id);
        // Keep remaining credits — they expire on next billing cycle anyway
        break;
      }

      // ── Monthly renewal ─────────────────────────────────────────
      case 'invoice.paid': {
        const invoice = event.data.object as Stripe.Invoice;
        const customerId = typeof invoice.customer === 'string' ? invoice.customer : null;
        if (!customerId) break;

        // Only process renewal cycles, not first payment (handled by checkout.session.completed)
        if ((invoice as any).billing_reason !== 'subscription_cycle') break;

        const profile = await getProfileByCustomerId(customerId);
        if (!profile) break;

        const subscriptionId = typeof (invoice as any).subscription === 'string'
          ? (invoice as any).subscription as string
          : null;

        let periodEnd: string | null = null;
        let priceId:   string | null = null;
        if (subscriptionId) {
          const sub = await stripe.subscriptions.retrieve(subscriptionId);
          periodEnd = new Date((sub as any).current_period_end * 1000).toISOString();
          priceId   = sub.items.data[0]?.price.id ?? null;
        }

        const newPlan = priceId
          ? (planFromPriceId(priceId) ?? (profile.plan as 'free' | 'creator' | 'studio' | 'agency'))
          : (profile.plan as 'free' | 'creator' | 'studio' | 'agency');

        await updateBillingStatus(profile.id, {
          plan: newPlan,
          subscription_status: 'active',
          stripe_price_id:     priceId,
          current_period_end:  periodEnd,
        }, event.id);

        // Refill credits for the new month
        if (newPlan !== 'free') await refreshCreditsForPlan(profile.id, newPlan as 'creator' | 'studio' | 'agency');
        break;
      }

      default:
        break;
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('[stripe-webhook] handler error:', error?.message ?? error);
    // Return 200 so Stripe doesn't retry-storm; we logged the error for ops
    return NextResponse.json({ received: true, warning: 'Handler error logged' });
  }
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

async function refreshCreditsForPlan(userId: string, plan: 'creator' | 'studio' | 'agency'): Promise<void> {
  const { createAdminClient } = await import('@/lib/supabase/admin');
  const supabase = createAdminClient();
  const credits = PLAN_CREDITS[plan];
  await supabase.from('profiles').update({ credits_remaining: credits }).eq('id', userId);
}
