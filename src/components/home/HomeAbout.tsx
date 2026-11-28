"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { ABOUT } from "@/src/data/about";
import { SecurityPillar3DModels } from "./Security3DVisual";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export function HomeAbout() {
  const reduce = useReducedMotion();

  /* True Multi-Plane 3D Parallax (Zero Flat Borders/Lines) */
  useEffect(() => {
    if (reduce) return;
    const section = document.getElementById("about");
    if (!section) return;

    const mq = window.matchMedia("(min-width: 1024px)");
    const cur = { x: 0, y: 0 };
    const tgt = { x: 0, y: 0 };
    let raf = 0;
    let stage: HTMLElement | null = null;
    let inner: HTMLElement | null = null;
    let logoBg: HTMLElement | null = null;
    let cut: HTMLElement | null = null;
    let shadowFloor: HTMLElement | null = null;
    let badge: HTMLElement | null = null;

    const loop = () => {
      cur.x += (tgt.x - cur.x) * 0.085;
      cur.y += (tgt.y - cur.y) * 0.085;

      const rx = -cur.y * 12; // ±6deg
      const ry = cur.x * 15; // ±7.5deg

      if (inner) {
        inner.style.transform = `rotateX(${rx.toFixed(3)}deg) rotateY(${ry.toFixed(3)}deg)`;
      }
      if (logoBg) {
        logoBg.style.transform = `translate3d(${(cur.x * 26).toFixed(2)}px, ${(cur.y * 18).toFixed(2)}px, -42px) scale(0.96)`;
      }
      if (cut) {
        const px = -cur.x * 24;
        const py = -cur.y * 14;
        const shX = (-cur.x * 36).toFixed(1);
        cut.style.transform = `translate3d(${px.toFixed(2)}px, ${py.toFixed(2)}px, 65px)`;
        cut.style.filter = `drop-shadow(${shX}px 28px 26px rgba(32, 5, 10, 0.36))`;
      }
      if (shadowFloor) {
        shadowFloor.style.transform = `translate3d(${(-cur.x * 18).toFixed(2)}px, 0px, 10px) scaleX(${(1 - Math.abs(cur.x) * 0.12).toFixed(3)})`;
      }
      if (badge) {
        badge.style.transform = `translate3d(${(-cur.x * 34).toFixed(2)}px, ${(-cur.y * 22).toFixed(2)}px, 95px)`;
      }

      raf = requestAnimationFrame(loop);
    };

    const setFromClient = (cx: number, cy: number) => {
      if (!stage) return;
      const r = stage.getBoundingClientRect();
      tgt.x = Math.max(-0.5, Math.min(0.5, (cx - r.left) / r.width - 0.5));
      tgt.y = Math.max(-0.5, Math.min(0.5, (cy - r.top) / r.height - 0.5));
    };

    const onMove = (e: PointerEvent) => setFromClient(e.clientX, e.clientY);
    const onTouch = (e: TouchEvent) => {
      const t = e.touches[0];
      if (t) setFromClient(t.clientX, t.clientY);
    };
    const reset = () => {
      tgt.x = 0;
      tgt.y = 0;
    };

    const detach = () => {
      if (!stage) return;
      stage.removeEventListener("pointermove", onMove);
      stage.removeEventListener("pointerleave", reset);
      stage.removeEventListener("touchmove", onTouch);
      stage.removeEventListener("touchend", reset);
      stage = null;
    };

    const wire = () => {
      detach();
      const stages = Array.from(
        section.querySelectorAll<HTMLElement>("[data-stage]")
      );
      stage =
        stages.find((el) => el.offsetParent !== null) || stages[0] || null;
      if (!stage) return;
      inner = stage.querySelector("[data-inner]");
      logoBg = stage.querySelector("[data-logobg]");
      cut = stage.querySelector("[data-cut]");
      shadowFloor = stage.querySelector("[data-floor]");
      badge = stage.querySelector("[data-badge]");

      stage.addEventListener("pointermove", onMove);
      stage.addEventListener("pointerleave", reset);
      stage.addEventListener("touchmove", onTouch, { passive: true });
      stage.addEventListener("touchend", reset);
    };

    wire();
    raf = requestAnimationFrame(loop);
    mq.addEventListener("change", wire);

    return () => {
      cancelAnimationFrame(raf);
      detach();
      mq.removeEventListener("change", wire);
    };
  }, [reduce]);

  const rise = (delay = 0) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 20 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, amount: 0.2 },
          transition: { duration: 0.85, ease: EASE, delay },
        };

  /* Clean, Borderless 3D Floating Stage (Exact Approved Image Scale) */
  const render3DStage = (isMobile = false) => (
    <div
      data-stage
      className={`relative mx-auto w-full select-none [perspective:1000px] ${
        isMobile ? "max-w-[430px] pt-2" : "max-w-[600px]"
      }`}
    >
      <div
        data-inner
        className="relative pb-3 [transform-style:preserve-3d] will-change-transform"
        style={{ transform: "rotateX(0deg) rotateY(0deg)" }}
      >
        {/* BACK PLANE (Z = -42px): Floating RS Crest on Left-Behind Plane (Desktop Only) */}
        {!isMobile && (
          <div
            data-logobg
            aria-hidden="true"
            className="pointer-events-none absolute -left-4 top-[2%] z-10 hidden h-[62%] w-[52%] opacity-[0.42] lg:block [transform:translate3d(0,0,-42px)_scale(0.96)]"
          >
            <Image
              src="/logos/rsshortlogoBGTRANSPARENT.png"
              alt=""
              fill
              unoptimized
              className="object-contain object-left-top drop-shadow-[0_14px_24px_rgba(42,6,12,0.14)]"
            />
          </div>
        )}

        {/* FOREGROUND PLANE (Z = +65px): Crisp Transparent Leadership Cutout */}
        <div
          data-cut
          className="relative z-30 mx-auto aspect-[666/375] w-full [transform:translate3d(0,0,65px)] [filter:drop-shadow(0_28px_26px_rgba(32,5,10,0.36))] lg:w-[128%] lg:-translate-x-[2%]"
        >
          <Image
            src="/about/bg-image.png"
            alt={ABOUT.images.portraitAlt}
            fill
            priority
            unoptimized
            quality={100}
            className="object-contain object-bottom"
          />
        </div>

        {/* GROUND CONTACT SHADOW (Anchors 3D Cutout to Floor Without Lines) */}
        <div
          data-floor
          aria-hidden="true"
          className="pointer-events-none mx-auto -mt-2 h-4 w-[82%] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(32,5,10,0.28)_0%,transparent_72%)] blur-xs [transform:translate3d(0,0,10px)]"
        />

        {/* FLOATING 3D MICRO-MEDALLION (Z = +95px) */}
        <div
          data-badge
          className="absolute bottom-1 right-10 z-40 [transform:translate3d(0,0,95px)] sm:bottom-2 sm:left-8"
        >
          <SecurityPillar3DModels />
        </div>
      </div>
    </div>
  );

  return (
    <section
      id="about"
      aria-label="About Ranchi Security"
      data-tone="light"
      className="relative overflow-x-clip bg-[var(--color-paper)] py-12 sm:py-16 md:py-20 lg:flex lg:min-h-[90vh] lg:items-center lg:py-14"
    >
      <div className="relative z-10 mx-auto w-full max-w-[1480px] px-5 sm:px-8 md:px-12 lg:px-12 xl:px-16">
        {/* =================================================================
            DESKTOP LAYOUT (>= 1024px) — Expansive Left Space + Exact Right Image Size
           ================================================================= */}
        <div className="hidden items-center lg:grid lg:grid-cols-[minmax(0,1.18fr)_minmax(0,1fr)] lg:gap-10 xl:gap-14">
          {/* Left Editorial Column (Generous Horizontal Room) */}
          <motion.div
            {...rise(0.05)}
            className="relative z-20 pr-2 xl:pr-6"
          >
            <p className="group mb-4 inline-flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.26em] text-[var(--color-maroon-900)]">
              <span
                aria-hidden="true"
                className="h-[2px] w-9 bg-gradient-to-r from-[var(--color-accent)] to-[#C8A265] transition-all duration-500 group-hover:w-14"
              />
              Who We Are &bull; Est. 1995
            </p>

            <h2 className="font-serif text-[clamp(2.65rem,4.05vw,4.1rem)] font-medium leading-[1.06] tracking-[-0.025em] text-[var(--color-maroon-950)]">
              <span className="block transition-transform duration-300 hover:translate-x-1">
                A Legacy of{" "}
                <span className="relative inline-block text-[var(--color-maroon-900)] after:absolute after:bottom-1 after:left-0 after:h-[2px] after:w-full after:bg-[#C8A265]/80">
                  Trust,
                </span>
              </span>
              <span className="block transition-transform duration-300 hover:translate-x-1">
                Discipline &amp;{" "}
                <span className="italic text-[var(--color-accent)]">
                  Excellence
                </span>
              </span>
            </h2>

            <p className="mt-6 max-w-[60ch] text-base leading-[1.78] text-[var(--color-grey-700)] xl:text-[17px]">
              {ABOUT.summary}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-8 border-t border-[#2A060C]/10 pt-7">
              <Link
                href="/about"
                className="group inline-flex min-h-12 items-center gap-2.5 bg-[var(--color-maroon-950)] px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.18em] text-white shadow-[0_14px_28px_rgba(42,6,12,0.18)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[var(--color-accent)]"
              >
                <span>Read our story</span>
                <ArrowUpRight
                  aria-hidden="true"
                  className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </Link>

              {/* <div className="border-l border-[#2A060C]/15 pl-6">
                <span className="block text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--color-grey-700)]">
                  Headquarters
                </span>
                <span className="mt-0.5 block font-serif text-[17px] font-medium text-[var(--color-maroon-950)]">
                  Ranchi, Jharkhand
                </span>
              </div> */}
            </div>
          </motion.div>

          {/* Right 3D Pop-Out Stage (Preserves Exact Image Size from Screenshot) */}
          <div className="relative z-10 flex justify-end">
            {render3DStage(false)}
          </div>
        </div>

        {/* =================================================================
            MOBILE & TABLET LAYOUT (< 1024px)
           ================================================================= */}
        <div className="lg:hidden">
          {render3DStage(true)}

          <motion.div
            {...rise(0.08)}
            className="mx-auto mt-7 max-w-[540px] sm:mt-9"
          >
            <div className="mb-2.5 flex items-center gap-2.5">
              <span
                aria-hidden="true"
                className="h-[1.5px] w-6 bg-[var(--color-accent)]"
              />
              <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-[var(--color-maroon-900)]">
                Who We Are &bull; Est. 1995
              </span>
            </div>

            <h2 className="font-serif text-[clamp(1.85rem,6.8vw,2.55rem)] font-medium leading-[1.1] tracking-[-0.02em] text-[var(--color-maroon-950)]">
              A Legacy of{" "}
              <span className="underline decoration-[#C8A265]/80 decoration-2 underline-offset-4">
                Trust,
              </span>{" "}
              Discipline &amp;{" "}
              <span className="italic text-[var(--color-accent)]">
                Excellence
              </span>
            </h2>

            <p className="mt-3.5 text-[14.5px] leading-[1.68] text-[var(--color-grey-700)] sm:text-[15.5px]">
              {ABOUT.summary}
            </p>

            <div className="mt-5 flex flex-col gap-4 border-t border-[#2A060C]/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
              <Link
                href="/about"
                className="group inline-flex min-h-11 w-full items-center justify-center gap-2 bg-[var(--color-maroon-950)] px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-white shadow-[0_10px_22px_rgba(42,6,12,0.16)] transition-colors hover:bg-[var(--color-accent)] sm:w-auto"
              >
                <span>Read our story</span>
                <ArrowUpRight
                  aria-hidden="true"
                  className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </Link>

              {/* <div className="flex items-center justify-between text-left sm:block sm:border-l sm:border-[#2A060C]/15 sm:pl-4">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-grey-700)]">
                  Headquarters
                </span>
                <span className="font-serif text-[14.5px] font-medium text-[var(--color-maroon-950)] sm:mt-0.5 sm:block">
                  Ranchi, Jharkhand
                </span>
              </div> */}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}