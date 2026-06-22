# Capduction — Project Details (Comprehensive Reference)

> เอกสารอ้างอิงเชิงเทคนิคทั้งหมดของโครงงาน Capduction · เก็บข้อมูลทุกอย่างที่สร้างไป
> ใช้เป็นแหล่งข้อมูลในการเขียน report, presentation, blog, sales pitch
>
> **Live URL:** https://capduction.com
> **Repo:** github.com/Maradosx/capduction (private)
> **Vercel project:** prj_T48ACf9JZMJ1gB4D8AXxgaDamfbJ
> **Supabase project:** ljpgkbkrpnpfjzxjsfzn (ap-southeast-1)

---

## สารบัญ

1. [ภาพรวมโครงงาน](#1-ภาพรวมโครงงาน)
2. [Tech Stack](#2-tech-stack)
3. [สถาปัตยกรรมระบบ](#3-สถาปัตยกรรมระบบ)
4. [ฟีเจอร์ทั้งหมด (ละเอียด)](#4-ฟีเจอร์ทั้งหมด-ละเอียด)
5. [Database Schema + Migrations](#5-database-schema--migrations)
6. [Prompt Engineering (3 Studios)](#6-prompt-engineering-3-studios)
7. [API Routes](#7-api-routes)
8. [Auth Flow](#8-auth-flow)
9. [Billing + Stripe Integration](#9-billing--stripe-integration)
10. [UI/UX System](#10-uiux-system)
11. [i18n System](#11-i18n-system)
12. [AI Model Strategy + Cost Optimization](#12-ai-model-strategy--cost-optimization)
13. [Security + Privacy](#13-security--privacy)
14. [Deployment + Environment](#14-deployment--environment)
15. [Sprint History](#15-sprint-history)
16. [Known Issues + Future Roadmap](#16-known-issues--future-roadmap)
17. [Pricing + Unit Economics](#17-pricing--unit-economics)
18. [Marketing Plan (parked)](#18-marketing-plan-parked)

---

## 1. ภาพรวมโครงงาน

### 1.1 ชื่อโครงงาน
**Capduction** — AI Studio for Thai Short-Form Creators

### 1.2 Tagline
- **TH:** AI ที่เขียนภาษาไทย — เหมือนครีเอเตอร์ไทยจริงๆ
- **EN:** AI scripts that sound like a Thai creator wrote them

### 1.3 Pain Point ที่แก้
ครีเอเตอร์ไทยที่ทำวิดีโอสั้น (TikTok, Reels, Shorts) ใช้เครื่องมือ AI ทั่วไป (ChatGPT, Jasper) แล้วได้คอนเทนต์ภาษาไทยที่ฟังแข็ง เป็น "แปลจากอังกฤษ" — ใช้คำว่า "จงตื่นเต้น", "นี่คือสิ่งที่คุณรอคอย" ที่ไม่มีครีเอเตอร์ไทยพูดจริง

Capduction แก้ปัญหานี้โดย:
1. Prompt engineer ที่ฝึก LLM ให้พูดสำเนียงครีเอเตอร์ไทยจริง
2. รองรับ tone หลายแบบ (Friendly / Persuasive / Viral / Luxury / Minimal / Professional)
3. ปรับสไตล์ตามแพลตฟอร์ม (TikTok ≠ Lemon8 ≠ Facebook)
4. ผลลัพธ์เป็น JSON structured พร้อมใช้ — script มี timecode + beats + B-roll cues + thumbnail copy

### 1.4 Studios (โหมดการสร้าง)

| Studio | สำหรับ | Output |
|--------|--------|--------|
| **Script Studio** | สคริปต์การพูดในวิดีโอสั้น | beats (timecode + role + spoken + broll + onScreenText) · totalSeconds · thumbnailCopy · postingChecklist |
| **Caption Studio** | แคปชั่นพร้อมโพสต์ | 5 captions · 5 hooks · 10 hashtags · 5 CTAs · 4 selling angles · 4 video content ideas |
| **Combo Mode** | สคริปต์ + แคปชั่นบน hook เดียวกัน | sharedHook + script + caption (ใช้ hook เดียวอ้างอิงทั้งคู่) |

### 1.5 Plans (4-tier pricing)

| Plan | ราคา | Credits/เดือน | Features |
|------|------|---------------|----------|
| Free | ฿0 | 10 (ลองครั้งเดียว) | ทุก studio, ทุกแพลตฟอร์ม, ประวัติเต็ม, อีเมลซัพพอร์ต |
| Creator | ฿199 | 100 | + history search/filter, อีเมล 24ชม |
| **Studio** ⭐ | **฿549** | **500** | + Brand Voice, Projects, Analytics |
| Agency | ฿1,890 | 3,000 (cap) | Brand voice ไม่จำกัด, ทุกอย่างใน Studio, direct support |

### 1.6 Status ปัจจุบัน
- ✅ Production live ที่ capduction.com
- ✅ Stripe billing ทำงานเต็ม (test mode verified end-to-end)
- ✅ Sentry-style error tracking via `lib/error.ts`
- ✅ Auth ครบ: Email + Magic Link + Password + Google OAuth + Reset
- ✅ Email infra ผ่าน Resend (verified capduction.com domain)
- ✅ Beta-ready: feedback widget, admin inbox, dogfood-ready
- ⏳ Stripe live mode: ยังไม่สลับ
- ⏳ Testimonials: ยังไม่มี (รอ beta users)

---

## 2. Tech Stack

### 2.1 Frontend
- **Next.js 14** App Router (TypeScript strict)
- **Tailwind CSS** + custom `glass` / `glass-strong` / `iridescent` utilities
- **lucide-react** icons
- **Custom theme:** "Soft Liquid" — iridescent pastel + frosted glass
  - Fonts: Custom serif display + Thai font + JetBrains Mono
  - Colors: pink, violet, peach, mint, teal, rose, lavender
  - Effects: `backdrop-blur`, `mix-blend-mode`, radial gradients
- **Custom cursor** with `data-cursor` attributes (delight detail)

### 2.2 Backend
- **Supabase** (PostgreSQL + Auth + Storage + RLS)
  - Region: ap-southeast-1 (Singapore)
  - Project: `ljpgkbkrpnpfjzxjsfzn`
- **Server Actions** + **API Routes** (Node.js runtime)
- **OpenAI API** (GPT-4o for paid, GPT-4o-mini for free)
- **Stripe** (subscriptions + Checkout + Customer Portal)
- **Resend** (transactional email + verified domain)
- **Upstash Redis** (optional rate limiting)

### 2.3 Infra
- **Vercel** (hosting + edge + serverless functions)
  - Team: athitboonpinit-5722's projects
  - Project: capduction
  - Auto-deploy from `main` branch (GitHub integration)
- **GitHub:** Maradosx/capduction (private)
- **DNS:** capduction.com (purchased through Vercel)
- **SSL:** auto via Vercel

### 2.4 Key Dependencies
```
@supabase/ssr           // server-side auth
@supabase/supabase-js   // base client
stripe                  // payment SDK
zod                     // request validation
lucide-react            // icons
tailwindcss             // styling
```

---

## 3. สถาปัตยกรรมระบบ

### 3.1 High-level Diagram (ASCII)

```
┌─────────────┐       ┌──────────────────────────────────┐       ┌──────────────┐
│   Browser   │──────▶│         Vercel (Next.js)         │◀─────▶│   Supabase   │
│  (Safari/   │  HTTPS│  ┌────────────┐ ┌────────────┐  │  PG   │  PostgreSQL  │
│   Chrome)   │       │  │ Server     │ │ API Routes │  │       │  + Auth      │
└─────────────┘       │  │ Components │ │            │  │       │  + Storage   │
       │              │  └────────────┘ └────────────┘  │       └──────────────┘
       │              │           │            │         │
       │              └───────────┼────────────┼─────────┘
       │                          │            │
       │                          ▼            ▼
       │              ┌────────────────┐  ┌──────────────┐
       │              │   OpenAI API   │  │  Stripe API  │
       │              │  (GPT-4o /     │  │  Subscriptions│
       │              │   GPT-4o-mini) │  │  + Webhooks   │
       │              └────────────────┘  └──────────────┘
       │                                          │
       └──────────────────────────────────────────┘
                  Stripe redirects after checkout

┌────────────────┐                  ┌─────────────────┐
│  Resend SMTP   │ ◀── transactional│  Stripe sends   │
│  (verified TH  │     emails       │  webhook events │
│   domain)      │                  │  → /api/webhooks│
└────────────────┘                  └─────────────────┘
```

### 3.2 Request Lifecycle (เช่น "สร้างสคริปต์")
1. User submit ฟอร์มใน `/dashboard/workspace/script`
2. Client POST `/api/generate/script` with `{productName, categories[], tones[], variants, ...}`
3. Server (Next.js API route):
   - `parseBody()` → Zod validation
   - `isAdversarial()` → check prompt injection patterns
   - `authenticate()` → verify Supabase session, set `ctx.userId, ctx.plan`
   - `checkCredits(ctx, variants)` → ensure user has ≥ variants credits
   - `applyRateLimit()` → Upstash check
   - `resolveBrandVoiceContext()` → load brand voice if provided
   - **Fan-out N parallel calls** to `generateScript(prompt, plan)` — each with distinct angle (PROOF / PROBLEM / CURIOSITY)
   - `saveGenerationAndDecrement()` → insert `generations` row + atomic credit decrement RPC
   - Return `{success: true, data: payload}` where payload is either single `ScriptContent` or `{variants: ScriptContent[]}`
4. Client receives → `ScriptResultRouter` decides tab UI vs single view
5. User can copy, export to text, regenerate

### 3.3 Database Tables (Supabase)

| Table | Purpose |
|-------|---------|
| `profiles` | User profile + plan + credits |
| `generations` | Every script/caption/combo created |
| `brand_voices` | User-saved voice presets |
| `projects` | Folder for organizing generations |
| `usage_events` | Telemetry for rate limit + analytics |
| `billing_events` | Idempotency log for Stripe webhooks |
| `feedback` | In-app beta feedback (new) |

Full schema below.

---

## 4. ฟีเจอร์ทั้งหมด (ละเอียด)

### 4.1 Landing Page (`/`)
- **Hero** with custom serif + iridescent gradient
  - H1: "AI ที่เขียนภาษาไทย — เหมือนครีเอเตอร์ไทยจริงๆ"
  - Sub: pain-naming subhead ("เลิกใช้ ChatGPT แล้วได้คำว่า 'จงตื่นเต้น'")
  - Email form → /signup
  - 5 sparkle SVGs animated
  - Trust line: "10 ครั้งฟรี · ไม่ต้องใช้บัตรเครดิต · ยกเลิกได้ตลอด"
  - Scroll-down chevron → `#dashboard-preview`
- **Showcase Section** (proof of output) — NEW after audit
  - 3 tabs: Script / Caption / Combo
  - Each shows real-quality sample output from same prompt (lipstick example)
  - INPUT chips row + actual structured output
  - No signup needed to see what the tool produces
- **Dashboard Preview** (rotated 3D glass mockup)
  - Mix 1 design with frosted glass workspace
  - Mobile-friendly compact variant
- **Studios Section** (3 cards for Script / Caption / Combo)
- **Bottom CTA** "Start creating free →"
- **Footer** with trust badges row (PDPA · Stripe · Cancel Anytime · No AI Training)

### 4.2 Auth Pages

| Route | Purpose |
|-------|---------|
| `/signup` | Magic Link tab + Password tab + Google OAuth + Terms consent |
| `/login` | Magic Link tab + Password tab + Google OAuth |
| `/forgot-password` | Send reset link via Supabase |
| `/reset-password` | Set new password (PKCE code exchange) |
| `/auth/callback` | OAuth + magic link receiver |
| `/auth/signout` | POST to clear session |

**Magic Link Cross-Browser Fix (NEW):**
- Auto-polling: `getSession()` every 2s on the "sent" panel
- Paste-link fallback: collapsible section that accepts the email URL
  - Detects Supabase verify URL → navigates so server can verify + PKCE exchange happens locally
  - Detects callback URL → exchanges code directly
  - Allowlist `*.supabase.co` or own hostname

### 4.3 Dashboard (`/dashboard`)
- **Server-rendered** with user profile + projects + recent generations
- **First-run onboarding** banner when `total === 0`
  - "Try first sample" CTA → `/dashboard/workspace/script?demo=lipstick`
  - Pre-fills lipstick example data (DEMO_PREFILLS in studio-shell.tsx)
  - Note: "ใช้ 1 เครดิต · เหลือ 9 หลังจากนี้"
- **3 studio quick cards**
- **4 stat cards:** Total / Credits / Plan / This Week
- **Recent activity** (last 5 generations)
- **Banners** for: demo mode, out of credits, low credits

### 4.4 Workspace (3 Studios)
Each studio at `/dashboard/workspace/{script|caption|combo}`:
- `<StudioShell>` wraps form + result with brand voice selector
- `<StudioForm>` shared component with:
  - **Product name** input (required, max 100 chars)
  - **Categories** multi-select chips (CATEGORY_PRESETS) + custom input
  - **Target Customer** multi-select chips (TARGET_PRESETS includes Gen Z/Y/X/Boomer/Alpha + Thai personas)
  - **Platform** dropdown (TikTok / Instagram / Facebook / Shopee / Lazada / LINE / YouTube / General)
  - **Tone** multi-select chips (6 presets) with TH sublabels
  - **Duration** (Script + Combo only) — multi-select with custom
  - **Variants** 1-3 buttons (now with cost preview: "1 แบบ / 2 แบบ / 3 แบบ")
  - **Details** textarea (free-form)
- **Submit button** shows cost: "Generate · ใช้ N เครดิต"
- Pre-validation: blocks submit if not enough credits with friendly error

**Result Routers:**
- `ScriptResultRouter`: shows VariantTabs if `data.variants` array, else single `ScriptResult`
- `CaptionResultRouter`: same pattern for Caption
- `ComboResultRouter`: same pattern for Combo
- **VariantTabs** (shared) with angle labels: PROOF/PROBLEM/CURIOSITY (Script), EMOTIONAL/PROBLEM-SOLUTION/SOCIAL-PROOF (Caption), EMOTIONAL/PROBLEM-LED/PROOF-LED (Combo)

### 4.5 Brand Voice (`/dashboard/brand-voice`)
- List all voices owned by user (RLS-scoped)
- Create new: name + description + up to 3 sample posts
- Edit existing
- Delete via server action
- When selected in workspace dropdown, voice context is loaded as prompt context block

### 4.6 Projects (`/dashboard/projects`)
- Create new with name + color
- Color-coded cards
- Project detail page lists associated generations
- Generations can be tagged to project via `project_id`

### 4.7 History (`/dashboard/history`)
- Lists all user generations (RLS-scoped)
- **Filter** by studio type (script/caption/combo/all)
- **Search** by product name or platform
- **Delete** with confirm (auth-checked DELETE endpoint)
- Display: orb + product name + meta + time ago

### 4.8 Analytics (`/dashboard/analytics`)
- Total generations
- This week count
- Credits remaining
- Plan info
- Studio breakdown
- Top platform / Top tone (currently client-side aggregate, slow at scale)

### 4.9 Settings (`/dashboard/settings`)
- Profile edit (name, company, avatar upload)
- Account email (read-only)
- Default form values for next generation
- Brand voice quick add
- Billing portal link (Stripe Customer Portal)
- Language toggle (TH/EN)
- Sign out form

### 4.10 Marketing/Resource Pages
- `/about` — mission, why, principles, story, contact
- `/docs` — 7 sections + FAQ
- `/pricing` — 4-tier cards + risk badges + 6 FAQs inline
- `/contact` — 3 channel cards + main email
- `/changelog` — version history with NEW/FIX/PERF/SECURITY tags
- `/status` — honest service status (no fake uptime %)
- `/privacy` — full PDPA-compliant policy
- `/terms` — full ToS aligned with Thai law

### 4.11 Feedback Widget (NEW — for beta)
- Floating button bottom-right of every `/dashboard/*` page
- Modal with 4 type cards (2×2 grid): Bug / Idea / Praise / Question
- Textarea up to 4000 chars + live counter
- Auto-captures: current page, plan, credits, UA
- POSTs to `/api/feedback`
- Inserts to `feedback` table + Resend email to hello@capduction.com

### 4.12 Admin Feedback Inbox (NEW)
- `/dashboard/admin/feedback` — gated by `isAdmin(email)` from `lib/admin.ts`
- Reads via service-role client (bypasses RLS)
- Type filter chips + search (ILIKE on message + email)
- Row cards: type tag · click-to-copy email · time ago · plan/credits · page · message · collapsed UA
- 404 for non-admins (hides route existence)

### 4.13 Topbar
- Mobile hamburger (drawer)
- Search bar (links to `/dashboard/history`)
- DEMO MODE badge if Supabase not configured
- Language toggle
- **Credits chip (NEW)** — Bell button replaced with `<Link href="/pricing">` showing credits with color states (rose ≤0, amber ≤5, normal otherwise)
- Avatar dropdown (Settings, Sign out)

### 4.14 Sidebar
- Brand + Beta badge
- Sections: Studios / Projects / Resources / Admin (admin-only)
- Studio items: Combo Mode (NEW badge) / Script Studio / Caption Studio
- Resources: Brand Voice / History / Analytics / Settings
- Bottom: Credits widget + Upgrade nudge for free users
- All section headers translatable (สตูดิโอ / โปรเจกต์ / เครื่องมือ)

---

## 5. Database Schema + Migrations

### 5.1 Tables

#### `profiles`
```sql
CREATE TABLE profiles (
  id                  uuid PRIMARY KEY REFERENCES auth.users(id),
  email               text NOT NULL,
  full_name           text,
  avatar_url          text,
  plan                text NOT NULL DEFAULT 'free'
                      CHECK (plan IN ('free', 'creator', 'studio', 'agency')),
  credits_remaining   integer NOT NULL DEFAULT 10,
  subscription_status text DEFAULT 'inactive'
                      CHECK (subscription_status IN
                        ('active', 'inactive', 'past_due', 'canceled', 'trialing')),
  billing_customer_id text,
  stripe_price_id     text,
  current_period_end  timestamptz,
  company_name        text,
  default_platform    text,
  default_tone        text,
  default_duration    text,
  created_at          timestamptz DEFAULT now(),
  updated_at          timestamptz DEFAULT now()
);
```

#### `generations`
```sql
CREATE TABLE generations (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  project_id          uuid REFERENCES projects(id) ON DELETE SET NULL,
  studio              text NOT NULL CHECK (studio IN ('script', 'caption', 'combo')),
  product_name        text NOT NULL,
  category            text,
  target_customer     text,
  tone                text,
  platform            text,
  duration            text,
  additional_details  text,
  payload             jsonb NOT NULL,   -- ScriptContent | CaptionContent | ComboContent | {variants: ...}
  created_at          timestamptz DEFAULT now()
);
```

#### `brand_voices`
```sql
CREATE TABLE brand_voices (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  name          text NOT NULL,
  description   text,
  sample_posts  text[] NOT NULL DEFAULT '{}',  -- up to 3
  created_at    timestamptz DEFAULT now(),
  updated_at    timestamptz DEFAULT now()
);
```

#### `projects`
```sql
CREATE TABLE projects (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  name        text NOT NULL,
  color       text DEFAULT 'pink',
  cover_emoji text,
  created_at  timestamptz DEFAULT now()
);
```

#### `usage_events`
```sql
CREATE TABLE usage_events (
  id          bigserial PRIMARY KEY,
  user_id     uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  event_type  text NOT NULL,
  metadata    jsonb DEFAULT '{}'::jsonb,
  created_at  timestamptz DEFAULT now()
);
```

#### `billing_events`
```sql
CREATE TABLE billing_events (
  id              bigserial PRIMARY KEY,
  user_id         uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  event_type      text NOT NULL,
  stripe_event_id text UNIQUE NOT NULL,  -- idempotency
  metadata        jsonb DEFAULT '{}'::jsonb,
  created_at      timestamptz DEFAULT now()
);
```

#### `feedback` (NEW)
```sql
CREATE TABLE feedback (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  email       text,
  type        text NOT NULL CHECK (type IN ('bug','idea','praise','question','other')),
  message     text NOT NULL CHECK (char_length(message) BETWEEN 1 AND 4000),
  page        text,
  user_agent  text,
  metadata    jsonb DEFAULT '{}'::jsonb,
  created_at  timestamptz DEFAULT now()
);
```

### 5.2 Migration History

| Migration | Purpose |
|-----------|---------|
| `001_initial_schema.sql` | profiles, basic auth setup |
| `002_atomic_credit_decrement.sql` | `decrement_credit(uid uuid)` RPC for race-safe charge |
| `003_storage_avatars.sql` | Supabase Storage bucket + RLS for avatars |
| `004_capduction_studios.sql` | generations, brand_voices, projects, usage_events; updated plan CHECK to include studio/agency; redefined decrement_credit with `p_user_id` param |
| `005_add_creator_plan.sql` | Added 'creator' to plan CHECK (4-tier pricing) |
| `006_decrement_credit_amount.sql` | Added `p_amount` param so variants > 1 charges N credits atomically |
| `007_feedback_table.sql` | feedback table + RLS (anyone insert, users read own) |

### 5.3 RLS Policies
- **profiles:** users read/update their own only
- **generations:** users read/insert/delete their own only
- **brand_voices:** users full CRUD on their own only
- **projects:** users full CRUD on their own only
- **feedback:** anyone insert (anonymous welcome) · users read their own · service-role bypasses for admin

### 5.4 Key RPCs
```sql
-- Atomic credit decrement (latest version)
CREATE FUNCTION decrement_credit(p_user_id uuid, p_amount integer DEFAULT 1)
RETURNS integer  -- returns new credits remaining, or -1 if insufficient
LANGUAGE plpgsql SECURITY DEFINER
AS $$
DECLARE remaining integer;
BEGIN
  UPDATE profiles
  SET credits_remaining = credits_remaining - p_amount
  WHERE id = p_user_id AND credits_remaining >= p_amount
  RETURNING credits_remaining INTO remaining;
  RETURN COALESCE(remaining, -1);
END;
$$;
```

---

## 6. Prompt Engineering (3 Studios)

ทุก prompt ใช้รูปแบบ **system + user** messages เพื่อให้ OpenAI auto-cache prefix (50% saving on cached tokens).

### 6.1 Script Studio Prompt Structure

**System (cached, identical per call):**
```
You are an elite Thai short-form video director and scriptwriter...

═══ CRITICAL LANGUAGE RULES ═══
1. NATURAL THAI (no robotic, no translated-feeling)
2. ENGLISH MIX (Best Seller, Must Have, Unbox, Review, Sold Out)
3. Reference TONE styles:
   - Friendly: warm, polite particles "นะคะ/ครับ/ค่า"
   - Professional: clear, authoritative, less slang
   - Luxury: elegant, premium-positioning
   - Viral: high energy, dramatic, sensational hooks
   - Persuasive: hard-selling, deep triggers, objection handling
   - Minimal: clean, calm, aesthetic restraint

═══ STRUCTURE ═══
N timed beats: HOOK (0-3s) → BODY/PROOF/OBJECTION → CTA
Each beat: timecode, role, spoken, broll, onScreenText
Plus: totalSeconds, thumbnailCopy, postingChecklist

═══ OUTPUT FORMAT ═══
{JSON schema}
WARNING: ONLY the raw JSON.
```

**User (dynamic per request):**
```
═══ THIS REQUEST ═══
Audience:   <joined target customers>
Tone blend: <joined tones>

Product:    <product name>
Categories: <joined categories>
Platform:   <platform>
Duration:   <duration> (N beats, ~Xs each)
Details:    <free-form details>

[BRAND VOICE block if set]
[VARIANT angle hint if variants > 1: PROOF / PROBLEM / CURIOSITY]

Generate a complete script with exactly N beats...
```

**Variants for Script:** Server-side parallel fan-out → N OpenAI calls → return `{variants: ScriptContent[]}`

### 6.2 Caption Studio Prompt

Per-call counts (fixed at 5 captions, 5 hooks, 8-12 hashtags, 5 CTAs, 4 angles, 4 ideas). Variants > 1 = N parallel calls with distinct angles: **EMOTIONAL / PROBLEM-SOLUTION / SOCIAL-PROOF**

### 6.3 Combo Mode Prompt

Single response with `sharedHook + script + caption`. Script's first beat MUST echo sharedHook. First caption variant MUST open with sharedHook words. Variants > 1 = N parallel calls with angles: **EMOTIONAL / PROBLEM-LED / PROOF-LED**

### 6.4 Beat Count Logic
```javascript
'15s' → 3 beats (~5s each)
'30s' → 4 beats (~7s each)
'60s' → 5 beats (~12s each)
'90s' → 6 beats (~15s each)
'long' → 8 beats (flexible)
Custom 'Xs' → calculated by range
```

### 6.5 Adversarial Filter (lib/api-handler.ts)
Blocks prompt injection patterns but NOT casual English words like "instruction" or "bypass":
```javascript
/ignore\s+(?:all\s+)?(?:previous|prior|above)/i
/disregard\s+(?:all\s+)?(?:previous|prior|above|instructions)/i
/system\s*prompt\s*[:=]/i
/you\s+are\s+now\s+(?:a|an|the)\s/i
/forget\s+(?:everything|all|your)\s/i
/jailbreak/i
/<\s*script[\s>]/i
/\bDAN\b.*(?:mode|prompt)/i
```

---

## 7. API Routes

| Route | Method | Auth | Purpose |
|-------|--------|------|---------|
| `/api/generate/script` | POST | ✓ | Generate script (fan-out N calls) |
| `/api/generate/caption` | POST | ✓ | Generate caption pack (fan-out) |
| `/api/generate/combo` | POST | ✓ | Generate shared-hook combo (fan-out) |
| `/api/billing/checkout` | GET | ✓ | Create Stripe Checkout session |
| `/api/billing/portal` | GET | ✓ | Open Stripe Customer Portal |
| `/api/webhooks/stripe` | POST | Stripe sig | Handle 4 Stripe events |
| `/api/history/[id]` | DELETE | ✓ | Delete a generation (RLS + user_id check) |
| `/api/feedback` | POST | optional | Submit feedback (anonymous OK) |
| `/auth/callback` | GET | n/a | Exchange Supabase code for session |
| `/auth/signout` | POST | ✓ | Clear session |

### 7.1 Standard Generate Flow (using script as example)
1. **parseBody** with Zod schema
2. **isAdversarial** check on productName, details, categories
3. **authenticate** — returns ctx with userId, plan (in demo mode = anonymous IP-based)
4. **checkCredits** with required = variantCount — blocks with 402 if insufficient
5. **applyRateLimit** — Upstash Redis (or no-op if not configured)
6. **resolveBrandVoiceContext** — load voice if `brandVoiceId` provided
7. **Promise.all** of N `generateScript(prompt, plan)` calls
8. **saveGenerationAndDecrement** — insert row + RPC decrement
9. Return `{success, data}`

### 7.2 Stripe Webhook Events Handled
| Event | Action |
|-------|--------|
| `checkout.session.completed` | First activation: set plan + refill credits |
| `customer.subscription.updated` | Sync plan/status, refill credits only on tier upgrade |
| `customer.subscription.deleted` | Downgrade to free, keep remaining credits |
| `invoice.paid` (subscription_cycle only) | Monthly renewal: refill credits |

### 7.3 Webhook Critical Fixes
- Uses `lib/supabase/admin.ts` service-role client (bypasses RLS)
- `updateBillingStatus()` does NOT touch credits_remaining (was a bug — every event refilled, gave free credits)
- `refreshCreditsForPlan()` called explicitly only on real activation/renewal events
- Idempotency: `billing_events.stripe_event_id` unique constraint
- Loud error logging on DB write failures (was silent before)

---

## 8. Auth Flow

### 8.1 Sign-up Methods
1. **Magic Link** (default tab)
   - Email only, no password
   - Sends OTP via Resend
   - Click link in email → /auth/callback → PKCE exchange → /dashboard
2. **Email + Password**
   - 8 chars minimum
   - Password hashed by Supabase (bcrypt)
3. **Google OAuth**
   - Redirect to Google → callback → session

### 8.2 Magic Link Cross-Browser Issue + Fix
**Problem:** macOS opens email links in default browser (e.g., Chrome) — session lands there, not in Safari where signInWithOtp was called.

**Solution:**
1. **Auto-polling**: "sent" panel polls `getSession()` every 2s — if user opens link in SAME browser, auto-redirects
2. **Paste-link fallback**: collapsible section with input
   - Detects URL type (supabase.co verify URL OR own callback URL)
   - If verify URL → `window.location.href = url` (lets server verify + redirect to /auth/callback → PKCE exchange in current browser)
   - If callback URL → `exchangeCodeForSession(code)` directly
   - Allowlist: only `*.supabase.co` or own hostname
3. **PKCE verifier** stored in browser localStorage at signInWithOtp time — required for the exchange to succeed in that browser

### 8.3 OAuth Callback Sanitization
`/auth/callback?next=...` validates `next` param:
- Must start with `/`
- Cannot start with `//` (protocol-relative URL bypass)
- Cannot start with `/\`
- Otherwise → defaults to `/dashboard`

This closes the open-redirect → phishing vector.

### 8.4 Password Reset Flow
1. User on `/forgot-password` enters email
2. Supabase sends reset email with `?code=...` link
3. User clicks → /reset-password
4. `reset-client.tsx` runs:
   - Listens to `onAuthStateChange` for PASSWORD_RECOVERY event
   - Falls back to manual hash parsing for implicit-flow tokens
   - `settled` flag prevents race condition between session-detected vs 4s timeout

---

## 9. Billing + Stripe Integration

### 9.1 Plans + Stripe Products

| Plan | Stripe Price ID env | Monthly Price | Credits |
|------|---------------------|---------------|---------|
| Creator | `STRIPE_CREATOR_PRICE_ID` | ฿199 | 100 |
| Studio | `STRIPE_STUDIO_PRICE_ID` | ฿549 | 500 |
| Agency | `STRIPE_AGENCY_PRICE_ID` | ฿1,890 | 3,000 |

All in THB, monthly recurring.

### 9.2 Checkout Flow
1. User clicks "Upgrade" → GET `/api/billing/checkout?plan=studio`
2. Server creates Stripe Checkout session:
   - mode: subscription
   - line_items: [{price: PRICE_IDS[plan], quantity: 1}]
   - customer: reuse existing if `profile.billing_customer_id`
   - metadata: `{supabase_user_id, plan}`
   - success_url: `/dashboard/settings?upgraded=<plan>`
   - cancel_url: `/pricing?cancelled=1`
   - allow_promotion_codes: true
   - (No more `payment_method_types` — let Stripe auto-detect: THB → card + PromptPay)
3. Server returns 303 redirect to Stripe Checkout URL
4. User completes payment
5. Stripe redirects to success_url
6. Stripe sends webhook → server processes

### 9.3 Webhook Processing Order (race-safe)
1. Verify Stripe signature → 400 if invalid
2. Check `billing_events.stripe_event_id` for idempotency → skip if duplicate
3. Switch on event.type, call appropriate handler
4. `updateBillingStatus()` — updates profile.plan + status + period_end + customer_id (NOT credits)
5. `refreshCreditsForPlan()` — sets credits_remaining to PLAN_CREDITS[plan] (only on real events)
6. Log to `billing_events` table

### 9.4 Critical Webhook Fixes Made
| Bug | Fix |
|-----|-----|
| RLS blocked all webhook writes silently (anon key) | Created `lib/supabase/admin.ts` with service-role key |
| Credit refilled on every `subscription.updated` event | Removed credit update from `updateBillingStatus`, only refresh on activation/renewal/upgrade |
| Failed writes were swallowed by try/catch | Loud `console.error` per event with grep-able format |
| Webhook URL was old vercel.app | User created new Stripe endpoint at `capduction.com/api/webhooks/stripe`; needs to delete old one |

### 9.5 Stripe Live Mode (TODO)
Currently using test mode. Switching:
1. Stripe Dashboard → toggle Test ↔ Live
2. Create products + prices in Live with same names + THB
3. Add webhook endpoint with live mode signing secret
4. Update Vercel env: STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, STRIPE_*_PRICE_ID
5. Redeploy

---

## 10. UI/UX System

### 10.1 Design Language: "Soft Liquid"
- **Iridescent gradient**: pink → violet → peach → mint
- **Frosted glass**: `backdrop-blur(28px)` + `bg-white/55` borders
- **Custom serif** display for headlines
- **Thai font** via `lang-th:font-thai` Tailwind variant
- **Mono uppercase** eyebrows with `tracking-[0.22em]`
- **Sparkles** (`✦`) as separator and visual punctuation
- **Custom cursor** with `data-cursor="<intent>"` attribute (open, switch, go, start, etc.)

### 10.2 Reusable Components
| Component | Purpose |
|-----------|---------|
| `<MultiSelect>` | Chip-based multi picker w/ custom input, optional collapse |
| `<StudioForm>` | Shared form for all 3 studios |
| `<StudioShell>` | Wrapper with brand voice selector + result panel |
| `<VariantTabs>` | Tab switcher for variant payloads |
| `<ScriptResult>` / `<CaptionResult>` / `<ComboResult>` | Result viewers per studio |
| `<AuthCard>` | Glass card wrapper for login/signup/forgot |
| `<MagicSentPanel>` (in login) / `<SignupSentPanel>` | Magic link sent confirmation w/ paste fallback |
| `<FeedbackWidget>` | Floating button + modal for beta feedback |
| `<Topbar>` | Dashboard topbar with credits chip |
| `<Sidebar>` | Dashboard sidebar with admin section |
| `<CapNav>` / `<CapFooter>` | Marketing nav + footer |
| `<BrandMark>` / `<AppIcon>` | Logo (quote-bubble concept) |
| `<HeroWaveBg>` | Animated wave background |

### 10.3 Error Boundaries (NEW)
- `app/global-error.tsx` — last-resort fallback outside i18n provider
- `app/error.tsx` — page-level error boundary inside glass surface
- Both log via `console.error` with structured JSON (Vercel logs greppable)
- `lib/error.ts` exports `reportError(err, {scope, context})` — used by API routes

### 10.4 Responsive Strategy
- Mobile breakpoint: `lg:` (1024px)
- Sidebar: drawer on mobile, fixed on desktop
- Topbar: hamburger + collapsed search on mobile
- Pricing grid: 1 col → 2 col → 4 col (sm:2, lg:4)
- Hero text: `clamp()` scaling

### 10.5 Color States
- Credits chip in topbar:
  - `credits === 0` → bg-rose-100, text-rose-700
  - `credits ≤ 5` → bg-amber-100, text-amber-800
  - else → glass white

---

## 11. i18n System

### 11.1 Architecture (`lib/i18n/`)
- `dict.ts` — 400+ keys, each with `th + en` strings
- `context.tsx` — React context with `useT()` hook + `setLang()`
- Stores choice in `localStorage` key `capduction_lang`
- Auto-detects browser language on first visit (TH if `navigator.language.startsWith('th')`)
- Sets `document.documentElement.lang` for CSS `:lang(th)` styling

### 11.2 Interpolation
Simple `{var}` substitution:
```javascript
t('dh.credits.low', { n: 3 })
// → "เหลือ 3 เครดิต · อัปเกรดเป็น Studio รับ 500/เดือน"
```

### 11.3 Language-Aware Tailwind Variant
`lang-th:font-thai` — applies Thai font only when `<html lang="th">`. Configured in `tailwind.config.ts`.

### 11.4 Pure-Language Discipline
After audit, the dict was cleaned so:
- Thai version contains only Thai (plus brand names like Capduction, TikTok, Stripe, accepted loanwords)
- English version contains only English
- Common Thai-style English borrowing kept: "studio", "hook", "viral", "CTA" — used when Thai equivalent feels forced

### 11.5 Sidebar Section Headers (per language)
| Key | TH | EN |
|-----|----|----|
| side.section.studios | สตูดิโอ | STUDIOS |
| side.section.projects | โปรเจกต์ | PROJECTS |
| side.section.resources | เครื่องมือ | RESOURCES |
| dash.brand_voice | เสียงแบรนด์ | Brand Voice |
| sidebar.analytics | สถิติการใช้งาน | Analytics |

### 11.6 Product Feature Names (kept English in both)
- Combo Mode, Script Studio, Caption Studio
- Capduction, Beta
- PromptPay (Thai-specific but officially branded)

---

## 12. AI Model Strategy + Cost Optimization

### 12.1 Tiered Model Selection
Configurable via env, default:
- `OPENAI_MODEL_FREE = 'gpt-4o-mini'` — 94% cheaper, acquisition cost saver
- `OPENAI_MODEL_PAID = 'gpt-4o'` — quality moat for paying customers

`modelForPlan(plan)` picks based on `auth.ctx.plan` (free → mini, others → 4o).

### 12.2 Prompt Caching
Prompt builders return `{system, user}` shape. OpenAI's automatic prompt caching matches the longest static prefix, so the identical `system` portion of every call (per studio) gets 50% off cached input tokens.

Cache TTL: 5 minutes. With consistent traffic, most generations hit cached system prompt.

### 12.3 Fan-out vs Single-Call
Originally Caption + Combo were single-call with text-based count instructions ("produce 15 captions"). LLM frequently ignored counts.

Refactored to **fan-out everywhere**:
- variants=1 → 1 call
- variants=2 → 2 parallel calls
- variants=3 → 3 parallel calls

Each call gets a distinct **angle hint** in the user message to ensure variety:
- Script: PROOF-led / PROBLEM-led / CURIOSITY-led
- Caption: EMOTIONAL / PROBLEM-SOLUTION / SOCIAL-PROOF
- Combo: EMOTIONAL / PROBLEM-LED / PROOF-LED

Result: predictable cost (1 credit per call), better variety, consistent UX across studios (all use shared `<VariantTabs>` component).

### 12.4 Cost Math (per generation, GPT-4o)
- Script (~800 in + 1200 out tokens): ~$0.014 ≈ ฿0.50
- Caption (~700 in + 1500 out): ~$0.018 ≈ ฿0.63
- Combo (~900 in + 3500 out): ~$0.038 ≈ ฿1.35

With GPT-4o-mini: ~94% cheaper across the board.

### 12.5 OpenAI Request Hardening
- `AbortSignal.timeout(45_000)` — no more 60s Vercel function kills mid-spinner
- Try/catch surfaces `TimeoutError` as user-friendly "AI request timed out"
- All 3 result viewers null-check (`Array.isArray(data.beats) ? ... : []`) — malformed JSON doesn't tear down React tree

---

## 13. Security + Privacy

### 13.1 Auth
- Supabase Auth with bcrypt password hashing
- Magic link tokens single-use, 1h expiry
- Google OAuth via Supabase provider
- PKCE flow for token exchange (browser-locked)
- Session cookies via `@supabase/ssr` (HttpOnly)

### 13.2 RLS (Row Level Security)
All user-data tables have RLS enabled. Policies scope to `auth.uid()`. Service-role bypasses for admin operations (webhooks, admin pages).

### 13.3 Service-Role Key Rotation
- Migrated from legacy JWT (eyJ...) to new sb_publishable + sb_secret keys
- Old JWT-based API keys disabled (revoked)
- Service-role key stored in Vercel env, only used server-side

### 13.4 Open Redirect Protection
- `/auth/callback?next=...` validates `next` is same-origin path
- Magic link paste-input allowlists `*.supabase.co` or own hostname only

### 13.5 Prompt Injection
- Adversarial filter on all user inputs to /api/generate/*
- Patterns target real injection attempts, not casual English

### 13.6 Privacy
- Full PDPA-compliant policy at `/privacy`
- Stated: We don't train AI on user content
- Sub-processors listed: Supabase, Vercel, OpenAI, Stripe, Resend, Google
- Data retention: account active → kept; inactive 2y → deleted; usage logs 90d; billing 7y (Thai tax law)
- User rights: see, edit, delete, withdraw consent, object

### 13.7 Email Security
- Resend with verified `capduction.com` domain
- SPF/DKIM configured
- `feedback@capduction.com` sender for notifications
- `hello@capduction.com` contact

### 13.8 Payment Security
- Never store card data — all via Stripe Checkout
- Webhook signature verification mandatory
- Idempotency on event_id prevents replay

---

## 14. Deployment + Environment

### 14.1 Hosting
- **Vercel** (Hobby plan)
- Region: auto (US East default for ap-southeast-1 db has cross-region cost)
- Auto-deploy from `main` branch on GitHub push
- Custom domain `capduction.com` with auto SSL

### 14.2 Required Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://ljpgkbkrpnpfjzxjsfzn.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_...
SUPABASE_SERVICE_ROLE_KEY=sb_secret_...

# OpenAI
OPENAI_API_KEY=sk-proj-...
OPENAI_MODEL_FREE=gpt-4o-mini    # optional override
OPENAI_MODEL_PAID=gpt-4o          # optional override

# Stripe
STRIPE_SECRET_KEY=sk_test_...     # or sk_live_... in live mode
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_CREATOR_PRICE_ID=price_...
STRIPE_STUDIO_PRICE_ID=price_...
STRIPE_AGENCY_PRICE_ID=price_...

# Resend (transactional email)
RESEND_API_KEY=re_...

# App
NEXT_PUBLIC_APP_URL=https://capduction.com

# Optional admin gate
ADMIN_EMAILS=athit.boonpinit@gmail.com   # fallback in code is the same

# Optional rate limiting
UPSTASH_REDIS_REST_URL=...
UPSTASH_REDIS_REST_TOKEN=...
```

### 14.3 GitHub Commit Author Gotcha
Vercel blocks deploys whose commit email doesn't match a GitHub account it can verify. Local git must use:
```bash
git config user.email mosakamak090@gmail.com
git config user.name Maradosx
```
Otherwise deploys go into BLOCKED state and need manual rebase + force-push to fix author.

### 14.4 Deploy Pipeline
1. Push to `main` → GitHub webhook triggers Vercel
2. Vercel builds (npm install + next build)
3. If author email matches → deploy → live in ~2 min
4. If not → BLOCKED state, no notification, manual fix needed

### 14.5 Rollback
Vercel keeps last 30 deploys. To rollback: Deployments tab → click old deploy → "Promote to Production"

---

## 15. Sprint History (Major Commits)

### Pre-Capduction sessions (earlier development)
- Initial setup: Next.js scaffold, theme, 3 studios MVP
- Auth: Supabase Auth + email/magic link
- Stripe: 3-tier pricing (Free/Studio/Agency) with hardcoded payment_method_types

### Sprint: Polish + dogfood prep (this session)

**Commit `4091b4e` — Polish round 1**
- MultiSelect: collapse + "+N more" chip (form less cluttered)
- Studio form: "1 แบบ" → cleaner Thai
- About: rewrote as real content (mission, principles, story, contact)
- Docs: full v1.0 guide
- Status: dropped fake uptime % (was 99.92% etc — fabricated)
- TH polish: "5 variants" → "5 แบบ", "package" → "ชุด"

**Commit `5f45436` — Pre-launch polish**
- Footer cleanup (drop ComingSoon stubs)
- /contact + /changelog with real content
- Login `?next=` support
- Google OAuth try/finally (button doesn't stay disabled on cancel)
- Adversarial filter tightened (no more false positives on "instruction"/"bypass")
- Error boundaries (`global-error.tsx`, `error.tsx`, `lib/error.ts`)

**Commit `00bb2b8` (after force-push, originally `fbbe2c0`) — Critical Stripe billing fix**
- `lib/supabase/admin.ts` with service-role client (RLS bypass)
- billing.ts + webhook use admin client
- Stripe price IDs configurable
- Drop hardcoded promptpay payment method

**Commit `c0d4b56` — Sprint 1+2 hardening**
- Webhook stops resetting credits on every event
- OAuth callback `?next` sanitization
- DELETE /api/history auth check
- OpenAI 45s timeout + result null-checks
- Signup + forgot-password i18n
- Real Privacy + Terms pages

**Commit `245d8db` — Conversion overhaul**
- New hero "AI ที่เขียนภาษาไทย — เหมือนครีเอเตอร์ไทยจริงๆ"
- Removed fake social proof (10 avatar stack)
- ShowcaseSection (Script/Caption/Combo tabs with real outputs)
- Pricing FAQ inline + 4 risk badges
- First-run dashboard onboarding (Try first sample)
- Dashboard preview "Create" → "See it live" (was dead button)

**Commit `cfba9b5` — Marketing master plan**
- 4-tier pricing (Free / Creator / Studio / Agency)
- AI model env vars + tiered dispatch (free=mini, paid=4o)
- Prompt caching (split system/user messages)
- Studio: ฿349 → ฿549 (with anchor positioning)
- Agency: ฿1,290/unlimited → ฿1,890/3,000 (capped)

**Commit `8ba17b4` — CHECK constraint fix**
- Migration 005: add 'creator' to plan CHECK
- Webhook DB write was failing silently before — now logged loudly

**Commit `40b9bbb` + `302f4fe` — Variant fix + magic-link UX**
- Migration 006: decrement_credit(uid, amount)
- Caption + Combo fan-out with distinct angles
- VariantTabs shared component
- Magic-link auto-polling + paste-link fallback

**Commit `5b4fe3d` — Topbar credits + i18n cleanup**
- Bell button → credits chip with color states
- ~20 Thaiglish strings cleaned to pure Thai

**Commit `322c152` — Magic-link paste fix v2**
- Detect Supabase verify URL vs callback URL
- Navigate for verify (preserves PKCE), exchange for callback

**Commit `d0e9e7e` — Sidebar i18n + Feedback widget**
- Sidebar section headers translate (สตูดิโอ/โปรเจกต์/เครื่องมือ)
- Brand Voice → เสียงแบรนด์
- Analytics → สถิติการใช้งาน
- Migration 007: feedback table
- `/api/feedback` route
- `<FeedbackWidget>` floating button + modal
- Email notification via Resend

**Commit `ea66af6` — Admin feedback inbox**
- `lib/admin.ts` with ADMIN_EMAILS env (fallback hardcoded)
- `/dashboard/admin/feedback` page (gated, 404 for non-admins)
- `<FeedbackInbox>` with type filters, search, copy-email
- Sidebar admin section (visible only when isAdmin)

---

## 16. Known Issues + Future Roadmap

### 16.1 Yellow Issues (post-launch polish)
- Analytics: top platform/tone aggregates client-side (slow at 10K+ generations) — should use Postgres GROUP BY
- Dashboard "this week" count uses recent[5] array, not real query (caps at 5)
- Generation save + credit decrement not in single transaction (rare race possible)
- Avatar upload trusts client MIME (should verify magic bytes)
- Demo mode settings save shows checkmark but doesn't persist (needs badge)
- i18n hydration flash (Thai briefly shows for EN users)
- Projects card icons decorative, no real counts

### 16.2 Missing Features (advertised features that DON'T exist)
**Currently NOT in product, also removed from pricing copy:**
- PDF export
- Regenerate from history (button)
- Team workspace / multi-seat
- API access
- White-label export
- Dedicated CSM

### 16.3 Marketing TODO
- Onboarding email sequence (welcome → tip → first paid prompt)
- Testimonial collection mechanism (auto-DM after 5 generations)
- Public landing showcase with real user output
- TikTok content engine (eat own dogfood)
- Influencer barter program
- Lemon8 marketing presence

### 16.4 Operational TODO
- Sentry/Axiom integration (currently use Vercel logs only)
- Cron job for inactive account cleanup
- Backup verification (Supabase Pro feature)
- Switch Stripe test → live mode
- Set up `hello@capduction.com` inbound forwarding (currently outbound only via Resend)

### 16.5 Speculative Future
- Brand voice marketplace (creators share/sell voices)
- Voice clone integration (ElevenLabs?)
- Video script + auto-generate teleprompter
- TikTok/IG API integration to auto-post
- Analytics on post performance (link → product page hits)

---

## 17. Pricing + Unit Economics

### 17.1 Cost per Generation (Real GPT-4o)
| Studio | Avg tokens | Cost USD | Cost THB |
|--------|-----------|----------|----------|
| Script | 800 in + 1200 out | $0.014 | ฿0.50 |
| Caption v1 | 700 in + 1500 out | $0.018 | ฿0.63 |
| Caption v3 (3 calls) | ~$0.054 | ฿1.89 | |
| Combo | 900 in + 3500 out | $0.038 | ฿1.35 |
| Combo v3 (3 calls) | ~$0.114 | ฿3.99 | |

Free tier (gpt-4o-mini): ~94% cheaper across the board.

### 17.2 Plan Margin Analysis
**Studio @ ฿549, 500 credits:**
- Avg user uses 150 gens/mo → cost ฿150-200 → margin ~฿330 after Stripe fee
- Heavy user maxes 500 gens with all Combo v3 → cost ~฿2000 → LOSS ~฿1500
- Realistic blend (~10% heavy): ~70% margin

**Agency @ ฿1,890, 3,000 capped:**
- Capped prevents catastrophic abuse
- At cap (3000 gens, mix): cost ~฿4500 — LOSS ~฿2,600
- But few users hit cap; realistic usage 1000-1500 → ~50% margin

### 17.3 Pricing Decisions Locked
- Studio raised ฿349 → ฿549 (better margin + anchoring)
- Agency: "unlimited" → 3,000 cap (abuse protection)
- Creator added at ฿199/100 (entry tier for Thai market psychology)
- All in THB (avoids USD conversion confusion)

### 17.4 Stripe Fees (THB)
- Card: 3.65% + ฿11 per transaction
- PromptPay: similar
- No setup/monthly fees

### 17.5 Other Operational Costs (monthly)
- Vercel: $0 (Hobby plan)
- Supabase: $0 (free tier — 500MB DB, 2GB transfer)
- Resend: $0 (3,000 emails/mo free)
- Domain: ฿400/yr ≈ ฿35/mo

Total fixed: ~฿35/mo until we exceed free tiers.

### 17.6 Break-even (with current pricing)
- 1 Studio user covers ~5x of total fixed costs
- 10 paying users (mix) = clearly profitable with current cost structure

---

## 18. Marketing Plan (parked)

### 18.1 Positioning Angle
**Differentiator vs ChatGPT/Jasper:** Thai-native voice. Not "AI for creators" generic. Tag: "AI ที่เขียนภาษาไทย — เหมือนครีเอเตอร์ไทยจริงๆ"

### 18.2 Channel Plan (4-week launch sequence)

**Week 1: Dogfood + Friends-and-Family**
- Founder uses Capduction to make own TikTok content
- Post 10 generated scripts on personal TikTok (hashtag #capduction)
- Send free Studio plan to 10-20 personal contacts
- Collect 5 testimonials by week 2

**Week 2: Polish + Assets**
- Embed testimonials on landing
- 3 SEO blog posts:
  - "10 hook TikTok ภาษาไทย ที่ทำให้คนหยุดเลื่อน"
  - "วิธีเขียน caption IG ขายของ ฉบับสมบูรณ์"
  - "ตารางคอนเทนต์ TikTok ทำเอง 30 นาที/วัน"
- Implement pricing + AI optimization commits

**Week 3: Soft Launch (Communities)**
- 3 Facebook groups (ครีเอเตอร์ TikTok ไทย · ขายของออนไลน์ · Reels Thailand)
- Lemon8 posts 5x/week
- Target: 100 signups, 5% paid conversion

**Week 4: Public Launch**
- Product Hunt launch (Tuesday 3pm BKK = 12:01am PST)
- DM 20 mid-tier creators (10K-100K followers) — offer 3 months Agency free for honest video review
- Google indexing
- Target: 500 signups, 25 paid

**Month 2+: Scale**
- TikTok Ads (start ฿500/day budget targeting lookalike from payers)
- Influencer barter scale (5 → 20)
- Referral program: "ชวนเพื่อน 1 คน รับ 25 credits ทั้งคู่"

### 18.3 Anti-patterns (DON'T DO)
- Facebook/Google Ads before testimonials
- LinkedIn (wrong audience)
- Newsletter popup
- "Beta discount" (destroys price anchor)
- Build more features before 10+ paying users give requirements

### 18.4 Metrics to Track
| Metric | Target |
|--------|--------|
| First-week activation (signups who complete 1 generation in 7d) | > 60% |
| Signup → first gen same session | > 80% |
| D7 retention | > 30% |
| Free → paid conversion in 14d | > 5% |
| ARPU (paying users) | > ฿400 |

### 18.5 Revenue Projection
Conservative:
- Month 1-3: 0 paid (free beta)
- Month 4-6: ฿3,800/mo (5 Studio + 1 Agency)
- Month 7-12: ฿14,500/mo (20 Studio + 3 Agency)
- Year 1 total: ~฿100-200K revenue, ~฿30-80K net profit

---

## Appendix A — File Tree

```
capduction/
├── app/
│   ├── (marketing landing root)
│   │   └── page.tsx
│   ├── about/ contact/ docs/ changelog/ status/ privacy/ terms/
│   ├── login/ signup/ forgot-password/ reset-password/
│   ├── auth/callback/ auth/signout/
│   ├── pricing/
│   ├── dashboard/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── dashboard-client.tsx
│   │   ├── workspace/script/ caption/ combo/
│   │   ├── brand-voice/
│   │   ├── projects/
│   │   ├── history/
│   │   ├── analytics/
│   │   ├── settings/
│   │   └── admin/feedback/
│   ├── api/
│   │   ├── generate/script/ caption/ combo/
│   │   ├── billing/checkout/ portal/
│   │   ├── webhooks/stripe/
│   │   ├── history/[id]/
│   │   └── feedback/
│   ├── error.tsx
│   ├── global-error.tsx
│   └── sitemap.ts
├── components/
│   ├── landing/ (hero, showcase-section, dashboard-preview, studios-section, bottom-cta, hero-wave-bg)
│   ├── dashboard/ (sidebar, topbar, feedback-widget, menu-context)
│   ├── workspace/ (studio-form, studio-shell, script-result, caption-result, combo-result, variant-tabs)
│   ├── auth/ (auth-card)
│   ├── ui/ (multi-select)
│   ├── cap-nav.tsx, cap-footer.tsx, brand-mark.tsx, lang-toggle.tsx, coming-soon.tsx
├── lib/
│   ├── ai.ts (OpenAI wrapper + tiered model)
│   ├── api-handler.ts (auth, credit check, save+decrement)
│   ├── admin.ts (admin gate helper)
│   ├── error.ts (structured error reporter)
│   ├── stripe.ts (PRICE_IDS, PLAN_META)
│   ├── i18n/ (dict, context)
│   ├── supabase/ (client, server, admin, middleware)
│   ├── db/ (profiles, generations, brand-voices, projects, billing)
│   └── prompts/ (script, caption, combo)
├── types/index.ts (StudioMode, Plan, all interfaces, PLAN_CREDITS)
├── supabase/migrations/ (001-007)
└── docs/ (this file)
```

## Appendix B — Useful SQL Queries

```sql
-- All paying users
SELECT email, plan, credits_remaining, current_period_end
FROM profiles
WHERE plan != 'free'
ORDER BY created_at DESC;

-- Generations by studio (last 30 days)
SELECT studio, COUNT(*) as count, COUNT(DISTINCT user_id) as users
FROM generations
WHERE created_at > now() - interval '30 days'
GROUP BY studio
ORDER BY count DESC;

-- Latest feedback
SELECT created_at, type, email, message, page, metadata
FROM feedback
ORDER BY created_at DESC
LIMIT 50;

-- Daily active users
SELECT DATE(created_at) as day, COUNT(DISTINCT user_id) as dau
FROM generations
WHERE created_at > now() - interval '30 days'
GROUP BY day
ORDER BY day DESC;

-- Top product names generated
SELECT product_name, COUNT(*) as count
FROM generations
WHERE created_at > now() - interval '7 days'
GROUP BY product_name
ORDER BY count DESC
LIMIT 20;
```

## Appendix C — Repository Information

- **GitHub:** Maradosx/capduction (private)
- **Default branch:** main
- **Commit format:** Conventional + Co-Authored-By Claude
- **Author email** (must match Vercel-verified GitHub email): `mosakamak090@gmail.com`
- **CI/CD:** Vercel auto-deploy on push to main

## Appendix D — Contact Channels (for users)

- **Primary email:** hello@capduction.com (outbound via Resend, needs inbound forwarding setup)
- **Contact page:** https://capduction.com/contact
- **Feedback widget:** in-app, bottom-right of every dashboard page
- **GitHub issues:** private repo, internal only

---

*Document last updated: 2026-05-17*
*Maintained by: Athit Boonpinit (founder)*
