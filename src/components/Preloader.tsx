"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { PRELOADER_DONE_EVENT, PRELOADER_STORAGE_KEY } from "../lib/preloader";

const LOGO = "/logos/rsfullllogoBGTRANSPARENT.png";
const CIRCUMFERENCE = 276.46;

type Phase = "show" | "exiting" | "gone";

const BASE_CLASS =
  "fixed inset-0 z-[99999] flex h-[100dvh] w-full items-center justify-center overflow-hidden bg-white text-slate-900 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]";

export function Preloader() {
  const [phase, setPhase] = useState<Phase>("show");
  const ringRef = useRef<SVGCircleElement>(null);

  useEffect(() => {
    let preloaded = false;
    try {
      preloaded = sessionStorage.getItem(PRELOADER_STORAGE_KEY) === "1";
    } catch {}

    const html = document.documentElement;

    // Already played this session: signal done and let React unmount.
    // No element.remove() — the CSS rule (data-preloaded → display:none)
    // covers the brief moment before React unmounts.
    if (preloaded) {
      html.setAttribute("data-ready", "1");
      html.setAttribute("data-preloaded", "1");
      window.dispatchEvent(new Event(PRELOADER_DONE_EVENT));
      const unmountTimer = setTimeout(() => setPhase("gone"), 0);
      return () => clearTimeout(unmountTimer);
    }

    const minTime = 1800;
    const maxTime = 3200;
    const startTime = Date.now();
    let isExiting = false;
    let isDone = false;
    let rafId: number;
    let finishTimeout: ReturnType<typeof setTimeout> | null = null;
    let unmountTimeout: ReturnType<typeof setTimeout> | null = null;

    const animateProgress = () => {
      if (isExiting) return;
      const ring = ringRef.current;
      if (!ring) return;

      const elapsed = Date.now() - startTime;
      const rawProgress = Math.min(elapsed / minTime, 1);
      const easedProgress = 1 - Math.pow(1 - rawProgress, 3);
      const dashOffset = CIRCUMFERENCE - CIRCUMFERENCE * easedProgress;
      ring.style.strokeDashoffset = String(dashOffset);

      if (rawProgress < 1) {
        rafId = requestAnimationFrame(animateProgress);
      } else {
        ring.style.strokeDashoffset = "0";
      }
    };

    rafId = requestAnimationFrame(animateProgress);

    const finish = () => {
      const elapsed = Date.now() - startTime;
      const extraTime = Math.max(0, minTime - elapsed);

      finishTimeout = setTimeout(() => {
        isExiting = true;
        if (ringRef.current) ringRef.current.style.strokeDashoffset = "0";

        // Signal React components that the preloader is done
        html.setAttribute("data-ready", "1");
        window.dispatchEvent(new Event(PRELOADER_DONE_EVENT));

        // React drives the exit class (CSS clip-path transition) while
        // the overlay is still in the DOM — no node removal
        setPhase("exiting");

        // After exit transition duration, let React unmount (phase "gone")
        unmountTimeout = setTimeout(() => {
          try {
            sessionStorage.setItem(PRELOADER_STORAGE_KEY, "1");
          } catch {}
          setPhase("gone");
        }, 800);
      }, extraTime);
    };

    const checkDone = () => {
      if (isDone) return;
      isDone = true;
      finish();
    };

    // Fallback: force finish after maxTime
    const maxTimeout = setTimeout(checkDone, maxTime);

    // Coordinate with web fonts & main priority images
    Promise.all([
      document.fonts ? document.fonts.ready : Promise.resolve(),
      new Promise<void>((resolve) => {
        const img = document.querySelector(
          'img[src*="Slide-1"], div[class*="heroZoom"] img'
        ) as HTMLImageElement | null;
        if (!img) return resolve();
        if (img.complete && img.naturalHeight !== 0) return resolve();
        img.addEventListener("load", () => resolve(), { once: true });
        img.addEventListener("error", () => resolve(), { once: true });
      }),
    ])
      .then(checkDone)
      .catch(checkDone);

    // Cleanup: cancels timers + rAF (proper for strict-mode double runs)
    return () => {
      isExiting = true;
      clearTimeout(maxTimeout);
      if (finishTimeout) clearTimeout(finishTimeout);
      if (unmountTimeout) clearTimeout(unmountTimeout);
      cancelAnimationFrame(rafId);
    };
  }, []);

  // React unmounts the overlay when phase is "gone" — never element.remove()
  if (phase === "gone") return null;

  return (
    <div
      id="preloader"
      className={phase === "exiting" ? `${BASE_CLASS} preloader-exit` : BASE_CLASS}
      aria-label="Loading Ranchi Security"
      role="status"
    >
      {/* Soft Ambient Maroon Glow */}
      <div
        className="pointer-events-none absolute inset-0 select-none"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(circle at center, rgba(128,0,32,0.06) 0%, transparent 65%)",
        }}
      />

      <div className="relative z-10 flex h-full w-full flex-col items-center justify-center px-5 sm:px-8">
        {/* Logo & Circular Ring Wrapper */}
        <div className="relative flex h-40 w-40 items-center justify-center sm:h-48 sm:w-48 md:h-52 md:w-52">
          <svg
            viewBox="0 0 100 100"
            className="absolute inset-0 h-full w-full -rotate-90 select-none"
            aria-hidden="true"
          >
            {/* Track Ring */}
            <circle
              cx="50"
              cy="50"
              r="44"
              fill="none"
              stroke="#800020"
              strokeOpacity="0.12"
              strokeWidth="1.5"
            />
            {/* Progress Ring */}
            <circle
              ref={ringRef}
              id="preloader-ring"
              cx="50"
              cy="50"
              r="44"
              fill="none"
              stroke="#800020"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE}
              style={{
                strokeDashoffset: CIRCUMFERENCE,
                transition: "stroke-dashoffset 0.12s linear",
              }}
            />
          </svg>

          {/* Unaltered Maroon Logo */}
          <div className="relative h-24 w-24 sm:h-28 sm:w-28 md:h-32 md:w-32 select-none [user-drag:none] [-webkit-user-drag:none]">
            <Image
              src={LOGO}
              alt="Ranchi Security"
              fill
              priority
              draggable={false}
              sizes="(max-width: 640px) 96px, (max-width: 768px) 112px, 128px"
              className="object-contain pointer-events-none select-none [user-drag:none] [-webkit-user-drag:none]"
            />
          </div>
        </div>

        {/* Typography Content */}
        <div className="mt-8 flex flex-col items-center text-center sm:mt-10">
          <span className="text-xs font-bold uppercase tracking-[0.35em] sm:text-sm text-[#68001A]">
            Ranchi Security
          </span>

          <span className="mt-2 text-[9px] font-semibold uppercase tracking-[0.22em] sm:text-[10px] text-slate-700">
            Security • Training • Manpower
          </span>

          <div className="mt-4 h-px w-14 sm:w-20 bg-[#800020]/25" />

          <span className="mt-3.5 text-[9px] font-medium uppercase tracking-[0.22em] sm:text-[10px] text-slate-500">
            Securing your experience
          </span>
        </div>
      </div>
    </div>
  );
}
