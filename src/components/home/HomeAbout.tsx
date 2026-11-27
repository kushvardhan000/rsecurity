import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { ABOUT } from "@/src/data/about";

export function HomeAbout() {
  return (
    <section
      id="about"
      aria-labelledby="home-about-heading"
      data-tone="light"
      className="bg-[var(--color-paper)] py-[clamp(56px,8vw,112px)]"
    >
      <div className="mx-auto max-w-[1240px] px-[clamp(16px,4vw,48px)]">
        <div className="grid items-center gap-8 sm:gap-10 md:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] md:gap-8 lg:gap-16">
          <figure className="relative order-1 aspect-[4/3] overflow-hidden bg-[var(--color-grey-soft)] sm:aspect-[5/3] md:aspect-[4/3]">
            <Image
              src={ABOUT.images.portrait}
              alt={ABOUT.images.portraitAlt}
              fill
              sizes="(min-width: 1024px) 44vw, (min-width: 640px) 90vw, 100vw"
              className="object-cover object-[center_35%]"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-t from-[#2A060C]/45 via-transparent to-transparent"
            />
            <figcaption className="absolute bottom-4 left-4 border-l border-white/80 pl-3 text-white sm:bottom-5 sm:left-5">
              <span className="block text-[10px] font-semibold uppercase tracking-[0.2em]">
                Rooted in Jharkhand
              </span>
              <span className="mt-1 block font-serif text-xl leading-none sm:text-2xl">
                Serving with purpose
              </span>
            </figcaption>
          </figure>

          <div className="order-2">
            <p className="mb-3 inline-flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--color-grey-700)] sm:text-xs">
              <span
                aria-hidden="true"
                className="h-1.5 w-1.5 shrink-0 bg-[var(--color-accent)]"
              />
              Our story
            </p>
            <h2
              id="home-about-heading"
              className="max-w-[16ch] font-serif text-[clamp(2rem,4vw,3.5rem)] font-medium leading-[1.08] tracking-tight text-[var(--color-maroon-950)]"
            >
              {ABOUT.headline}
            </h2>
            <p className="mt-5 max-w-[62ch] text-[15px] leading-relaxed text-[var(--color-grey-700)] sm:text-base">
              {ABOUT.summary}
            </p>
            <p className="mt-3 max-w-[62ch] text-[15px] leading-relaxed text-[var(--color-grey-700)] sm:text-base">
              {ABOUT.homeDetail}
            </p>
            <Link
              href="/about"
              className="mt-6 inline-flex min-h-11 items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-maroon-900)] transition-colors hover:text-[var(--color-accent)]"
            >
              Read our story
              <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
