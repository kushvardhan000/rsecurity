"use client";

import { Fragment, useEffect, useRef, useState, useCallback } from "react";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut } from "lucide-react";
import { useLenis } from "@/src/lib/lenis";
import { cn } from "@/src/lib/cn";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
const SWIPE_THRESHOLD = 50;

export type LightboxItem = {
  image: string;
  imageAlt: string;
  title: string;
  meta?: string;
  caption?: string;
};

type LightboxProps = {
  items: readonly LightboxItem[];
  index: number | null;
  onNavigate: (index: number) => void;
  onClose: () => void;
};

export function Lightbox({ items, index, onNavigate, onClose }: LightboxProps) {
  const open = index !== null && items.length > 0;
  const item = open ? items[index] : null;
  const lenis = useLenis();

  const [zoom, setZoom] = useState(false);
  const touchStartY = useRef<number | null>(null);
  const touchStartX = useRef<number | null>(null);
  const previousFocus = useRef<HTMLElement | null>(null);

  // Focus trap & keyboard nav
  useEffect(() => {
    if (!open) return;

    previousFocus.current = document.activeElement as HTMLElement;

    // Use counter-based stop/start from Lenis context
    // Do NOT set root.style.overflow = "hidden" — it breaks Lenis
    lenis?.stop();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") {
        onNavigate((index - 1 + items.length) % items.length);
      }
      if (e.key === "ArrowRight") {
        onNavigate((index + 1) % items.length);
      }
    };
    document.addEventListener("keydown", onKey);

    return () => {
      lenis?.start();
      document.removeEventListener("keydown", onKey);
      previousFocus.current?.focus();
    };
  }, [open, index, items.length, onNavigate, onClose, lenis]);

  // Preload neighbors
  useEffect(() => {
    if (!open || index === null) return;
    const prev = (index - 1 + items.length) % items.length;
    const next = (index + 1) % items.length;
    const img1 = new window.Image();
    const img2 = new window.Image();
    img1.src = items[prev].image;
    img2.src = items[next].image;
  }, [open, index, items]);

  const onTouchStart = (e: React.TouchEvent) => {
    if (zoom) return; // Don't swipe while zoomed
    touchStartY.current = e.touches[0].clientY;
    touchStartX.current = e.touches[0].clientX;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (zoom || touchStartY.current === null || touchStartX.current === null || index === null) return;
    const dy = e.changedTouches[0].clientY - touchStartY.current;
    const dx = e.changedTouches[0].clientX - touchStartX.current;

    // Swipe down to close
    if (dy > SWIPE_THRESHOLD && Math.abs(dy) > Math.abs(dx)) {
      onClose();
    }
    // Swipe left/right
    else if (Math.abs(dx) > SWIPE_THRESHOLD && Math.abs(dx) > Math.abs(dy)) {
      if (dx > 0) {
         onNavigate((index - 1 + items.length) % items.length);
      } else {
         onNavigate((index + 1) % items.length);
      }
    }
    touchStartY.current = null;
    touchStartX.current = null;
  };

  const toggleZoom = () => setZoom((z) => !z);

  return (
    <AnimatePresence>
      {open && item && (
        <Fragment key="lightbox">
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-[100] bg-maroon-950/95 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Lightbox Shell */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={item.title}
            className="fixed inset-0 z-[110] flex flex-col pointer-events-none"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.4, ease: EASE }}
          >
             {/* Header */}
             <div className="absolute top-0 inset-x-0 p-4 sm:p-6 flex justify-between items-center bg-gradient-to-b from-maroon-950/50 to-transparent pointer-events-auto z-10">
                <div className="text-white/80 font-medium tracking-[0.1em] text-xs uppercase px-2">
                   {String(index + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
                </div>
                <div className="flex gap-2">
                   <button
                     onClick={toggleZoom}
                     className="grid h-11 w-11 place-items-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                     aria-label="Toggle zoom"
                   >
                     {zoom ? <ZoomOut className="w-5 h-5"/> : <ZoomIn className="w-5 h-5"/>}
                   </button>
                   <button
                     onClick={onClose}
                     aria-label="Close"
                     className="grid h-11 w-11 place-items-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                   >
                     <X className="w-5 h-5" aria-hidden="true" />
                   </button>
                </div>
             </div>

{/* Content Area */}
              <div
                className={cn("flex-1 relative w-full h-full pointer-events-auto touch-none select-none overflow-hidden", zoom && "cursor-zoom-out overflow-auto")}
                onTouchStart={onTouchStart}
                onTouchEnd={onTouchEnd}
                onDoubleClick={toggleZoom}
                onClick={(e) => {
                   if (e.target === e.currentTarget) onClose();
                }}
                data-lenis-prevent
              >
                <div
                   className={cn("absolute inset-0 flex items-center justify-center p-4 sm:p-12 transition-transform duration-500", zoom && "scale-150 sm:scale-[2]")}
                   onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
                >
                   <motion.div
                     layoutId={`lightbox-img-${item.image}`}
                     className="relative w-full h-full"
                   >
                      <Image
                        src={item.image}
                        alt={item.imageAlt}
                        fill
                        className="object-contain"
                        sizes="100%"
                        priority
                      />
                   </motion.div>
                </div>

                {/* Left/Right Controls */}
                {!zoom && items.length > 1 && (
                  <>
                    <button
                      onClick={(e) => { e.stopPropagation(); onNavigate((index - 1 + items.length) % items.length); }}
                      className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 grid h-12 w-12 sm:h-14 sm:w-14 place-items-center rounded-full bg-white/5 hover:bg-white/10 backdrop-blur-sm text-white transition-colors"
                      aria-label="Previous"
                    >
                      <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8" />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); onNavigate((index + 1) % items.length); }}
                      className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 grid h-12 w-12 sm:h-14 sm:w-14 place-items-center rounded-full bg-white/5 hover:bg-white/10 backdrop-blur-sm text-white transition-colors"
                      aria-label="Next"
                    >
                      <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8" />
                    </button>
                  </>
                )}
             </div>

             {/* Footer Caption */}
             <div className="absolute bottom-0 inset-x-0 p-6 sm:p-8 bg-gradient-to-t from-maroon-950/80 to-transparent pointer-events-auto">
                <div className="max-w-3xl mx-auto text-center">
                   <h3 className="display text-xl sm:text-2xl text-white">{item.title}</h3>
                   {item.meta && <p className="text-accent mt-2 text-xs font-bold tracking-wider uppercase">{item.meta}</p>}
                   {item.caption && <p className="text-white/80 mt-3 text-sm sm:text-base leading-relaxed">{item.caption}</p>}
                </div>
             </div>
          </motion.div>
        </Fragment>
      )}
    </AnimatePresence>
  );
}

export function useLightbox(items: readonly LightboxItem[]) {
  const [index, setIndex] = useState<number | null>(null);

  const open = useCallback((i: number) => setIndex(i), []);
  const close = useCallback(() => setIndex(null), []);
  const navigate = useCallback((i: number) => setIndex(i), []);

  const element = (
    <Lightbox
      items={items}
      index={index}
      onNavigate={navigate}
      onClose={close}
    />
  );

  return { open, close, Lightbox: element };
}
