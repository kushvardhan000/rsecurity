"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";
import { ABOUT } from "@/src/data/about";

type Point = {
  num: string;
  title: string;
  suffix?: string;
  detail: string;
  desc: string;
};

const POINTS: Point[] = [
  {
    num: "01",
    title: "Ex-Servicemen Leadership",
    detail: "Military discipline",
    desc: ABOUT.whyChooseUs[0].description,
  },
  {
    num: "02",
    title: "Government Empanelment",
    suffix: "(DGR)",
    detail: "Since 1996",
    desc: ABOUT.whyChooseUs[1].description,
  },
  {
    num: "03",
    title: "ISO 9001:2015 Certification",
    detail: "Quality system",
    desc: ABOUT.whyChooseUs[2].description,
  },
  {
    num: "04",
    title: "NSDC / MEPSC Accredited Training",
    detail: "NSQF aligned",
    desc: ABOUT.whyChooseUs[3].description,
  },
];

export function WhyChooseUs() {
  const reduce = useReducedMotion();

  const railRef = useRef<HTMLDivElement>(null);
  const baseD = useRef<HTMLSpanElement>(null);
  const dotD = useRef<HTMLSpanElement>(null);
  const fillD = useRef<HTMLSpanElement>(null);
  const dotM = useRef<HTMLSpanElement>(null);
  const fillM = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (reduce) return;
    const rail = railRef.current;
    if (!rail) return;

    const pillars = Array.from(
      rail.querySelectorAll<HTMLElement>(".why-pillar")
    );
    if (pillars.length < 4) return;

    const mq = window.matchMedia("(min-width: 1024px)");
    let isDesktop = mq.matches;

    // Desktop geometry (px, relative to the rail)
    let centers = [0, 0, 0, 0];
    let lineStart = 0;
    let lineEnd = 1;
    // Mobile geometry
    let y0 = 0;
    let y3 = 1;

    const measure = () => {
      isDesktop = mq.matches;
      if (isDesktop) {
        const rr = rail.getBoundingClientRect();
        centers = pillars.map((p) => {
          const r = p.getBoundingClientRect();
          return r.left + r.width / 2 - rr.left;
        });
        lineStart = centers[0];
        lineEnd = centers[3];
        if (baseD.current) {
          baseD.current.style.left = `${lineStart}px`;
          baseD.current.style.width = `${Math.max(0, lineEnd - lineStart)}px`;
        }
      } else {
        y0 = pillars[0].offsetTop;
        y3 = pillars[3].offsetTop;
      }
    };

    const setActive = (p: number) => {
      let active = 0;
      if (isDesktop) {
        let best = Infinity;
        const span = lineEnd - lineStart || 1;
        for (let i = 0; i < pillars.length; i++) {
          const pi = (centers[i] - lineStart) / span;
          const d = Math.abs(p - pi);
          if (d < best) {
            best = d;
            active = i;
          }
        }
      } else {
        active = Math.round(p * (pillars.length - 1));
      }
      const show = isDesktop ? true : p > 0.02;
      pillars.forEach((el, i) => {
        el.dataset.active = i === active && show ? "true" : "false";
      });
    };

    /* ── Desktop: continuous, cursor-interactive autoplay ── */
    const applyDesktop = (p: number) => {
      const x = lineStart + (lineEnd - lineStart) * p;
      if (dotD.current) dotD.current.style.left = `${x}px`;
      if (fillD.current) {
        fillD.current.style.left = `${lineStart}px`;
        fillD.current.style.width = `${Math.max(0, x - lineStart)}px`;
      }
      setActive(p);
    };

    let draf = 0;
    let pos = 0;
    let dir = 1;
    let vel = 0;
    let lastT = 0;
    let hovering = false;
    let cursorTarget = 0;
    let resumeAt = 0;
    const SPEED = 1 / 7.5; // full sweep in ~7.5s (slow, calm)
    const SPRING_K = 140; // hover follow stiffness
    const SPRING_C = 18; // hover follow damping (slightly under-damped → elastic)

    const dtick = (t: number) => {
      if (!lastT) lastT = t;
      const dt = Math.min((t - lastT) / 1000, 0.05);
      lastT = t;

      if (hovering) {
        // Elastic spring follow toward the cursor position
        const a = (cursorTarget - pos) * SPRING_K - vel * SPRING_C;
        vel += a * dt;
        pos += vel * dt;
        if (pos < 0) {
          pos = 0;
          if (vel < 0) vel = 0;
        } else if (pos > 1) {
          pos = 1;
          if (vel > 0) vel = 0;
        }
        if (Math.abs(cursorTarget - pos) < 0.0004 && Math.abs(vel) < 0.002) {
          pos = cursorTarget;
          vel = 0;
        }
      } else if (resumeAt && t < resumeAt) {
        // hold last position briefly after the cursor leaves
        vel = 0;
      } else {
        resumeAt = 0;
        vel = 0;
        pos += dir * SPEED * dt;
        if (pos >= 1) {
          pos = 1;
          dir = -1;
        } else if (pos <= 0) {
          pos = 0;
          dir = 1;
        }
      }
      applyDesktop(pos);
      draf = requestAnimationFrame(dtick);
    };

    const onWindowMove = (e: PointerEvent) => {
      if (!isDesktop || e.pointerType === "touch") return;
      const rr = rail.getBoundingClientRect();
      const inside =
        e.clientX >= rr.left &&
        e.clientX <= rr.right &&
        e.clientY >= rr.top &&
        e.clientY <= rr.bottom;
      if (inside) {
        const span = lineEnd - lineStart || 1;
        cursorTarget = Math.max(0, Math.min(1, (e.clientX - rr.left - lineStart) / span));
        hovering = true;
        resumeAt = 0;
      } else if (hovering) {
        hovering = false;
        resumeAt = performance.now() + 700;
      }
    };

    const startDesktop = () => {
      measure();
      applyDesktop(pos);
      lastT = 0;
      draf = requestAnimationFrame(dtick);
      window.addEventListener("pointermove", onWindowMove, { passive: true });
    };
    const stopDesktop = () => {
      cancelAnimationFrame(draf);
      draf = 0;
      window.removeEventListener("pointermove", onWindowMove);
    };

    /* ── Mobile: scroll-driven vertical (unchanged behaviour) ── */
    let mraf = 0;
    let cur = 0;
    const applyMobile = (p: number) => {
      const y = y0 + (y3 - y0) * p;
      if (dotM.current) dotM.current.style.top = `${y}px`;
      if (fillM.current) fillM.current.style.height = `${Math.max(0, y - 8)}px`;
      setActive(p);
    };
    const mtarget = () => {
      const vh = window.innerHeight;
      const rect = rail.getBoundingClientRect();
      const start = vh * 0.85;
      const end = vh * 0.3;
      const raw = (start - rect.top) / (start - end + rect.height);
      return Math.max(0, Math.min(1, raw));
    };
    const mtick = () => {
      const t = mtarget();
      cur += (t - cur) * 0.2;
      if (Math.abs(t - cur) < 0.0005) cur = t;
      applyMobile(cur);
      if (Math.abs(t - cur) > 0.0005) {
        mraf = requestAnimationFrame(mtick);
      } else {
        mraf = 0;
      }
    };
    const onScroll = () => {
      if (!mraf) mraf = requestAnimationFrame(mtick);
    };
    const startMobile = () => {
      measure();
      applyMobile(cur);
      window.addEventListener("scroll", onScroll, { passive: true });
      onScroll();
    };
    const stopMobile = () => {
      cancelAnimationFrame(mraf);
      mraf = 0;
      window.removeEventListener("scroll", onScroll);
    };

    const start = () => {
      stopDesktop();
      stopMobile();
      measure();
      if (mq.matches) startDesktop();
      else startMobile();
    };
    const onMQ = () => start();
    const onResize = () => {
      measure();
      if (!mq.matches) onScroll();
    };

    start();
    mq.addEventListener("change", onMQ);
    window.addEventListener("resize", onResize, { passive: true });
    if (document.fonts?.ready) {
      document.fonts.ready.then(() => {
        measure();
        if (!mq.matches) onScroll();
      });
    }

    return () => {
      stopDesktop();
      stopMobile();
      mq.removeEventListener("change", onMQ);
      window.removeEventListener("resize", onResize);
    };
  }, [reduce]);

  return (
    <section
      id="why-choose-us"
      aria-labelledby="why-choose-us-heading"
      data-tone="light"
      className="relative overflow-hidden bg-[var(--color-paper)] py-[clamp(48px,6.5vw,92px)]"
    >
      <style>{`
        .why-pillar .why-anim { transition: color .45s cubic-bezier(.22,1,.36,1), transform .45s cubic-bezier(.22,1,.36,1), opacity .45s cubic-bezier(.22,1,.36,1); }
        .why-pillar .why-desc { opacity: .7; }
        .why-pillar[data-active="true"] .why-num { color: var(--color-accent); }
        .why-pillar[data-active="true"] .why-title { color: var(--color-accent); transform: translateY(-2px); }
        .why-pillar[data-active="true"] .why-desc { opacity: 1; }
        .why-pillar[data-active="true"] .why-detail { color: var(--color-maroon-800); }
        @media (prefers-reduced-motion: reduce) {
          .why-pillar .why-anim { transition: none; }
        }
      `}</style>

      <div className="mx-auto max-w-[1240px] px-[clamp(16px,4vw,48px)]">
        {/* Header across the top */}
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-3 inline-flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.24em] text-[var(--color-grey-700)]">
              <span aria-hidden="true" className="h-px w-7 bg-[var(--color-accent)]" />
              The RSP difference
            </p>
            <h2
              id="why-choose-us-heading"
              className="font-serif text-[clamp(2rem,4.4vw,3.4rem)] font-medium leading-[1.02] tracking-[-0.04em] text-[var(--color-maroon-950)]"
            >
              Why{" "}
              <span className="italic font-normal text-[var(--color-accent)]">
                Choose
              </span>{" "}
              Us
            </h2>
          </div>
          <p className="max-w-[40ch] text-sm leading-[1.65] text-[var(--color-grey-700)] md:pb-2 md:text-right">
            Four enduring pillars of institutional trust behind every
            deployment.
          </p>
        </div>

        {/* Four-point credibility rail */}
        <div ref={railRef} className="relative mt-10 sm:mt-12">
          {/* Base faint connectors */}
          <span
            ref={baseD}
            aria-hidden="true"
            className="absolute top-[3px] hidden h-px bg-[var(--color-maroon-900)]/15 lg:block"
            style={{ left: 0, width: 0 }}
          />
          <span
            aria-hidden="true"
            className="absolute left-[3px] top-2 bottom-2 w-px bg-[var(--color-maroon-900)]/15 lg:hidden"
          />

          {/* Progress fill + travelling dot (desktop) */}
          {!reduce && (
            <>
              <span
                ref={fillD}
                aria-hidden="true"
                className="absolute left-0 top-[3px] hidden h-px bg-[var(--color-accent)] lg:block"
                style={{ width: 0 }}
              />
              <span
                ref={dotD}
                aria-hidden="true"
                className="absolute top-[3px] z-10 hidden h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--color-accent)] ring-4 ring-[var(--color-accent)]/15 lg:block"
                style={{ left: 0 }}
              />
              <span
                ref={fillM}
                aria-hidden="true"
                className="absolute left-[3px] top-2 w-px bg-[var(--color-accent)] lg:hidden"
                style={{ height: 0 }}
              />
              <span
                ref={dotM}
                aria-hidden="true"
                className="absolute left-[3px] z-10 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--color-accent)] ring-4 ring-[var(--color-accent)]/15 lg:hidden"
                style={{ top: 0 }}
              />
            </>
          )}

          <ol className="relative grid gap-y-9 lg:grid-cols-4 lg:gap-x-10 lg:gap-y-0">
            {POINTS.map((point) => (
              <li
                key={point.num}
                data-active="false"
                className="why-pillar group relative pl-8 lg:pl-0 lg:pt-8"
              >
                <div className="flex items-baseline gap-3">
                  <span className="why-anim why-num font-serif text-[clamp(2.6rem,5vw,3.9rem)] font-medium leading-none tracking-[-0.05em] text-[var(--color-maroon-900)]/55">
                    {point.num}
                  </span>
                  <span className="why-anim why-detail text-[9px] font-semibold uppercase tracking-[0.2em] text-[var(--color-maroon-400)]">
                    {point.detail}
                  </span>
                </div>

                <h3 className="why-anim why-title mt-3 max-w-[22ch] font-serif text-[17px] font-medium leading-[1.2] tracking-[-0.01em] text-[var(--color-maroon-950)] sm:text-lg">
                  {point.title}
                  {point.suffix && (
                    <span className="text-[var(--color-maroon-400)]">
                      {" "}
                      {point.suffix}
                    </span>
                  )}
                </h3>

                <p className="why-anim why-desc mt-2 max-w-[34ch] text-[13px] leading-[1.6] text-[var(--color-grey-700)]">
                  {point.desc}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}