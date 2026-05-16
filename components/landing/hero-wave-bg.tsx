/**
 * Wave SVG decoration that floats behind the hero (pure visual)
 */
export function HeroWaveBg() {
  return (
    <div
      className="absolute top-0 left-0 right-0 pointer-events-none z-[1] opacity-40"
      style={{ height: '70vh' }}
      aria-hidden
    >
      <svg viewBox="0 0 1440 800" fill="none" preserveAspectRatio="none" className="w-full h-full">
        <path d="M0,250 Q360,150 720,250 T1440,250" stroke="rgba(181,143,255,0.4)" strokeWidth="1" fill="none" />
        <path d="M0,300 Q360,200 720,300 T1440,300" stroke="rgba(255,143,181,0.3)" strokeWidth="1" fill="none" />
        <path d="M0,350 Q360,250 720,350 T1440,350" stroke="rgba(93,213,218,0.25)" strokeWidth="1" fill="none" />
        <path d="M0,400 Q360,300 720,400 T1440,400" stroke="rgba(181,143,255,0.18)" strokeWidth="1" fill="none" />
      </svg>
    </div>
  );
}
