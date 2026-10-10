/* eslint-disable */
"use client";

import {
  createContext,
  createElement,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";

type LenisContextValue = {
  stop: () => void;
  start: () => void;
  isStopped: boolean;
  lenis: Lenis | null;
  resize: () => void;
};

const LenisContext = createContext<LenisContextValue | null>(null);

function isTouchDevice() {
  if (typeof window === "undefined") return false;
  return (
    "ontouchstart" in window ||
    navigator.maxTouchPoints > 0 ||
    window.matchMedia("(hover: none)").matches
  );
}

/**
 * Provider that creates the single Lenis instance for the app.
 * Disabled entirely on touch devices and prefers-reduced-motion (native scroll).
 * Exposes stop()/start() through context so overlays / drawers / mobile
 * menus can pause smooth scroll and restore it on close.
 * stop/start are counter-based (lock count) so nested overlays never leave Lenis stopped.
 * Auto-resizes on content changes, font loads, route changes, window resize.
 */
export function LenisProvider({ children }: { children: ReactNode }) {
  const [stopped, setStopped] = useState(false);
  const [lockCount, setLockCount] = useState(0);
  const lenisRef = useRef<Lenis | null>(null);
  const resizeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pathname = usePathname();

  // Debounced resize helper
  const requestResize = useCallback(() => {
    if (resizeTimeoutRef.current) {
      clearTimeout(resizeTimeoutRef.current);
    }
    resizeTimeoutRef.current = window.setTimeout(() => {
      lenisRef.current?.resize();
    }, 100) as unknown as ReturnType<typeof setTimeout> | null;
  }, []);

  // Resize on route change (Next.js app router)
  useEffect(() => {
    if (pathname) {
      setTimeout(requestResize, 50);
    }
  }, [pathname, requestResize]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (isTouchDevice()) return; // native scroll is smoother on phones

    const lenis = new Lenis({
      duration: 1.15,
      smoothWheel: true,
      // Let Lenis auto-observe size changes (default in v1.1+)
      // We also manually trigger resize for edge cases
    });

    let rafId: number;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    lenisRef.current = lenis;

    // Resize on window load (images, fonts may have shifted layout)
    const onLoad = () => requestResize();
    window.addEventListener("load", onLoad);

    // Resize after fonts are ready
    document.fonts.ready.then(requestResize);

    // Safety: start on window focus (in case stop was left active)
    const onFocus = () => {
      if (lockCount === 0 && lenisRef.current?.isStopped) {
        lenisRef.current.start();
        setStopped(false);
      }
    };
    window.addEventListener("focus", onFocus);

    // Observe main content for size changes (images, dynamic content)
    const mainContent = document.querySelector("main");
    let resizeObserver: ResizeObserver | null = null;
    if (mainContent) {
      resizeObserver = new ResizeObserver(() => requestResize());
      resizeObserver.observe(mainContent);
    }

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("load", onLoad);
      window.removeEventListener("focus", onFocus);
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [lockCount, requestResize]);

  const stop = useCallback(() => {
    setLockCount((c) => {
      const next = c + 1;
      if (next === 1 && lenisRef.current) {
        lenisRef.current.stop();
        setStopped(true);
      }
      return next;
    });
  }, []);

  const start = useCallback(() => {
    setLockCount((c) => {
      const next = Math.max(0, c - 1);
      if (next === 0 && lenisRef.current) {
        lenisRef.current.start();
        setStopped(false);
      }
      return next;
    });
  }, []);

  const resize = useCallback(() => {
    lenisRef.current?.resize();
  }, []);

  const value = useMemo<LenisContextValue>(
    () => ({ stop, start, isStopped: stopped, lenis: lenisRef.current, resize }),
    [stop, start, stopped],
  );

  return createElement(LenisContext.Provider, { value }, children);
}

export function useLenis(): LenisContextValue | null {
  return useContext(LenisContext);
}