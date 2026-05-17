/**
 * Capduction Landing Page
 * Theme: Mix 1 — Soft Liquid Console (iridescent pastel + glass)
 *
 * Sections:
 *  1. Floating glass pill NAV (component)
 *  2. HERO — 3D app icon + sparkles + bilingual headline + email/CTA + trust badge
 *  3. DASHBOARD PREVIEW — rotated frosted-glass workspace mockup
 *  4. STUDIOS — 3 cards (Script / Caption / Combo) with chrome orb icons
 *  5. BOTTOM CTA — gradient headline + email form
 *  6. FOOTER (component)
 */

import { CapNav } from '@/components/cap-nav';
import { CapFooter } from '@/components/cap-footer';
import { LandingHero } from '@/components/landing/hero';
import { ShowcaseSection } from '@/components/landing/showcase-section';
import { DashboardPreview } from '@/components/landing/dashboard-preview';
import { StudiosSection } from '@/components/landing/studios-section';
import { BottomCta } from '@/components/landing/bottom-cta';
import { HeroWaveBg } from '@/components/landing/hero-wave-bg';

export default function HomePage() {
  return (
    <>
      <HeroWaveBg />
      <CapNav active="/" />

      <main>
        <LandingHero />
        {/* Proof-of-output BEFORE workspace preview — answers
            "what do I actually get?" while interest is highest. */}
        <ShowcaseSection />
        <DashboardPreview />
        <StudiosSection />
        <BottomCta />
      </main>

      <CapFooter />
    </>
  );
}
