"use client";

import { Fragment, useEffect, useRef, useState, ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { X } from "lucide-react";
import { cn } from "@/src/lib/cn";
import { useLenis } from "@/src/lib/lenis";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
const SWIPE_DOWN_PX = 60;

type SheetProps = {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  /** Pass a custom content completely replacing the internal padding logic if needed */
  asChild?: boolean;
};

export function Sheet({ isOpen, onClose, title = "Dialog", children, asChild }: SheetProps) {
  const [isDesktop, setIsDesktop] = useState(false);
  const reduce = useReducedMotion();
  const lenis = useLenis();

  const panelRef = useRef<HTMLDivElement>(null);
  const touchY = useRef<number | null>(null);
  const previousFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // Lock overlay + lenis + focus
  useEffect(() => {
    if (!isOpen) return;

    // save focus
    previousFocus.current = document.activeElement as HTMLElement;

    // Use counter-based stop/start from Lenis context
    // Do NOT set root.style.overflow = "hidden" — it breaks Lenis
    lenis?.stop();

    // trap focus
    const container = panelRef.current;
    if (container) {
      const focusables = container.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      const first = focusables[0];
      first?.focus();

      const handleKey = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          onClose();
          return;
        }
        if (e.key === "Tab" && focusables.length > 0) {
          const list = Array.from(focusables);
          const i = list.indexOf(document.activeElement as HTMLElement);
          if (e.shiftKey && i <= 0) {
            e.preventDefault();
            list[list.length - 1].focus();
          } else if (!e.shiftKey && i === list.length - 1) {
            e.preventDefault();
            list[0].focus();
          }
        }
      };
      document.addEventListener("keydown", handleKey);

      return () => {
        lenis?.start();
        document.removeEventListener("keydown", handleKey);
        previousFocus.current?.focus();
      };
    }
  }, [isOpen, lenis, onClose]);

  const onTouchStart = (e: React.TouchEvent) => {
    touchY.current = e.touches[0].clientY;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchY.current === null || !isOpen) return;
    if (e.changedTouches[0].clientY - touchY.current > SWIPE_DOWN_PX && !isDesktop) {
      onClose();
    }
    touchY.current = null;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Fragment>
          {/* Scrim overlay */}
          <motion.div
            className="fixed inset-0 z-[80] bg-maroon-950/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Panel */}
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label={title}
            className={cn(
              "fixed z-[90] flex w-full flex-col overflow-hidden bg-white shadow-lift",
              isDesktop
                ? "inset-y-0 right-0 max-w-[max(min(440px,92vw),auto)]"
                : "inset-x-0 bottom-0 rounded-t-sharp max-h-[88dvh]"
            )}
            initial={{
              x: isDesktop ? "100%" : 0,
              y: isDesktop ? 0 : "100%",
            }}
            animate={{ x: 0, y: 0 }}
            exit={{
              x: isDesktop ? "100%" : 0,
              y: isDesktop ? 0 : "100%",
            }}
            transition={{ duration: reduce ? 0 : 0.5, ease: EASE }}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            {/* Drag handle */}
            {!isDesktop && (
              <div
                className="flex justify-center pt-3 pb-1 shrink-0 bg-white"
                aria-hidden="true"
              >
                <span className="h-1 w-10 rounded-full bg-grey-soft" />
              </div>
            )}

            {!asChild && (
              <header className="flex items-center justify-between px-6 py-4 border-b border-grey-soft shrink-0">
                <h2 className="display text-xl font-medium text-grey-dark truncate">
                  {title}
                </h2>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close"
                  className="grid h-11 w-11 shrink-0 place-items-center rounded-full transition-colors hover:bg-grey-soft focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
                >
                  <X className="h-5 w-5" aria-hidden="true" />
                </button>
              </header>
            )}

            <div className={cn("overflow-y-auto flex-1 overscroll-contain", !asChild && "px-6 py-6 pb-12")} data-lenis-prevent>
              {children}
            </div>
          </motion.div>
        </Fragment>
      )}
    </AnimatePresence>
  );
}
