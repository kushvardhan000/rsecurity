"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import { SectionHeader } from "../ui/SectionHeader";
import { AWARDS } from "@/src/data/awards";
import { useLightbox, LightboxItem } from "../ui/Lightbox";
import { ChevronLeft, ChevronRight, Pause, Play, Star } from "lucide-react";
import { useReducedMotion } from "motion/react";

// Safe looping buffer
const extendedAwards =
  AWARDS.length < 16
    ? [...AWARDS, ...AWARDS, ...AWARDS, ...AWARDS].slice(0, Math.max(16, AWARDS.length * 4))
    : AWARDS;

export function Awards() {
  const containerRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);
  const captionsRef = useRef<(HTMLElement | null)[]>([]);

  const [isPlaying, setIsPlaying] = useState(true);
  const isPlayingRef = useRef(true);
  const reduceMotion = useReducedMotion();

  const viewportRef = useRef({ width: 1024, height: 768 });
  const isVisibleRef = useRef(true);

  const cardDimensions = useRef({ w: 0, h: 0 });
  const stylesCache = useRef<{ [key: number]: string }>({});

  // Smooth spring physics state
  const physics = useRef({
    targetPos: 0,
    currentPos: 0,
    isDragging: false,
    dragged: false,
    startX: 0,
    startPos: 0,
    lastTime: 0,
    velocity: 0,
  });

  const frameRef = useRef<number | null>(null);

  const lightboxItems: LightboxItem[] = extendedAwards.map((a) => ({
    image: a.image,
    imageAlt: a.imageAlt,
    title: a.title,
    meta: a.year,
    caption: a.presentedBy,
  }));

  const { open: openLightbox, Lightbox } = useLightbox(lightboxItems);

  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const onResize = () => {
      viewportRef.current.width = window.innerWidth;
      viewportRef.current.height = window.innerHeight;
    };
    onResize();
    window.addEventListener("resize", onResize, { passive: true });

    const onVisibilityChange = () => {
      isVisibleRef.current = document.visibilityState === "visible";
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = entry.isIntersecting && document.visibilityState === "visible";
      },
      { threshold: 0.1 }
    );
    if (containerRef.current) observer.observe(containerRef.current);

    let ro: ResizeObserver | null = null;
    const measure = () => {
      const firstCard = itemsRef.current[0];
      if (firstCard) {
        ro = new ResizeObserver(() => {
          cardDimensions.current.w = firstCard.offsetWidth;
          cardDimensions.current.h = firstCard.offsetHeight;
        });
        ro.observe(firstCard);
      }
    };
    // Let layout flush first
    setTimeout(measure, 50);

    return () => {
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      observer.disconnect();
      if (ro) ro.disconnect();
    };
  }, []);

  // 60FPS Arc/Fanning Physics loop
  useEffect(() => {
    const loop = (time: number) => {
      frameRef.current = requestAnimationFrame(loop);

      if (!isVisibleRef.current) {
        physics.current.lastTime = time;
        return;
      }

      const dt = physics.current.lastTime ? Math.min(0.05, Math.max(0.001, (time - physics.current.lastTime) / 1000)) : 0.016;
      physics.current.lastTime = time;

      // Autoplay drift
      if (isPlayingRef.current && !physics.current.isDragging && !reduceMotion) {
        physics.current.targetPos += 0.35 * dt;
      }

      // Smooth lerp tracking
      if (!physics.current.isDragging) {
        const diff = physics.current.targetPos - physics.current.currentPos;
        if (Math.abs(diff) < 0.0005) {
          physics.current.currentPos = physics.current.targetPos;
        } else {
          physics.current.currentPos += diff * (reduceMotion ? 1 : (1 - Math.exp(-dt * 7)));
        }
      }

      const N = extendedAwards.length;
      const vW = viewportRef.current.width;

      const w = cardDimensions.current.w || (vW >= 1280 ? 260 : vW >= 1024 ? 240 : vW >= 768 ? 230 : vW >= 480 ? 220 : 210);
      const h = cardDimensions.current.h || w * (14 / 9);

      const GAP = vW >= 1024 ? 14 : vW >= 640 ? 12 : 10;

      // Card projected extent calculation
      const calcExtent = (k: number) => {
        const absExt = k;
        // The instruction: anchor values for scale, rotateY, etc. keep the old math
        const scale = Math.max(0.72, 1 - absExt * 0.07);
        const tiltY = Math.min(absExt, 2) * -7;
        // reduce rotateZ from 6 to max 3deg
        const tiltZ = Math.min(absExt, 2.5) * (vW < 640 ? 2.25 : 3);

        // Use absolute values for calculating width extents properly regardless of sign
        const radY = Math.abs(tiltY) * Math.PI / 180;
        const radZ = Math.abs(tiltZ) * Math.PI / 180;

        const ext = (w * scale * Math.cos(radY) / 2) * Math.cos(radZ) + (h * scale / 2) * Math.sin(radZ);
        const perspectiveFactor = 1 + (absExt * 0.06);
        return ext * perspectiveFactor;
      };

      const anchorX: number[] = [0];
      for (let k = 1; k <= 5; k++) {
        anchorX[k] = anchorX[k - 1] + calcExtent(k - 1) + calcExtent(k) + GAP;
      }

      itemsRef.current.forEach((el, i) => {
        if (!el) return;

        const offset = (((i - physics.current.currentPos + N / 2) % N) + N) % N - N / 2;
        const abs = Math.abs(offset);
        const sign = offset < 0 ? -1 : 1;

        // Cull distant cards
        if (abs > 4.5) {
          if (el.style.visibility !== "hidden") {
            el.style.visibility = "hidden";
            el.style.pointerEvents = "none";
          }
          return;
        }

        const k = Math.floor(abs);
        const frac = abs - k;

        let exactX = 0;
        if (k >= 5) {
          exactX = anchorX[5];
        } else {
          exactX = anchorX[k] * (1 - frac) + anchorX[k + 1] * frac;
        }

        const x = sign * exactX;

        // Gentle downward parabolic dip on lateral cards
        const y = Math.pow(abs, 1.4) * (vW < 640 ? 12 : 22);

        // Subtle 3D Y yaw and organic Z tilt
        const tiltZ = sign * Math.min(abs, 2.5) * (vW < 640 ? 2.25 : 3);
        const tiltY = sign * Math.min(abs, 2) * -7;
        const scale = Math.max(0.72, 1 - abs * 0.07);

        // Soft fading on edges
        const opacity = Math.max(0, 1 - Math.max(0, abs - 1.8) * 0.45);
        const zIndex = Math.round(50 - abs * 10);
        const visibility = "visible";
        const pointerEvents = abs < 0.6 ? "auto" : "none";

        const cacheKey = `${x.toFixed(1)}_${y.toFixed(1)}_${tiltZ.toFixed(2)}_${tiltY.toFixed(2)}_${scale.toFixed(3)}_${opacity.toFixed(3)}_${zIndex}_${visibility}_${pointerEvents}`;

        if (stylesCache.current[i] !== cacheKey) {
          stylesCache.current[i] = cacheKey;
          el.style.zIndex = zIndex.toString();
          el.style.opacity = opacity.toFixed(3);
          el.style.pointerEvents = pointerEvents;
          if (el.style.visibility !== visibility) el.style.visibility = visibility;
          el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0px) rotateZ(${tiltZ.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg) scale(${scale.toFixed(3)})`;

          el.classList.toggle("caption-active", abs < 0.45);
        }
      });
    };

    frameRef.current = requestAnimationFrame(loop);
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [reduceMotion]);

  // Touch & Mouse Drag handlers
  const onPointerDown = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest("button") || reduceMotion) return;
    physics.current.isDragging = true;
    physics.current.dragged = false;
    physics.current.startX = e.clientX;
    physics.current.startPos = physics.current.currentPos;
    physics.current.targetPos = physics.current.currentPos;

    setIsPlaying(false);
    containerRef.current?.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!physics.current.isDragging) return;
    const dx = e.clientX - physics.current.startX;
    if (Math.abs(dx) > 6) {
      physics.current.dragged = true;
    }
    const dragSensitivity = viewportRef.current.width < 640 ? 170 : 260;
    physics.current.currentPos = physics.current.startPos - dx / dragSensitivity;
    physics.current.targetPos = physics.current.currentPos;
  };

  const onPointerUp = (e: React.PointerEvent) => {
    if (!physics.current.isDragging) return;
    physics.current.isDragging = false;
    containerRef.current?.releasePointerCapture(e.pointerId);
    physics.current.targetPos = Math.round(physics.current.currentPos);
  };

  const handleCardClick = (e: React.MouseEvent, index: number) => {
    if (physics.current.dragged) {
      e.stopPropagation();
      e.preventDefault();
      return;
    }
    openLightbox(index);
  };

  const moveNext = useCallback(() => {
    setIsPlaying(false);
    physics.current.targetPos = Math.round(physics.current.targetPos) + 1;
  }, []);

  const movePrev = useCallback(() => {
    setIsPlaying(false);
    physics.current.targetPos = Math.round(physics.current.targetPos) - 1;
  }, []);

  const togglePlay = useCallback(() => {
    setIsPlaying((prev) => !prev);
  }, []);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      moveNext();
    }
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      movePrev();
    }
  };

  return (
    <section
      id="awards"
      data-tone="light"
      className="relative isolate w-full bg-[#f5f2eba6] py-8 sm:py-12 md:py-18 overflow-hidden border-y border-[#DDD7CD] shadow-[inset_0_4px_16px_rgba(0,0,0,0.025),inset_0_-4px_16px_rgba(0,0,0,0.025)]"
    >
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center mb-4 sm:mb-6 relative z-20">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#7A1426]/5 border border-[#7A1426]/10 mb-4 shadow-sm">
          <Star className="w-3.5 h-3.5 text-[#7A1426] fill-[#7A1426]" />
          <span className="text-[10px] font-bold tracking-[0.18em] uppercase text-[#7A1426]">
            30+ Years of Distinguished Service
          </span>
        </div>

        <SectionHeader
          title="Recognised at the"
          accentWord="highest levels."
        />

        <p className="mt-2 text-xs sm:text-sm md:text-base text-neutral-600 max-w-xl mx-auto leading-relaxed">
          Honoured by state governments, industry leaders, and national security institutions for unyielding discipline, vigilance, and field execution.
        </p>
      </div>

      <div
        ref={containerRef}
        className="relative w-full h-[400px] xs:h-[430px] sm:h-[470px] md:h-[500px] max-w-[1300px] mx-auto flex items-center justify-center touch-pan-y cursor-grab active:cursor-grabbing outline-none select-none [perspective:1200px]"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        tabIndex={0}
        onKeyDown={onKeyDown}
        aria-label="Awards Carousel. Drag or use arrow keys to navigate."
      >
        <div className="relative w-full h-full flex items-center justify-center [transform-style:preserve-3d]">
          {extendedAwards.map((award, i) => (
            <div
              key={`${award.id}-${i}`}
              ref={(el) => {
                itemsRef.current[i] = el;
              }}
              className="absolute w-[210px] xs:w-[220px] sm:w-[230px] md:w-[240px] xl:w-[260px] aspect-[9/14] rounded-[24px] sm:rounded-[28px] overflow-hidden will-change-transform shadow-[0_18px_40px_-10px_rgba(0,0,0,0.28)] bg-neutral-900 border border-black/5 [&.caption-active_.card-caption]:opacity-100 [&.caption-active_.card-caption]:translate-y-0 [&.caption-active_.card-caption]:scale-100 [&.caption-active_.card-caption]:pointer-events-auto"
              style={{
                opacity: 0,
                transform: "translate3d(0, 0, 0)",
              }}
            >
              <div
                className="absolute inset-0 w-full h-full cursor-pointer group"
                onClick={(e) => handleCardClick(e, i)}
                aria-label={`View ${award.title}`}
              >
                <Image
                  src={award.image}
                  alt={award.imageAlt}
                  fill
                  className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                  sizes="(max-width: 640px) 220px, 260px"
                  priority={i < 3}
                />
                <div className="absolute inset-x-0 bottom-0 h-[65%] bg-gradient-to-t from-black/85 via-black/40 to-transparent pointer-events-none" />
                <div className="absolute inset-0 rounded-[24px] sm:rounded-[28px] ring-1 ring-inset ring-white/20 pointer-events-none" />
              </div>

              <div
                ref={(el) => {
                  captionsRef.current[i] = el;
                }}
                className="card-caption absolute inset-x-0 bottom-0 z-10 p-4 sm:p-5 flex flex-col justify-end transition-all duration-300 ease-out opacity-0 translate-y-2 scale-[0.96] pointer-events-none"
              >
                <span className="inline-block w-fit px-2.5 py-0.5 bg-white/20 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider rounded-full mb-1.5 border border-white/25">
                  {award.year}
                </span>
                <h3 className="font-serif text-base sm:text-lg font-bold text-white leading-tight drop-shadow-sm mb-1">
                  {award.title}
                </h3>
                <p className="text-[11px] sm:text-xs font-normal text-white/80 line-clamp-2 leading-relaxed">
                  {award.presentedBy}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 sm:mt-6 flex items-center justify-center gap-3 relative z-30">
        <div className="flex items-center gap-2 bg-white/90 backdrop-blur-md rounded-full px-4 py-2 border border-[#E3E1DE] shadow-[0_4px_16px_rgba(0,0,0,0.06)]">
          <button
            onClick={movePrev}
            className="w-8 h-8 flex items-center justify-center rounded-full text-neutral-700 hover:bg-neutral-100 transition-colors active:scale-95"
            aria-label="Previous Award"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            onClick={togglePlay}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-[#7A1426] text-white hover:bg-[#600e1c] transition-transform active:scale-95 shadow-sm"
            aria-label={isPlaying ? "Pause Carousel" : "Play Carousel"}
          >
            {isPlaying ? (
              <Pause className="w-3.5 h-3.5 fill-current" />
            ) : (
              <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
            )}
          </button>

          <button
            onClick={moveNext}
            className="w-8 h-8 flex items-center justify-center rounded-full text-neutral-700 hover:bg-neutral-100 transition-colors active:scale-95"
            aria-label="Next Award"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {Lightbox}
    </section>
  );
}