"use client";

import { useEffect, useState } from "react";

export type Tone = "light" | "offwhite" | "dark";

/**
 * Detects the `data-tone` of the section currently under the navbar.
 * Returns the tone of the section that intersects the top viewport area.
 * Defaults to "dark" (for hero).
 */
export function useSectionTone(): Tone {
  const [tone, setTone] = useState<Tone>("dark");

  useEffect(() => {
    const sections = document.querySelectorAll("section[data-tone]");
    if (!sections.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const sectionTone = entry.target.getAttribute("data-tone") as Tone;
            if (sectionTone) setTone(sectionTone);
          }
        }
      },
      {
        rootMargin: "-45% 0px -45% 0px",
      }
    );

    sections.forEach((section) => io.observe(section));
    return () => io.disconnect();
  }, []);

  return tone;
}