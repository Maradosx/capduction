/**
 * Capduction brand mark (chrome triangle / play icon)
 * Used in nav, footer, dashboard sidebar, app icon
 */
export function BrandMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path d="M6 4l12 8-12 8V4z" fill="currentColor" />
    </svg>
  );
}

/**
 * Larger 3D chrome app icon (used in hero)
 */
export function AppIcon({ size = 120 }: { size?: number }) {
  return (
    <div
      className="orb-chrome rounded-[28px] flex items-center justify-center"
      style={{
        width: size,
        height: size,
        background:
          'radial-gradient(circle at 30% 25%, rgba(255,255,255,0.95) 0%, var(--lav) 15%, var(--rose) 35%, var(--violet) 60%, var(--ink-3) 100%)',
        boxShadow:
          'inset 0 3px 0 rgba(255,255,255,0.6), inset 0 -3px 0 rgba(94,79,138,0.4), 0 0 0 1px rgba(255,255,255,0.4), 0 28px 60px rgba(181,143,255,0.5), 0 0 100px rgba(255,143,181,0.3)',
      }}
    >
      <BrandMark
        className="w-[44%] h-[44%] text-white"
        // drop shadow handled via style
      />
    </div>
  );
}
