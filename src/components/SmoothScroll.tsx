"use client";

import { type ReactNode } from "react";
import { LenisProvider } from "@/src/lib/lenis";

/**
 * Drop-in wrapper that wires Lenis into the app.
 * Lenis is disabled on touch devices and under prefers-reduced-motion;
 * stop()/start() are exposed via the useLenis() hook for overlays.
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  return <LenisProvider>{children}</LenisProvider>;
}