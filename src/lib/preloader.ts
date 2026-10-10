/* eslint-disable */
"use client";

import { useEffect, useState } from "react";

export const PRELOADER_STORAGE_KEY = "rs-preloaded";
export const PRELOADER_DONE_EVENT = "rspl:preloader-done";

/**
 * Shared "preloader finished" state.
 * True immediately if the preloader was skipped this session,
 * otherwise flips when the Preloader dispatches its done event.
 */
export function usePreloaderDone() {
  const [done, setDone] = useState<boolean>(() => {
    if (typeof document !== "undefined") {
      const html = document.documentElement;
      return html.dataset.ready === "1" || html.dataset.preloaded === "1";
    }
    return false; // Guard for SSR
  });

  useEffect(() => {
    if (done) return;

    let seen = false;
    try {
      seen = sessionStorage.getItem(PRELOADER_STORAGE_KEY) === "1";
    } catch {
      /* private mode */
    }
    const html = document.documentElement;
    if (seen || html.dataset.ready === "1" || html.dataset.preloaded === "1") {
      setDone(true);
      return;
    }

    const onDone = () => setDone(true);

    window.addEventListener(PRELOADER_DONE_EVENT, onDone);

    const observer = new MutationObserver(() => {
      if (html.dataset.ready === "1" || html.dataset.preloaded === "1") {
        setDone(true);
      }
    });

    observer.observe(html, { attributes: true, attributeFilter: ["data-ready", "data-preloaded"] });

    // Hard fallback
    const timer = setTimeout(() => {
      setDone(true);
    }, 3500);

    return () => {
      window.removeEventListener(PRELOADER_DONE_EVENT, onDone);
      observer.disconnect();
      clearTimeout(timer);
    };
  }, [done]);

  return done;
}
