'use server';
/**
 * app/actions/generation.ts
 *
 * NOTE: The /api/generate route is now the single source of truth for:
 *   - Saving the generation row
 *   - Decrementing credits
 *   - Logging usage events
 *
 * This Server Action's only job is to revalidate cached pages so the
 * Dashboard / History / Analytics reflect the new data immediately.
 */
import { revalidatePath } from 'next/cache';

export async function invalidateGenerationCache(): Promise<void> {
  revalidatePath('/dashboard');
  revalidatePath('/dashboard/history');
  revalidatePath('/dashboard/analytics');
}
