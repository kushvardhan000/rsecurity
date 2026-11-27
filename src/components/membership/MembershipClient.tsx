"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Eye, ShieldCheck } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useLenis } from "@/src/lib/lenis";
import { cn } from "@/src/lib/cn";
import { DragMarquee } from "@/src/components/ui/DragMarquee";

export interface MembershipLogoData {
  id: string;
  caption: string;
  image: string;
}

export interface MembershipData {
  id: string;
  name: string;
  type: string;
  slug: string;
  image: string;
  width?: number;
  height?: number;
}

interface MembershipClientProps {
  memberships: MembershipData[];
  logos?: MembershipLogoData[];
  variant?: "default" | "editorial";
}

function LocalLightbox({
  items,
  index,
  onClose,
  onNavigate,
  reducedMotion,
}: {
  items: MembershipData[];
  index: number | null;
  onClose: () => void;
  onNavigate: (dir: number) => void;
  reducedMotion: boolean;
}) {
  const open = index !== null;
  const item = open ? items[index] : null;
  const lenis = useLenis();
  const [zoomed, setZoomed] = useState(false);
  const boundsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const prevOver = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    if (lenis && typeof lenis.stop === "function") lenis.stop();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onNavigate(-1);
      if (e.key === "ArrowRight") onNavigate(1);
    };
    window.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = prevOver;
      if (lenis && typeof lenis.start === "function") lenis.start();
      window.removeEventListener("keydown", onKey);
      setZoomed(false);
    };
  }, [open, lenis, onClose, onNavigate]);

  return (
    <AnimatePresence initial={!reducedMotion}>
      {open && item && (
        <motion.div
          initial={reducedMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={reducedMotion ? undefined : { opacity: 0 }}
          transition={{ duration: reducedMotion ? 0 : 0.25 }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/90 backdrop-blur-md touch-none"
          onClick={onClose}
        >
          {/* Top Control Bar */}
          <div className="absolute top-0 inset-x-0 p-4 sm:p-6 flex items-center justify-between z-20 text-white">
            <div className="font-mono text-xs sm:text-sm tracking-widest text-neutral-400">
              {String(index + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              className="flex items-center justify-center h-10 px-5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors tracking-widest text-xs font-mono uppercase cursor-pointer"
              aria-label="Close lightbox"
            >
              Close ✕
            </button>
          </div>

          {/* Bounds / Image Viewport */}
          <div
            ref={boundsRef}
            className="fixed inset-0 z-0 flex items-center justify-center px-4 py-16 pointer-events-none"
          >
            <motion.div
              drag={zoomed ? true : "x"}
              dragConstraints={zoomed ? boundsRef : { left: 0, right: 0 }}
              dragElastic={zoomed ? 0.1 : 0.6}
              onDragEnd={(_, info) => {
                if (!zoomed) {
                  if (info.offset.x < -50) onNavigate(1);
                  else if (info.offset.x > 50) onNavigate(-1);
                }
              }}
              onClick={(e) => {
                e.stopPropagation();
                setZoomed(!zoomed);
              }}
              className={cn(
                "relative pointer-events-auto shadow-2xl",
                zoomed ? "cursor-zoom-out" : "cursor-zoom-in"
              )}
              style={{
                width: item.width || 800,
                height: item.height || 1000,
                maxWidth: "88vw",
                maxHeight: "80vh",
              }}
              animate={{ scale: zoomed ? 1.7 : 1 }}
              transition={
                reducedMotion
                  ? { duration: 0 }
                  : { type: "spring", damping: 25, stiffness: 220 }
              }
            >
              <Image
                src={item.image}
                alt={item.name}
                fill
                className="object-contain"
                sizes="100%"
                priority
              />
            </motion.div>
          </div>

          {/* Bottom Title */}
          <div className="absolute bottom-0 inset-x-0 p-5 pb-8 pointer-events-none flex flex-col items-center bg-gradient-to-t from-black/80 to-transparent z-10 text-center text-white">
            <h3 className="font-serif text-lg sm:text-xl font-bold tracking-wide">
              {item.name}
            </h3>
            {item.type && (
              <p className="text-[11px] uppercase tracking-[0.2em] font-mono text-amber-300/80 mt-1">
                {item.type}
              </p>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function MembershipClient({
  memberships,
  logos = [],
  variant = "default",
}: MembershipClientProps) {
  const editorial = variant === "editorial";
  const prefersReducedMotion = useReducedMotion();
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const handleImageError = (id: string) => {
    setFailedImages((prev) => ({ ...prev, [id]: true }));
  };

  const updateScrollState = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollPrev(scrollLeft > 8);
    setCanScrollNext(scrollLeft < scrollWidth - clientWidth - 8);
  }, []);

  const scrollByAmount = useCallback((direction: number) => {
    const el = scrollRef.current;
    if (!el) return;
    const card = el.querySelector('[role="button"]') as HTMLElement | null;
    const gap = parseInt(getComputedStyle(el).gap) || 4;
    const step = card ? card.offsetWidth + gap : 300;
    el.scrollBy({ left: direction * step, behavior: "smooth" });
  }, []);

  const navigateLightbox = (dir: number) => {
    if (openIndex === null) return;
    setOpenIndex((openIndex + dir + memberships.length) % memberships.length);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateScrollState, { passive: true });
    updateScrollState();
    return () => el.removeEventListener("scroll", updateScrollState);
  }, [updateScrollState]);

  useEffect(() => {
    updateScrollState();
  }, [memberships.length, updateScrollState]);

  return (
    <section
      id="membership"
      data-tone="light"
      className={cn(
        "relative border-t border-neutral-200/80 overflow-hidden",
        editorial ? "bg-[var(--color-paper)] py-10 sm:py-14" : "bg-[#FAF9F6] py-14 sm:py-20"
      )}
    >
      <div className="mx-auto w-full max-w-[1360px] px-4 sm:px-6 lg:px-10 flex flex-col">
        {/* Header Block */}
        <div
          className={cn(
            "flex flex-col justify-between gap-4 sm:flex-row sm:items-end",
            editorial ? "mb-6 gap-3 sm:mb-8" : "mb-8 sm:mb-12"
          )}
        >
          <div>
            <div
              className={cn(
                "mb-2.5 inline-flex items-center gap-2 rounded-sm px-2.5 py-1 text-[11px] font-mono font-bold uppercase tracking-[0.2em] text-[#540B13]",
                editorial && "mb-2 bg-[#540B13]/[0.07] text-[9px] tracking-[0.17em]"
              )}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              {editorial ? "Trust & credentials" : "Accredited Authorities"}
            </div>
            <h2
              className={cn(
                "font-serif tracking-tight text-[#1C1917]",
                editorial
                  ? "text-[clamp(1.9rem,4vw,3rem)] leading-[1.05]"
                  : "text-4xl sm:text-5xl lg:text-6xl"
              )}
            >
              {editorial ? (
                <>
                  Certificates &{" "}
                  <span className="font-normal italic text-[#540B13]">
                    affiliations.
                  </span>
                </>
              ) : (
                <>
                  Memberships &{" "}
                  <span className="font-normal italic text-[#540B13]">
                    affiliations.
                  </span>
                </>
              )}
            </h2>
          </div>
        </div>

        {/* ── Certificates Gallery ── */}
        <div className="relative w-full">
          {/* Scrollable Container (Mobile & Large viewports) */}
          <div
            ref={scrollRef}
            className={cn(
              "flex gap-4 pb-4 pt-1 snap-x snap-mandatory overflow-x-auto hide-scrollbar focus-visible:outline-none sm:gap-6",
              editorial && "gap-3 sm:gap-4",
              // On extra large screens, if items are few, center or display them cleanly
              memberships.length <= 4 && "lg:grid lg:grid-cols-4 lg:overflow-visible"
            )}
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {memberships.map((m, i) => (
              <div
                key={m.id}
                onClick={() => setOpenIndex(i)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setOpenIndex(i);
                  }
                }}
                tabIndex={0}
                role="button"
                aria-label={`View ${m.name} certificate`}
                className={cn(
                  "group flex shrink-0 snap-center cursor-pointer flex-col items-center transition-transform duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#540B13]",
                  editorial
                    ? "w-[148px] xs:w-[160px] sm:w-[176px] lg:w-[176px] motion-reduce:transform-none motion-reduce:transition-none"
                    : "w-[260px] xs:w-[285px] sm:w-[310px] lg:w-auto"
                )}
              >
                {/* Certificate Frame with Physical Archival Shadow */}
                <div
                  className={cn(
                    "relative aspect-[3/4] w-full border border-neutral-300/80 bg-white p-3 shadow-[0_8px_20px_rgba(0,0,0,0.06)] transition-all duration-300 group-hover:-translate-y-1.5 group-hover:shadow-[0_12px_28px_rgba(84,11,19,0.12)] sm:p-3.5",
                    editorial &&
                      "p-2 shadow-[0_5px_14px_rgba(0,0,0,0.06)] group-hover:shadow-[0_9px_20px_rgba(84,11,19,0.12)] sm:p-2.5 motion-reduce:transform-none motion-reduce:transition-none"
                  )}
                >
                  <div className="relative w-full h-full bg-[#FAF9F6] overflow-hidden flex items-center justify-center">
                    {failedImages[m.id] ? (
                      <div className="p-4 text-center">
                        <span className="font-serif text-sm font-semibold text-neutral-600">
                          {m.name}
                        </span>
                      </div>
                    ) : (
                      <Image
                        src={m.image}
                        alt={m.name}
                        fill
                        className="object-contain p-1"
                        sizes="(max-width: 640px) 280px, 340px"
                        onError={() => handleImageError(m.id)}
                      />
                    )}

                    {/* Hover Inspect Overlay */}
                    <div
                      className={cn(
                        "absolute inset-0 flex items-center justify-center bg-[#540B13]/10 opacity-0 backdrop-blur-2xs transition-opacity duration-300 group-hover:opacity-100",
                        editorial && "motion-reduce:transition-none"
                      )}
                    >
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/95 rounded-full text-xs font-mono font-bold text-[#540B13] uppercase tracking-wider shadow-md">
                        <Eye className="w-3.5 h-3.5" />
                        Click to View
                      </span>
                    </div>
                  </div>
                </div>

                {/* Caption Metadata */}
                <div className={cn("mt-3.5 w-full px-1 text-center", editorial && "mt-2.5")}>
                  <h3
                    className={cn(
                      "line-clamp-1 font-serif font-bold leading-snug text-neutral-900 transition-colors group-hover:text-[#540B13]",
                      editorial ? "text-sm sm:text-[15px]" : "text-base sm:text-lg"
                    )}
                  >
                    {m.name}
                  </h3>
                  <span
                    className={cn(
                      "mt-1 inline-block font-mono text-[11px] font-semibold uppercase tracking-widest text-[#540B13]",
                      editorial && "text-[9px] tracking-[0.13em]"
                    )}
                  >
                    {m.type}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Carousel Arrow Navigation */}
          {memberships.length > 1 && (
            <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-2 pointer-events-none z-20">
              <button
                onClick={() => scrollByAmount(-1)}
                disabled={!canScrollPrev}
                aria-label="Scroll certificates left"
                className={cn(
                  "pointer-events-auto self-center z-30 h-10 w-10 grid place-items-center rounded-full border border-neutral-300 bg-white text-neutral-700 shadow-sm transition-colors transition-transform",
                  !canScrollPrev
                    ? "opacity-40 cursor-not-allowed border-neutral-200 text-neutral-400"
                    : "hover:border-[#540B13] hover:text-[#540B13] hover:shadow-md active:scale-95"
                )}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => scrollByAmount(1)}
                disabled={!canScrollNext}
                aria-label="Scroll certificates right"
                className={cn(
                  "pointer-events-auto self-center z-30 h-10 w-10 grid place-items-center rounded-full border border-neutral-300 bg-white text-neutral-700 shadow-sm transition-colors transition-transform",
                  !canScrollNext
                    ? "opacity-40 cursor-not-allowed border-neutral-200 text-neutral-400"
                    : "hover:border-[#540B13] hover:text-[#540B13] hover:shadow-md active:scale-95"
                )}
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>

        {/* ── Seamless Accredited Association Logos Strip ── */}
        {logos && logos.length > 0 && (
          <div className="mt-12 sm:mt-12 pt-6  w-full flex flex-col items-center">
            {/* Unified Micro Header */}
            <div className="flex items-center justify-center gap-3 mb-6">
              <span className="h-px w-8 bg-neutral-300" />
              <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-neutral-600 font-bold text-center">
                Recognised Industry Bodies
              </span>
              <span className="h-px w-8 bg-neutral-300" />
            </div>

            {/* Desktop: Show all 7 logos at once in a balanced grid */}
            <div className="hidden lg:flex flex-wrap items-center justify-center gap-x-12 gap-y-6 w-full max-w-[1200px]">
              {logos.map((logo) => (
                <div
                  key={logo.id}
                  className="flex flex-col items-center gap-2 group cursor-default"
                >
                  <div className="relative w-30 h-14 flex items-center justify-center   transition-all duration-300 opacity-80 group-hover:opacity-100 group-hover:scale-105">
                    <Image
                      src={logo.image}
                      alt={logo.caption}
                      fill
                      className="object-contain"
                      sizes="120px"
                    />
                  </div>
                  <span className="text-[10px] font-mono tracking-wider uppercase text-neutral-600 group-hover:text-[#540B13] transition-colors">
                    {logo.caption}
                  </span>
                </div>
              ))}
            </div>

            {/* Mobile / Tablet: Smooth Edge-Faded Drag Marquee */}
            <div className="lg:hidden w-full relative">
              <div
                aria-hidden="true"
                className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-[#FAF9F6] to-transparent z-10 pointer-events-none"
              />
              <div
                aria-hidden="true"
                className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-[#FAF9F6] to-transparent z-10 pointer-events-none"
              />

              <DragMarquee speed={28} gap={24} className="w-full py-1" pauseOnHover>
                {logos.map((logo) => (
                  <div
                    key={logo.id}
                    className="w-28 shrink-0 flex flex-col items-center gap-2 justify-center"
                  >
                    <div className="relative w-full h-11 flex items-center justify-center">
                      <Image
                        src={logo.image}
                        alt={logo.caption}
                        fill
                        className="object-contain"
                        sizes="112px"
                      />
                    </div>
                    <span className="text-[10px] font-mono tracking-wider uppercase text-neutral-600 text-center truncate w-full">
                      {logo.caption}
                    </span>
                  </div>
                ))}
              </DragMarquee>
            </div>
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      <LocalLightbox
        items={memberships}
        index={openIndex}
        onClose={() => setOpenIndex(null)}
        onNavigate={navigateLightbox}
        reducedMotion={editorial && Boolean(prefersReducedMotion)}
      />
    </section>
  );
}