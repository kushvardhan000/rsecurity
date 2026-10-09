"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/src/lib/cn";
import { type EventItem } from "@/src/data/events";

const BLUR =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 8'%3E%3Crect width='8' height='8' fill='%231f0306'/%3E%3C/svg%3E";

export function EventCard({
  event,
  className,
}: {
  event: EventItem;
  className?: string;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const isHindi = /[ऀ-ॿ]/.test(event.headline);

  return (
    <Link
      href={`/events/${event.slug}`}
      className={cn(
        "group relative block shrink-0 select-none overflow-hidden rounded-none bg-[#120204]",
        // Highly compact dimensions tailored for mobile viewports
        "w-[230px] xs:w-[250px] sm:w-[270px] md:w-[290px]",
        "h-[270px] xs:h-[285px] sm:h-[300px] md:h-[315px]",
        "border border-neutral-300 hover:border-[#800020] transition-colors duration-300",
        "shadow-sm hover:shadow-md",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* ── 1. Photography Layer ── */}
      <div className="absolute inset-0 w-full h-full">
        <Image
          src={event.image}
          alt={event.imageAlt || event.headline}
          fill
          placeholder="blur"
          blurDataURL={BLUR}
          sizes="(max-width: 640px) 240px, 290px"
          className={cn(
            "object-cover object-center transition-transform duration-500 ease-out",
            isHovered ? "scale-105 brightness-95" : "scale-100 brightness-[0.9]"
          )}
        />
      </div>

      {/* ── 2. Controlled Gradient (Bottom 40% only for text contrast) ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(to top, rgba(16, 2, 4, 0.95) 0%, rgba(35, 4, 8, 0.82) 32%, rgba(20, 2, 4, 0.25) 55%, transparent 100%)",
        }}
        aria-hidden="true"
      />

      {/* ── 3. Top News Strip (Sharp Edge) ── */}
      <div className="relative z-10 flex items-center justify-between p-2.5 xs:p-3">
        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-black/75 backdrop-blur-xs border-l-2 border-[#800020] text-white">
          <span className="text-[10px] font-mono tracking-widest uppercase font-bold text-neutral-200">
            {event.kicker || "DISPATCH"}
          </span>
        </div>

        {event.date && (
          <span className="text-[10px] font-mono tracking-wider uppercase text-neutral-200 bg-black/60 backdrop-blur-xs px-2 py-0.5">
            {event.date}
          </span>
        )}
      </div>

      {/* ── 4. Bottom Content Block ── */}
      <div className="absolute bottom-0 inset-x-0 z-10 p-3 xs:p-3.5 flex flex-col justify-end bg-gradient-to-t from-black/60 to-transparent">
        <h3
          className={cn(
            "text-white font-serif font-bold transition-colors duration-200 line-clamp-2",
            isHindi
              ? "text-[14px] xs:text-[15px] font-sans leading-snug"
              : "text-[15px] xs:text-[16px] sm:text-[17px] leading-[1.25]"
          )}
          lang={isHindi ? "hi" : "en"}
        >
          <span
            className={cn(
              "underline decoration-1 decoration-transparent transition-all duration-300",
              isHovered && "decoration-neutral-300 underline-offset-4"
            )}
          >
            {event.headline}
          </span>
        </h3>

        {/* Minimalist Micro Bar */}
        <div className="mt-2 pt-2 border-t border-white/15 flex items-center justify-between text-[11px] font-mono tracking-wider uppercase text-neutral-300">
          <span className="group-hover:text-white transition-colors">Read Article</span>
          <ArrowUpRight
            className={cn(
              "w-3.5 h-3.5 text-neutral-300 transition-transform duration-300",
              isHovered && "translate-x-0.5 -translate-y-0.5 text-white"
            )}
          />
        </div>
      </div>
    </Link>
  );
}