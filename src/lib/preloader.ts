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
  const [done, setDone] = useState(false);

  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem(PRELOADER_STORAGE_KEY) === "1";
    } catch {
      /* private mode */
    }
    if (seen) {
      // Browser-only storage read, post-mount (avoids hydration mismatch)
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDone(true);
      return;
    }
    const onDone = () => setDone(true);
    window.addEventListener(PRELOADER_DONE_EVENT, onDone);
    return () => window.removeEventListener(PRELOADER_DONE_EVENT, onDone);
  }, []);

  return done;
}
