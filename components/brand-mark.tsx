/**
 * Capduction brand mark — supports 4 concepts (lumen / bloom / prism / quote)
 * Used in nav, footer, dashboard sidebar, auth, app icon.
 *
 * Swap CONCEPT to preview each option site-wide.
 */

export type Concept = 'lumen' | 'bloom' | 'prism' | 'quote';
export const CONCEPT: Concept = 'quote';

export function LumenMark() {
  return (
    <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" className="w-full h-full" aria-hidden>
      <defs>
        <linearGradient id="bm-lum-r1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#C4B5FD"/><stop offset="55%" stopColor="#F0ABFC"/><stop offset="100%" stopColor="#FBA98C"/>
        </linearGradient>
        <linearGradient id="bm-lum-r2" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#6EE7C7"/><stop offset="50%" stopColor="#93C5FD"/><stop offset="100%" stopColor="#C4B5FD"/>
        </linearGradient>
        <linearGradient id="bm-lum-r3" x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor="#FB7185"/><stop offset="100%" stopColor="#F0ABFC"/>
        </linearGradient>
        <radialGradient id="bm-lum-core" cx="40%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#FFFFFF"/><stop offset="55%" stopColor="#FFE9C9"/><stop offset="100%" stopColor="#FBA98C"/>
        </radialGradient>
      </defs>
      <circle cx="32" cy="32" r="28" fill="none" stroke="url(#bm-lum-r3)" strokeWidth="1.2" opacity="0.55"/>
      <circle cx="32" cy="32" r="22" fill="none" stroke="url(#bm-lum-r2)" strokeWidth="1.6" opacity="0.75"/>
      <circle cx="32" cy="32" r="16" fill="none" stroke="url(#bm-lum-r1)" strokeWidth="2.2" opacity="0.92"/>
      <circle cx="32" cy="32" r="9" fill="url(#bm-lum-core)"/>
      <circle cx="29" cy="29" r="2.4" fill="#FFFFFF" opacity="0.9"/>
    </svg>
  );
}

export function BloomMark() {
  return (
    <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" className="w-full h-full" aria-hidden>
      <defs>
        <linearGradient id="bm-bl-1" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#C4B5FD"/><stop offset="100%" stopColor="#F0ABFC"/></linearGradient>
        <linearGradient id="bm-bl-2" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#FBA98C"/><stop offset="100%" stopColor="#FB7185"/></linearGradient>
        <linearGradient id="bm-bl-3" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#6EE7C7"/><stop offset="100%" stopColor="#93C5FD"/></linearGradient>
        <radialGradient id="bm-bl-c" cx="40%" cy="35%" r="70%"><stop offset="0%" stopColor="#FFFFFF"/><stop offset="100%" stopColor="#FFE9C9"/></radialGradient>
      </defs>
      <g transform="translate(32 32)" style={{ mixBlendMode: 'multiply' }}>
        <ellipse cx="0" cy="-13" rx="8" ry="15" fill="url(#bm-bl-1)" opacity="0.78"/>
        <ellipse cx="0" cy="-13" rx="8" ry="15" fill="url(#bm-bl-2)" opacity="0.78" transform="rotate(60)"/>
        <ellipse cx="0" cy="-13" rx="8" ry="15" fill="url(#bm-bl-3)" opacity="0.78" transform="rotate(120)"/>
        <ellipse cx="0" cy="-13" rx="8" ry="15" fill="url(#bm-bl-1)" opacity="0.78" transform="rotate(180)"/>
        <ellipse cx="0" cy="-13" rx="8" ry="15" fill="url(#bm-bl-2)" opacity="0.78" transform="rotate(240)"/>
        <ellipse cx="0" cy="-13" rx="8" ry="15" fill="url(#bm-bl-3)" opacity="0.78" transform="rotate(300)"/>
      </g>
      <circle cx="32" cy="32" r="6" fill="url(#bm-bl-c)"/>
      <path d="M30 29 L36 32 L30 35 Z" fill="#7C3AED" opacity="0.55"/>
    </svg>
  );
}

