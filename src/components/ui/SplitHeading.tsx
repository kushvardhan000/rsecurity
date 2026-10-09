"use client";

import { motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import { cn } from "@/src/lib/cn";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

type SplitHeadingProps = {
  /** headline text; any word equal to `accent` (case-insensitive) renders as the red italic accent */
  text: string;
  /** the single word to accent in italic red serif */
  accent?: string;
  as?: "h1" | "h2" | "h3";
  /** stagger delay in seconds before the first word animates */
  delay?: number;
  /** stagger gap between words in seconds */
  stagger?: number;
  /** when provided, gates the animation externally (e.g. after the preloader) */
  play?: boolean;
  className?: string;
  style?: React.CSSProperties;
  /** id for aria-labelledby */
  id?: string;
};

const wordVariants = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: EASE },
  },
};

/**
 * Animates a headline word by word; the accent word renders
 * as an italic red serif. Robust implementation: visible by default,
 * hides via JS only after hydration, and auto-reveals on a timer.
 */
export function SplitHeading({
  text,
  accent,
  as = "h2",
  delay = 0,
  stagger = 0.07,
  play,
  style,
  className,
  id,
}: SplitHeadingProps) {
  const reduce = useReducedMotion();
  const [hydrated, setHydrated] = useState(false);
  const [fallbackShow, setFallbackShow] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHydrated(true);
    const timer = setTimeout(() => {
      setFallbackShow(true);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const Tag = as;
  const accentLower = accent?.toLowerCase();
  const words = text.split(/\s+/).filter(Boolean);

  const containerBaseClass = cn(
    "display leading-[1.12] pb-[0.12em] mb-[-0.12em]",
    className
  );

  // If no JS / pre-hydration or reduced motion
  if (reduce || !hydrated) {
    return (
      <Tag id={id} className={containerBaseClass}>
        {words.map((word, i) => (
          <span key={`${word}-${i}`}>
            {accentLower && word.toLowerCase() === accentLower ? (
              <span className="italic-accent">{word}</span>
            ) : (
              word
            )}
            {i < words.length - 1 ? " " : ""}
          </span>
        ))}
      </Tag>
    );
  }

  // External gating (e.g. wait for the preloader)
  // If fallbackShow fired, force it to 'show'
  let animateStatus: "show" | "hidden";
  if (play !== undefined) {
    animateStatus = play || fallbackShow ? "show" : "hidden";
  } else {
    animateStatus = "hidden"; // rely on whileInView or fallback
  }

  const containerVariants = {
    hidden: {},
    show: {
      transition: { staggerChildren: stagger, delayChildren: delay },
    },
  };

  return (
    <Tag
      id={id}
      className={containerBaseClass}
      style={{ display: "block", ...style }}
    >
      <motion.span
        style={{ display: "contents" }}
        variants={containerVariants}
        initial="hidden"
        animate={animateStatus === "show" || fallbackShow ? "show" : undefined}
        whileInView={play === undefined ? "show" : undefined}
        viewport={{ once: true, amount: 0.1, margin: "0px 0px -8% 0px" }}
      >
        {words.map((word, i) => (
          <motion.span
            key={`${word}-${i}`}
            variants={wordVariants}
            style={{ display: "inline-block", whiteSpace: "pre" }}
            aria-hidden={false}
          >
            {accentLower && word.toLowerCase() === accentLower ? (
              <span className="italic-accent">{word}</span>
            ) : (
              word
            )}
            {i < words.length - 1 ? " " : ""}
          </motion.span>
        ))}
      </motion.span>
    </Tag>
  );
}
