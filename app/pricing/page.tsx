import { CapNav } from '@/components/cap-nav';
import { CapFooter } from '@/components/cap-footer';
import { createClient } from '@/lib/supabase/server';
import { getProfile } from '@/lib/db/profiles';
import { PricingClient } from './pricing-client';

export const metadata = {
  title: 'Pricing — Capduction',
  description: 'Capduction pricing — Free, Studio, Agency',
};

export default async function PricingPage() {
  const isDemoMode = !process.env.NEXT_PUBLIC_SUPABASE_URL;
  let isLoggedIn = false;
  let currentPlan: string | null = null;

  if (!isDemoMode) {
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        isLoggedIn = true;
        const profile = await getProfile();
        currentPlan = profile?.plan ?? null;
      }
    } catch { /* swallow */ }
  }

  return (
    <>
      <CapNav active="/pricing" />
      <PricingClient isLoggedIn={isLoggedIn} currentPlan={currentPlan} />
      <CapFooter />
    </>
  );
}
