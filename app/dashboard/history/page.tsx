import { createClient } from '@/lib/supabase/server';
import { getRecentGenerations } from '@/lib/db/generations';
import type { Generation } from '@/types';
import { HistoryClient } from './history-client';
import { HistoryHeader, HistoryEmpty } from './history-header';

export default async function HistoryPage() {
  const isDemoMode = !process.env.NEXT_PUBLIC_SUPABASE_URL;
  let items: Generation[] = [];

  if (!isDemoMode) {
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) items = await getRecentGenerations(100);
    } catch { /* swallow */ }
  }

  return (
    <div className="max-w-[1200px] mx-auto flex flex-col gap-6">
      <HistoryHeader isDemoMode={isDemoMode} count={items.length} />
      {items.length === 0 ? <HistoryEmpty /> : <HistoryClient items={items} />}
    </div>
  );
}
