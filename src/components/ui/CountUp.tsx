"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "motion/react";
import { cn } from "@/src/lib/cn";

type CountUpProps = {
  to: number;
  /** appended after the number, e.g. "+" */
  suffix?: string;
  /** seconds */
  duration?: number;
  /** gate the count-up externally (e.g. wait for the preloader) */
  enabled?: boolean;
  className?: string;
};

const easeOutExpo = (t: number) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t));

/**
 * Counts to a number when it enters the viewport, easing out.
 * Reduced motion: renders the final value immediately.
 */
export function CountUp({
  to,
  suffix = "",
  duration = 2,
  enabled = true,
  className,
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const reduce = useReducedMotion();
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView || !enabled || reduce) return;

    let rafId: number;
    const start = performance.now();

    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / (duration * 1000));
      setDisplay(Math.round(to * easeOutExpo(progress)));
      if (progress < 1) {
        rafId = requestAnimationFrame(tick);
      }
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [inView, to, duration, reduce, enabled]);

  const value = !enabled ? 0 : reduce ? to : display;

  return (
    <span ref={ref} className={cn("tabular-nums", className)}>
      {value.toLocaleString("en-IN")}
      {suffix}
    </span>
  );
}
