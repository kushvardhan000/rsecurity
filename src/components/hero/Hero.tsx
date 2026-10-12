"use client";

import { useEffect, useState, useRef, useCallback, useSyncExternalStore } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { cn } from "@/src/lib/cn";
import { HERO_SLIDES } from "@/src/data/hero";
import { ABOUT } from "@/src/data/about";
import { Sheet } from "@/src/components/ui/Sheet";
import Link from "next/link";

import { usePreloaderDone } from "@/src/lib/preloader";

export type HeroMobileTextMode = "overlay" | "below";

/**
 * Constants:
 * HERO_MOBILE_RATIO: The median natural aspect ratio of the hero photos,
 * calculated with image-size (ratios: 1.33, 1.41, 1.50, 1.66, 2.22; median: 1.50)
 * clamped to [1.5, 1.8].
 * HERO_MOBILE_TEXT: "overlay" | "below" (default "overlay").
 */
export const HERO_MOBILE_RATIO = 1.5;
export const HERO_MOBILE_TEXT: HeroMobileTextMode = "overlay";

const SLIDE_DURATION = 4500;
const SWIPE_THRESHOLD = 40;

function AboutSheet({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  return (
    <Sheet isOpen={isOpen} onClose={onClose} title="Our story">
      <div className="space-y-8 text-grey-dark">
        <div>
          <h2 className="display text-3xl font-bold tracking-tight mb-4">
            About Ranchi Security
          </h2>
          <p className="text-[14.5px] leading-relaxed mb-4">{ABOUT.body}</p>
          <p className="text-[14.5px] leading-relaxed">
            Since 1995 we have guarded industry, mines and institutions across
            Jharkhand, Bihar and Odisha, and trained 25,000 youth through Skill
            India and MEPSC programmes.
          </p>
        </div>

        <div className="py-4 border-y border-grey-soft">
          <p className="text-accent font-medium text-sm">
            Grew 5x in a year and 10x in 18 months, deploying 500+ ex-servicemen.
          </p>
        </div>

        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-grey-mid mb-4">
            {ABOUT.groupTitle}
          </h3>
          <ul className="space-y-4">
            {ABOUT.organisations.map((org, i) => (
              <li key={i}>
                <p className="font-semibold text-sm">{org.name}</p>
                <p className="text-xs text-grey-mid mt-0.5">{org.note}</p>
              </li>
            ))}
          </ul>
        </div>

        <div className="pt-2">
          <button
            onClick={onClose}
            className="flex w-full items-center justify-center rounded-sm bg-accent px-6 py-4 text-sm font-semibold tracking-wide text-white transition-colors hover:bg-accent-hover"
          >
            Close
          </button>
        </div>
      </div>
    </Sheet>
  );
}

function subscribeHeroMode(callback: () => void) {
  window.addEventListener("popstate", callback);
  return () => window.removeEventListener("popstate", callback);
}

function getHeroModeSnapshot(): HeroMobileTextMode | null {
  if (typeof window === "undefined") return null;
  const q = new URLSearchParams(window.location.search).get("heroMode");
  return q === "below" || q === "overlay" ? q : null;
}

function getHeroModeServerSnapshot(): HeroMobileTextMode | null {
  return null;
}

export function Hero({
  mobileText = HERO_MOBILE_TEXT,
}: {
  mobileText?: HeroMobileTextMode;
} = {}) {
  const preloaderDone = usePreloaderDone();
  const [active, setActive] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const reduce = useReducedMotion();
  const touchStartX = useRef<number | null>(null);
  const heroRef = useRef<HTMLDivElement>(null);

  // Allow query parameter override for testing/screenshots (?heroMode=below | overlay)
  const queryMode = useSyncExternalStore(
    subscribeHeroMode,
    getHeroModeSnapshot,
    getHeroModeServerSnapshot
  );

  const activeMode = queryMode ?? mobileText;
  const isBelowMode = activeMode === "below";

  const nextSlide = useCallback(() => {
    setActive((prev) => (prev + 1) % HERO_SLIDES.length);
  }, []);

  const prevSlide = useCallback(() => {
    setActive((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (
        document.activeElement === document.body ||
        heroRef.current?.contains(document.activeElement)
      ) {
        if (e.key === "ArrowRight") {
          e.preventDefault();
          nextSlide();
        } else if (e.key === "ArrowLeft") {
          e.preventDefault();
          prevSlide();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [nextSlide, prevSlide]);

  // Autoplay every 4.5s
  useEffect(() => {
    if (isPaused || !preloaderDone) return;
    const timer = setTimeout(nextSlide, SLIDE_DURATION);
    return () => clearTimeout(timer);
  }, [active, isPaused, nextSlide, preloaderDone]);

  // Touch Swipe
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > SWIPE_THRESHOLD) {
      if (dx < 0) nextSlide();
      else prevSlide();
    }
    touchStartX.current = null;
  };

  const current = HERO_SLIDES[active];

  return (
    <>
      <section
        id="home"
        data-tone="dark"
        ref={heroRef}
        aria-label="Hero"
        className={cn(
          "relative w-full bg-[#0F0E0D] text-white overflow-hidden m-0 p-0",
          // Mobile (< 640px): exactly as tall as landscape photo, zero min-h/vh/svh
          isBelowMode
            ? "flex flex-col"
            : "grid grid-cols-1 grid-rows-1",
          // Desktop and Tablet (>= 640px): original flex-col 110svh layout
          "sm:flex sm:flex-col sm:justify-between sm:h-[110svh] sm:max-h-[110svh]"
        )}
        style={
          {
            "--hero-mobile-ratio": HERO_MOBILE_RATIO,
          } as React.CSSProperties
        }
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        tabIndex={-1}
      >
        {/* 1. PHOTO LAYER */}
        <div
          className={cn(
            "w-full overflow-hidden",
            // Mobile (< 640px): aspect ratio 1.5, in same cell if overlay mode
            isBelowMode
              ? "relative [aspect-ratio:var(--hero-mobile-ratio)] sm:[aspect-ratio:auto]"
              : "col-start-1 row-start-1 relative self-stretch [aspect-ratio:var(--hero-mobile-ratio)] sm:[aspect-ratio:auto]",
            // Tablet & Desktop (>= 640px): absolute fill
            "sm:absolute sm:inset-0 sm:h-full sm:w-full lg:left-[5%] lg:w-[95%] pointer-events-auto z-0"
          )}
        >
          {HERO_SLIDES.map((slide, i) => {
            const isActive = i === active;

            return (
              <div
                key={i}
                className={cn(
                  "absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out",
                  isActive ? "opacity-100 z-10" : "opacity-0 pointer-events-none z-0"
                )}
                aria-hidden={!isActive}
              >
                <div
                  className={cn(
                    "relative w-full h-full transform-gpu",
                    // Disable slow zoom on mobile (< 640px) so photo is not cropped
                    isActive && !reduce && preloaderDone && "sm:animate-[heroZoom_8s_ease-out_forwards]"
                  )}
                >
                  <Image
                    src={slide.src}
                    alt={slide.alt}
                    fill
                    priority={i === 0}
                    className="object-cover w-full h-full [object-position:var(--focal-mob)] sm:[object-position:var(--focal-desk)]"
                    style={
                      {
                        "--focal-mob": slide.focalMobile || "50% 20%",
                        "--focal-desk": slide.focal || "center center",
                      } as React.CSSProperties
                    }
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 78vw"
                  />
                </div>
              </div>
            );
          })}

          <style
            dangerouslySetInnerHTML={{
              __html: `
            @keyframes heroZoom {
              from { transform: scale(1.05); }
              to { transform: scale(1); }
            }
          `,
            }}
          />

          {/* Mobile Story-style Progress Bars (Top edge of the photo) */}
          <div className="sm:hidden absolute top-0 left-0 right-0 z-30 px-3 pt-2.5 pb-2 pointer-events-none flex gap-1.5">
            {HERO_SLIDES.map((_, i) => {
              const isPast = i < active;
              const isCurrent = i === active;
              return (
                <div
                  key={i}
                  className="flex-1 h-[2.5px] bg-white/30 rounded-full overflow-hidden"
                >
                  {isPast ? (
                    <div className="w-full h-full bg-white" />
                  ) : isCurrent ? (
                    <motion.div
                      key={`story-bar-${active}-${isPaused}`}
                      className="h-full bg-white origin-left"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: isPaused ? 0 : 1 }}
                      transition={{
                        duration: SLIDE_DURATION / 1000,
                        ease: "linear",
                      }}
                    />
                  ) : null}
                </div>
              );
            })}
          </div>

          {/* Desktop Mask Gradient */}
          <div className="hidden lg:block absolute inset-y-0 left-0 w-2/5 z-20 pointer-events-none bg-gradient-to-r from-[#0F0E0D] via-[#0F0E0D]/60 to-transparent" />

          {/* Tablet Scrim (640px - 1023px) */}
          <div className="hidden sm:block lg:hidden absolute inset-0 z-20 pointer-events-none bg-gradient-to-b from-[#0F0E0D]/80 via-black/30 to-[#0F0E0D]/60" />
        </div>

        {/* 2. HERO CONTENT AREA (OVERLAY MODE & DESKTOP/TABLET) */}
        <div
          className={cn(
            "w-full pointer-events-none",
            // Overlay mode on mobile: shares cell 1/1, flex-col, push content to bottom
            !isBelowMode && "col-start-1 row-start-1 relative z-20 flex flex-col justify-end h-full",
            // Below mode on mobile: this area is hidden on mobile (< 640px)
            isBelowMode && "hidden sm:flex",
            // Desktop and Tablet (>= 640px): original layout
            "sm:relative sm:z-20 sm:flex-1 sm:flex sm:flex-col sm:justify-center sm:max-w-[1400px] sm:mx-auto sm:px-10 lg:px-16 sm:pt-8 sm:pb-6"
          )}
        >
          {/* Overlay Gradient on Mobile (< 640px) so top half of photo stays clear */}
          {!isBelowMode && (
            <div
              className="sm:hidden absolute inset-0 pointer-events-none z-0"
              style={{
                background:
                  "linear-gradient(to top, rgba(42,6,12,.88) 0%, rgba(42,6,12,.6) 38%, transparent 70%)",
              }}
              aria-hidden="true"
            />
          )}

          {/* Content Block */}
          <div className="relative z-10 w-full max-w-xl pointer-events-auto px-4 pb-3 pt-6 sm:px-0 sm:pb-0 sm:pt-0">
            {/* Kicker (Mobile: 10.5px, bold, uppercase) */}
            <div className="block sm:hidden text-[10.5px] font-bold uppercase tracking-[0.14em] text-[#FF8595] leading-tight mb-1 truncate drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
              {current.caption}
            </div>

            {/* Headline H1 */}
            <h1
              className="text-white font-bold sm:font-semibold text-[clamp(1.05rem,5.4vw,1.3rem)] sm:text-[clamp(1.9rem,3.8vw,3.1rem)] leading-[1.18] sm:leading-[1.12] tracking-tight mb-2 sm:mb-5 line-clamp-3 sm:line-clamp-none drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]"
              style={{ fontFamily: "'Newsreader', serif" }}
            >
              Security built on{" "}
              <em className="not-italic text-[#FF8595] italic font-normal">
                discipline
              </em>
              , delivered by ex-servicemen.
            </h1>

            {/* Subtext (Hidden below 640px in overlay mode) */}
            <p
              className="hidden sm:block text-sm sm:text-base lg:text-lg leading-relaxed text-white/90 font-normal mb-6 sm:mb-8 max-w-[480px] drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Guarding industry, mines and institutions across Jharkhand, Bihar and
              Odisha — backed by over 25,000 certified personnel.
            </p>

            {/* CTA Buttons (Mobile: one row, grid-cols-2, gap 8px, 40px high, 13px text) */}
            <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-row sm:items-center sm:gap-3.5 w-full sm:w-auto">
              <Link
                href="#contact"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-2.5 sm:px-8 h-[40px] sm:h-[48px] rounded-sm sm:rounded-md bg-[#9E002B] hover:bg-[#B80032] text-[13px] sm:text-sm font-bold tracking-[0.02em] sm:tracking-[0.1em] uppercase text-white transition-all shadow-md sm:shadow-xl hover:shadow-red-900/40 active:scale-95 text-center truncate"
              >
                Request a Quote
                <svg
                  className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 hidden xs:inline-block sm:inline-block"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.5"
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </Link>

              <button
                type="button"
                onClick={() => setAboutOpen(true)}
                className="w-full sm:w-auto inline-flex items-center justify-center h-[40px] sm:h-[48px] px-2.5 sm:px-8 rounded-sm sm:rounded-md border border-white/35 bg-black/40 hover:bg-white/15 text-[13px] sm:text-sm font-bold tracking-[0.02em] sm:tracking-[0.1em] uppercase text-white transition-all backdrop-blur-sm active:scale-95 text-center truncate"
              >
                Our Story
              </button>
            </div>
          </div>
        </div>

        {/* 2B. MOBILE CONTENT AREA (BELOW MODE ONLY, < 640px) */}
        {isBelowMode && (
          <div className="sm:hidden w-full bg-[#2A060C] px-4 py-3.5 pointer-events-auto flex flex-col text-white z-20">
            {/* Kicker: 10.5px */}
            <div className="text-[10.5px] font-bold uppercase tracking-[0.14em] text-[#FF8595] leading-tight mb-1 truncate">
              {current.caption}
            </div>

            {/* H1: clamp(1.05rem, 5.4vw, 1.3rem), weight 700, max 3 lines */}
            <h1
              className="text-white font-bold text-[clamp(1.05rem,5.4vw,1.3rem)] leading-[1.18] tracking-tight mb-1.5 line-clamp-3"
              style={{ fontFamily: "'Newsreader', serif" }}
            >
              Security built on{" "}
              <em className="not-italic text-[#FF8595] italic font-normal">
                discipline
              </em>
              , delivered by ex-servicemen.
            </h1>

            {/* Sub paragraph: shown in below mode */}
            <p
              className="text-[12px] leading-relaxed text-white/90 font-normal mb-3"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Guarding industry, mines and institutions across Jharkhand, Bihar and
              Odisha — backed by over 25,000 certified personnel.
            </p>

            {/* CTA Buttons: grid-cols-2, gap 8px, 40px high, 13px text */}
            <div className="grid grid-cols-2 gap-2 w-full">
              <Link
                href="#contact"
                className="inline-flex items-center justify-center gap-1.5 px-2.5 h-[40px] rounded-sm bg-[#9E002B] hover:bg-[#B80032] text-[13px] font-bold tracking-[0.02em] uppercase text-white transition-all shadow-md active:scale-95 text-center truncate"
              >
                Request a Quote
                <svg
                  className="w-3.5 h-3.5 shrink-0 hidden xs:inline-block"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.5"
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </Link>

              <button
                type="button"
                onClick={() => setAboutOpen(true)}
                className="inline-flex items-center justify-center h-[40px] px-2.5 rounded-sm border border-white/35 bg-black/40 hover:bg-white/15 text-[13px] font-bold tracking-[0.02em] uppercase text-white transition-all backdrop-blur-sm active:scale-95 text-center truncate"
              >
                Our Story
              </button>
            </div>
          </div>
        )}

        {/* 3. BOTTOM SLIDER CONTROLS BAR (TABLET & DESKTOP ONLY, >= 640px) */}
        <div className="hidden sm:block relative z-30 w-full bg-gradient-to-r from-transparent via-[#6b001a]/20 to-[#6b001a]/75 backdrop-blur-sm lg:backdrop-blur-none border-t border-white/10 pointer-events-auto">
          <div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16 h-16 sm:h-20 flex items-center justify-between">
            {/* Left Caption / Slide Title (Desktop Only) */}
            <div className="hidden lg:flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-[#FF8595] animate-ping" />
              <AnimatePresence mode="wait">
                <motion.span
                  key={active}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="text-xs sm:text-sm font-medium tracking-wide text-white/95 drop-shadow-md"
                >
                  {current.caption}
                </motion.span>
              </AnimatePresence>
            </div>

            {/* Right Side: Slide Thumbnails */}
            <div className="flex items-center justify-between w-full lg:w-auto gap-4 sm:gap-6">
              <div className="flex gap-2 sm:gap-3 items-center">
                {HERO_SLIDES.map((slide, i) => (
                  <button
                    key={i}
                    onClick={() => setActive(i)}
                    className="relative focus:outline-none"
                    aria-label={`Slide ${i + 1}`}
                  >
                    <div
                      className={cn(
                        "relative w-12 h-8 sm:w-16 sm:h-10 rounded overflow-hidden transition-all duration-300",
                        active === i
                          ? "ring-2 ring-white opacity-100 scale-105 shadow-lg"
                          : "opacity-40 hover:opacity-90 border border-white/20"
                      )}
                    >
                      <Image
                        src={slide.src}
                        alt=""
                        fill
                        sizes="64px"
                        className="object-cover"
                        style={{ objectPosition: slide.focal || "center" }}
                      />
                    </div>

                    {/* Active Progress Track Line */}
                    {active === i && (
                      <div className="absolute -bottom-1 left-0 right-0 h-[2px] bg-white/30 overflow-hidden rounded-full">
                        <motion.div
                          className="h-full bg-white origin-left"
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: isPaused ? 0 : 1 }}
                          transition={{
                            duration: SLIDE_DURATION / 1000,
                            ease: "linear",
                          }}
                        />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <AboutSheet isOpen={aboutOpen} onClose={() => setAboutOpen(false)} />
    </>
  );
}
