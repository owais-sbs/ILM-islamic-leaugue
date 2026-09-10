'use client';

import { motion, useReducedMotion, type Variants } from 'framer-motion';
import type { ReactNode } from 'react';

const ease = [0.22, 0.61, 0.36, 1] as const;

<<<<<<< HEAD
type RevealFrom = 'up' | 'down' | 'left' | 'right' | 'fade';

function offset(from: RevealFrom, distance: number) {
  switch (from) {
    case 'left':
      return { x: -distance, y: 0 };
    case 'right':
      return { x: distance, y: 0 };
    case 'down':
      return { x: 0, y: -distance };
    case 'fade':
      return { x: 0, y: 0 };
    case 'up':
    default:
      return { x: 0, y: distance };
  }
}

=======
/** Safe scroll reveal: never leaves content permanently invisible. */
>>>>>>> 5101914cc611ead94a3bf675e32733332f278d46
export function ScrollReveal({
  children,
  className = '',
  delay = 0,
<<<<<<< HEAD
  y = 36,
  from = 'up',
  once = false,
=======
  y = 24,
>>>>>>> 5101914cc611ead94a3bf675e32733332f278d46
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  from?: RevealFrom;
  /** When false, re-animates when scrolling back into view */
  once?: boolean;
}) {
<<<<<<< HEAD
  const start = offset(from, y);
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, ...start }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once, amount: 0.18, margin: '0px 0px -40px 0px' }}
      transition={{ duration: 0.75, delay, ease }}
=======
  const reduce = useReducedMotion();
  if (reduce) {
    return <div className={className}>{children}</div>;
  }
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.08, margin: '0px 0px -24px 0px' }}
      transition={{ duration: 0.65, delay, ease }}
>>>>>>> 5101914cc611ead94a3bf675e32733332f278d46
    >
      {children}
    </motion.div>
  );
}

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.04 } },
};

<<<<<<< HEAD
function itemVariants(from: RevealFrom = 'up'): Variants {
  const start = offset(from, 28);
  return {
    hidden: { opacity: 0, ...start },
    show: { opacity: 1, x: 0, y: 0, transition: { duration: 0.65, ease } },
  };
}

export function StaggerIn({
  children,
  className = '',
  once = false,
}: {
  children: ReactNode;
  className?: string;
  once?: boolean;
}) {
=======
const item: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease } },
};

export function StaggerIn({ children, className = '' }: { children: ReactNode; className?: string }) {
  const reduce = useReducedMotion();
  if (reduce) {
    return <div className={className}>{children}</div>;
  }
>>>>>>> 5101914cc611ead94a3bf675e32733332f278d46
  return (
    <motion.div
      className={className}
      variants={stagger}
      initial="hidden"
      whileInView="show"
<<<<<<< HEAD
      viewport={{ once, amount: 0.12 }}
=======
      viewport={{ once: true, amount: 0.08 }}
>>>>>>> 5101914cc611ead94a3bf675e32733332f278d46
    >
      {children}
    </motion.div>
  );
}

<<<<<<< HEAD
export function StaggerChild({
  children,
  className = '',
  from = 'up',
}: {
  children: ReactNode;
  className?: string;
  from?: RevealFrom;
}) {
=======
export function StaggerChild({ children, className = '' }: { children: ReactNode; className?: string }) {
  const reduce = useReducedMotion();
  if (reduce) {
    return <div className={className}>{children}</div>;
  }
>>>>>>> 5101914cc611ead94a3bf675e32733332f278d46
  return (
    <motion.div className={className} variants={itemVariants(from)}>
      {children}
    </motion.div>
  );
}
