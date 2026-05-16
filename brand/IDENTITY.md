# Capduction — Brand Identity

> **Capduction** = *Capture* + *Production*
> สตูดิโอ AI สำหรับสคริปต์ แคปชั่น และคอนเทนต์วิดีโอสั้นยุค scroll-first

---

## 01 — Positioning

**Category:** AI Content Studio for Short-Form Video Creators (TH / SEA-first)
**Audience:** Thai online sellers, creators, agency, brand teams ที่ทำ TikTok / Reels / Shorts / LINE VOOM
**One-liner (TH):** "สตูดิโอ AI ระหว่างไอเดียกับการกดอัปโหลด"
**One-liner (EN):** "The studio between idea and upload."
**Tagline:** *"Studio for the scroll era."* / *"สตูดิโอสำหรับยุคไถฟีด"*

### What's different vs SellBoost AI v1
| ก่อน (SellBoost) | ตอนนี้ (Capduction) |
|---|---|
| Caption เป็นหลัก | **Script + Caption + Combo** ครบ pipeline |
| Generic monochrome SaaS | Editorial cinema studio aesthetic |
| Single-shot generation | Project-based workflow + Brand Voice memory |
| Mock + Demo mode | Production-ready launch |

---

## 02 — Aesthetic Direction: **Cinema Studio Editorial**

ไม่ใช่ SaaS ทั่วไป ไม่ใช่ Vercel/Linear clone — แต่เป็น "magazine-grade studio brand" ที่เอา reference จาก:
- A24 film promotion
- Apple Studio Display product page
- Japanese editorial magazines (POPEYE, BRUTUS)
- Pentagram editorial design
- The Browser Company aesthetic restraint

### Tone Words
**Editorial · Studio · Crafted · Quietly Confident · Cinema · Precise**

NOT: bubbly · gradient · purple · web3 · cyber · generic-friendly

---

## 03 — Color System

```
─── Primary Surfaces ─────────────────────────────────
Paper       #F5F1E8   warm cream — primary background, NOT white
Ink         #0B0B0B   deep near-black — primary text + dramatic blocks
Stone       #1A1817   secondary dark surface

─── Accents (use SPARINGLY) ──────────────────────────
Signal      #D4FF3F   electric lime — CTAs, key highlights, "live" indicators
Ember       #C45A1A   burnt ochre — secondary accent, warm callouts

─── Neutrals ─────────────────────────────────────────
Fog         #E8E3D6   subtle dividers, hover states
Mist        #B8B3A5   secondary text
Smoke       #6B6760   tertiary text, labels
Slate       #2E2C28   borders on light, secondary on dark

─── Functional ───────────────────────────────────────
Success     #4A8B3D   harvest green (not generic emerald)
Warning     #D89614   amber-mustard
Danger      #B23B2E   brick red (not bright red)
```

**Allocation rule:** Paper 70% · Ink 20% · Fog/Mist 8% · Signal 2% (used as scarce as gold)

---

## 04 — Typography

```
─── Display ──────────────────────────────────────────
Fraunces      variable serif — soft-opt 144, italic optional
              for hero, section titles, magazine-style display

─── Thai ─────────────────────────────────────────────
Anuphan       modern Thai sans — pairs with Fraunces beautifully
              for all Thai headlines + body

─── Body ─────────────────────────────────────────────
Fraunces      roman, opt 14, weights 400/500

─── Mono / UI ────────────────────────────────────────
JetBrains Mono   for labels, timestamps, code, "01 —" markers,
                 small caps tracking
```

### Typographic motifs
- **Chapter markers:** `01 — HOOK` (mono, all-caps, tracking 0.15em, smoke color)
- **Display italic:** Fraunces italic with opt-sz 144 for emotional emphasis
- **Number anchors:** Giant Fraunces numbers (10rem+) as section IDs, like a magazine
- **Asymmetric headlines:** mix serif italic with mono caps in same line

---

## 05 — 3D Identity: "Studio Tools"

Three signature 3D objects in **chrome polished material**, rendered with Three.js:

1. **Clapperboard** — represents Script Studio
2. **Microphone** (vintage condenser) — represents Voice / spoken script
3. **Lens / aperture ring** — represents Caption Studio (the "framing")

Treatment:
- Chrome reflective material with subtle iridescence
- Slow scroll-linked rotation (not autoplay spinning)
- Float subtly with sine wave (0.5s amplitude, 4s period)
- Drop a soft warm shadow on Paper background
- One hero object on landing, smaller versions as section dividers

---

## 06 — Motion Principles

- **Restraint over excess.** Cinema cuts, not micro-bounce parties.
- Page load: single staggered reveal (60ms increments), then quiet
- Hover: 200ms ease-out, subtle scale (1.01) or color shift only
- Scroll: parallax on 3D objects + chapter numbers fade-in
- No infinite spinners — use shimmer skeleton with grain texture
- Cursor: standard, but link hover swaps to subtle custom indicator

---

## 07 — Texture & Atmosphere

- **Film grain overlay** on entire viewport (SVG noise, 4% opacity)
- **Paper texture** subtle via CSS gradient noise on `--paper` surface
- **Hairline borders** (0.5px on retina, 1px elsewhere) — never thick
- **Drop shadows:** warm-tinted (rgba(11,11,11,0.06)) not pure black
- **Dividers:** always with chapter labels, never bare lines

---

## 08 — Voice & Copy Style

### Thai (primary market)
- ภาษากึ่งเป็นทางการ ผู้รู้ ใช้คำสั้นกระชับ
- ไม่ใช้ emoji ใน UI, ใช้ในผลลัพธ์เท่านั้น
- ใช้ "เรา" (Capduction) สื่อสารแบบเพื่อนร่วมงาน ไม่ใช่ฝ่ายขาย

**Examples:**
- ✅ "เขียนสคริปต์ก่อนกด record"
- ✅ "ปั้นแคปชั่นก่อนกดโพสต์"
- ❌ "AI สุดเจ๋ง! เปลี่ยนชีวิตคุณ! 🚀✨"

### English (secondary)
- Editorial, confident, lowercase-first when stylistic
- Short sentences. Periods. Like film direction notes.

**Examples:**
- ✅ "Script first. Caption second. Post like a pro."
- ✅ "Studio between idea and upload."
- ❌ "Revolutionize your content with our amazing AI platform!"

---

## 09 — Product Modes (the three studios)

```
╔══════════════════════════════════════════════════════╗
║  01 — SCRIPT STUDIO                                  ║
║  Spoken video scripts. Hook, body, payoff, CTA.      ║
║  Duration: 15s / 30s / 60s / 90s / long-form         ║
║  Output: Timed beats, B-roll cues, on-screen text    ║
╠══════════════════════════════════════════════════════╣
║  02 — CAPTION STUDIO                                 ║
║  Post copy, hooks, hashtags, CTAs, angles, ideas.    ║
║  Output: 5 variants per category, copy-ready.        ║
╠══════════════════════════════════════════════════════╣
║  03 — COMBO MODE                                     ║
║  Script + Caption aligned to the same hook.          ║
║  Output: A complete content package per video.       ║
╚══════════════════════════════════════════════════════╝
```

---

## 10 — Logo Concept

Wordmark: **Capduction** in Fraunces italic, opt-sz 144, weight 500
With a small **chrome aperture mark** (◉) as the lettermark
Spacing: -0.02em tracking, careful kerning around 'pd' ligature

```
   ◉  Capduction
   ◉  ฅ̇ปดักชั่น    (Thai treatment, optional)
```

The aperture ◉ doubles as:
- Favicon
- Loading indicator (rotates)
- Section divider
- "Capture" affordance icon
