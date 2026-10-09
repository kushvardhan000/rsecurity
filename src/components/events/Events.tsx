"use client";

import { EVENTS } from "@/src/data/events";
import { DragMarquee } from "../ui/DragMarquee";
import { EventCard } from "./EventCard";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

export function Events() {
  return (
    <section
      id="events"
      data-tone="light"
      className="relative isolate bg-[#FAF8F5] py-12 sm:py-16 md:py-20 border-t border-neutral-200/80 overflow-hidden"
    >
      {/* Background Grid Accent */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#800020 1px, transparent 1px)`,
          backgroundSize: "24px 24px",
        }}
        aria-hidden="true"
      />

      <div className="mx-auto max-w-[1340px] px-4 sm:px-6 lg:px-8 w-full mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-neutral-200/80 pb-4">
          <div>
            <div className="inline-flex items-center gap-2 text-[10px] font-mono tracking-[0.2em] uppercase text-[#800020] font-bold mb-1.5">
              <span className="w-1.5 h-1.5 bg-[#800020]" />
              PRESS & FIELD DISPATCHES
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif text-[#1C1917] tracking-tight">
              Moments that <span className="text-[#800020] italic">define us.</span>
            </h2>
          </div>

          <Link
            href="/events"
            className="group inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#800020] hover:text-[#520014] transition-colors"
          >
            <span>All Press Dispatches</span>
            <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>
      </div>

      {/* ── Marquee Feed with Zero Card Radius ── */}
      <div className="relative w-full overflow-x-clip overflow-y-visible py-1">
        {/* Left & Right Edge Vignettes */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-0 top-0 bottom-0 w-6 sm:w-16 bg-gradient-to-r from-[#FAF8F5] to-transparent z-20"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-0 top-0 bottom-0 w-6 sm:w-16 bg-gradient-to-l from-[#FAF8F5] to-transparent z-20"
        />

        <DragMarquee
          speed={32}
          gap={12}
          fade={false}
          hideCursor
          pauseOnHover
          ariaLabel="Latest Security Events and Dispatches"
          className="w-full"
        >
          {EVENTS.map((event) => (
            <EventCard key={`event-${event.slug}`} event={event} />
          ))}
        </DragMarquee>
      </div>
    </section>
  );
}