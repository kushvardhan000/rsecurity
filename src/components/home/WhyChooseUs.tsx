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
    detail: "Military Discipline",
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
    detail: "Quality System",
    desc: ABOUT.whyChooseUs[2].description,
  },
  {
    num: "04",
    title: "NSDC / MEPSC Accredited Training",
    detail: "NSQF Aligned",
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
  const nodesRef = useRef<(HTMLSpanElement | null)[]>([]);

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

    let centers = [0, 0, 0, 0];
    let lineStart = 0;
    let lineEnd = 1;
    let y0 = 0;
    let y3 = 1;

    const measure = () => {
      isDesktop = mq.matches;
      if (isDesktop) {
        const rr = rail.getBoundingClientRect();
        centers = pillars.map((p) => {
          const r = p.getBoundingClientRect();
          // Align station node with the left editorial axis of each column
          return r.left + 24 - rr.left;
        });
        lineStart = centers[0];
        lineEnd = centers[3];
        if (baseD.current) {
          baseD.current.style.left = `${lineStart}px`;
          baseD.current.style.width = `${Math.max(0, lineEnd - lineStart)}px`;
        }
        nodesRef.current.forEach((node, idx) => {
          if (node) node.style.left = `${centers[idx]}px`;
        });
      } else {
        y0 = pillars[0].offsetTop + 18;
        y3 = pillars[3].offsetTop + 18;
      }
    };

    const setActive = (p: number) => {
      let active = 0;
      const span = lineEnd - lineStart || 1;
      if (isDesktop) {
        let best = Infinity;
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
        const pi = isDesktop ? (centers[i] - lineStart) / span : i / 3;
        el.dataset.passed = p >= pi - 0.02 && show ? "true" : "false";
      });
    };

    /* ── Desktop: Serene 26-Second Sweep + Critically Damped Cursor Glide ── */
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

    // Ultra-calm 26-second sweep across the 4 pillars
    const BASE_SPEED = 1 / 26;
    const SPRING_K = 42;
    const SPRING_C = 14; // Smooth, zero-overshoot magnetic glide

    const dtick = (t: number) => {
      if (!lastT) lastT = t;
      const dt = Math.min((t - lastT) / 1000, 0.05);
      lastT = t;

      if (hovering) {
        const a = (cursorTarget - pos) * SPRING_K - vel * SPRING_C;
        vel += a * dt;
        pos += vel * dt;
        if (pos < 0) {
          pos = 0;
          vel = 0;
        } else if (pos > 1) {
          pos = 1;
          vel = 0;
        }
        if (Math.abs(cursorTarget - pos) < 0.0002 && Math.abs(vel) < 0.0008) {
          pos = cursorTarget;
          vel = 0;
        }
      } else if (resumeAt && t < resumeAt) {
        vel = 0;
      } else {
        resumeAt = 0;
        vel = 0;
        // Sinusoidal velocity curve so turnaround at 0 and 1 is imperceptibly smooth
        const smoothCurve = 0.35 + 0.65 * Math.sin(Math.PI * pos);
        pos += dir * BASE_SPEED * smoothCurve * dt;
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
        e.clientX >= rr.left - 20 &&
        e.clientX <= rr.right + 20 &&
        e.clientY >= rr.top - 20 &&
        e.clientY <= rr.bottom + 20;
      if (inside) {
        const span = lineEnd - lineStart || 1;
        cursorTarget = Math.max(
          0,
          Math.min(1, (e.clientX - rr.left - lineStart) / span)
        );
        hovering = true;
        resumeAt = 0;
      } else if (hovering) {
        hovering = false;
        resumeAt = performance.now() + 1100;
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

    /* ── Mobile: Scroll-Driven Vertical Axis ── */
    let mraf = 0;
    let cur = 0;
    const applyMobile = (p: number) => {
      const y = y0 + (y3 - y0) * p;
      if (dotM.current) dotM.current.style.top = `${y}px`;
      if (fillM.current) {
        fillM.current.style.height = `${Math.max(0, y - y0)}px`;
      }
      setActive(p);
    };
    const mtarget = () => {
      const vh = window.innerHeight;
      const rect = rail.getBoundingClientRect();
      const start = vh * 0.82;
      const end = vh * 0.28;
      const raw = (start - rect.top) / (start - end + rect.height);
      return Math.max(0, Math.min(1, raw));
    };
    const mtick = () => {
      const t = mtarget();
      cur += (t - cur) * 0.12;
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
      className="relative overflow-hidden bg-[var(--color-paper)] py-[clamp(60px,8vw,116px)]"
    >
      <style>{`
        .why-pillar .why-anim {
          transition:
            color .7s cubic-bezier(.22,1,.36,1),
            transform .7s cubic-bezier(.22,1,.36,1),
            opacity .7s cubic-bezier(.22,1,.36,1);
        }
        .why-pillar .why-bar {
          transform: scaleX(0);
          transform-origin: left center;
          transition: transform .75s cubic-bezier(.22,1,.36,1);
        }
        .why-pillar .why-desc {
          opacity: .68;
        }
        .why-pillar[data-active="true"] .why-num {
          color: var(--color-accent);
          transform: translateY(-6px);
        }
        .why-pillar[data-active="true"] .why-detail {
          color: var(--color-accent);
          transform: translateX(4px);
        }
        .why-pillar[data-active="true"] .why-title {
          color: var(--color-maroon-950);
          transform: translateY(-2px);
        }
        .why-pillar[data-active="true"] .why-desc {
          opacity: 1;
          color: var(--color-maroon-950);
        }
        .why-pillar[data-active="true"] .why-bar {
          transform: scaleX(1);
        }
        @media (prefers-reduced-motion: reduce) {
          .why-pillar .why-anim,
          .why-pillar .why-bar { transition: none; }
        }
      `}</style>

      <div className="mx-auto max-w-[1400px] px-5 sm:px-8 md:px-12 lg:px-16">
        {/* Asymmetric Editorial Top Bar (Unboxed, Generous Breathing Room) */}
        <div className="grid gap-6 pb-10 lg:grid-cols-12 lg:items-end lg:pb-14">
          <div className="lg:col-span-7">
            <p className="mb-3.5 inline-flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.26em] text-[var(--color-maroon-900)]">
              <span
                aria-hidden="true"
                className="h-[2px] w-9 bg-gradient-to-r from-[var(--color-accent)] to-[#C8A265]"
              />
              The RSP Difference
            </p>
            <h2
              id="why-choose-us-heading"
              className="font-serif text-[clamp(2.3rem,4.6vw,3.95rem)] font-medium leading-[1.03] tracking-[-0.03em] text-[var(--color-maroon-950)]"
            >
              Why{" "}
              <span className="italic font-normal text-[var(--color-accent)]">
                Choose
              </span>{" "}
              Us
            </h2>
          </div>

          <div className="lg:col-span-5 lg:pb-1.5">
            <p className="max-w-[44ch] border-l-2 border-[#C8A265]/65 pl-5 text-[15px] leading-[1.72] text-[var(--color-grey-700)] lg:ml-auto">
              Four enduring pillars of institutional trust, statutory
              compliance, and disciplined field execution behind every
              deployment.
            </p>
          </div>
        </div>

        {/* Open Architectural Ledger Rail (Zero Boxes / Zero Cards) */}
        <div ref={railRef} className="relative pt-2 lg:pt-4">
          {/* Desktop Base Hairline + Stationary Station Ticks */}
          <span
            ref={baseD}
            aria-hidden="true"
            className="absolute top-[6px] hidden h-px bg-[#2A060C]/15 lg:block"
            style={{ left: 0, width: 0 }}
          />
          {[0, 1, 2, 3].map((idx) => (
            <span
              key={idx}
              ref={(el) => {
                nodesRef.current[idx] = el;
              }}
              aria-hidden="true"
              className="absolute top-[6px] z-[5] hidden h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#2A060C]/35 bg-[var(--color-paper)] lg:block"
              style={{ left: 0 }}
            />
          ))}

          {/* Mobile Vertical Hairline */}
          <span
            aria-hidden="true"
            className="absolute bottom-6 left-[6px] top-[18px] w-px bg-[#2A060C]/15 lg:hidden"
          />

          {/* Smooth Progress Line + Glowing Pulse Dot */}
          {!reduce && (
            <>
              <span
                ref={fillD}
                aria-hidden="true"
                className="absolute left-0 top-[6px] hidden h-[1.5px] bg-gradient-to-r from-[#2A060C] via-[var(--color-accent)] to-[#C8A265] lg:block"
                style={{ width: 0 }}
              />
              <span
                ref={dotD}
                aria-hidden="true"
                className="absolute top-[6px] z-10 hidden h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--color-accent)] shadow-[0_0_16px_rgba(139,30,46,0.5)] ring-4 ring-[var(--color-accent)]/15 lg:block"
                style={{ left: 0 }}
              />
              <span
                ref={fillM}
                aria-hidden="true"
                className="absolute left-[6px] top-[18px] w-[1.5px] bg-gradient-to-b from-[#2A060C] to-[var(--color-accent)] lg:hidden"
                style={{ height: 0 }}
              />
              <span
                ref={dotM}
                aria-hidden="true"
                className="absolute left-[6px] z-10 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--color-accent)] ring-4 ring-[var(--color-accent)]/15 lg:hidden"
                style={{ top: 18 }}
              />
            </>
          )}

          {/* Unboxed Architectural Columns */}
          <ol className="relative grid gap-y-10 lg:grid-cols-4 lg:gap-x-0 lg:gap-y-0 lg:pt-10">
            {POINTS.map((point) => (
              <li
                key={point.num}
                data-active="false"
                className="why-pillar group relative pl-9 lg:border-l lg:border-[#2A060C]/12 lg:px-6 lg:py-2 xl:px-8"
              >
                {/* Eyebrow Detail Above Oversized Watermark Numeral */}
                <span className="why-anim why-detail block text-[10px] font-bold uppercase tracking-[0.24em] text-[#2A060C]/55">
                  {point.detail}
                </span>

                {/* Sculptural Display Serif Numeral */}
                <div className="mt-2 flex items-baseline">
                  <span className="why-anim why-num font-serif text-[clamp(3rem,4.6vw,4.4rem)] font-light leading-none tracking-[-0.04em] text-[#2A060C]/25">
                    {point.num}
                  </span>
                </div>

                {/* Animated Bottom Hairline Under Numeral */}
                <div className="relative mt-4 h-px w-full bg-[#2A060C]/10">
                  <span
                    aria-hidden="true"
                    className="why-bar absolute inset-y-0 left-0 w-full bg-gradient-to-r from-[var(--color-accent)] to-[#C8A265]"
                  />
                </div>

                {/* High-Contrast Title */}
                <h3 className="why-anim why-title mt-5 font-serif text-[20px] font-medium leading-[1.24] tracking-[-0.015em] text-[var(--color-maroon-950)] sm:text-[22px]">
                  {point.title}
                  {point.suffix && (
                    <span className="ml-1.5 font-sans text-xs font-bold uppercase tracking-[0.14em] text-[var(--color-accent)]">
                      {point.suffix}
                    </span>
                  )}
                </h3>

                {/* Open Editorial Description */}
                <p className="why-anim why-desc mt-3 max-w-[34ch] text-[14.5px] leading-[1.7] text-[var(--color-grey-700)]">
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