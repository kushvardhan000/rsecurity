"use client";

import { motion, useReducedMotion } from "motion/react";
import { type ReactNode, useEffect, useState } from "react";
import { cn } from "@/src/lib/cn";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

type RevealProps = {
  children: ReactNode;
  /** seconds before the reveal starts */
  delay?: number;
  /** rise distance in px */
  y?: number;
  /** only animate the first time it enters the viewport (defaults to true) */
  once?: boolean;
  /** when provided, gates the animation externally (e.g. after the preloader) */
  play?: boolean;
  className?: string;
  /** Custom fallback timeout in ms */
  fallbackTimeout?: number;
};

/**
 * Scroll reveal: fade + rise, slow and eased.
 * Robust implementation: visible by default (no JS), only hides after hydration,
 * removes blur entirely, and auto-reveals after a timeout if IO fails.
 */
export function Reveal({
  children,
  delay = 0,
  y = 24,
  once = true,
  play,
  className,
  fallbackTimeout = 1500,
}: RevealProps) {
  const reduce = useReducedMotion();
  const [hydrated, setHydrated] = useState(false);
  const [fallbackShow, setFallbackShow] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHydrated(true);
    const timer = setTimeout(() => {
      setFallbackShow(true);
    }, fallbackTimeout);
    return () => clearTimeout(timer);
  }, [fallbackTimeout]);

  // If reduce motion is on or not hydrated yet, just show content statically
  if (reduce || !hydrated) {
    return (
      <div className={cn(className, "opacity-100 translate-y-0 filter-none")}>
        {children}
      </div>
    );
  }

  const initial = { opacity: 0, y };
  const shown = { opacity: 1, y: 0 };
  const transition = { duration: 0.9, delay, ease: EASE };

  if (play !== undefined) {
    return (
      <motion.div
        className={cn(className)}
        initial={initial}
        animate={play || fallbackShow ? shown : initial}
        transition={transition}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      className={cn(className)}
      initial={initial}
      animate={fallbackShow ? shown : undefined}
      whileInView={shown}
      viewport={{ once, amount: 0.1, margin: "0px 0px -8% 0px" }}
      transition={transition}
    >
      {children}
    </motion.div>
  );
}
