'use client';

import { useEffect, useRef, useState } from 'react';

type RevealFrom = 'up' | 'left' | 'right' | 'scale';

const fromClass: Record<RevealFrom, string> = {
  up: 'reveal-up',
  left: 'reveal-left',
  right: 'reveal-right',
  scale: 'reveal-scale',
};

/** Scroll reveal — animates once on enter by default (better CLS / Core Web Vitals). */
export function Reveal({
  children,
  className = '',
  delay = '',
  from = 'up',
  once = true,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: string;
  from?: RevealFrom;
  /** If true (default), only animate the first time. Set false to re-animate on scroll. */
  once?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
        } else if (!once) {
          setVisible(false);
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -6% 0px' },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [once]);

  return (
    <div
      ref={ref}
      className={`reveal ${fromClass[from]} ${visible ? 'visible' : ''} ${delay} ${className}`.trim()}
    >
      {children}
    </div>
  );
}
