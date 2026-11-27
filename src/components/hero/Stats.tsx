"use client";
import React, { useRef, useMemo, useLayoutEffect, useEffect } from "react";
import { usePreloaderDone } from "@/src/lib/preloader";

function TrustMedallion({
  year = "1995",
  label = "SINCE",
  className,
}: {
  year?: string;
  label?: string;
  className?: string;
}) {
  return (
    <div
      className={`shrink-0 flex items-center justify-center relative select-none ${
        className || ""
      }`}
    >
      <div className="relative w-full h-full transition-transform duration-300 hover:scale-105 motion-reduce:transition-none motion-reduce:hover:scale-100 filter drop-shadow-[0_4px_16px_rgba(0,0,0,0.22)]">
        <svg
          viewBox="0 0 200 200"
          className="w-full h-full overflow-visible"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="goldRim" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fae296" />
              <stop offset="20%" stopColor="#ffffff" />
              <stop offset="42%" stopColor="#d1a636" />
              <stop offset="68%" stopColor="#fdf1ad" />
              <stop offset="88%" stopColor="#875d0b" />
              <stop offset="100%" stopColor="#e5be53" />
            </linearGradient>

            <linearGradient id="goldShineText" x1="0%" y1="0%" x2="100%" y2="90%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="15%" stopColor="#fff9d6" />
              <stop offset="35%" stopColor="#ffd868" />
              <stop offset="52%" stopColor="#ffffff" />
              <stop offset="70%" stopColor="#e0a72c" />
              <stop offset="85%" stopColor="#fff2ba" />
              <stop offset="100%" stopColor="#ffffff" />
            </linearGradient>

            <radialGradient id="maroonPlate" cx="46%" cy="40%" r="62%">
              <stop offset="0%" stopColor="#ab1c27" />
              <stop offset="52%" stopColor="#700d14" />
              <stop offset="88%" stopColor="#400408" />
              <stop offset="100%" stopColor="#240104" />
            </radialGradient>

            <filter id="goldEmboss" x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow dx="0" dy="2.2" stdDeviation="0.5" floodColor="#0d0001" floodOpacity="1" />
              <feDropShadow dx="0" dy="-0.8" stdDeviation="0.4" floodColor="#ffffff" floodOpacity="0.85" />
            </filter>

            <path
              id="establishedArc"
              d="M 37 98 A 63 63 0 0 1 163 98"
              fill="none"
            />
          </defs>

          <g className="animate-[spin_28s_linear_infinite] motion-reduce:animate-none [transform-origin:100px_100px]">
            <path
              d={(() => {
                const points = 36;
                const cx = 100,
                  cy = 100,
                  outerR = 98,
                  innerR = 86;
                let pathStr = "";
                for (let i = 0; i <= points * 2 - 1; i++) {
                  const angle = (i * Math.PI) / points - Math.PI / 2;
                  const r = i % 2 === 0 ? outerR : innerR;
                  const x = cx + r * Math.cos(angle);
                  const y = cy + r * Math.sin(angle);
                  pathStr += `${i === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)} `;
                }
                return pathStr + "Z";
              })()}
              fill="url(#goldRim)"
            />
          </g>

          <circle cx="100" cy="100" r="82.5" fill="none" stroke="url(#goldRim)" strokeWidth="3.2" />
          <circle cx="100" cy="100" r="79.5" fill="none" stroke="#2b0103" strokeWidth="1" opacity="0.9" />

          <circle cx="100" cy="100" r="78.5" fill="url(#maroonPlate)" />

          <circle
            cx="100"
            cy="100"
            r="72"
            fill="none"
            stroke="url(#goldShineText)"
            strokeWidth="1.2"
            opacity="0.85"
            strokeDasharray="3 2"
          />

          <g filter="url(#goldEmboss)">
            <text
              fill="url(#goldShineText)"
              fontSize="12.5"
              fontWeight="900"
              letterSpacing="0.23em"
              className="uppercase select-none"
              style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
            >
              <textPath href="#establishedArc" startOffset="50%" textAnchor="middle">
                ESTABLISHED
              </textPath>
            </text>
          </g>

          <polygon
            points="100,66 102.8,73.4 110.2,73.4 104.2,77.8 106.5,84.8 100,80.5 93.5,84.8 95.8,77.8 89.8,73.4 97.2,73.4"
            fill="url(#goldShineText)"
            filter="url(#goldEmboss)"
          />

          <g filter="url(#goldEmboss)">
            <text
              x="100"
              y="105"
              textAnchor="middle"
              className="font-serif font-black tracking-[0.22em]"
              fill="url(#goldShineText)"
              fontSize="24"
              style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
            >
              {label}
            </text>

            <text
              x="100"
              y="142"
              textAnchor="middle"
              className="font-serif font-black tracking-tight"
              fill="url(#goldShineText)"
              fontSize="41"
              style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
            >
              {year}
            </text>
          </g>
        </svg>
      </div>
    </div>
  );
}

