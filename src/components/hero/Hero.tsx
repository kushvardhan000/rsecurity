"use client";

import { useEffect, useState, useRef, useCallback, useSyncExternalStore, useMemo } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { cn } from "@/src/lib/cn";
import { HERO_SLIDES } from "@/src/data/hero";

import { usePreloaderDone } from "@/src/lib/preloader";

export type HeroMobileTextMode = "overlay" | "below";

/**
 * Constants:
 * HERO_MOBILE_RATIO: The natural aspect ratio of the hero photographs,
 * all supplied at 16:9 (1.78), so the mobile frame matches the asset ratio.
 * HERO_MOBILE_TEXT: "overlay" | "below" (default "overlay").
 */
export const HERO_MOBILE_RATIO = 1.78;
export const HERO_MOBILE_TEXT: HeroMobileTextMode = "overlay";

const SLIDE_DURATION = 4500;
const SWIPE_THRESHOLD = 40;

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

// Preload next slide image for smoother transitions
function preloadImage(src: string) {
  if (typeof window === "undefined") return;
  const link = document.createElement("link");
  link.rel = "preload";
  link.as = "image";
  link.href = src;
  document.head.appendChild(link);
}

export function Hero({
  mobileText = HERO_MOBILE_TEXT,
}: {
  mobileText?: HeroMobileTextMode;
} = {}) {
  const preloaderDone = usePreloaderDone();
  const [active, setActive] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const reduce = useReducedMotion();
  const touchStartX = useRef<number | null>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const thumbRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const thumbsStripRef = useRef<HTMLDivElement>(null);
  const preloadedImages = useRef<Set<string>>(new Set());

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

  // Preload next slide image
  useEffect(() => {
    if (!preloaderDone) return;
    const nextIndex = (active + 1) % HERO_SLIDES.length;
    const nextSrc = HERO_SLIDES[nextIndex].src;
    if (!preloadedImages.current.has(nextSrc)) {
      preloadedImages.current.add(nextSrc);
      preloadImage(nextSrc);
    }
    // Also preload the one after next for even smoother experience
    const nextNextIndex = (active + 2) % HERO_SLIDES.length;
    const nextNextSrc = HERO_SLIDES[nextNextIndex].src;
    if (!preloadedImages.current.has(nextNextSrc)) {
      preloadedImages.current.add(nextNextSrc);
      preloadImage(nextNextSrc);
    }
  }, [active, preloaderDone]);

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

  // Keep the active preview visible without scrolling the page.
  const previewMounted = useRef(false);
  useEffect(() => {
    if (!previewMounted.current) {
      previewMounted.current = true;
      return;
    }
    const strip = thumbsStripRef.current;
    const thumb = thumbRefs.current[active];
    if (!strip || !thumb) return;
    const stripRect = strip.getBoundingClientRect();
    const thumbRect = thumb.getBoundingClientRect();
    const delta =
      thumbRect.left -
      stripRect.left -
      stripRect.width / 2 +
      thumbRect.width / 2;
    strip.scrollTo({ left: strip.scrollLeft + delta, behavior: "smooth" });
  }, [active]);

  // Memoize slide elements to prevent unnecessary re-renders
  const slides = useMemo(() => HERO_SLIDES.map((slide, i) => {
    const isActive = i === active;
    const isPriority = i === 0 || i === active || i === ((active + 1) % HERO_SLIDES.length);
    
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
            isActive && !reduce && preloaderDone && "hero-zoom"
          )}
        >
          <Image
            src={slide.src}
            alt={slide.alt}
            fill
            priority={isPriority}
            loading={isPriority ? undefined : "lazy"}
            className="object-cover w-full h-full [object-position:var(--focal-mob)] hero-focal-desk"
            style={
              {
                "--focal-mob": slide.focalMobile || "50% top",
                "--focal-desk": slide.focal || "center top",
              } as React.CSSProperties
            }
            sizes="100vw"
            placeholder="blur"
            blurDataURL="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 8'%3E%3Crect width='8' height='8' fill='%231a0406'/%3E%3C/svg%3E"
          />
        </div>
      </div>
    );
  }), [active, reduce, preloaderDone]);

  return (
    <>
      <section
        id="home"
        data-tone="dark"
        ref={heroRef}
        aria-label="Hero"
        className={cn(
          "relative w-full bg-[#0F0E0D] text-white overflow-hidden m-0 p-0",
          isBelowMode
            ? "flex flex-col"
            : "grid grid-cols-1 grid-rows-1",
          "hero-layout hero-h95"
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
            isBelowMode
              ? "relative [aspect-ratio:var(--hero-mobile-ratio)] hero-ratio-auto"
              : "col-start-1 row-start-1 relative self-stretch [aspect-ratio:var(--hero-mobile-ratio)] hero-ratio-auto",
            "hero-photo pointer-events-auto z-0"
          )}
        >
          {slides}

          <style
            dangerouslySetInnerHTML={{
              __html: `
            @keyframes heroZoom {
              from { transform: scale(1.05); }
              to { transform: scale(1); }
            }
            .hero-thumbs::-webkit-scrollbar { display: none; }
          `,
            }}
          />

          {/* Mobile Story-style Progress Bars (Top edge of the photo) */}
          <div className="hero-bars-hidden absolute top-0 left-0 right-0 z-30 px-3 pt-2.5 pb-2 pointer-events-none flex gap-1.5">
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

          {/* Desktop Scrim — brand-tinted cinematic wash for text contrast */}
          <div className="hidden hero-scrim-desk absolute inset-0 z-20 pointer-events-none">
            <div className="absolute inset-0 bg-[linear-gradient(100deg,rgba(18,4,8,0.7)_0%,rgba(26,6,10,0.46)_34%,rgba(26,6,10,0.12)_64%,rgba(26,6,10,0)_84%)]" />
            <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-[#120407]/55 via-[#120407]/15 to-transparent" />
            <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#0F0E0D]/25 to-transparent" />
          </div>

          {/* Tablet Scrim (640px - 1023px) */}
          <div className="hidden hero-scrim-tablet absolute inset-0 z-20 pointer-events-none bg-gradient-to-b from-[#0F0E0D]/80 via-black/30 to-[#0F0E0D]/60" />
        </div>

        {/* 2. HERO CONTENT AREA (OVERLAY MODE & DESKTOP/TABLET) */}
        <div
          className={cn(
            "w-full pointer-events-none",
            !isBelowMode && "col-start-1 row-start-1 relative z-20 flex flex-col justify-end h-full",
            isBelowMode && "hidden hero-below-hidden",
            "hero-content"
          )}
        >
          {/* Overlay Gradient on Mobile (< 640px) so top half of photo stays clear */}
              {!isBelowMode && (
                <div
                  className="hero-below-hidden absolute inset-0 pointer-events-none z-0"
                  style={{
                    background:
                      "linear-gradient(to top, rgba(42,6,12,.88) 0%, rgba(42,6,12,.6) 38%, transparent 70%)",
                  }}
                  aria-hidden="true"
                />
              )}

          {/* Content Block */}
          <div className="relative z-10 w-full hero-block pointer-events-auto px-4 pb-3 pt-6">
            {/* Kicker (Mobile: 10.5px, bold, uppercase) */}
            <div className="block hero-kicker-hidden text-[10.5px] font-bold uppercase tracking-[0.14em] text-[#FF8595] leading-tight mb-1 truncate drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
              {current.caption}
            </div>

            {/* Headline H1 */}
            <h1
              className="text-white font-bold hero-h1 text-[clamp(1.15rem,6vw,1.45rem)] leading-[1.18] tracking-tight mb-2 line-clamp-3"
              style={{ fontFamily: "'Newsreader', serif" }}
            >
              Trusted Security & Manpower Solutions {" "}
              <em className="not-italic text-[#FF8595] italic font-normal">
                Since 1995
              </em>.
            </h1>

            {/* Subtext (Hidden below 640px in overlay mode) */}
            <p
              className="hidden hero-p text-[16px] leading-relaxed text-white/90 font-normal max-w-[480px]"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              A pioneer in Jharkhand’s private security industry — an Ex-Servicemen enterprise, ISO 9001:2015 certified, and committed to quality, training, and compliance.
            </p>
          </div>
        </div>

        {/* 2B. MOBILE CONTENT AREA (BELOW MODE ONLY, < 640px) */}
        {isBelowMode && (
          <div className="hero-below-hidden w-full bg-[#2A060C] px-4 py-3.5 pointer-events-auto flex flex-col text-white z-20">
            {/* Kicker: 10.5px */}
            <div className="text-[10.5px] font-bold uppercase tracking-[0.14em] text-[#FF8595] leading-tight mb-1 truncate">
              {current.caption}
            </div>

            {/* H1: clamp(1.05rem, 5.4vw, 1.3rem), weight 700, max 3 lines */}
            <h1
              className="text-white font-bold text-[clamp(1.15rem,6vw,1.45rem)] leading-[1.18] tracking-tight mb-1.5 line-clamp-3"
              style={{ fontFamily: "'Newsreader', serif" }}
            >
              Trusted Security & Manpower Solutions{" "}
              <em className="not-italic text-[#FF8595] italic font-normal">
                Since 1995
              </em>.
            </h1>

            {/* Sub paragraph: shown in below mode */}
            <p
              className="text-[13px] leading-relaxed text-white/90 font-normal"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              A pioneer in Jharkhand’s private security industry — an Ex-Servicemen enterprise, ISO 9001:2015 certified, and committed to quality, training, and compliance.
            </p>
          </div>
        )}

        {/* 3. BOTTOM PREVIEWER BAR (tablet landscape & desktop): caption left, thumbnails right-aligned within container */}
        <div className="hero-bar relative z-30 w-full bg-gradient-to-r from-transparent via-[#6b001a]/20 to-[#6b001a]/75 backdrop-blur-sm border-t border-white/10 pointer-events-auto">
          <div className="hero-bar-inner max-w-[1400px] mx-auto px-6 flex items-center justify-between gap-4 min-w-0 h-16">
            {/* Left Caption / Slide Title (desktop only) */}
            <div className="hidden hero-caption-row items-center gap-3 min-w-0">
              <span className="w-2 h-2 rounded-full bg-[#FF8595] animate-ping shrink-0" />
              <AnimatePresence mode="wait">
                <motion.span
                  key={active}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="text-xs hero-caption font-medium tracking-wide text-white/95 drop-shadow-md truncate"
                >
                  {current.caption}
                </motion.span>
              </AnimatePresence>
            </div>

            {/* Right Side: Slide Previews (right-aligned within bottom container, not screen edge) */}
            <div className="flex items-center justify-end w-full min-w-0">
              <div
                ref={thumbsStripRef}
                className="hero-thumbs flex gap-2 hero-preview items-center overflow-x-auto py-1 -my-1 w-[332px] hero-strip max-w-full shrink-0"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              >
                {HERO_SLIDES.map((slide, i) => (
                  <button
                    key={i}
                    ref={(el) => {
                      thumbRefs.current[i] = el;
                    }}
                    onClick={() => setActive(i)}
                    className="relative shrink-0 focus:outline-none"
                    aria-label={`Slide ${i + 1}`}
                    aria-current={active === i}
                  >
                    <div
                      className={cn(
                        "relative w-12 h-8 hero-thumb rounded overflow-hidden transition-all duration-300",
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
                        style={{ objectPosition: slide.focal || "center top" }}
                        loading="lazy"
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
    </>
  );
}
