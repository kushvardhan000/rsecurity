"use client";

import { useState } from "react";
import { DragMarquee } from "@/src/components/ui/DragMarquee";
import { Sheet } from "@/src/components/ui/Sheet";
import { useLightbox } from "@/src/components/ui/Lightbox";

const MOCK_ITEMS = [
  "Ranchi",
  "Jamshedpur",
  "Bokaro",
  "Dhanbad",
  "Patna",
  "Gaya",
  "Bhubaneswar",
  "Cuttack",
  "Kolkata",
  "Delhi",
];

const LIGHTBOX_ITEMS = [
  {
    image: "/hero/slide-1-gate.jpg",
    imageAlt: "Gate security",
    title: "Gate Security Operations",
    caption: "Professional guards monitoring the main entrance.",
    meta: "2026",
  },
  {
    image: "/hero/slide-2-industrial.jpg",
    imageAlt: "Industrial security",
    title: "Industrial Plant Safety",
    caption: "Patrolling the perimeter of a large manufacturing facility.",
    meta: "2026",
  },
  {
    image: "/hero/slide-3-training.jpg",
    imageAlt: "Training academy",
    title: "Training & Certification",
    caption: "Cadets undergoing rigorous physical training.",
    meta: "2026",
  },
];

export default function PrimitivesDevPage() {
  const [sheetOpen, setSheetOpen] = useState(false);
  const { open, Lightbox } = useLightbox(LIGHTBOX_ITEMS);

  return (
    <main className="min-h-screen pt-32 pb-24 px-5">
      <div className="max-w-4xl mx-auto space-y-16">
        <header>
          <h1 className="text-4xl display font-bold text-grey-dark">
            Primitives Test Page
          </h1>
          <p className="mt-2 text-grey-mid">
            Testing DragMarquee, Sheet, and Lightbox
          </p>
        </header>

        {/* DragMarquee Demo */}
        <section className="space-y-4 rounded-md border border-grey-soft p-6">
          <h2 className="text-xl font-bold mb-6">DragMarquee (3 rows)</h2>
          <DragMarquee speed={40} direction="left" gap={24} fade>
            {MOCK_ITEMS.map((item, i) => (
              <div
                key={i}
                className="w-[200px] h-24 bg-maroon-950 rounded-sm text-white flex items-center justify-center font-serif text-2xl cursor-pointer"
                onClick={() => alert(`Clicked ${item}`)}
              >
                {item}
              </div>
            ))}
          </DragMarquee>
          <DragMarquee speed={30} direction="right" gap={24} fade>
            {MOCK_ITEMS.map((item, i) => (
              <div
                key={i}
                className="w-[200px] h-24 bg-accent rounded-sm text-white flex items-center justify-center font-serif text-2xl cursor-pointer"
                onClick={() => alert(`Clicked ${item}`)}
              >
                {item}
              </div>
            ))}
          </DragMarquee>
          <DragMarquee speed={50} direction="left" gap={24} fade>
            {MOCK_ITEMS.map((item, i) => (
              <div
                key={i}
                className="w-[200px] h-24 bg-grey-dark rounded-sm text-white flex items-center justify-center font-serif text-2xl cursor-pointer"
                onClick={() => alert(`Clicked ${item}`)}
              >
                {item}
              </div>
            ))}
          </DragMarquee>
        </section>

        {/* Sheet Demo */}
        <section className="space-y-4 rounded-md border border-grey-soft p-6">
          <h2 className="text-xl font-bold">Sheet Demo</h2>
          <button
            onClick={() => setSheetOpen(true)}
            className="px-6 py-3 bg-maroon-950 text-white rounded-sm hover:bg-grey-dark"
          >
            Open Sheet
          </button>

          <Sheet
            isOpen={sheetOpen}
            onClose={() => setSheetOpen(false)}
            title="Example Sheet"
          >
            <div className="space-y-6">
              <p className="text-grey-dark leading-relaxed">
                This is a Sheet component. On mobile it will appear from the bottom
                with a drag handle and swipe-to-close capabilities. On desktop it
                appears as a right-side drawer.
              </p>
              <div className="h-40 bg-grey-soft rounded-sm animate-pulse" />
              <div className="h-40 bg-grey-soft rounded-sm animate-pulse" />
              <div className="h-40 bg-grey-soft rounded-sm animate-pulse" />
              <button
                onClick={() => setSheetOpen(false)}
                className="w-full px-6 py-3 bg-accent text-white rounded-sm hover:bg-accent-hover"
              >
                Close Sheet
              </button>
            </div>
          </Sheet>
        </section>

        {/* Lightbox Demo */}
        <section className="space-y-4 rounded-md border border-grey-soft p-6">
          <h2 className="text-xl font-bold">Lightbox Demo</h2>
          <div className="flex gap-4">
            {LIGHTBOX_ITEMS.map((item, i) => (
              <button
                key={i}
                onClick={() => open(i)}
                className="relative w-32 h-24 overflow-hidden rounded-sm hover:opacity-80 transition-opacity"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.image}
                  alt={item.imageAlt}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
          {Lightbox}
        </section>
      </div>
    </main>
  );
}
