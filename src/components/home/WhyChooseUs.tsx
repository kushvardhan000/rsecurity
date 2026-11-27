import { BadgeCheck, GraduationCap, Landmark, ShieldCheck } from "lucide-react";
import { ABOUT } from "@/src/data/about";

const icons = {
  shield: ShieldCheck,
  government: Landmark,
  quality: BadgeCheck,
  training: GraduationCap,
} as const;

export function WhyChooseUs() {
  return (
    <section
      id="why-choose-us"
      aria-labelledby="why-choose-us-heading"
      data-tone="light"
      className="relative isolate overflow-hidden py-14 text-[var(--color-maroon-950)] sm:py-16 lg:py-20"
    >
      <div className="mx-auto grid max-w-[1240px] gap-10 px-[clamp(20px,5vw,64px)] lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:gap-16">
        {/* Left panel */}
        <header className="flex flex-col">
          <p className="mb-3 inline-flex items-center gap-2.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--color-grey-700)]">
            <span
              aria-hidden="true"
              className="h-px w-7 bg-[var(--color-accent)]"
            />
            The RSP difference
          </p>
          <h2
            id="why-choose-us-heading"
            className="font-serif text-[clamp(2.1rem,3.8vw,3.1rem)] font-medium leading-[1] tracking-[-0.04em]"
          >
            Why{" "}
            <span className="italic font-normal text-[var(--color-accent)]">
              Choose
            </span>{" "}
            Us
          </h2>
          <p className="mt-3 max-w-[32ch] text-sm leading-[1.65] text-[var(--color-grey-700)]">
            Experience, accountability and accredited standards behind every
            service.
          </p>

          <div className="mt-7 grid max-w-[300px] grid-cols-2 divide-x divide-[var(--color-maroon-900)]/15 rounded-lg border border-[var(--color-maroon-900)]/15">
            <div className="px-4 py-3.5">
              <p className="font-serif text-[1.7rem] leading-none tracking-[-0.04em]">
                1995
              </p>
              <p className="mt-1.5 text-[9px] font-semibold uppercase tracking-[0.16em] text-[var(--color-grey-700)]">
                Incorporated
              </p>
            </div>
            <div className="px-4 py-3.5">
              <p className="font-serif text-[1.7rem] leading-none tracking-[-0.04em] text-[var(--color-accent)]">
                1996
              </p>
              <p className="mt-1.5 text-[9px] font-semibold uppercase tracking-[0.16em] text-[var(--color-grey-700)]">
                DGR empanelled
              </p>
            </div>
          </div>
        </header>

        {/* 2x2 pillars */}
        <ol
          aria-label="Four pillars of RSP institutional trust"
          className="grid grid-cols-2 gap-x-5 sm:gap-x-10 sm:gap-y-2"
        >
          {ABOUT.whyChooseUs.map((item, index) => {
            const Icon = icons[item.icon];

            return (
              <li
                key={item.title}
                className="group relative min-w-0 border-t border-[var(--color-maroon-900)]/15 py-5 transition-colors sm:py-6 duration-300 hover:border-[var(--color-accent)] motion-reduce:transition-none"
              >
                <div className="flex items-center justify-between">
                  <span
                    aria-hidden="true"
                    className="font-serif text-sm tracking-[0.1em] text-[var(--color-accent)]"
                  >
                    0{index + 1}
                  </span>
                  <Icon
                    aria-hidden="true"
                    className="h-5 w-5 text-[var(--color-maroon-800)]/70 transition-colors duration-300 group-hover:text-[var(--color-maroon-900)] motion-reduce:transition-none"
                    strokeWidth={1.4}
                  />
                </div>
                <h3 className="mt-4 font-serif text-[15px] font-medium leading-[1.25] tracking-[-0.01em] sm:mt-5 sm:text-xl">
                  {item.title}
                </h3>
                <p className="mt-1.5 max-w-[38ch] text-[12px] leading-[1.55] sm:mt-2 sm:text-[13px] sm:leading-[1.65] text-[var(--color-grey-700)]">
                  {item.description}
                </p>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}