const DURATION = 1800; // ms the count-up takes
const PRELOADER_GRACE = 4000; // start anyway if the preloader signal never arrives

const StatBox = ({
  value,
  suffix,
  label,
  preloaderDone,
}: {
  value: number;
  suffix: string;
  label: string;
  preloaderDone: boolean;
}) => {
  const ref = useRef<HTMLSpanElement>(null);
  const rafRef = useRef(0);
  const formatter = useMemo(() => new Intl.NumberFormat("en-IN"), []);
  const finalString = formatter.format(value) + suffix;
  const charsCount = finalString.length;

  /* Set the starting text before paint (final text if reduced motion). */
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || el.dataset.finished === "true") return;
    const t = el.firstChild as Text | null;
    if (!t) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      t.nodeValue = finalString;
      el.dataset.finished = "true";
      return;
    }
    t.nodeValue = formatter.format(0) + suffix;
  }, [finalString, suffix, formatter]);

  /* Count up as soon as: (a) it is on screen AND (b) the preloader is done. */
  useEffect(() => {
    const el = ref.current;
    if (!el || el.dataset.finished === "true") return;
    const t = el.firstChild as Text | null;
    if (!t) return;

    let inView = false;
    let ready =
      preloaderDone ||
      document.documentElement.dataset.ready === "1" ||
      document.documentElement.dataset.preloaded === "1";
    let graceTimer: ReturnType<typeof setTimeout> | undefined;

    const finish = () => {
      cancelAnimationFrame(rafRef.current);
      t.nodeValue = finalString;
      el.dataset.finished = "true";
    };

    const start = () => {
      if (!inView || !ready) return;
      if (el.dataset.started === "true") return;
      el.dataset.started = "true";

      const startTime = performance.now();
      const tick = (now: number) => {
        const p = Math.min((now - startTime) / DURATION, 1);
        const eased = 1 - Math.pow(1 - p, 3); // ease-out cubic
        t.nodeValue = formatter.format(Math.round(eased * value)) + suffix;

        if (p < 1) {
          rafRef.current = requestAnimationFrame(tick);
        } else {
          finish();
        }
      };
      rafRef.current = requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
        start();
      },
      { threshold: 0.3 }
    );
    observer.observe(el);

    if (!ready) {
      graceTimer = setTimeout(() => {
        ready = true;
        start();
      }, PRELOADER_GRACE);
    }

    const onVisibility = () => {
      // rAF is paused in background tabs, so jump to the final number
      if (
        document.visibilityState === "hidden" &&
        el.dataset.started === "true" &&
        el.dataset.finished !== "true"
      ) {
        finish();
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    start();

    // Don't cancel rAF here: a mid-count animation must survive prop changes.
    return () => {
      observer.disconnect();
      clearTimeout(graceTimer);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [preloaderDone, value, suffix, finalString, formatter]);

  /* Cancel any running animation only on unmount. */
  useEffect(() => () => cancelAnimationFrame(rafRef.current), []);

  return (
    <div className="flex w-full flex-col items-center justify-center px-1 text-center xs:px-2 sm:px-3 lg:px-4">
      <div
        className="text-[#7A1426] font-bold flex items-baseline justify-center tracking-tight"
        style={{
          fontFamily: "var(--font-display-serif, Georgia, serif)",
          fontSize: "clamp(1.25rem, 3.2vw, 2.4rem)",
          lineHeight: "1.05",
        }}
      >
        <span
          ref={ref}
          className="tabular-nums inline-block text-right"
          style={{ minWidth: `${charsCount}ch` }}
        >
          {finalString}
        </span>
      </div>
      <div
        className="mt-1 sm:mt-1.5 text-neutral-700 uppercase font-bold text-center leading-tight tracking-[0.06em] sm:tracking-[0.14em]"
        style={{ fontSize: "clamp(10px, 1.05vw, 12px)" }}
      >
        {label}
      </div>
    </div>
  );
};

const isoStandards = [
  { number: "27001", year: "2022" },
  { number: "45001", year: "2018" },
  { number: "14001", year: "2015" },
  { number: "9001", year: "2015" },
];

function IsoCertificationBadge({ compact = false }: { compact?: boolean }) {
  if (compact) {
    return (
      <div className="grid w-full grid-cols-[auto_minmax(0,1fr)] items-center gap-x-2">
        <div className="flex items-center gap-1.5">
          <svg
            aria-hidden="true"
            viewBox="0 0 36 42"
            className="h-6 w-5 shrink-0"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M18 1.5 33 6v12.2c0 10.2-6.1 18.1-15 22.3C9.1 36.3 3 28.4 3 18.2V6l15-4.5Z"
              fill="#FBFAF8"
              stroke="#B99A63"
              strokeWidth="1.5"
            />
            <path
              d="m10.5 20.5 5 5 10-11"
              stroke="#7A1426"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path d="M11 31h14" stroke="#B99A63" strokeWidth="1.5" />
          </svg>
          <h3 className="whitespace-nowrap font-serif text-[9px] font-bold tracking-[0.06em] text-[#7A1426]">
            ISO CERTIFIED
          </h3>
        </div>
        <ul
          aria-label="Certified ISO standards"
          className="grid grid-cols-4 gap-0.5"
        >
          {isoStandards.map(({ number, year }) => (
            <li
              key={number}
              aria-label={`ISO ${number}:${year}`}
              className="min-w-0 text-center leading-tight"
            >
              <span className="block whitespace-nowrap text-[9px] font-semibold text-[#4D4240]">
                {number}
              </span>
              <span className="block text-[8px] text-[#4D4240]">:{year}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div className="w-full px-2 sm:px-4 lg:px-2">
      <div className="flex items-center justify-center gap-2">
        <svg
          aria-hidden="true"
          viewBox="0 0 36 42"
          className="h-9 w-8 shrink-0"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M18 1.5 33 6v12.2c0 10.2-6.1 18.1-15 22.3C9.1 36.3 3 28.4 3 18.2V6l15-4.5Z"
            fill="#FBFAF8"
            stroke="#B99A63"
            strokeWidth="1.5"
          />
          <path
            d="m10.5 20.5 5 5 10-11"
            stroke="#7A1426"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path d="M11 31h14" stroke="#B99A63" strokeWidth="1.5" />
        </svg>
        <h3 className="font-serif text-[11px] font-bold leading-tight tracking-[0.08em] text-[#7A1426] sm:text-xs">
          ISO CERTIFIED
        </h3>
      </div>
      <ul
        aria-label="Certified ISO standards"
        className="mt-2 grid grid-cols-2 gap-x-1 gap-y-1"
      >
        {isoStandards.map(({ number, year }) => (
          <li
            key={number}
            aria-label={`ISO ${number}:${year}`}
            className="min-w-0 text-center leading-tight"
          >
            <span className="hidden whitespace-nowrap text-[10px] font-semibold text-[#4D4240] sm:inline">
              ISO {number}:{year}
            </span>
            <span className="text-[10px] font-semibold text-[#4D4240] sm:hidden">
              <span className="block whitespace-nowrap">ISO {number}</span>
              <span className="block">:{year}</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export const Stats: React.FC = () => {
  const preloaderDone = usePreloaderDone();

  return (
    <section
      id="stats"
      data-tone="light"
      aria-label="RSP statistics and certifications"
      className="relative z-10 w-full border-b-0 bg-white lg:border-b lg:border-[#E3E1DE]"
      style={{
        paddingTop: "max(10px, calc(var(--nav-h, 0px) + env(safe-area-inset-top)))",
      }}
    >
      <div className="relative mx-auto w-full max-w-6xl px-4 py-3 sm:px-8 sm:py-4 md:px-12">
        <div className="grid grid-cols-3 items-stretch lg:grid-cols-4">
          <div className="flex min-h-[96px] items-center justify-center px-0 py-2 sm:min-h-[126px] sm:px-4 sm:py-3 lg:min-h-[146px] ">
            <TrustMedallion className="h-[72px] w-[72px] sm:h-[100px] sm:w-[100px] md:h-[130px] md:w-[130px] lg:h-[140px] lg:w-[140px]" />
          </div>
          <div className="flex min-h-[96px] items-center justify-center px-0 py-2 sm:min-h-[126px] sm:px-4 sm:py-3 lg:min-h-[146px]  ">
            <StatBox
              value={40000}
              suffix="+"
              label="DEPLOYED"
              preloaderDone={preloaderDone}
            />
          </div>
          <div className="flex min-h-[96px] items-center justify-center px-0 py-2 sm:min-h-[126px] sm:px-4 sm:py-3 lg:min-h-[146px] ">
            <StatBox
              value={25000}
              suffix="+"
              label="TRAINED & CERTIFIED"
              preloaderDone={preloaderDone}
            />
          </div>
          <div className="col-span-3 px-0 pt-2 lg:col-span-1 lg:flex lg:min-h-[146px] lg:items-center lg:px-4 lg:py-3">
            <div className="w-full border-t border-[var(--color-maroon-900)]/10 pt-2 lg:hidden">
              <IsoCertificationBadge compact />
            </div>
            <div className="hidden w-full lg:block">
              <IsoCertificationBadge />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Stats;