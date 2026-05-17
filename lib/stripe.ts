/**
 * lib/stripe.ts
 * Stripe SDK server-side singleton + plan registry.
 * Never import this in client components.
 */
import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  console.warn('[stripe] STRIPE_SECRET_KEY is not set. Billing features will be unavailable.');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? 'sk_test_placeholder', {
  // Pin to the API version this code was written against
  apiVersion: '2024-04-10' as any,
  typescript: true,
});

// ─── Plan registry ───────────────────────────────────────────────────────────
// Capduction plans: free / creator / studio / agency
// Creator (฿199/mo) → 100 generations · entry tier for first-time buyers
// Studio  (฿549/mo) → 500 generations · main tier
// Agency  (฿1,890/mo) → 3,000 generations · capped (no more "unlimited" abuse risk)
export const PRICE_IDS = {
  creator: process.env.STRIPE_CREATOR_PRICE_ID ?? '',
  studio:  process.env.STRIPE_STUDIO_PRICE_ID  ?? '',
  agency:  process.env.STRIPE_AGENCY_PRICE_ID  ?? '',
} as const;

export type PaidPlan = keyof typeof PRICE_IDS;
export type AnyPlan = 'free' | PaidPlan;

export const PLAN_META: Record<PaidPlan, { name: string; credits: number; price: string }> = {
  creator: { name: 'Creator', credits: 100,  price: '฿199/mo' },
  studio:  { name: 'Studio',  credits: 500,  price: '฿549/mo' },
  agency:  { name: 'Agency',  credits: 3000, price: '฿1,890/mo' },
};

/** Map a Stripe Price ID back to a plan name. Returns null for unknown. */
export function planFromPriceId(priceId: string): PaidPlan | null {
  if (priceId === PRICE_IDS.creator) return 'creator';
  if (priceId === PRICE_IDS.studio)  return 'studio';
  if (priceId === PRICE_IDS.agency)  return 'agency';
  return null;
}

/** Validate a plan name passed via URL/query. */
export function isPaidPlan(s: string): s is PaidPlan {
  return s === 'creator' || s === 'studio' || s === 'agency';
}

export function isStripeConfigured(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY) && process.env.STRIPE_SECRET_KEY?.startsWith('sk_') === true;
}
