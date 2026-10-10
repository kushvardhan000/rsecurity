"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Eye, ShieldCheck } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
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
}

function LocalLightbox({
  items,
  index,
  onClose,
  onNavigate,
}: {
  items: MembershipData[];
  index: number | null;
  onClose: () => void;
  onNavigate: (dir: number) => void;
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
    <AnimatePresence>
      {open && item && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
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
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
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

export function MembershipClient({ memberships, logos = [] }: MembershipClientProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleImageError = (id: string) => {
    setFailedImages((prev) => ({ ...prev, [id]: true }));
  };

  const scrollByAmount = (direction: number) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: direction * 380, behavior: "smooth" });
    }
  };

  const navigateLightbox = (dir: number) => {
    if (openIndex === null) return;
    setOpenIndex((openIndex + dir + memberships.length) % memberships.length);
  };

  return (
    <section
      id="membership"
      data-tone="light"
      className="relative bg-[#FAF9F6] py-14 sm:py-20 border-t border-neutral-200/80 overflow-hidden"
    >
      <div className="mx-auto w-full max-w-[1360px] px-4 sm:px-6 lg:px-10 flex flex-col">
        {/* Header Block */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-sm bg-[#540b1360]/10 text-[#540B13] text-[11px] font-mono tracking-[0.2em] uppercase font-bold mb-2.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              Accredited Authorities
            </div>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-serif text-[#1C1917] tracking-tight">
              Memberships & <span className="text-[#540B13] italic font-normal">affiliations.</span>
            </h2>
          </div>

          {/* Desktop Arrow Controls */}
          {memberships.length > 4 && (
            <div className="hidden sm:flex items-center gap-2">
              <button
                onClick={() => scrollByAmount(-1)}
                className="h-10 w-10 grid place-items-center rounded-md border border-neutral-300 bg-white text-neutral-700 hover:border-[#540B13] hover:text-[#540B13] transition-colors shadow-2xs cursor-pointer active:scale-95"
                aria-label="Scroll certificates left"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => scrollByAmount(1)}
                className="h-10 w-10 grid place-items-center rounded-md border border-neutral-300 bg-white text-neutral-700 hover:border-[#540B13] hover:text-[#540B13] transition-colors shadow-2xs cursor-pointer active:scale-95"
                aria-label="Scroll certificates right"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>

        {/* ── Certificates Gallery ── */}
        <div className="relative w-full">
          {/* Scrollable Container (Mobile & Large viewports) */}
          <div
            ref={scrollRef}
            className={cn(
              "flex gap-4 sm:gap-6 pb-4 pt-1 snap-x snap-mandatory overflow-x-auto hide-scrollbar focus-visible:outline-none",
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
                className="group snap-center shrink-0 w-[260px] xs:w-[285px] sm:w-[310px] lg:w-auto flex flex-col items-center cursor-pointer focus-visible:ring-2 focus-visible:ring-[#540B13] focus-visible:outline-none transition-transform duration-300"
              >
                {/* Certificate Frame with Physical Archival Shadow */}
                <div className="relative w-full aspect-[3/4] p-3 sm:p-3.5 bg-white border border-neutral-300/80 shadow-[0_8px_20px_rgba(0,0,0,0.06)] group-hover:shadow-[0_12px_28px_rgba(84,11,19,0.12)] group-hover:-translate-y-1.5 transition-all duration-300">
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
                    <div className="absolute inset-0 bg-[#540B13]/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-2xs">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/95 rounded-full text-xs font-mono font-bold text-[#540B13] uppercase tracking-wider shadow-md">
                        <Eye className="w-3.5 h-3.5" />
                        Inspect
                      </span>
                    </div>
                  </div>
                </div>

                {/* Caption Metadata */}
                <div className="mt-3.5 text-center px-1 w-full">
                  <h3 className="font-serif font-bold text-base sm:text-lg text-neutral-900 group-hover:text-[#540B13] transition-colors leading-snug line-clamp-1">
                    {m.name}
                  </h3>
                  <span className="inline-block text-[11px] font-mono tracking-widest uppercase text-[#540B13] font-semibold mt-1">
                    {m.type}
                  </span>
                </div>
              </div>
            ))}
          </div>
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
      />
    </section>
  );
}