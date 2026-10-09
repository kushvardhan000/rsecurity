"use client";

import { useEffect } from "react";
import { PRELOADER_DONE_EVENT, PRELOADER_STORAGE_KEY } from "../lib/preloader";

export function PreloaderController() {
  useEffect(() => {
    let preloaded = false;
    try {
      preloaded = sessionStorage.getItem(PRELOADER_STORAGE_KEY) === "1";
    } catch {}

    const html = document.documentElement;
    const preloaderNode = document.getElementById("preloader");

    if (preloaded) {
      if (preloaderNode) {
        preloaderNode.remove();
      }
      return;
    }

    // Paced timing to ensure smooth viewing
    const minTime = 1800; // minimum duration so it doesn't vanish prematurely
    const maxTime = 3200; // fallback limit
    const startTime = Date.now();
    const ringNode = document.getElementById("preloader-ring") as unknown as SVGCircleElement | null;
    const circumference = 276.46; // 2 * Math.PI * 44

    let rafId: number;
    let isExiting = false;

    // Smooth cubic eased ring animation
    const animateProgress = () => {
      if (isExiting) return;
      const elapsed = Date.now() - startTime;
      const rawProgress = Math.min(elapsed / minTime, 1);
      
      // Smooth cubic-out easing curve
      const easedProgress = 1 - Math.pow(1 - rawProgress, 3);

      if (ringNode) {
        const dashOffset = circumference - circumference * easedProgress;
        ringNode.style.strokeDashoffset = String(dashOffset);
      }

      if (rawProgress < 1) {
        rafId = requestAnimationFrame(animateProgress);
      } else {
        if (ringNode) ringNode.style.strokeDashoffset = "0";
      }
    };

    rafId = requestAnimationFrame(animateProgress);

    const finish = () => {
      const elapsed = Date.now() - startTime;
      const extraTime = Math.max(0, minTime - elapsed);

      setTimeout(() => {
        isExiting = true;
        if (ringNode) ringNode.style.strokeDashoffset = "0";

        // Notify page components to trigger their animations
        html.setAttribute("data-ready", "1");
        window.dispatchEvent(new Event(PRELOADER_DONE_EVENT));

        if (preloaderNode) {
          // Smooth opacity fade & subtle zoom-out exit
          preloaderNode.style.opacity = "0";
          preloaderNode.style.transform = "scale(0.98)";
          preloaderNode.style.pointerEvents = "none";

          setTimeout(() => {
            preloaderNode.remove();
            try {
              sessionStorage.setItem(PRELOADER_STORAGE_KEY, "1");
            } catch {}
          }, 800); // Wait for transition duration (0.8s)
        } else {
          try {
            sessionStorage.setItem(PRELOADER_STORAGE_KEY, "1");
          } catch {}
        }
      }, extraTime);
    };

    let isDone = false;
    const checkDone = () => {
      if (isDone) return;
      isDone = true;
      finish();
    };

    const timeout = setTimeout(() => {
      checkDone();
    }, maxTime);

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
      .then(() => checkDone())
      .catch(() => checkDone());

    return () => {
      clearTimeout(timeout);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return null;
}