"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { ChevronDown, ArrowUpRight, Maximize2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { type AwardItem } from "@/src/data/awards";
import { useLightbox, type LightboxItem } from "../ui/Lightbox";
import { cn } from "@/src/lib/cn";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
const BLUR =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 8'%3E%3Crect width='8' height='8' fill='%23E8E8EB'/%3E%3C/svg%3E";

/* ─── Premium Framed Plaque Card ─── */
function Plaque({ award }: { award: AwardItem }) {
  return (
    <div className="relative bg-white shadow-[0_20px_50px_rgba(42,6,12,0.14)] p-3.5 sm:p-5 rounded-md border border-[#2A060C]/10 transition-all duration-300">
      {/* Corner Engravings */}
      <div className="relative border border-[#2A060C]/15 p-2 sm:p-3 bg-[#FAF8F5]">
        <span
          className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-accent/80 -translate-x-1 -translate-y-1 z-10"
          aria-hidden="true"
        />
        <span
          className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-accent/80 translate-x-1 -translate-y-1 z-10"
          aria-hidden="true"
        />
        <span
          className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-accent/80 -translate-x-1 translate-y-1 z-10"
          aria-hidden="true"
        />
        <span
          className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-accent/80 translate-x-1 translate-y-1 z-10"
          aria-hidden="true"
        />

        {/* Dynamic Image Container (object-contain displays whole trophy without crop) */}
        <div className="relative aspect-[4/5] sm:aspect-[1/1] max-h-[380px] sm:max-h-[440px] w-full overflow-hidden rounded-sm bg-[#F3EFEA] group">
          <Image
            src={award.image}
            alt={award.imageAlt}
            fill
            sizes="(max-width: 1024px) 100vw, 480px"
            placeholder="blur"
            blurDataURL={BLUR}
            className="object-contain object-center transition-transform duration-500 ease-out group-hover:scale-102 p-2"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-end p-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 text-[11px] font-bold uppercase tracking-wider text-maroon-950 shadow-md backdrop-blur-sm">
              <Maximize2 className="w-3.5 h-3.5 text-accent" />
              Expand
            </span>
          </div>
        </div>
      </div>

      {/* Engraved Caption */}
      <div className="pt-4 pb-1 px-2 text-center">
        <p
          className="text-maroon-950 text-lg sm:text-xl font-bold leading-tight"
          style={{ fontFamily: "'Newsreader', serif" }}
        >
          {award.title}
        </p>
        <div className="mx-auto my-2.5 h-0.5 w-10 bg-gradient-to-r from-transparent via-accent to-transparent" />
        <p className="text-xs sm:text-sm text-grey-dark/80 font-medium leading-relaxed">
          Presented by <span className="text-maroon-950 font-semibold">{award.presentedBy}</span>
        </p>
        <p className="mt-2 text-[10px] sm:text-[11px] font-bold tracking-[0.2em] uppercase text-accent">
          Honour Year · {award.year}
        </p>
      </div>
    </div>
  );
}

