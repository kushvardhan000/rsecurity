"use client";

import { motion, useReducedMotion, useMotionValue, useSpring } from "motion/react";
import { ArrowRight } from "lucide-react";
import type { MouseEvent, ReactNode } from "react";
import { cn } from "@/src/lib/cn";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
const MAX_SHIFT = 6;

type MagneticButtonProps = {
  children: ReactNode;
  variant?: "primary" | "outline-light" | "outline-dark" | "text";
  href?: string;
  onClick?: () => void;
  className?: string;
};

/**
 * Single-element magnetic button. All styling lives on the one
 * a/button — no inner span draws its own border or background.
 * Primary = crimson fill. Outline-light = white border (dark bg).
 * Outline-dark = charcoal border (light bg). Text = bare link.
 * Magnetic shift is disabled under reduced motion.
 */
export function MagneticButton({
  children,
  variant = "primary",
  href,
  onClick,
  className,
}: MagneticButtonProps) {
  const reduce = useReducedMotion();

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 140, damping: 18 });
  const springY = useSpring(y, { stiffness: 140, damping: 18 });

  const handleMove = (e: MouseEvent<HTMLElement>) => {
    if (reduce) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    x.set(Math.max(-MAX_SHIFT, Math.min(MAX_SHIFT, (e.clientX - cx) / 12)));
    y.set(Math.max(-MAX_SHIFT, Math.min(MAX_SHIFT, (e.clientY - cy) / 12)));
  };

  const handleLeave = () => {
    x.set(0);
    y.set(0);
  };

  const base =
    "group inline-flex items-center justify-center gap-2.5 rounded-sm px-6 py-3 text-sm font-semibold tracking-wide transition-colors duration-300";

  const variants = {
    primary:
      "bg-crimson text-white hover:bg-crimson-dark active:bg-crimson-dark",
    "outline-light":
      "border border-white/40 text-white bg-transparent hover:border-crimson hover:text-crimson",
    "outline-dark":
      "border border-grey-300 text-grey-900 bg-transparent hover:border-crimson hover:text-crimson",
    text: "text-grey-900 hover:text-crimson",
  } as const;

  const motionProps = {
    style: { x: springX, y: springY },
    onMouseMove: handleMove,
    onMouseLeave: handleLeave,
    whileTap: reduce ? undefined : { scale: 0.98 },
    transition: { duration: 0.4, ease: EASE },
  };

  if (href) {
    return (
      <motion.a
        href={href}
        className={cn(base, variants[variant], className)}
        {...motionProps}
      >
        {children}
        {variant !== "text" && (
          <ArrowRight
            aria-hidden="true"
            className="h-4 w-4 transition-transform duration-500 ease-out group-hover:translate-x-1.5"
          />
        )}
      </motion.a>
    );
  }

  return (
    <motion.button
      type="button"
      onClick={onClick}
      className={cn(base, variants[variant], className)}
      {...motionProps}
    >
      {children}
      {variant !== "text" && (
        <ArrowRight
          aria-hidden="true"
          className="h-4 w-4 transition-transform duration-500 ease-out group-hover:translate-x-1.5"
        />
      )}
    </motion.button>
  );
}