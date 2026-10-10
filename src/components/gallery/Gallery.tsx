"use client";

import { useMemo, useEffect } from "react";
import Image from "next/image";
import { GALLERY, type GalleryItem } from "@/src/data/gallery";
import { DragMarquee } from "../ui/DragMarquee";
import { SectionHeader } from "../ui/SectionHeader";
import { useLightbox } from "../ui/Lightbox";

export function Gallery() {
  const row1 = GALLERY.slice(0, 9);
  const row2 = GALLERY.slice(9, 18);
  const row3 = GALLERY.slice(18, 27);

  // Map GALLERY to Lightbox items
  const lightboxItems = useMemo(
    () =>
      GALLERY.map((item) => ({
        image: item.image,
        imageAlt: item.imageAlt,
        title: "Legacy in pictures",
        meta: item.year,
        caption: item.caption,
      })),
    []
  );

  const { open, Lightbox } = useLightbox(lightboxItems);

  useEffect(() => {
    if (GALLERY.length < 12) {
      console.warn("Gallery has fewer than 12 images:", GALLERY.length);
    }
  }, []);

  // Helper to render a photo card
  const renderItem = (item: GalleryItem, rowStartIndex: number, idx: number) => {
    const originalIndex = rowStartIndex + idx;
    return (
      <button
        key={item.id + idx}
        onClick={() => open(originalIndex)}
        className="group/item relative block shrink-0 overflow-hidden rounded-[2px] transition-all duration-500 ease-out
                   group-hover/row:opacity-40 hover:!opacity-100 focus:outline-none bg-[var(--color-maroon-800)]"
        style={{
          height: "var(--row-h)",
          width: `calc(var(--row-h) * (${item.w} / ${item.h}))`
        }}
        aria-label={`View photo from ${item.year || "gallery"}`}
      >
        <Image
          src={item.image}
          alt={item.imageAlt}
          width={item.w}
          height={item.h}
          className="object-cover w-full h-full transition-transform duration-700 ease-out group-hover/item:scale-105"
        />
        {/* Caption slide-up on hover (desktop only) */}
        <div className="absolute inset-x-0 bottom-0 translate-y-full bg-gradient-to-t from-[var(--color-maroon-950)]/90 pb-4 pt-8 px-4 transition-transform duration-500 ease-out group-hover/item:translate-y-0 hidden md:block">
          <p className="text-white text-xs font-semibold leading-tight line-clamp-2 text-left">
            {item.caption}
          </p>
        </div>
      </button>
    );
  };

  return (
    <section
      id="gallery"
      data-tone="dark"
      className="relative isolate w-full py-16 md:py-24 overflow-x-clip bg-[var(--color-maroon-900)] flex flex-col"
      style={{
        "--wall-h": "clamp(420px, 66svh, 680px)",
        "--row-h": "calc((var(--wall-h) - 20px) / 3)"
      } as React.CSSProperties}
    >
      {/* Background gradients */}
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-40 mix-blend-color-dodge"
        style={{
          background:
            "radial-gradient(circle at 50% 0%, rgba(200, 200, 200, 0.05) 0%, transparent 60%)",
        }}
      />

      <div className="relative z-10 w-full max-w-[1320px] mx-auto px-5 sm:px-8 lg:px-12 shrink-0 mb-8 md:mb-12">
        <SectionHeader
          eyebrow="Our Journey"
          title="A legacy, in"
          accentWord="pictures."
          linkLabel="View full gallery"
          linkHref="#contact"
          dark
          hideEyebrowSquare // Custom prop we'll add to SectionHeader
        />
      </div>

      {/* Tilt block wrapper */}
      <div className="relative z-10 w-full overflow-hidden flex items-center justify-center" style={{ height: "var(--wall-h)" }}>
        {/* We tilt the container slightly on desktop, but make it extra wide to prevent clipping */}
        <div className="w-[110%] md:w-[105%] flex flex-col gap-[10px] md:-rotate-[1.5deg] md:scale-105 origin-center justify-center">

          {/* Row 1 */}
          <div className="relative group/row w-full flex-none" style={{ height: "var(--row-h)" }}>
            <DragMarquee speed={38} gap={10} fade className="w-full h-full items-stretch">
              {row1.map((item, idx) => renderItem(item, 0, idx))}
            </DragMarquee>
          </div>

          {/* Row 2 */}
          <div className="relative group/row w-full flex-none" style={{ height: "var(--row-h)" }}>
            <DragMarquee speed={30} direction="right" gap={10} fade className="w-full h-full items-stretch">
              {row2.map((item, idx) => renderItem(item, 9, idx))}
            </DragMarquee>
          </div>

          {/* Row 3 */}
          <div className="relative group/row w-full flex-none" style={{ height: "var(--row-h)" }}>
            <DragMarquee speed={44} gap={10} fade className="w-full h-full items-stretch">
              {row3.map((item, idx) => renderItem(item, 18, idx))}
            </DragMarquee>
          </div>

        </div>
      </div>

      {Lightbox}
    </section>
  );
}
