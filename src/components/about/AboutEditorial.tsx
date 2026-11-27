import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  ChevronDown,
  ChevronRight,
  GraduationCap,
  Landmark,
  ShieldCheck,
} from "lucide-react";
import { ABOUT } from "@/src/data/about";
import { milestones } from "@/src/data/milestones";
import { CountUp } from "@/src/components/ui/CountUp";

const credentialIcons = {
  shield: ShieldCheck,
  government: Landmark,
  quality: BadgeCheck,
  training: GraduationCap,
} as const;

export function AboutStory() {
  const accentIndex = ABOUT.headline.indexOf(ABOUT.accent);

  return (
    <section
      id="about-story"
      aria-labelledby="about-story-heading"
      className="relative overflow-hidden bg-[var(--color-paper)] pb-8 sm:pb-12"
    >
      <div className="mx-auto max-w-[1320px] px-5 pt-4 sm:px-8 sm:pt-6 lg:px-12">
        <nav aria-label="Breadcrumb" className="mb-4 sm:mb-6">
          <ol className="flex items-center gap-2 text-[11px] text-[var(--color-grey-700)] sm:text-xs">
            <li>
              <Link
                href="/"
                className="transition-colors hover:text-[var(--color-accent)] motion-reduce:transition-none"
              >
                Home
              </Link>
            </li>
            <li aria-hidden="true">
              <ChevronRight className="h-3 w-3" />
            </li>
            <li aria-current="page" className="font-medium text-[var(--color-maroon-900)]">
              About
            </li>
          </ol>
        </nav>

        <div className="grid items-center gap-0 md:grid-cols-[minmax(0,0.94fr)_minmax(0,1.06fr)] md:gap-8 lg:gap-12">
          <figure className="group relative order-1 grid h-[clamp(230px,66vw,410px)] grid-cols-[1.18fr_0.82fr] grid-rows-[1fr_0.72fr] gap-2 sm:gap-3 md:order-2 md:h-auto md:aspect-[1.15] lg:h-[500px] lg:aspect-auto">
            <div className="relative row-span-2 overflow-hidden bg-[var(--color-maroon-900)]">
              <Image
                src={ABOUT.images.portrait}
                alt={ABOUT.images.portraitAlt}
                fill
                loading="eager"
                sizes="(min-width: 1024px) 36vw, 65vw"
                className="object-cover object-[center_28%] transition-transform duration-700 group-hover:scale-[1.025] motion-reduce:transform-none motion-reduce:transition-none"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-[var(--color-maroon-950)]/45 via-transparent to-transparent"
              />
            </div>

            <div className="relative overflow-hidden bg-[var(--color-grey-soft)]">
              <Image
                src="/gallery/f6.jpeg"
                alt="Ranchi Security representatives with President Pratibha Patil and the CAPSI delegation"
                fill
                sizes="(min-width: 1024px) 24vw, 35vw"
                className="object-cover object-center transition-transform duration-700 group-hover:scale-[1.025] motion-reduce:transform-none motion-reduce:transition-none"
              />
            </div>

            <div className="flex flex-col justify-between border border-[var(--color-maroon-900)]/15 bg-white p-3 sm:p-5 lg:p-6">
              <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[var(--color-grey-700)] sm:text-[10px]">
                DGR empanelled
              </span>
              <span className="font-serif text-[clamp(1.7rem,3vw,2.7rem)] leading-none tracking-tight text-[var(--color-maroon-900)]">
                1996
              </span>
              <span className="text-[9px] leading-snug text-[var(--color-grey-700)] sm:text-[10px]">
                Ministry of Defence
              </span>
            </div>
            <figcaption className="pointer-events-none absolute bottom-3 left-3 z-10 bg-[var(--color-maroon-950)]/80 px-2 py-1 text-[9px] font-medium uppercase tracking-[0.14em] text-white sm:bottom-4 sm:left-4 sm:text-[10px]">
              Service since 1995
            </figcaption>
          </figure>

          <header className="relative z-10 order-2 -mt-8 bg-[var(--color-paper)] px-3 pb-2 pt-4 sm:px-6 md:order-1 md:mt-0 md:bg-transparent md:px-0 md:py-4">
            <p className="mb-3 inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--color-grey-700)] sm:mb-4 sm:text-[11px]">
              <span aria-hidden="true" className="h-px w-7 bg-[#B99A63]" />
              {ABOUT.eyebrow}
            </p>
            <h1
              id="about-story-heading"
              className="max-w-[14ch] font-serif text-[clamp(2.35rem,5.7vw,4.5rem)] font-medium leading-[0.98] tracking-[-0.045em] text-[var(--color-maroon-950)]"
            >
              {accentIndex >= 0 ? (
                <>
                  {ABOUT.headline.slice(0, accentIndex)}
                  <span className="italic text-[var(--color-accent)]">
                    {ABOUT.accent}
                  </span>
                  {ABOUT.headline.slice(accentIndex + ABOUT.accent.length)}
                </>
              ) : (
                ABOUT.headline
              )}
            </h1>
            <p className="mt-4 max-w-[48ch] text-[13px] leading-[1.75] text-[var(--color-grey-700)] sm:mt-5 sm:text-[15px]">
              {ABOUT.summary}
            </p>
            <details className="group mt-4 max-w-[48ch] border-t border-[var(--color-maroon-900)]/15 pt-1">
              <summary className="flex min-h-10 cursor-pointer list-none items-center justify-between gap-4 text-[11px] font-semibold uppercase tracking-[0.13em] text-[var(--color-maroon-900)] marker:hidden focus-visible:outline-offset-2 sm:text-xs">
                More about our history
                <ChevronDown
                  aria-hidden="true"
                  className="h-4 w-4 shrink-0 transition-transform duration-300 group-open:rotate-180 motion-reduce:transition-none"
                />
              </summary>
              <div className="space-y-3 pb-3 pt-1 text-[12px] leading-[1.7] text-[var(--color-grey-700)] sm:text-[13px]">
                <p>{ABOUT.homeDetail}</p>
                {ABOUT.body.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </details>
          </header>
        </div>

        <dl
          aria-label="Ranchi Security at a glance"
          className="mt-7 grid grid-cols-2 border-y border-[var(--color-maroon-900)]/15 sm:mt-9 sm:grid-cols-4"
        >
          {ABOUT.stats.map((stat, index) => (
            <div
              key={stat.label}
              className={`flex min-h-[68px] flex-col justify-center py-2.5 pr-3 sm:min-h-[82px] sm:py-4 ${
                index % 2 === 0 ? "border-r" : ""
              } ${
                index < 2 ? "border-b sm:border-b-0" : ""
              } ${
                index < ABOUT.stats.length - 1
                  ? "border-[var(--color-maroon-900)]/15 sm:border-r"
                  : "sm:border-r-0"
              } ${
                index % 2 === 1 ? "pl-4 sm:pl-5" : "sm:pl-0"
              }`}
            >
              <dt className="order-2 mt-1 text-[9px] font-semibold uppercase tracking-[0.13em] text-[var(--color-grey-700)] sm:text-[10px]">
                {stat.label}
              </dt>
              <dd className="order-1 font-serif text-[1.45rem] leading-none tracking-tight text-[var(--color-maroon-900)] sm:text-[1.7rem]">
                <CountUp to={stat.count} suffix={stat.suffix} duration={1.2} />
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

export function AboutJourney() {
  return (
    <section
      id="about-journey"
      aria-labelledby="about-journey-heading"
      data-tone="dark"
      className="overflow-hidden bg-[var(--color-maroon-950)] py-10 text-white sm:py-14 lg:py-16"
    >
      <div className="mx-auto max-w-[1320px] px-5 sm:px-8 lg:px-12">
        <header         className="mb-6 flex flex-col gap-3 sm:mb-9 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-white/65 sm:text-[11px]">
              <span aria-hidden="true" className="h-px w-7 bg-[#D4B77B]" />
              Our Journey
            </p>
            <h2
              id="about-journey-heading"
              className="font-serif text-[clamp(2rem,4.3vw,3.35rem)] font-medium leading-[1.02] tracking-[-0.035em]"
            >
              Milestones that <span className="italic text-[#D4B77B]">built us.</span>
            </h2>
          </div>
          <p className="max-w-[37ch] text-[12px] leading-relaxed text-white/70 sm:text-[13px] sm:text-right">
            From an ex-servicemen enterprise to a group shaped by service,
            training and growth.
          </p>
        </header>

        <p className="mb-2 flex items-center gap-2 text-[9px] font-semibold uppercase tracking-[0.16em] text-[#D4B77B] md:hidden">
          Swipe through the milestones
          <ArrowRight aria-hidden="true" className="h-3.5 w-3.5" />
        </p>
        <ol
          aria-label="Ranchi Security milestones"
          tabIndex={0}
          className="flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain focus-visible:outline-offset-4 md:grid md:grid-cols-3 md:overflow-visible md:snap-none xl:grid-cols-6"
        >
          {milestones.map((milestone, index) => (
            <li
              key={milestone.id}
              className="relative w-[78vw] max-w-[280px] shrink-0 snap-start border-t border-white/25 pb-2 pr-5 pt-4 before:absolute before:left-0 before:top-[-4px] before:h-2 before:w-2 before:rounded-full before:bg-[#D4B77B] before:content-[''] md:w-auto md:max-w-none md:pb-0 md:pr-5 md:pt-5 xl:pr-4"
            >
              <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#D4B77B] sm:text-[10px]">
                {milestone.year}
              </p>
              <h3 className="mt-2 font-serif text-[1.15rem] leading-tight text-white sm:text-[1.25rem] xl:text-[1.1rem]">
                {milestone.title}
              </h3>
              <p className="mt-2 max-w-[28ch] text-[11px] leading-[1.65] text-white/65 sm:text-xs">
                {milestone.text}
              </p>
              {index < milestones.length - 1 && (
                <span
                  aria-hidden="true"
                  className="absolute right-0 top-[-1px] hidden h-px w-3 bg-[#D4B77B]/70 xl:block"
                />
              )}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function AboutGroup() {
  return (
    <section
      id="about-group"
      aria-labelledby="about-group-heading"
      className="border-b border-[var(--color-maroon-900)]/15 bg-white py-8 sm:py-12"
    >
      <div className="mx-auto grid max-w-[1320px] gap-4 px-5 sm:px-8 md:grid-cols-[minmax(0,0.75fr)_minmax(0,1.25fr)] md:gap-10 lg:px-12">
        <header className="flex items-start gap-3 md:block">
          <Building2
            aria-hidden="true"
            className="mt-1 h-4 w-4 shrink-0 text-[var(--color-accent)] md:mb-3"
            strokeWidth={1.5}
          />
          <div>
            <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[var(--color-grey-700)]">
              Our group
            </p>
            <h2
              id="about-group-heading"
              className="mt-1 font-serif text-[1.45rem] font-medium leading-tight tracking-tight text-[var(--color-maroon-950)] sm:text-[1.75rem]"
            >
              Three organisations, one group.
            </h2>
          </div>
        </header>

        <ol className="grid divide-y divide-[var(--color-maroon-900)]/15 border-y border-[var(--color-maroon-900)]/15 md:grid-cols-3 md:divide-y-0 md:divide-x">
          {ABOUT.organisations.map((organisation, index) => (
            <li
              key={organisation.name}
              className="grid grid-cols-[2rem_minmax(0,1fr)] gap-2 py-2 md:block md:px-4 md:py-2 md:first:pl-0 md:last:pr-0"
            >
              <span className="pt-0.5 font-serif text-sm italic text-[var(--color-accent)]">
                0{index + 1}
              </span>
              <div>
                <h3 className="font-serif text-[1rem] leading-snug text-[var(--color-maroon-900)] sm:text-[1.05rem]">
                  {organisation.name}
                </h3>
                <p className="mt-1 text-[11px] leading-relaxed text-[var(--color-grey-700)] sm:text-xs">
                  {organisation.note}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function AboutPillars() {
  return (
    <section
      id="about-credentials"
      aria-labelledby="about-credentials-heading"
      className="bg-[var(--color-paper)] py-9 sm:py-14"
    >
      <div className="mx-auto grid max-w-[1320px] gap-5 px-5 sm:px-8 md:grid-cols-[minmax(0,0.75fr)_minmax(0,1.25fr)] md:items-start md:gap-10 lg:px-12">
        <header className="relative border-l-2 border-[#B99A63] pl-4 sm:pl-5">
          <p className="mb-2 text-[9px] font-semibold uppercase tracking-[0.2em] text-[var(--color-grey-700)] sm:text-[10px]">
            The RSP difference
          </p>
          <h2
            id="about-credentials-heading"
            className="max-w-[16ch] font-serif text-[clamp(1.9rem,3.8vw,2.8rem)] font-medium leading-[1.02] tracking-[-0.03em] text-[var(--color-maroon-950)]"
          >
            Why organisations choose RSP
          </h2>
          <p className="mt-3 max-w-[40ch] text-[12px] leading-relaxed text-[var(--color-grey-700)] sm:text-[13px]">
            Four foundations of institutional trust, from leadership and
            empanelment to quality and accredited training.
          </p>
        </header>

        <ol className="divide-y divide-[var(--color-maroon-900)]/15 border-y border-[var(--color-maroon-900)]/15">
          {ABOUT.whyChooseUs.map((item, index) => {
            const Icon = credentialIcons[item.icon];

            return (
              <li key={item.title}>
                <details className="group">
                  <summary className="grid min-h-[54px] cursor-pointer list-none grid-cols-[2rem_1.75rem_minmax(0,1fr)_1rem] items-center gap-2 py-2 text-[var(--color-maroon-950)] marker:hidden focus-visible:outline-offset-2 sm:min-h-[62px] sm:grid-cols-[2.4rem_2rem_minmax(0,1fr)_1rem] sm:gap-3">
                    <span
                      aria-hidden="true"
                      className="font-serif text-sm italic text-[var(--color-accent)]"
                    >
                      0{index + 1}
                    </span>
                    <Icon
                      aria-hidden="true"
                      className="h-[17px] w-[17px] text-[var(--color-maroon-800)] sm:h-[18px] sm:w-[18px]"
                      strokeWidth={1.5}
                    />
                    <span className="text-[13px] font-semibold leading-snug sm:text-sm">
                      {item.title}
                    </span>
                    <ChevronDown
                      aria-hidden="true"
                      className="h-4 w-4 text-[var(--color-grey-700)] transition-transform duration-300 group-open:rotate-180 motion-reduce:transition-none"
                    />
                  </summary>
                  <p className="pb-4 pl-[3.5rem] pr-5 text-[11px] leading-[1.7] text-[var(--color-grey-700)] sm:pb-5 sm:pl-[4.8rem] sm:text-xs">
                    {item.description}
                  </p>
                </details>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