export function PrismMark() {
  return (
    <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" className="w-full h-full" aria-hidden>
      <defs>
        <linearGradient id="bm-pr-1" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#FFFFFF"/><stop offset="100%" stopColor="#C4B5FD"/></linearGradient>
        <linearGradient id="bm-pr-2" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#F0ABFC"/><stop offset="100%" stopColor="#FB7185"/></linearGradient>
        <linearGradient id="bm-pr-3" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#FBA98C"/><stop offset="100%" stopColor="#F0ABFC"/></linearGradient>
        <linearGradient id="bm-pr-4" x1="0%" y1="100%" x2="100%" y2="0%"><stop offset="0%" stopColor="#6EE7C7"/><stop offset="100%" stopColor="#93C5FD"/></linearGradient>
        <linearGradient id="bm-pr-5" x1="100%" y1="100%" x2="0%" y2="0%"><stop offset="0%" stopColor="#93C5FD"/><stop offset="100%" stopColor="#C4B5FD"/></linearGradient>
        <linearGradient id="bm-pr-edge" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#7C3AED" stopOpacity="0.35"/><stop offset="100%" stopColor="#1E1B4B" stopOpacity="0.18"/></linearGradient>
      </defs>
      <polygon points="32,6 8,24 32,22" fill="url(#bm-pr-1)"/>
      <polygon points="32,6 56,24 32,22" fill="url(#bm-pr-2)"/>
      <polygon points="8,24 16,40 32,22" fill="url(#bm-pr-3)"/>
      <polygon points="56,24 48,40 32,22" fill="url(#bm-pr-4)"/>
      <polygon points="32,22 16,40 32,32 48,40" fill="url(#bm-pr-5)"/>
      <polygon points="16,40 32,58 32,32" fill="url(#bm-pr-3)" opacity="0.85"/>
      <polygon points="48,40 32,58 32,32" fill="url(#bm-pr-4)" opacity="0.85"/>
      <polygon points="32,6 8,24 16,40 32,58 48,40 56,24" fill="none" stroke="url(#bm-pr-edge)" strokeWidth="0.7" strokeLinejoin="round"/>
      <polygon points="32,7 30,11 34,11" fill="#FFFFFF" opacity="0.85"/>
    </svg>
  );
}

export function QuoteMark() {
  return (
    <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" className="w-full h-full" aria-hidden>
      <defs>
        <linearGradient id="bm-q-b" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#C4B5FD"/><stop offset="40%" stopColor="#F0ABFC"/><stop offset="100%" stopColor="#FBA98C"/></linearGradient>
        <linearGradient id="bm-q-s" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#FFE9C9"/><stop offset="100%" stopColor="#FB7185"/></linearGradient>
        <linearGradient id="bm-q-sh" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stopColor="#7C3AED" stopOpacity="0"/><stop offset="100%" stopColor="#1E1B4B" stopOpacity="0.18"/></linearGradient>
      </defs>
      <path d="M14 12 h28 a10 10 0 0 1 10 10 v14 a10 10 0 0 1 -10 10 h-12 l-7 8 1.5 -8 h-10.5 a10 10 0 0 1 -10 -10 v-14 a10 10 0 0 1 10 -10 z" fill="url(#bm-q-b)"/>
      <path d="M14 12 h28 a10 10 0 0 1 10 10 v14 a10 10 0 0 1 -10 10 h-12 l-7 8 1.5 -8 h-10.5 a10 10 0 0 1 -10 -10 v-14 a10 10 0 0 1 10 -10 z" fill="url(#bm-q-sh)"/>
      <rect x="18" y="22" width="22" height="2.4" rx="1.2" fill="#FFFFFF" opacity="0.9"/>
      <rect x="18" y="28" width="28" height="2.4" rx="1.2" fill="#FFFFFF" opacity="0.85"/>
      <rect x="18" y="34" width="16" height="2.4" rx="1.2" fill="#FFFFFF" opacity="0.8"/>
      <g transform="translate(50 14)">
        <path d="M0 -5 L1.3 -1.3 L5 0 L1.3 1.3 L0 5 L-1.3 1.3 L-5 0 L-1.3 -1.3 Z" fill="url(#bm-q-s)"/>
        <circle cx="0" cy="0" r="1" fill="#FFFFFF"/>
      </g>
    </svg>
  );
}

const MARKS: Record<Concept, () => JSX.Element> = {
  lumen: LumenMark,
  bloom: BloomMark,
  prism: PrismMark,
  quote: QuoteMark,
};

/**
 * Capduction brand mark — renders the currently-selected concept.
 * Sized via className (e.g. "w-9 h-9").
 */
export function BrandMark({ className }: { className?: string }) {
  const Mark = MARKS[CONCEPT];
  return (
    <span className={className} style={{ display: 'inline-flex' }}>
      <Mark />
    </span>
  );
}

/**
 * Hero app-icon — large freestanding mark with soft glow.
 */
export function AppIcon({ size = 120 }: { size?: number }) {
  const Mark = MARKS[CONCEPT];
  return (
    <div
      style={{
        width: size,
        height: size,
        filter:
          'drop-shadow(0 30px 60px rgba(124,58,237,0.30)) drop-shadow(0 8px 16px rgba(251,113,133,0.22))',
      }}
    >
      <Mark />
    </div>
  );
}
