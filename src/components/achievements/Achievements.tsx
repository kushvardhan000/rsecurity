'use client';
import { SectionHeader } from "../ui/SectionHeader";
import { cn } from "@/src/lib/cn";
import { milestones } from "@/src/data/milestones";
import { useRef, useState, PointerEvent, useEffect } from "react";

export function Achievements() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [progress, setProgress] = useState(0);

  // Update progress on scroll
  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    const maxScroll = scrollWidth - clientWidth;
    if (maxScroll <= 0) {
      setProgress(0);
    } else {
      setProgress((scrollLeft / maxScroll) * 100);
    }
  };

  // Run on mount to set initial progress/scroll width calculation
  useEffect(() => {
    handleScroll();
    window.addEventListener('resize', handleScroll);
    return () => window.removeEventListener('resize', handleScroll);
  }, []);

  const handlePointerDown = (e: PointerEvent) => {
    if (e.pointerType !== 'mouse') return;
    if (!scrollRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
    // disable snap while dragging
    scrollRef.current.style.scrollSnapType = 'none';
  };

  const handlePointerLeave = (e: PointerEvent) => {
    if (e.pointerType !== 'mouse') return;
    setIsDragging(false);
    if (scrollRef.current) {
      scrollRef.current.style.scrollSnapType = 'x mandatory';
    }
  };

  const handlePointerUp = (e: PointerEvent) => {
    if (e.pointerType !== 'mouse') return;
    setIsDragging(false);
    if (scrollRef.current) {
      scrollRef.current.style.scrollSnapType = 'x mandatory';
    }
  };

  const handlePointerMove = (e: PointerEvent) => {
    if (e.pointerType !== 'mouse' || !isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  return (
    <section
      id="achievements"
      data-tone="dark"
      className="bg-maroon-900 overflow-hidden py-16 md:py-20 lg:max-h-[520px] flex flex-col justify-center"
    >
      <div className="mx-auto max-w-[1320px] w-full px-5 sm:px-8 lg:px-12">
        <SectionHeader
          eyebrow="Our Journey"
          title="Milestones that"
          accentWord="built"
          titleSuffix="us"
          dark
          className="mb-10 lg:mb-14"
        />

        <div className="relative">
          {/* Background line running through nodes */}
          <div className="absolute top-[28px] left-0 right-0 h-px bg-[#F2B8BF]/30 -z-10 pointer-events-none" />

          {/* Scrollable track */}
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            onPointerDown={handlePointerDown}
            onPointerLeave={handlePointerLeave}
            onPointerUp={handlePointerUp}
            onPointerMove={handlePointerMove}
            className={cn(
              "flex items-start gap-6 md:gap-10 overflow-x-auto snap-x snap-mandatory hide-scrollbar select-none",
              isDragging ? "cursor-grabbing" : "cursor-grab"
            )}
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              WebkitOverflowScrolling: 'touch'
            }}
          >
            {milestones.map((m, i) => (
              <div
                key={m.id}
                className={cn(
                  "relative shrink-0 snap-start pb-4",
                  "w-[78vw] md:w-[280px]"
                )}
                style={i === milestones.length - 1 ? { paddingRight: '2rem' } : undefined}
              >
                {/* Year with outline. Node aligns horizontally */}
                <div
                   className="font-display text-[56px] leading-[1] mb-4 md:mb-5 tracking-tight"
                   style={{
                     WebkitTextStroke: '1px #F2B8BF', /* A bit more elegant than 1.5px for smaller viewports if possible, but 1px is definitely sharp enough */
                     color: 'transparent'
                   }}
                >
                  {m.year}
                </div>

                {/* Title */}
                <h3 className="font-display text-white text-[20px] leading-snug mb-2 pointer-events-none">
                  {m.title}
                </h3>

                {/* 2-line Text */}
                <p className="text-white/80 text-[15px] leading-relaxed line-clamp-2 pointer-events-none max-w-[90%]">
                  {m.text}
                </p>
              </div>
            ))}
          </div>

          {/* Progress bar (Mobile primarily) */}
          <div className="mt-8 h-1 w-full max-w-[160px] bg-white/10 rounded-full mx-auto md:hidden overflow-hidden">
            <div
              className="h-full bg-[#F2B8BF] rounded-full transition-all duration-300 ease-out"
              style={{ width: `${Math.max(15, progress)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Required style to literally hide scrollbar if utility isn't enough */}
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}} />
    </section>
  );
}
