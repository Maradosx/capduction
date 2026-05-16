'use client';

import { useEffect, useRef } from 'react';

const CURSOR_LABELS: Record<string, string> = {
  go: '→',
  start: 'GO',
  join: 'JOIN',
  open: 'OPEN',
  switch: '⇄',
  create: '+',
  next: '›',
  prev: '‹',
  read: '✦',
};

export function CapCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    const label = labelRef.current;
    if (!cursor || !label) return;

    // Hide until first move
    cursor.style.opacity = '0';
    let firstMove = true;

    const onMove = (e: PointerEvent) => {
      cursor.style.transform =
        `translate(-50%, -50%) translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      if (firstMove) {
        cursor.style.opacity = '1';
        firstMove = false;
      }
    };

    const onEnter = (e: Event) => {
      const el = e.currentTarget as HTMLElement;
      cursor.classList.add('target');
      label.textContent = CURSOR_LABELS[el.dataset.cursor || 'go'] || '→';
    };
    const onLeave = () => cursor.classList.remove('target');

    document.addEventListener('pointermove', onMove, { passive: true });

    const attachAll = () => {
      const targets = document.querySelectorAll<HTMLElement>('.hover-target');
      targets.forEach((el) => {
        el.addEventListener('pointerenter', onEnter);
        el.addEventListener('pointerleave', onLeave);
      });
      return () => {
        targets.forEach((el) => {
          el.removeEventListener('pointerenter', onEnter);
          el.removeEventListener('pointerleave', onLeave);
        });
      };
    };

    let detach = attachAll();
    const reattach = () => {
      detach();
      detach = attachAll();
    };
    const obs = new MutationObserver(reattach);
    obs.observe(document.body, { childList: true, subtree: true });

    return () => {
      document.removeEventListener('pointermove', onMove);
      detach();
      obs.disconnect();
    };
  }, []);

  return (
    <div ref={cursorRef} className="cap-cursor" aria-hidden>
      <span ref={labelRef} className="label"></span>
    </div>
  );
}
