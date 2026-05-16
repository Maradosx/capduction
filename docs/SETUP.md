# Capduction — Setup Walkthrough

This guide takes you from `git clone` to a fully working production app — step by step. Every section is **optional independently**: skip what you don't need, the app degrades gracefully into demo mode.

> ⏱ Total time end-to-end: **~45 minutes** (mostly waiting for Supabase + Stripe to finish creating things).

---

## Table of contents
1. [Run in 30 seconds (demo mode)](#1-run-in-30-seconds-demo-mode)
2. [Add OpenAI — real AI generation](#2-add-openai--real-ai-generation)
3. [Add Supabase — auth + persistence](#3-add-supabase--auth--persistence)
4. [Add Stripe — billing](#4-add-stripe--billing)
5. [Add Upstash Redis — rate limiting](#5-add-upstash-redis--rate-limiting)
6. [Production checklist](#6-production-checklist)

---

## 1. Run in 30 seconds (demo mode)

No env, no signup, no API keys. Just run.

```bash
git clone <repo-url> capduction && cd capduction
npm install                # ~1 min
npm run dev                # → http://localhost:3000
```

**What works in demo mode:**
- ✅ Landing page + all 22 routes
- ✅ All 3 studios (Script / Caption / Combo) — return Thai mock data
- ✅ Dashboard / History / Analytics / Settings (with demo banner)
- ✅ Projects + Brand Voice list with sample data
- ✅ Pricing page (Studio CTA redirects to "stripe not configured" error)

**What doesn't work in demo mode:**
- ❌ Login/Signup (Supabase not connected → submit fails silently)
- ❌ Saving generations (no DB)
- ❌ Billing (no Stripe)

---

## 2. Add OpenAI — real AI generation

**Time: 2 minutes** · **Cost: pay-as-you-go (~$0.01 per generation)**

### Step-by-step
1. Go to [platform.openai.com/api-keys](https://platform.openai.com/api-keys)
2. Click **+ Create new secret key** · name it `capduction-dev`
3. Copy the `sk-proj-…` value (shown ONCE)
4. In `capduction/`, copy env template:
   ```bash
   cp .env.example .env.local
   ```
5. Edit `.env.local` and paste:
   ```
   OPENAI_API_KEY=sk-proj-…paste-here
   ```
6. Restart `npm run dev`

### Verify
```bash
curl -X POST http://localhost:3000/api/generate/script \
  -H 'Content-Type: application/json' \
  -d '{"productName":"ลิปสติกแดง","tone":"Persuasive","platform":"TikTok","duration":"30s"}'
```
Look for **real Thai content** (not the same canned mock every time). If responses differ on repeat calls → real OpenAI is wired ✅.

### Cost guard
- Hard-coded to model `gpt-4o` (~$0.005/script avg)
- Set spending limit in OpenAI dashboard: **Limits → Usage limits → Set monthly hard limit**
- Default plan gives ~5,000 generations/month for $25

---

## 3. Add Supabase — auth + persistence

**Time: 10 minutes** · **Cost: free tier covers up to 50k MAU**

### 3.1 Create project
1. [supabase.com](https://supabase.com) → **New project**
2. Name: `capduction-prod` · region: `Singapore (Southeast Asia)` for Thai users
3. Database password: generate strong, save in 1Password
4. Wait ~2 min for provisioning

### 3.2 Get keys
**Settings → API:**
- Copy **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
- Copy **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Copy **service_role** key (CLICK "Reveal") → `SUPABASE_SERVICE_ROLE_KEY`
  - ⚠️ NEVER commit this · never expose to client · server only

### 3.3 Run migrations
**SQL Editor → New query** — paste each file in order, run, repeat:

| Order | File | What it creates |
|---|---|---|
| 1 | `supabase/migrations/001_initial_schema.sql` | profiles, generations, usage_events, user_settings + RLS |
| 2 | `supabase/migrations/002_atomic_credit_decrement.sql` | atomic credit RPC (early version) |
| 3 | `supabase/migrations/003_billing_columns.sql` | billing fields on profiles + plan_credits + billing_events |
| 4 | `supabase/migrations/004_capduction_studios.sql` | **multi-studio + projects + brand_voices + decrement_credit RPC** |

✅ After migration 4 you should see 7 tables in **Table Editor**:
`profiles, generations, usage_events, user_settings, plan_credits, billing_events, projects, brand_voices`

### 3.4 Enable auth providers
**Authentication → Providers:**
- **Email**: enabled by default ✓
- **Google**: enable → add OAuth client (free) — [walkthrough](https://supabase.com/docs/guides/auth/social-login/auth-google)
- **LINE**: enable as a Custom OIDC Provider — [LINE docs](https://developers.line.biz/en/docs/line-login/integrate-line-login/)

### 3.5 Configure redirect URLs
**Authentication → URL Configuration:**
- Site URL: `http://localhost:3000` (dev) or `https://capduction.app` (prod)
- Redirect URLs: add both:
  ```
  http://localhost:3000/auth/callback
  https://capduction.app/auth/callback
  ```

### Verify
Restart `npm run dev`, go to `/signup` → enter email + password → check email → click confirm link → land on `/dashboard` with real data (no demo banner).

---

## 4. Add Stripe — billing

**Time: 15 minutes** · **Cost: 2.9% + ฿10 per transaction (Thailand)**

### 4.1 Create Stripe account
- [stripe.com](https://stripe.com) → use **Test mode** (toggle top-right) until ready to launch
- **Settings → Payments → Payment methods**: enable **Card** + **PromptPay** (Thai users love this)

### 4.2 Create products
**Products → + Add product** twice:

| Product | Description | Pricing |
|---|---|---|
| **Capduction Studio** | 500 generations/month + Brand Voice Memory + Export Pack | Recurring · ฿349/month · THB |
| **Capduction Agency** | Unlimited + 10 brand voices + 5 team seats + API access | Recurring · ฿1,290/month · THB |

After save, click each product → copy the **Price ID** (starts with `price_…`) → paste to `.env.local`:
```
STRIPE_STUDIO_PRICE_ID=price_1AbC…
STRIPE_AGENCY_PRICE_ID=price_1XyZ…
```

### 4.3 Get API keys
**Developers → API keys:**
- **Secret key** (test) → `STRIPE_SECRET_KEY=sk_test_…`
- **Publishable key** → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_…`

### 4.4 Set up webhook
**Developers → Webhooks → + Add endpoint:**
- Endpoint URL: `https://capduction.app/api/webhooks/stripe`
  (for local dev, use [Stripe CLI](https://stripe.com/docs/stripe-cli) → `stripe listen --forward-to localhost:3000/api/webhooks/stripe`)
- Events to send (4 events):
  - `checkout.session.completed`
  - `customer.subscription.updated`
  - `customer.subscription.deleted`
  - `invoice.paid`
- Save → copy **Signing secret** (starts with `whsec_…`) → `STRIPE_WEBHOOK_SECRET=whsec_…`

### 4.5 Enable Customer Portal
**Settings → Billing → Customer portal:**
- Enable
- Allowed features: cancel subscriptions, update payment methods, view invoices
- Save

### Verify
Restart `npm run dev`. Log in → go to `/pricing` → click "Upgrade to Studio" → should redirect to Stripe Checkout (not error page).

Use Stripe's test card: `4242 4242 4242 4242` · any future date · any CVC.

After payment → redirected to `/dashboard/settings?upgraded=studio` → webhook fires → DB updates → credits refreshed to 500.

---

## 5. Add Upstash Redis — rate limiting

**Time: 3 minutes** · **Cost: free tier covers 10k commands/day**

### Step-by-step
1. [upstash.com](https://upstash.com) → **Create Redis database**
2. Region: `ap-southeast-1` (Singapore — same as Supabase)
3. Once created → **REST API** tab → copy:
   - `UPSTASH_REDIS_REST_URL=https://...upstash.io`
   - `UPSTASH_REDIS_REST_TOKEN=Axxxxx...`

Without this, generation APIs have no rate limit (users could spam). With it: **10 requests/minute per user**.

### Verify
Hit a generation API 15× in a row → 11th call should return `429` with `Retry-After` header.

---

## 6. Production checklist

Before going live:

### Code & repo
- [ ] All `.env.local` keys filled (Sections 2–5)
- [ ] `npm run check` passes (TypeScript + ESLint)
- [ ] `npm run build` succeeds locally
- [ ] Latest migration applied to production Supabase
- [ ] Brand assets (favicon, og:image) added to `public/`

### Vercel deploy
- [ ] Repo connected to Vercel
- [ ] All env vars added in **Vercel → Project → Settings → Environment Variables**
  (mark `STRIPE_SECRET_KEY` + `SUPABASE_SERVICE_ROLE_KEY` as **secret**)
- [ ] Production branch = `main`
- [ ] Domain attached (custom domain or `*.vercel.app`)

### Supabase
- [ ] **Settings → API → Site URL** updated to production domain
- [ ] **Settings → API → Redirect URLs** includes production `/auth/callback`
- [ ] **Database → Backups → Point-in-time Recovery (PITR)** enabled
- [ ] **Auth → Email Templates** customized with Capduction branding

### Stripe
- [ ] Toggle from **Test mode → Live mode**
- [ ] Re-create products + prices in Live mode (Test mode data ≠ Live)
- [ ] Update `STRIPE_*` env vars in Vercel with Live keys
- [ ] Update webhook endpoint to point to production URL + Live signing secret
- [ ] Test full flow with a real ฿1 product first → refund

### Monitoring
- [ ] Set up Vercel logs alerts for `/api/webhooks/stripe` errors
- [ ] Set OpenAI monthly spending limit
- [ ] Set Upstash daily request limit
- [ ] Set up Sentry or LogRocket for error tracking (optional)

### Launch
- [ ] Soft launch with 10 beta users → collect feedback for 1 week
- [ ] Fix any DB/billing edge cases that surface
- [ ] Public launch on Twitter/X + Facebook groups + TikTok

---

## Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| Studio CTA → "stripe_not_configured" | No `STRIPE_SECRET_KEY` | Section 4.3 |
| Signup form does nothing | No Supabase env | Section 3.2 |
| Webhook returns 400 "Invalid signature" | Wrong `STRIPE_WEBHOOK_SECRET` | Re-copy from Stripe → Webhooks → endpoint detail |
| `decrement_credit is not a function` (Postgres) | Migration 004 not run | Run it from SQL editor |
| OAuth redirect loop | Wrong Site URL or Redirect URLs in Supabase | Match exactly, including protocol |
| Credits don't refresh after payment | Webhook not firing OR `SUPABASE_SERVICE_ROLE_KEY` missing | Check webhook logs in Stripe dashboard |

---

Need help? Open an issue or DM the team.
