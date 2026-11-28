"use client";

import React, { useState, useEffect, useLayoutEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { ArrowUpRight, Radio, ChevronLeft, ChevronRight } from "lucide-react";
import {
  FEATURED_SERVICES,
  ALSO_SERVICES,
} from "@/src/data/services";
import { Reveal } from "../ui/Reveal";
import { cn } from "@/src/lib/cn";

const AUTOPLAY_MS = 5000;
const PAUSE_ON_HOVER = true;
const SERVICE_COUNT = FEATURED_SERVICES.length;

function wrap(val: number): number {
  if (SERVICE_COUNT <= 1) return 0;
  return ((((val + SERVICE_COUNT / 2) % SERVICE_COUNT) + SERVICE_COUNT) % SERVICE_COUNT) - SERVICE_COUNT / 2;
}

function normalizeIndex(index: number): number {
  return SERVICE_COUNT > 0
    ? ((Math.round(index) % SERVICE_COUNT) + SERVICE_COUNT) % SERVICE_COUNT
    : 0;
}

function lerp3(t: number, a: number, b: number, c: number): number {
  if (t <= 0) return a;
  if (t <= 1) return a + (b - a) * t;
  if (t <= 2) return b + (c - b) * (t - 1);
  return c;
}

export function Services() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [mounted, setMounted] = useState(false);

  const sectionRef = useRef<HTMLElement>(null);
  const deckRef = useRef<HTMLDivElement>(null);
  const [openWidth, setOpenWidth] = useState<number>(600);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isIntersectingRef = useRef(false);
  const isTabHiddenRef = useRef(false);
  const isHoveredRef = useRef(false);
  const isFocusedRef = useRef(false);
  const isReducedMotionRef = useRef(false);

  // Mobile Coverflow Stage & Card Refs
  const stageRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const detailsRefs = useRef<(HTMLDivElement | null)[]>(Array(SERVICE_COUNT).fill(null));
  const nearCenterFlags = useRef<boolean[]>(Array(SERVICE_COUNT).fill(false));
  const lastZIndexRef = useRef<number[]>(Array(SERVICE_COUNT).fill(0));
  const lastVisibilityRef = useRef<boolean[]>(Array(SERVICE_COUNT).fill(false));

  const cardWRef = useRef<number>(300);
  const cardHRef = useRef<number>(400);
  const posRef = useRef<number>(0);
  const targetRef = useRef<number>(0);
  const animFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);
  const activeIdxRef = useRef<number>(0);

  // Pointer drag & gesture refs
  const pointerIdRef = useRef<number | null>(null);
  const pointerStartXRef = useRef<number>(0);
  const pointerStartYRef = useRef<number>(0);
  const pointerLastXRef = useRef<number>(0);
  const pointerLastTRef = useRef<number>(0);
  const dragStartPosRef = useRef<number>(0);
  const velocityRef = useRef<number>(0);
  const isDraggingRef = useRef<boolean>(false);
  const hasCapturedRef = useRef<boolean>(false);
  const swallowClickRef = useRef<boolean>(false);
  const clickResetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const timeout = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timeout);
  }, []);

  // Write styles via refs, transform and opacity only, no layout reads in the loop
  const renderStyles = useCallback((currentPos: number) => {
    const cardW = cardWRef.current;
    if (!cardW) return;
    const x1 = cardW * 0.93 + 12;
    const x2 = x1 + cardW * 0.9;

    for (let i = 0; i < SERVICE_COUNT; i++) {
      const cardEl = cardRefs.current[i];
      if (!cardEl) continue;

      const d = wrap(i - currentPos);
      const absD = Math.abs(d);

      if (absD >= 1.6) {
        if (lastVisibilityRef.current[i]) {
          lastVisibilityRef.current[i] = false;
          cardEl.style.opacity = "0";
          cardEl.style.visibility = "hidden";
          cardEl.style.pointerEvents = "none";
        }
      } else {
        if (!lastVisibilityRef.current[i]) {
          lastVisibilityRef.current[i] = true;
          cardEl.style.visibility = "visible";
          cardEl.style.pointerEvents = "auto";
        }

        const opacity = lerp3(absD, 1, 0.55, 0);
        cardEl.style.opacity = opacity.toFixed(4);

        const scale = lerp3(absD, 1, 0.86, 0.78);
        const translateY = lerp3(absD, 0, 14, 24);
        const x = Math.sign(d) * lerp3(absD, 0, x1, x2);
        cardEl.style.transform = `translate3d(${x.toFixed(2)}px, ${translateY.toFixed(2)}px, 0) scale(${scale.toFixed(4)})`;

        const zIndex = Math.round((SERVICE_COUNT + 2 - absD) * 10);
        if (lastZIndexRef.current[i] !== zIndex) {
          lastZIndexRef.current[i] = zIndex;
          cardEl.style.zIndex = String(zIndex);
        }
      }

      // Description & link fade in (250ms, 150ms delay) only when |d| < 0.3
      const isNearCenter = absD < 0.3;
      if (nearCenterFlags.current[i] !== isNearCenter) {
        nearCenterFlags.current[i] = isNearCenter;
        const detailsEl = detailsRefs.current[i];
        if (detailsEl) {
          if (isNearCenter) {
            detailsEl.style.opacity = "1";
            detailsEl.style.pointerEvents = "auto";
            detailsEl.style.transition = "opacity 250ms cubic-bezier(0.16, 1, 0.3, 1) 150ms";
          } else {
            detailsEl.style.opacity = "0";
            detailsEl.style.pointerEvents = "none";
            detailsEl.style.transition = "opacity 150ms ease 0ms";
          }
        }
      }
    }

    // Update React active index only when integer active index changes
    const activeIndex = normalizeIndex(currentPos);
    if (activeIndex !== activeIdxRef.current) {
      activeIdxRef.current = activeIndex;
      setActiveIdx(activeIndex);
    }
  }, []);

  const animateRef = useRef<(time: number) => void>(() => {});

  // Motion: requestAnimationFrame only while |target - pos| > 0.001 or dragging
  // Easing: pos += (target - pos) * (1 - Math.exp(-dt * 8)), dt capped at 0.05
  const animate = useCallback(
    (time: number) => {
      if (lastTimeRef.current === null) {
        lastTimeRef.current = time;
      }
      const dt = Math.min((time - lastTimeRef.current) / 1000, 0.05);
      lastTimeRef.current = time;

      if (isReducedMotionRef.current) {
        posRef.current = normalizeIndex(targetRef.current);
        targetRef.current = posRef.current;
        renderStyles(posRef.current);
        animFrameRef.current = null;
        lastTimeRef.current = null;
        return;
      }

      const diff = targetRef.current - posRef.current;
      if (Math.abs(diff) <= 0.001 && !isDraggingRef.current) {
        posRef.current = normalizeIndex(targetRef.current);
        targetRef.current = posRef.current;
        renderStyles(posRef.current);
        animFrameRef.current = null;
        lastTimeRef.current = null;
        return;
      }

      posRef.current += diff * (1 - Math.exp(-dt * 8));
      renderStyles(posRef.current);

      animFrameRef.current = requestAnimationFrame((t) => animateRef.current(t));
    },
    [renderStyles]
  );

  useEffect(() => {
    animateRef.current = animate;
  }, [animate]);

  const startAnimation = useCallback(() => {
    if (isReducedMotionRef.current) {
      posRef.current = normalizeIndex(targetRef.current);
      targetRef.current = posRef.current;
      renderStyles(posRef.current);
      return;
    }
    if (animFrameRef.current === null) {
      lastTimeRef.current = null;
      animFrameRef.current = requestAnimationFrame((t) => animateRef.current(t));
    }
  }, [renderStyles]);

  useEffect(() => {
    if (!mounted) return;
    const deck = deckRef.current;
    if (!deck) return;

    const measure = () => {
      const containerWidth = deck.getBoundingClientRect().width;
      if (containerWidth > 0) {
        const computedOpenW = Math.max(0, (containerWidth - 4 * 12) * (5 / 9));
        setOpenWidth(computedOpenW);
        deck.style.setProperty("--open-w", `${computedOpenW}px`);
      }
    };

    measure();

    if (typeof ResizeObserver !== "undefined") {
      const ro = new ResizeObserver(([entry]) => {
        const containerWidth = entry.contentRect.width;
        if (containerWidth > 0) {
          const computedOpenW = Math.max(0, (containerWidth - 4 * 12) * (5 / 9));
          setOpenWidth(computedOpenW);
          deck.style.setProperty("--open-w", `${computedOpenW}px`);
        }
      });

      ro.observe(deck);
      return () => ro.disconnect();
    }
  }, [mounted]);

  // ResizeObserver for Mobile Stage
  useLayoutEffect(() => {
    if (!mounted) return;
    const stage = stageRef.current;
    if (!stage) return;

    const measure = () => {
      const vw = window.innerWidth;
      const stageWidth = stage.getBoundingClientRect().width;
      if (stageWidth <= 0) return;
      const isTablet = vw >= 640 && vw < 1024;
      const availableWidth = Math.max(0, stageWidth - 32);
      const cardW = isTablet
        ? Math.min(vw * 0.56, 420, availableWidth)
        : Math.min(vw * 0.78, 360, availableWidth);
      const cardH = cardW * (4 / 3);
      cardWRef.current = cardW;
      cardHRef.current = cardH;

      stage.style.height = `${Math.round(cardH + 32)}px`;
      stage.style.setProperty("--card-w", `${Math.round(cardW)}px`);
      stage.style.setProperty("--card-h", `${Math.round(cardH)}px`);

      renderStyles(posRef.current);
    };

    measure();

    if (typeof ResizeObserver !== "undefined") {
      const ro = new ResizeObserver(() => {
        measure();
      });
      ro.observe(stage);
      return () => ro.disconnect();
    }
  }, [mounted, renderStyles]);

  const isDesktopDevice = useCallback(() => {
    if (typeof window === "undefined") return false;
    return (
      window.matchMedia("(min-width: 1024px)").matches ||
      window.matchMedia("(hover: hover) and (pointer: fine)").matches
    );
  }, []);

  const shouldPause = useCallback(() => {
    if (typeof window === "undefined") return true;
    if (isReducedMotionRef.current) return true;
    if (isTabHiddenRef.current) return true;
    if (!isIntersectingRef.current) return true;
    if (isDraggingRef.current) return true;
    if (PAUSE_ON_HOVER && isDesktopDevice()) {
      if (isHoveredRef.current || isFocusedRef.current) {
        return true;
      }
    }
    return false;
  }, [isDesktopDevice]);

  const scheduleNextRef = useRef<() => void>(() => {});

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const scheduleNext = useCallback(() => {
    clearTimer();
    if (!isDesktopDevice() || shouldPause()) return;

    timerRef.current = setTimeout(() => {
      targetRef.current += 1;
      startAnimation();
      scheduleNextRef.current();
    }, AUTOPLAY_MS);
  }, [clearTimer, shouldPause, startAnimation, isDesktopDevice]);

  useEffect(() => {
    scheduleNextRef.current = scheduleNext;
  }, [scheduleNext]);

  const nextSlide = useCallback(() => {
      targetRef.current = Math.round(targetRef.current) + 1;
    startAnimation();
    scheduleNext();
  }, [startAnimation, scheduleNext]);

  const prevSlide = useCallback(() => {
      targetRef.current = Math.round(targetRef.current) - 1;
    startAnimation();
    scheduleNext();
  }, [startAnimation, scheduleNext]);

  const handleManualSelect = useCallback(
    (index: number) => {
      setActiveIdx(index);
      activeIdxRef.current = index;
      targetRef.current = index;
      if (isReducedMotionRef.current) {
        posRef.current = index;
        renderStyles(index);
      } else {
        startAnimation();
      }
      scheduleNext();
    },
    [scheduleNext, startAnimation, renderStyles]
  );

  const tabButtonsRef = useRef<(HTMLButtonElement | null)[]>([]);

  const handleTabKeyDown = useCallback(
    (e: React.KeyboardEvent, index: number) => {
      let targetIndex = -1;
      const total = FEATURED_SERVICES.length;

      if (e.key === "ArrowRight") {
        e.preventDefault();
        targetIndex = (index + 1) % total;
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        targetIndex = (index - 1 + total) % total;
      } else if (e.key === "Home") {
        e.preventDefault();
        targetIndex = 0;
      } else if (e.key === "End") {
        e.preventDefault();
        targetIndex = total - 1;
      } else if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        if (index !== activeIdx) {
          handleManualSelect(index);
        }
        return;
      }

      if (targetIndex !== -1) {
        handleManualSelect(targetIndex);
        tabButtonsRef.current[targetIndex]?.focus();
      }
    },
    [activeIdx, handleManualSelect]
  );

  // Touch and Pointer controls for Phone + Tablet coverflow
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    pointerIdRef.current = e.pointerId;
    pointerStartXRef.current = e.clientX;
    pointerStartYRef.current = e.clientY;
    pointerLastXRef.current = e.clientX;
    pointerLastTRef.current = performance.now();
    dragStartPosRef.current = posRef.current;
    velocityRef.current = 0;
    isDraggingRef.current = false;
    hasCapturedRef.current = false;
    clearTimer();
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (pointerIdRef.current !== e.pointerId) return;
    const now = performance.now();
    const dx = e.clientX - pointerStartXRef.current;
    const dy = e.clientY - pointerStartYRef.current;

    if (!isDraggingRef.current) {
      if (Math.abs(dx) > 6 && Math.abs(dx) > Math.abs(dy)) {
        isDraggingRef.current = true;
        hasCapturedRef.current = true;
        try {
          e.currentTarget.setPointerCapture(e.pointerId);
        } catch {}
      } else if (Math.abs(dy) > 6) {
        // Vertical scroll: release pointer so native scroll occurs freely
        pointerIdRef.current = null;
        scheduleNext();
        return;
      }
    }

    if (isDraggingRef.current) {
      const dt = (now - pointerLastTRef.current) / 1000;
      if (dt > 0.008) {
        const cardSpacing = cardWRef.current * 0.93 + 12;
        const vPx = (e.clientX - pointerLastXRef.current) / dt;
        const vCards = vPx / (cardSpacing || 1);
        velocityRef.current = velocityRef.current * 0.4 + vCards * 0.6;
        pointerLastXRef.current = e.clientX;
        pointerLastTRef.current = now;
      }

      const cardSpacing = cardWRef.current * 0.93 + 12;
      const newPos = dragStartPosRef.current - dx / (cardSpacing || 1);
      posRef.current = newPos;
      targetRef.current = Math.round(newPos);
      renderStyles(newPos);
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (pointerIdRef.current !== e.pointerId) return;
    const capturedId = pointerIdRef.current;
    pointerIdRef.current = null;

    if (hasCapturedRef.current) {
      try {
        e.currentTarget.releasePointerCapture(capturedId);
      } catch {}
      hasCapturedRef.current = false;
    }

    if (isDraggingRef.current) {
      isDraggingRef.current = false;
      swallowClickRef.current = true;
      if (clickResetTimerRef.current) clearTimeout(clickResetTimerRef.current);
      clickResetTimerRef.current = setTimeout(() => {
        swallowClickRef.current = false;
        clickResetTimerRef.current = null;
      }, 120);

      const now = performance.now();
      if (now - pointerLastTRef.current > 0.08) {
        velocityRef.current = 0;
      }

      const rawTarget = Math.round(posRef.current - velocityRef.current * 0.25);
      targetRef.current = rawTarget;
      startAnimation();
    }

    scheduleNext();
  };

  const handlePointerCancel = (e: React.PointerEvent<HTMLDivElement>) => {
    if (pointerIdRef.current !== e.pointerId) return;
    const capturedId = pointerIdRef.current;
    pointerIdRef.current = null;

    if (hasCapturedRef.current) {
      try {
        e.currentTarget.releasePointerCapture(capturedId);
      } catch {}
      hasCapturedRef.current = false;
    }

    isDraggingRef.current = false;
    targetRef.current = Math.round(posRef.current);
    startAnimation();
    scheduleNext();
  };

  const handleStageClickCapture = (e: React.MouseEvent) => {
    if (swallowClickRef.current) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  useEffect(() => {
    if (!mounted) return;
    const section = sectionRef.current;
    if (!section) return;

    // Check reduced motion
    const motionMq = window.matchMedia("(prefers-reduced-motion: reduce)");
    isReducedMotionRef.current = motionMq.matches;

    const handleMotionChange = (e: MediaQueryListEvent) => {
      isReducedMotionRef.current = e.matches;
      if (e.matches) {
        clearTimer();
      } else {
        scheduleNext();
      }
    };
    motionMq.addEventListener("change", handleMotionChange);

    // Tab visibility
    isTabHiddenRef.current = document.hidden;
    const handleVisibilityChange = () => {
      isTabHiddenRef.current = document.hidden;
      if (document.hidden) {
        clearTimer();
      } else {
        scheduleNext();
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // IntersectionObserver for offscreen pause
    const observer = new IntersectionObserver(
      ([entry]) => {
        isIntersectingRef.current = entry.isIntersecting;
        if (!entry.isIntersecting) {
          clearTimer();
        } else {
          scheduleNext();
        }
      },
      { threshold: 0 }
    );
    observer.observe(section);

    // Desktop hover & focus inside pause handlers
    const handlePointerEnter = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      isHoveredRef.current = true;
      if (PAUSE_ON_HOVER && isDesktopDevice()) {
        clearTimer();
      }
    };

    const handlePointerLeave = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      isHoveredRef.current = false;
      scheduleNext();
    };

    const handleFocusIn = () => {
      isFocusedRef.current = true;
      if (PAUSE_ON_HOVER && isDesktopDevice()) {
        clearTimer();
      }
    };

    const handleFocusOut = (e: FocusEvent) => {
      if (!section.contains(e.relatedTarget as Node)) {
        isFocusedRef.current = false;
        scheduleNext();
      }
    };

    // Keyboard navigation (arrows and any keys inside section)
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!section.contains(document.activeElement)) return;
      if (document.activeElement?.getAttribute("role") === "tab") return;

      if (e.key === "ArrowRight") {
        e.preventDefault();
        nextSlide();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        prevSlide();
      } else {
        scheduleNext();
      }
    };

    // Any click inside section restarts countdown
    const handleClick = () => {
      scheduleNext();
    };

    section.addEventListener("pointerenter", handlePointerEnter);
    section.addEventListener("pointerleave", handlePointerLeave);
    section.addEventListener("focusin", handleFocusIn);
    section.addEventListener("focusout", handleFocusOut);
    section.addEventListener("click", handleClick);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      clearTimer();
      if (clickResetTimerRef.current) {
        clearTimeout(clickResetTimerRef.current);
        clickResetTimerRef.current = null;
      }
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
      observer.disconnect();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      motionMq.removeEventListener("change", handleMotionChange);
      section.removeEventListener("pointerenter", handlePointerEnter);
      section.removeEventListener("pointerleave", handlePointerLeave);
      section.removeEventListener("focusin", handleFocusIn);
      section.removeEventListener("focusout", handleFocusOut);
      section.removeEventListener("click", handleClick);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [mounted, clearTimer, scheduleNext, isDesktopDevice, nextSlide, prevSlide]);

  if (!mounted) {
    return (
      <section id="services" className="bg-[#FAF8F5] py-16">
        <div className="mx-auto max-w-[1320px] px-5 text-center text-neutral-400">
          Loading Security Operations...
        </div>
      </section>
    );
  }