export function AwardsInteractive({ awards }: { awards: AwardItem[] }) {
  const [active, setActive] = useState(0);
  const [openRow, setOpenRow] = useState<number | null>(0);

  const lightboxItems: LightboxItem[] = useMemo(
    () =>
      awards.map((a) => ({
        image: a.image,
        imageAlt: a.imageAlt,
        title: a.title,
        meta: `${a.year} · ${a.presentedBy}`,
      })),
    [awards]
  );
  const { open, Lightbox } = useLightbox(lightboxItems);

  const activeAward = awards[active] || awards[0];

  /* Keyboard Navigation */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = document.activeElement;
      if (!el || !el.closest("#awards")) return;
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActive((a) => (a + 1) % awards.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActive((a) => (a - 1 + awards.length) % awards.length);
      } else if (e.key === "Enter" && el.closest("[data-ledger]")) {
        e.preventDefault();
        open(active);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [awards.length, active, open]);

  return (
    <>
      {/* DESKTOP VIEW (≥1024px) */}
      <div className="hidden lg:grid grid-cols-[1fr_460px] gap-12 xl:gap-16 items-center w-full">
        {/* Ledger List */}
        <div
          data-ledger
          role="listbox"
          aria-label="Awards list"
          tabIndex={0}
          className="relative flex flex-col justify-center outline-none focus-visible:ring-2 focus-visible:ring-accent/40 rounded-sm pr-2"
        >
          {awards.map((award, i) => {
            const isActive = i === active;
            return (
              <button
                key={award.id}
                role="option"
                aria-selected={isActive}
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                onClick={() => open(i)}
                className={cn(
                  "group relative flex items-center gap-6 py-4 px-4 text-left border-b border-grey-soft transition-all duration-300 ease-out cursor-pointer rounded-md my-0.5",
                  isActive
                    ? "bg-white shadow-sm translate-x-2 border-transparent"
                    : "hover:bg-white/40 hover:translate-x-1"
                )}
              >
                {/* Accent Indicator */}
                <span
                  className={cn(
                    "absolute left-0 top-1/2 -translate-y-1/2 h-[65%] w-[4px] rounded-r bg-accent transition-all duration-300",
                    isActive ? "opacity-100 scale-100" : "opacity-0 scale-y-50"
                  )}
                  aria-hidden="true"
                />

                {/* Year */}
                <span
                  className="w-16 shrink-0 text-2xl font-bold tabular-nums transition-colors duration-300"
                  style={{
                    fontFamily: "'Newsreader', serif",
                    color: isActive ? "#9E002B" : "#A1A1A8",
                  }}
                >
                  {award.year}
                </span>

                {/* Title & Presenter */}
                <span className="flex-1 min-w-0 pr-2">
                  <span
                    className={cn(
                      "block text-lg xl:text-xl leading-snug transition-colors duration-300",
                      isActive ? "text-maroon-950 font-bold" : "text-grey-dark/80 font-semibold"
                    )}
                    style={{ fontFamily: "'Newsreader', serif" }}
                  >
                    {award.title}
                  </span>
                  <span className="block text-xs text-grey-mid mt-0.5 truncate">
                    Presented by {award.presentedBy}
                  </span>
                </span>

                {/* Hover Arrow */}
                <ArrowUpRight
                  className={cn(
                    "h-5 w-5 shrink-0 transition-all duration-300",
                    isActive
                      ? "text-accent opacity-100 translate-x-0"
                      : "text-grey-mid opacity-0 -translate-x-2 group-hover:opacity-70 group-hover:translate-x-0"
                  )}
                />
              </button>
            );
          })}
        </div>

        {/* Dynamic Plaque Showcase */}
        <div className="relative w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeAward.id}
              initial={{ opacity: 0, y: 12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.98 }}
              transition={{ duration: 0.3, ease: EASE }}
            >
              <button
                onClick={() => open(active)}
                className="block w-full text-left cursor-pointer focus:outline-none group"
                aria-label={`Open preview: ${activeAward.title}`}
              >
                <Plaque award={activeAward} />
              </button>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* MOBILE / TABLET ACCORDION VIEW (<1024px) */}
      <div className="lg:hidden flex flex-col space-y-3 w-full">
        {awards.map((award, i) => {
          const isOpen = openRow === i;
          return (
            <div
              key={award.id}
              className={cn(
                "rounded-lg border transition-all duration-300 overflow-hidden bg-white",
                isOpen
                  ? "border-accent/30 shadow-lg ring-1 ring-accent/20"
                  : "border-grey-soft shadow-sm"
              )}
            >
              {/* Accordion Trigger Header */}
              <button
                onClick={() => {
                  setOpenRow(isOpen ? null : i);
                  setActive(i);
                }}
                aria-expanded={isOpen}
                className="flex w-full min-h-[60px] items-center justify-between gap-3 px-4 py-3.5 text-left cursor-pointer focus-visible:outline-none"
              >
                <div className="flex items-center gap-3.5 min-w-0 flex-1">
                  <span
                    className={cn(
                      "text-lg font-bold tabular-nums shrink-0 transition-colors",
                      isOpen ? "text-accent" : "text-grey-mid"
                    )}
                    style={{ fontFamily: "'Newsreader', serif" }}
                  >
                    {award.year}
                  </span>
                  <span
                    className={cn(
                      "text-base leading-snug truncate",
                      isOpen ? "text-maroon-950 font-bold" : "text-grey-dark font-medium"
                    )}
                    style={{ fontFamily: "'Newsreader', serif" }}
                  >
                    {award.title}
                  </span>
                </div>

                <div
                  className={cn(
                    "w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300",
                    isOpen ? "bg-accent/10 rotate-180" : "bg-grey-soft/80"
                  )}
                >
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 transition-colors",
                      isOpen ? "text-accent" : "text-grey-mid"
                    )}
                  />
                </div>
              </button>

              {/* Accordion Content */}
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: EASE }}
                    className="overflow-hidden"
                  >
                    <div className="p-3 sm:p-4 pt-0 bg-[#FAF8F5]/60 border-t border-grey-soft/60">
                      <button
                        onClick={() => open(i)}
                        className="block w-full text-left cursor-pointer focus:outline-none mt-3"
                      >
                        <Plaque award={award} />
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {Lightbox}
    </>
  );
}