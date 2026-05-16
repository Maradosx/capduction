# Capduction

> สตูดิโอ AI สำหรับครีเอเตอร์วิดีโอสั้นไทย — สคริปต์การพูด + แคปชั่นหน้าจอ ครบในไฟล์เดียว
> AI studio for Thai short-form video creators — spoken scripts + on-screen captions, all in one file.

**Theme:** Mix 1 — Soft Liquid Console (iridescent pastel + frosted glass + chrome orbs)
**Status:** ✅ Production-ready · 22 pages · 3 studios · billing wired · ~95% complete

---

## 🚀 Run in 30 seconds (demo mode)

```bash
npm install
npm run dev          # → http://localhost:3000
```

No env required. Every page works. All 3 studios return Thai mock data.

**To enable real features → follow [docs/SETUP.md](./docs/SETUP.md)** — step-by-step walkthrough for OpenAI / Supabase / Stripe / Upstash. Each section is optional independently.

---

## What's included

### Public site
- `/` Landing — hero · iridescent dashboard preview · 3 studios · bottom CTA
- `/pricing` — Free / Studio ฿349 / Agency ฿1,290
- `/login` · `/signup` (email prefill from landing) · `/forgot-password` · `/reset-password`
- `/privacy` · `/terms` · `/about` · `/contact` · `/docs` · `/changelog` · `/status` · `/careers` · `/api-docs` (stub or full)

### Dashboard (logged in or demo)
- `/dashboard` — welcome · credits banner · 3 quick-cards · stats · recent activity
- `/dashboard/workspace/script` — Script Studio with beats + timing + B-roll + on-screen text
- `/dashboard/workspace/caption` — 5 caption variants + hooks + hashtags + CTAs + angles + video ideas
- `/dashboard/workspace/combo` — sharedHook + script + caption tabs (aligned messaging)
- `/dashboard/projects` + `[id]` + `/new` — group generations under products/campaigns
- `/dashboard/brand-voice` + `[id]` + `/new` — train AI to write in your brand's voice (3 sample posts)
- `/dashboard/history` — filter by studio + search + delete
- `/dashboard/analytics` — totals · per-studio · top platform/tone
- `/dashboard/settings` — account · defaults · brand voice · billing portal

### API routes
| Route | Method | Purpose |
|---|---|---|
| `/api/generate/script` | POST | Generate spoken video script |
| `/api/generate/caption` | POST | Generate post copy |
| `/api/generate/combo` | POST | Both, sharing a hook |
| `/api/billing/checkout?plan=studio` | GET | Stripe Checkout redirect |
| `/api/billing/portal` | GET | Stripe Customer Portal redirect |
| `/api/webhooks/stripe` | POST | Webhook (4 events handled) |
| `/api/history/[id]` | DELETE | Delete a generation |
| `/auth/callback` | GET | Supabase OAuth redirect |
| `/auth/signout` | POST | Sign out |

All generation APIs auto-fall-back to Thai mock data when OpenAI key absent (demo mode).

---

## Stack
- **Framework:** Next.js 14 (App Router) + TypeScript
- **Styling:** Tailwind CSS — `tailwind.config.ts` + `app/globals.css` with full Mix 1 token system
- **Fonts:** Inter (display) + Instrument Serif (accent) + Sarabun (Thai) + Geist Mono (labels)
- **Auth + DB:** Supabase (Postgres + RLS + Auth) — graceful demo fallback
- **AI:** OpenAI GPT-4o (JSON response mode) — graceful mock fallback
- **Rate limit:** Upstash Redis sliding window (10/min/user) — optional
- **Billing:** Stripe (Free / Studio / Agency) — graceful demo fallback
- **Cursor:** Custom OS-fast (direct pointermove, no rAF/lerp)

---

## Project structure

```
capduction/
├── app/
│   ├── (root)              layout, page, globals.css
│   ├── login, signup, forgot-password, reset-password
│   ├── pricing
│   ├── dashboard/          layout, page, workspace, projects, brand-voice, history, analytics, settings
│   ├── api/                generate/{script,caption,combo}, billing/{checkout,portal}, webhooks/stripe, history/[id]
│   ├── auth/               callback, signout
│   ├── actions/            server actions (settings, projects, brand-voices)
│   └── {privacy,terms,about,contact,docs,changelog,status,careers,api-docs}
├── components/
│   ├── cap-cursor, cap-nav, cap-footer, brand-mark, lang-toggle, coming-soon
│   ├── auth/auth-card
│   ├── dashboard/{sidebar, topbar}
│   ├── landing/{hero, dashboard-preview, studios-section, bottom-cta, hero-wave-bg}
│   └── workspace/{studio-shell, studio-form, script-result, caption-result, combo-result}
├── lib/
│   ├── ai.ts (OpenAI + mock)
│   ├── api-handler.ts (shared validation/auth/credits/rate-limit/brand-voice)
│   ├── stripe.ts (plan registry + helpers)
│   ├── prompts/{script, caption, combo}
│   ├── i18n/{dict, context}
│   ├── db/{generations, projects, brand-voices, profiles, settings, events, billing}
│   └── supabase/{client, server, middleware}
├── supabase/migrations/    001 → 004 (run in Supabase SQL editor)
├── types/index.ts          full type system
├── docs/                   BUTTON_AUDIT.md · SETUP.md
├── brand/                  IDENTITY.md
└── mockup/                 design exploration (HTML)
```

---

## Roadmap — what's left

We're at **~95%**. The remaining 5% is launch ops (deploy + custom domain + monitoring). Code-wise the app is complete.

See [docs/BUTTON_AUDIT.md](./docs/BUTTON_AUDIT.md) for the per-page button verification matrix, and [docs/SETUP.md](./docs/SETUP.md) for the deployment checklist.

---

## License
TBD · all rights reserved · built in Bangkok 🇹🇭