const count = SERVICE_COUNT;
const safeActiveIdx = count > 0 ? ((activeIdx % count) + count) % count : 0;
const halfSpan = Math.floor(count / 2);

const getShortestStep = (targetIndex: number, currentIndex: number) => {
  if (count <= 1) return 0;
  let diff = (targetIndex - currentIndex) % count;
  if (diff > halfSpan) diff -= count;
  if (diff < -halfSpan) diff += count;
  return diff;
};

  return (
    <section
      ref={sectionRef}
      id="services"
      data-tone="light"
      className="relative bg-[#FAF8F5] py-14 sm:py-20 border-t border-neutral-200/80 overflow-hidden border-b-2 border-[#000]"
    >
      <div className="mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-8">
        {/* Header Block */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-[#540B13]/10 text-[#540B13] text-[11px] font-mono tracking-widest uppercase mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#540B13] animate-ping" />
              DEPLOYMENT DIVISIONS
            </div>
            <h2 className="text-2xl sm:text-4xl font-serif text-[#1C1917] tracking-tight">
              Security, built around <span className="text-[#540B13] italic">your site.</span>
            </h2>
          </div>

          <a
            href="#contact"
            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#540B13] hover:text-[#380202] transition-colors"
          >
            All Services & Pricing
            <ArrowUpRight className="w-4 h-4" />
          </a>
        </div>

        {/* ── DESKTOP: Dynamic Expanding Dossier Deck (>= 1024px) ── */}
       {/* ── DESKTOP / LAPTOP / ULTRAWIDE / 4K (>= 1024px) ── */}
<div className="hidden lg:grid w-full grid-cols-[44px_minmax(0,1fr)_44px] items-center gap-2">
<div
  ref={deckRef}
  role="tablist"
  aria-label="Deployment Divisions"
  className="col-start-2 flex h-[420px] w-full gap-3 xl:h-[460px] 2xl:h-[500px]"
  style={
    {
      "--open-w": `${Math.round(openWidth)}px`,
    } as React.CSSProperties
  }
>
  {FEATURED_SERVICES.map((service, i) => {
    const isActive = safeActiveIdx === i;
    return (
      <div
        key={service.slug}
        className={cn(
          "group relative rounded-2xl overflow-hidden select-none min-w-0",
          "transition-[flex-grow,box-shadow,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-[flex-grow]",
          isActive
            ? "shadow-xl ring-2 ring-[#540B13] opacity-100 z-10"
            : "opacity-85 hover:opacity-100"
        )}
        style={{
          flexGrow: isActive ? 5 : 1,
          flexShrink: 1,
          flexBasis: FEATURED_SERVICES.length > 4 ? "64px" : "88px",
        }}
      >
        <button
          ref={(el) => {
            tabButtonsRef.current[i] = el;
          }}
          type="button"
          role="tab"
          id={`division-tab-${service.slug}`}
          aria-selected={isActive}
          aria-controls={`division-panel-${service.slug}`}
          tabIndex={isActive ? 0 : -1}
          onClick={() => {
            if (!isActive) {
              handleManualSelect(i);
            }
          }}
          onKeyDown={(e) => handleTabKeyDown(e, i)}
          className="absolute inset-0 w-full h-full text-left p-0 border-0 bg-transparent cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:z-20"
        >
          {/* Photo Layer */}
          <div
            className="absolute inset-y-0 pointer-events-none will-change-transform"
            style={{
              width: "var(--open-w)",
              left: "50%",
              transform: "translate3d(-50%, 0, 0)",
            }}
          >
            <Image
              src={service.image}
              alt={service.title}
              fill
              priority={i === 0}
              sizes="(min-width: 1536px) 860px, (min-width: 1280px) 720px, 560px"
              className={cn(
                "object-cover transition-transform duration-500 ease-out will-change-transform",
                isActive ? "scale-[1.03]" : "scale-100 group-hover:scale-[1.015]"
              )}
              style={{ objectPosition: service.focal || "center" }}
            />
          </div>

          {/* Scrim Layers */}
          <div
            className={cn(
              "absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/20 pointer-events-none transition-opacity duration-300",
              isActive ? "opacity-0" : "opacity-100 group-hover:opacity-75"
            )}
          />
          <div
            className={cn(
              "absolute inset-0 bg-gradient-to-t from-[#260307]/95 via-[#540B13]/45 to-black/20 pointer-events-none transition-opacity duration-500",
              isActive ? "opacity-100" : "opacity-0"
            )}
          />

          {/* Top Badges */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between gap-2 z-10 pointer-events-none">
            <span
              className={cn(
                "text-[11px] font-mono font-semibold px-2 py-0.5 rounded transition-colors duration-300",
                isActive
                  ? "bg-white text-[#540B13]"
                  : "bg-black/65 text-white/90 border border-white/15"
              )}
            >
              {service.tag || `DIV-${String(i + 1).padStart(2, "0")}`}
            </span>
            <span
              className={cn(
                "flex items-center gap-1 text-[10px] font-mono text-white/90 bg-black/45 px-2.5 py-0.5 rounded-full border border-white/15 transition-opacity duration-300",
                isActive ? "opacity-100" : "opacity-0"
              )}
            >
              <Radio className="w-2.5 h-2.5 text-[#F2B8BF]" />
              DEPLOYED
            </span>
          </div>

          {/* Collapsed Title */}
          <div
            className={cn(
              "absolute bottom-5 left-4 right-4 z-10 pointer-events-none transition-opacity duration-200",
              isActive ? "opacity-0" : "opacity-100 delay-150"
            )}
          >
            <h3 className="font-serif font-bold text-base text-white/95 leading-tight truncate">
              {service.title}
            </h3>
          </div>
        </button>

        {/* Active Panel Content */}
        <div
          id={`division-panel-${service.slug}`}
          role="region"
          aria-labelledby={`division-tab-${service.slug}`}
          className={cn(
            "absolute bottom-0 left-0 p-5 z-10 text-white max-w-full will-change-[transform,opacity]",
            isActive
              ? "opacity-100 translate-y-0 pointer-events-auto"
              : "opacity-0 translate-y-2.5 pointer-events-none"
          )}
          style={{
            width: "var(--open-w)",
            transitionProperty: "opacity, transform",
            transitionDuration: isActive ? "400ms" : "180ms",
            transitionDelay: isActive ? "160ms" : "0ms",
            transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          <h3 className="font-serif font-bold text-2xl text-white mb-2 leading-tight">
            {service.title}
          </h3>

          <p className="text-xs sm:text-sm text-neutral-200 line-clamp-2 font-sans leading-relaxed mb-3 max-w-lg">
            {service.short} Ex-servicemen led perimeter protection and strict verification.
          </p>

          <a
            href="#contact"
            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-white hover:underline transition-colors"
          >
            Book Unit Assessment
            <ArrowUpRight className="w-3.5 h-3.5 text-[#F2B8BF]" />
          </a>
        </div>
      </div>
    );
  })}
</div>

</div>

{/* ── PHONE + TABLET (< 1024px): Infinite Coverflow Carousel ── */}
<div className="lg:hidden relative w-full">
  <div
    ref={stageRef}
    role="region"
    aria-roledescription="carousel"
    aria-label="Featured Services Carousel"
    tabIndex={0}
    onKeyDown={(e) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        e.stopPropagation();
        prevSlide();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        e.stopPropagation();
        nextSlide();
      }
    }}
    onPointerDown={handlePointerDown}
    onPointerMove={handlePointerMove}
    onPointerUp={handlePointerUp}
    onPointerCancel={handlePointerCancel}
    onClickCapture={handleStageClickCapture}
    className={cn(
        "relative w-full overflow-hidden touch-pan-y select-none outline-none",
        "h-[calc(min(78vw,360px)*4/3+32px)] sm:h-[calc(min(56vw,420px)*4/3+32px)]",
      "focus-visible:ring-2 focus-visible:ring-[#3D0A12] rounded-2xl"
    )}
    style={
      {
        "--card-w": "min(78vw, 360px)",
        "--card-h": "calc(min(78vw, 360px) * 4 / 3)",
        transform: "translate3d(0, 0, 0)",
      } as React.CSSProperties
    }
  >
    {FEATURED_SERVICES.map((service, i) => (
      <div
        key={service.slug}
        ref={(el) => {
          cardRefs.current[i] = el;
        }}
        role="group"
        aria-roledescription="slide"
        aria-label={`${i + 1} of ${count}: ${service.title}`}
        onClick={(e) => {
          if (swallowClickRef.current) {
            e.preventDefault();
            e.stopPropagation();
            return;
          }
          if (count <= 1) return;
          const d = wrap(i - posRef.current);
          if (Math.abs(d) >= 0.25) {
            e.preventDefault();
            e.stopPropagation();
            targetRef.current = Math.round(posRef.current) + Math.round(d);
            startAnimation();
            scheduleNext();
          } else {
            scheduleNext();
          }
        }}
        className="absolute top-3 left-1/2 aspect-[3/4] rounded-2xl overflow-hidden shadow-xl border border-white/10 will-change-transform select-none cursor-pointer"
        style={{
          width: "var(--card-w)",
          height: "var(--card-h)",
          marginLeft: "calc(-1 * var(--card-w) / 2)",
          transform:
            i === 0
              ? "translate3d(0px, 0px, 0px) scale(1)"
              : `translate3d(${wrap(i) * 220}px, 14px, 0px) scale(0.86)`,
          opacity: i === 0 ? 1 : 0.65,
          zIndex: i === 0 ? 30 : 20 - Math.abs(wrap(i)),
        }}
      >
        <Image
          src={service.image}
          alt={service.title}
          fill
          priority={i === 0}
          className="object-cover pointer-events-none"
          style={{ objectPosition: service.focal || "center" }}
          sizes="(max-width: 640px) 78vw, 420px"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-[#200306]/95 via-black/40 to-black/20 pointer-events-none" />

        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 z-10 pointer-events-none">
          <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-black/65 text-white/95 border border-white/15">
            {service.tag || String(i + 1).padStart(2, "0")}
          </span>
          <span className="flex items-center gap-1 text-[10px] font-mono text-white/90 bg-black/45 px-2 py-0.5 rounded-full border border-white/15">
            <Radio className="w-2.5 h-2.5 text-[#F2B8BF]" />
            DEPLOYED
          </span>
        </div>

        <div className="absolute bottom-0 left-0 right-0 z-10 px-8 py-4 text-white sm:p-5">
          <h3 className="font-serif font-bold text-lg sm:text-xl text-white leading-tight">
            {service.title}
          </h3>

          <div
            ref={(el) => {
              detailsRefs.current[i] = el;
            }}
            style={{
              opacity: i === 0 ? 1 : 0,
              pointerEvents: i === 0 ? "auto" : "none",
            }}
          >
            <p className="text-xs text-neutral-200 line-clamp-2 font-sans leading-relaxed mt-1.5">
              {service.short} Ex-servicemen led perimeter protection and strict verification.
            </p>

            <a
              href="#contact"
              onClick={(e) => {
                if (swallowClickRef.current) {
                  e.preventDefault();
                  e.stopPropagation();
                  return;
                }
                e.stopPropagation();
              }}
              className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-white hover:underline mt-2.5"
            >
              Book Unit Assessment
              <ArrowUpRight className="w-3.5 h-3.5 text-[#F2B8BF]" />
            </a>
          </div>
        </div>
      </div>
    ))}

  </div>

  {count > 1 && (
    <div className="pointer-events-none absolute inset-0 z-50">
      <button
        type="button"
        onPointerDown={(e) => e.stopPropagation()}
        onClick={prevSlide}
        aria-label="Previous service"
        className="group pointer-events-auto absolute left-0 top-1/2 flex h-11 w-11 -translate-x-[13px] -translate-y-1/2 cursor-pointer items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3D0A12]"
      >
        <span className="flex h-7 w-7 -translate-x-2 items-center justify-center rounded-full bg-[#3D0A12]/90 text-white ring-1 ring-white/25 shadow-lg transition-colors group-hover:bg-[#4D0D17]">
          <ChevronLeft aria-hidden="true" className="h-5 w-5" />
        </span>
      </button>

      <button
        type="button"
        onPointerDown={(e) => e.stopPropagation()}
        onClick={nextSlide}
        aria-label="Next service"
        className="group pointer-events-auto absolute right-0 top-1/2 flex h-11 w-11 translate-x-[13px] -translate-y-1/2 cursor-pointer items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3D0A12]"
      >
        <span className="flex h-7 w-7 translate-x-2 items-center justify-center rounded-full bg-[#3D0A12]/90 text-white ring-1 ring-white/25 shadow-lg transition-colors group-hover:bg-[#4D0D17]">
          <ChevronRight aria-hidden="true" className="h-5 w-5" />
        </span>
      </button>
    </div>
  )}

  {count > 1 && (
    <div
      className="mt-4 flex items-center justify-center gap-2"
      role="tablist"
      aria-label="Services Pagination"
    >
      {FEATURED_SERVICES.map((service, i) => {
        const isDotActive = safeActiveIdx === i;
        return (
        <button
          key={service.slug}
          type="button"
          role="tab"
          aria-selected={isDotActive}
          aria-label={`Go to ${service.title}`}
          onClick={() => {
            const currentActive = (((Math.round(posRef.current) % count) + count) % count);
            const diff = getShortestStep(i, currentActive);
            targetRef.current = Math.round(posRef.current) + diff;
            startAnimation();
            scheduleNext();
          }}
          className={cn(
            "h-1.5 rounded-full transition-all duration-300 cursor-pointer p-0 border-0 outline-none focus-visible:ring-2 focus-visible:ring-[#3D0A12]",
            isDotActive
              ? "w-[18px] bg-[#3D0A12]"
              : "w-1.5 bg-[#3D0A12]/25 hover:bg-[#3D0A12]/40"
          )}
        />
        );
      })}
    </div>
  )}
</div>

        {/* ── Compact "Also" Strip ── */}
        {/* <Reveal delay={0.1} className="mt-8 pt-6 border-t border-neutral-200/80">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-500 font-semibold mr-1">
              Also Covering:
            </span>
            {ALSO_SERVICES.map((s) => (
              <a
                key={s.slug}
                href="#contact"
                className="px-2.5 py-1 text-xs font-medium text-neutral-700 bg-white border border-neutral-200/80 rounded hover:border-[#540B13] hover:text-[#540B13] transition-colors shadow-2xs"
              >
                {s.title}
              </a>
            ))}
          </div>
        </Reveal> */}
      </div>
    </section>
  );
}

