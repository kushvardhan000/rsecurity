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
      <div className="relative w-full h-full transition-transform duration-300 hover:scale-105 filter drop-shadow-[0_4px_16px_rgba(0,0,0,0.22)]">
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

          <g className="animate-[spin_28s_linear_infinite] [transform-origin:100px_100px]">
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

const StatBox = ({
  value,
  suffix,
  label,
  preloaderDone,
  border = false,
}: {
  value: number;
  suffix: string;
  label: string;
  preloaderDone: boolean;
  border?: boolean;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const formatter = useMemo(() => new Intl.NumberFormat('en-IN'), []);
  const finalString = formatter.format(value) + suffix;
  const charsCount = finalString.length;
  const mountedAt = useRef<number | null>(null);

  useLayoutEffect(() => {
    if (!ref.current) return;
    if (ref.current.dataset.finished === 'true') return;

    const t = ref.current.firstChild as Text;
    if (!t) return;

    // Always render final on reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      t.nodeValue = finalString;
      ref.current.dataset.finished = 'true';
      return;
    }

    t.nodeValue = "0" + suffix;
  }, [finalString, suffix]);

  useEffect(() => {
    if (mountedAt.current === null) mountedAt.current = Date.now();
    const el = ref.current;
    if (!el || el.dataset.finished === 'true') return;
    const t = el.firstChild as Text;
    if (!t) return;

    let rafId: number;
    let observer: IntersectionObserver;
    let fallbackTimeout: NodeJS.Timeout | undefined;

    const startAnimation = () => {
      if (el.dataset.started === 'true' || el.dataset.finished === 'true') return;
      el.dataset.started = 'true';
      if (observer) observer.disconnect();

      const startTime = performance.now();
      const duration = 1400;

      const animate = (time: number) => {
        const rawProgress = Math.min((time - startTime) / duration, 1);
        const easedProgress = Math.min(1, 1 - Math.pow(1 - rawProgress, 3));
        const currentVal = Math.round(easedProgress * value);

        t.nodeValue = formatter.format(currentVal) + suffix;

        if (rawProgress < 1) {
          rafId = requestAnimationFrame(animate);
        } else {
          t.nodeValue = finalString;
          el.dataset.finished = "true";
        }
      };
      rafId = requestAnimationFrame(animate);
    };

    const tryStart = () => {
      if (el.dataset.started === 'true') return;
      const rect = el.getBoundingClientRect();
      const isVisible = rect.top < window.innerHeight && rect.bottom >= 0;
      if (isVisible) {
        startAnimation();
      } else {
        if (!observer) {
          observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
              startAnimation();
            }
          }, { threshold: 0 });
          observer.observe(el);
        }
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden' && el.dataset.started === 'true' && el.dataset.finished !== 'true') {
        cancelAnimationFrame(rafId);
        t.nodeValue = finalString;
        el.dataset.finished = "true";
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    if (preloaderDone) {
      tryStart();
    }

    const elapsed = Date.now() - mountedAt.current!;
    const remaining = Math.max(0, 3500 - elapsed);

    /* eslint-disable-next-line prefer-const */
    fallbackTimeout = setTimeout(() => {
      startAnimation();
    }, remaining);

    return () => {
      cancelAnimationFrame(rafId);
      if (observer) observer.disconnect();
      clearTimeout(fallbackTimeout);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [preloaderDone, value, suffix, finalString, formatter]);

  return (
    <div
      className={`flex flex-col items-center justify-center text-center px-2 xs:px-4 sm:px-6 md:px-8 w-full ${
        border ? "border-r border-[#E3E1DE]" : ""
      }`}
    >
      <div
        className="text-[#7A1426] font-bold flex items-baseline justify-center tracking-tight"
        style={{
          fontFamily: "var(--font-display-serif, Georgia, serif)",
          fontSize: "clamp(1.4rem, 3.4vw, 2.75rem)",
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
        className="mt-1 sm:mt-1.5 text-neutral-700 uppercase font-bold text-center leading-tight tracking-[0.14em] sm:tracking-[0.18em]"
        style={{
          fontSize: "clamp(10.5px, 1.25vw, 13.5px)",
        }}
      >
        {label}
      </div>
    </div>
  );
};

export const Stats: React.FC = () => {
  const preloaderDone = usePreloaderDone();

  return (
    <section
      id="stats"
      data-tone="light"
      className="relative w-full bg-white border-b border-[#E3E1DE] z-10"
      style={{
        paddingTop: "max(10px, calc(var(--nav-h, 0px) + env(safe-area-inset-top)))",
      }}
    >
      <div className="relative mx-auto w-full max-w-5xl px-4 sm:px-8 md:px-12 py-3 sm:py-4">
        <div className="grid grid-cols-[auto_1fr] sm:grid-cols-3 items-center gap-3 xs:gap-6 sm:gap-8">
          <div className="flex items-center justify-center">
            <TrustMedallion className="w-[88px] h-[88px] xs:w-[100px] xs:h-[100px] sm:w-[114px] sm:h-[114px] md:w-[130px] md:h-[130px] lg:w-[140px] lg:h-[140px]" />
          </div>

          <div className="col-span-1 sm:col-span-2 grid grid-cols-2 items-center">
            <StatBox
              value={40000}
              suffix="+"
              label="DEPLOYED"
              preloaderDone={preloaderDone}
              border
            />
            <StatBox
              value={25000}
              suffix="+"
              label="TRAINED & CERTIFIED"
              preloaderDone={preloaderDone}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Stats;