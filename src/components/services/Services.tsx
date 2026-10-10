"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { ArrowUpRight, Shield, Radio, CheckCircle2 } from "lucide-react";
import {
  FEATURED_SERVICES,
  ALSO_SERVICES,
} from "@/src/data/services";
import { Reveal } from "../ui/Reveal";
import { cn } from "@/src/lib/cn";

export function Services() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setTimeout(() => setMounted(true), 0);
  }, []);

  if (!mounted) {
    return (
      <section id="services" className="bg-[#FAF8F5] py-16">
        <div className="mx-auto max-w-[1320px] px-5 text-center text-neutral-400">
          Loading Security Operations...
        </div>
      </section>
    );
  }

  return (
    <section
      id="services"
      data-tone="light"
      className="relative bg-[#FAF8F5] py-14 sm:py-20 border-t border-neutral-200/80 overflow-hidden"
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
        <div className="hidden lg:flex gap-3 h-[420px] w-full" role="region" aria-label="Services Grid">
          {FEATURED_SERVICES.map((service, i) => {
            const isHovered = activeIdx === i;
            return (
              <div
                key={service.slug}
                onMouseEnter={() => setActiveIdx(i)}
                onFocus={() => setActiveIdx(i)}
                tabIndex={0}
                className={cn(
                  "relative rounded-xl overflow-hidden cursor-pointer transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] flex flex-col justify-end p-5 select-none",
                  isHovered
                    ? "flex-[3] shadow-xl ring-2 ring-[#540B13]"
                    : "flex-[1] hover:flex-[1.2] opacity-80 hover:opacity-100"
                )}
              >
                {/* Background Image */}
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  className={cn(
                    "object-cover transition-transform duration-700 ease-out",
                    isHovered ? "scale-105" : "scale-100 brightness-[0.65]"
                  )}
                  style={{ objectPosition: service.focal || "center" }}
                />

                {/* Tactical Scrim / Gradients */}
                <div
                  className={cn(
                    "absolute inset-0 transition-opacity duration-500",
                    isHovered
                      ? "bg-gradient-to-t from-[#260307]/95 via-[#540B13]/40 to-black/20"
                      : "bg-gradient-to-t from-black/85 via-black/30 to-black/20"
                  )}
                />

                {/* Top Badge: Code Tag */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
                  <span className={cn(
                    "text-[11px] font-mono font-semibold px-2 py-0.5 rounded backdrop-blur-md transition-colors",
                    isHovered
                      ? "bg-white text-[#540B13]"
                      : "bg-black/50 text-white/80 border border-white/10"
                  )}>
                    {service.tag || `DIV-0${i + 1}`}
                  </span>
                  {isHovered && (
                    <span className="flex items-center gap-1 text-[10px] font-mono text-emerald-300 bg-black/60 px-2 py-0.5 rounded backdrop-blur-md">
                      <Radio className="w-2.5 h-2.5 animate-pulse text-emerald-400" />
                      DEPLOYED
                    </span>
                  )}
                </div>

                {/* Content Layer */}
                <div className="relative z-10 text-white">
                  <h3
                    className={cn(
                      "font-serif font-bold transition-all duration-300 leading-tight",
                      isHovered ? "text-2xl text-white mb-2" : "text-base text-white/90 writing-mode-normal"
                    )}
                  >
                    {service.title}
                  </h3>

                  {/* Expanded Body: Revealed on focus/hover only */}
                  <div
                    className={cn(
                      "overflow-hidden transition-all duration-500",
                      isHovered ? "max-h-[140px] opacity-100 mt-2" : "max-h-0 opacity-0"
                    )}
                  >
                    <p className="text-xs text-neutral-200 line-clamp-2 font-sans leading-relaxed mb-3">
                      {service.short} Ex-servicemen led perimeter protection and strict verification.
                    </p>

                    <a
                      href="#contact"
                      className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-200 hover:text-white transition-colors"
                    >
                      Book Unit Assessment
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── MOBILE: Minimalist Compact View (< 1024px) ── */}
        <div className="lg:hidden">
          {/* Quick Segment Indicator Strip */}
          <div className="grid grid-cols-5 gap-1 p-1 bg-neutral-200/60 rounded-lg mb-3">
            {FEATURED_SERVICES.map((s, i) => (
              <button
                key={s.slug}
                type="button"
                onClick={() => setActiveIdx(i)}
                className={cn(
                  "py-1.5 text-[11px] font-mono font-bold rounded transition-all text-center",
                  activeIdx === i
                    ? "bg-[#540B13] text-white shadow-xs"
                    : "text-neutral-600 hover:text-neutral-900"
                )}
              >
                0{i + 1}
              </button>
            ))}
          </div>

          {/* Active Featured Card: Low height, high visual impact */}
          <div className="relative rounded-xl overflow-hidden bg-neutral-900 border border-neutral-200/60 shadow-md">
            <div className="relative h-[220px] w-full">
              <Image
                src={FEATURED_SERVICES[activeIdx].image}
                alt={FEATURED_SERVICES[activeIdx].title}
                fill
                priority
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#200306] via-black/40 to-transparent" />

              <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm px-2.5 py-1 rounded text-[10px] font-mono text-white/90 border border-white/10 flex items-center gap-1.5">
                <Shield className="w-3 h-3 text-[#E6AF2E]" />
                {FEATURED_SERVICES[activeIdx].tag || `0${activeIdx + 1}`}
              </div>

              <div className="absolute bottom-3 left-3 right-3 text-white">
                <h3 className="text-lg font-serif font-bold text-white leading-tight">
                  {FEATURED_SERVICES[activeIdx].title}
                </h3>
                <p className="text-white/80 text-xs line-clamp-2 mt-1">
                  {FEATURED_SERVICES[activeIdx].short}
                </p>
              </div>
            </div>

            {/* Quick Action Footer */}
            <div className="p-3 bg-[#FAF8F5] border-t border-neutral-200 flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 text-[11px] text-neutral-600 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#540B13]" />
                Disciplined Guarding
              </div>

              <a
                href="#contact"
                className="px-3.5 py-1.5 rounded bg-[#540B13] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#3D050C] transition-colors"
              >
                Deploy
              </a>
            </div>
          </div>
        </div>

        {/* ── Compact "Also" Strip ── */}
        <Reveal delay={0.1} className="mt-8 pt-6 border-t border-neutral-200/80">
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
        </Reveal>
      </div>
    </section>
  );
}