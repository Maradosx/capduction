/**
 * Capduction — structured error reporter.
 *
 * Writes to console with a `[ERROR]` prefix and JSON metadata so the
 * Vercel runtime logs can be filtered/aggregated. No external dependency
 * — swap the implementation for Sentry/Axiom later by changing this file.
 */

interface ReportOpts {
  /** Where in the app this happened — `api/generate/script`, `webhook/stripe`, etc. */
  scope: string;
  /** Optional user id, request id, or other context. */
  context?: Record<string, unknown>;
}

export function reportError(err: unknown, opts: ReportOpts): void {
  const message =
    err instanceof Error ? err.message :
    typeof err === 'string' ? err :
    'Unknown error';

  const stack = err instanceof Error ? err.stack : undefined;

  // Single-line JSON makes Vercel's log search work well.
  const payload = {
    level: 'error',
    scope: opts.scope,
    message,
    ...(opts.context ?? {}),
    ...(stack ? { stack: stack.split('\n').slice(0, 8).join(' | ') } : {}),
    ts: new Date().toISOString(),
  };
  console.error('[ERROR]', JSON.stringify(payload));
}
