'use client';
import React from 'react';
import CountUp from 'react-countup';
import { usePreloaderDone } from "@/src/lib/preloader";

function TrustMedallion({ year = "1995", label = "SINCE" }: { year?: string; label?: string }) {
  return (
    <div className="shrink-0 flex items-center justify-center relative select-none">
      {/* Ambient gold glow behind medal */}
      <div 
        className="absolute w-[210px] h-[210px] sm:w-[230px] sm:h-[230px] md:w-[220px] md:h-[220px] lg:w-[245px] lg:h-[245px] rounded-full bg-gradient-to-tr from-[#d4af37]/35 via-[#f5d061]/25 to-transparent blur-2xl pointer-events-none -z-10" 
        aria-hidden="true"
      />

      <div className="relative w-[180px] h-[180px] xs:w-[195px] xs:h-[195px] sm:w-[200px] sm:h-[200px] md:w-[190px] md:h-[190px] lg:w-[220px] lg:h-[220px] filter drop-shadow-[0_14px_28px_rgba(128,16,32,0.25)] transition-transform duration-300 hover:scale-[1.03]">
        <svg
          viewBox="0 0 200 200"
          className="w-full h-full overflow-visible"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Metallic Gold Gradient for Outer Serrated Starburst */}
            <linearGradient id="goldRim" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#d4af37" />
              <stop offset="22%" stopColor="#fff6b8" />
              <stop offset="44%" stopColor="#c59b27" />
              <stop offset="70%" stopColor="#f3cf65" />
              <stop offset="88%" stopColor="#966a15" />
              <stop offset="100%" stopColor="#ffd875" />
            </linearGradient>

            {/* Specular Lustrous Gold for Rings, Star & Foil Typography */}
            <linearGradient id="goldLuster" x1="0%" y1="0%" x2="100%" y2="85%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="25%" stopColor="#fde089" />
              <stop offset="50%" stopColor="#dfa72c" />
              <stop offset="78%" stopColor="#9a6e16" />
              <stop offset="100%" stopColor="#ffea9f" />
            </linearGradient>

            {/* Rich Radial Crimson Plate */}
            <radialGradient id="maroonPlate" cx="48%" cy="45%" r="55%">
              <stop offset="0%" stopColor="#b4232c" />
              <stop offset="65%" stopColor="#87171e" />
              <stop offset="100%" stopColor="#5c0d12" />
            </radialGradient>

            {/* Embossed Drop Shadow for Crisp Relief */}
            <filter id="goldEmboss" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="1.6" stdDeviation="0.9" floodColor="#380005" floodOpacity="0.85" />
            </filter>

            {/* Subtle path for curved ESTABLISHED text */}
            <path
              id="establishedArc"
              d="M 44 95 A 58 58 0 0 1 156 95"
              fill="none"
            />
          </defs>

          {/* ── 1. ROTATING OUTER SERRATED GOLD GEAR ── */}
          {/* Centered at (100, 100) with a smooth 24s infinite spin */}
          <g className="animate-[spin_24s_linear_infinite] [transform-origin:100px_100px]">
            <path
              d={(() => {
                const points = 36;
                const cx = 100, cy = 100, outerR = 98, innerR = 86;
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

          {/* ── 2. STATIC MEDALLION CORE & INNER RINGS ── */}
          {/* Outer Beveled Gold Ring */}
          <circle cx="100" cy="100" r="82" fill="none" stroke="url(#goldLuster)" strokeWidth="4" />
          <circle cx="100" cy="100" r="79.5" fill="none" stroke="#68470a" strokeWidth="0.8" opacity="0.6" />

          {/* Inner Maroon Core Plate */}
          <circle cx="100" cy="100" r="78" fill="url(#maroonPlate)" />

          {/* Thin Gold Pinstripe Ring */}
          <circle
            cx="100"
            cy="100"
            r="70"
            fill="none"
            stroke="url(#goldLuster)"
            strokeWidth="1.2"
            opacity="0.9"
          />

          {/* ── 3. STATIC TYPOGRAPHY & MOTIF ── */}
          {/* Curved ESTABLISHED Arch Text */}
          <g filter="url(#goldEmboss)">
            <text
              fill="url(#goldLuster)"
              fontSize="9"
              fontWeight="800"
              letterSpacing="0.28em"
              className="uppercase select-none"
              style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
            >
              <textPath href="#establishedArc" startOffset="50%" textAnchor="middle">
                ESTABLISHED
              </textPath>
            </text>
          </g>

          {/* Small Accent Star */}
          <polygon
            points="100,69 101.8,74.2 107.2,74.2 102.8,77.5 104.5,82.8 100,79.5 95.5,82.8 97.2,77.5 92.8,74.2 98.2,74.2"
            fill="url(#goldLuster)"
            filter="url(#goldEmboss)"
          />

          {/* SINCE */}
          <g filter="url(#goldEmboss)">
            <text
              x="100"
              y="105"
              textAnchor="middle"
              className="font-serif font-extrabold tracking-[0.16em]"
              fill="url(#goldLuster)"
              fontSize="21"
              style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
            >
              {label}
            </text>

            {/* YEAR */}
            <text
              x="100"
              y="139"
              textAnchor="middle"
              className="font-serif font-black tracking-tight"
              fill="url(#goldLuster)"
              fontSize="34"
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
export const Stats: React.FC = () => {
  const preloaderDone = usePreloaderDone();
  return (
    <section
      id="stats"
      data-tone="light"
      className="relative isolate w-full bg-gradient-to-b from-white via-[#FCF9F7] to-white py-4 sm:py-10 md:py-12 border-y border-neutral-200/80 overflow-hidden"
    >
      <div className="relative w-full max-w-[1320px] px-5 sm:px-8 lg:px-12 flex flex-col md:flex-row items-center justify-between gap-10 md:gap-8">

        {/* Left: Seal */}
       <TrustMedallion />

        {/* Right: Stats Grid */}
        <div className="w-full flex-1 grid grid-cols-2 md:grid-cols-3 gap-y-10 md:gap-y-0 md:divide-x md:divide-[var(--color-grey-soft)]">
          <StatBox value={40000} suffix="+" label="Personnel Deployed" delay={0} preloaderDone={preloaderDone} />
          <StatBox value={25000} suffix="+" label="Youth Trained & Certified" delay={0.1} preloaderDone={preloaderDone} />
          <StatBox value={500} suffix="+" label="Ex-Servicemen Deployed" delay={0.2} preloaderDone={preloaderDone} />
          {/* <StatBox value={3} suffix="" label="Group Organisations" delay={0.3} preloaderDone={preloaderDone} /> */}
        </div>

      </div>
    </section>
  );
};

const StatBox = ({ value, suffix, label, delay, preloaderDone }: { value: number; suffix: string; label: string; delay: number; preloaderDone: boolean }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center px-1 sm:px-4">
      <div className="text-[36px] md:text-[52px] font-display font-semibold text-[#80141e] leading-none tabular-nums flex items-baseline">
        <CountUp end={preloaderDone ? value : 0} separator="," enableScrollSpy scrollSpyOnce delay={delay} />
        <span className="font-light">{suffix}</span>
      </div>
      <div className="mt-2 md:mt-3 text-[11px] font-bold uppercase tracking-wider text-gray-700">
        {label}
      </div>
    </div>
  );
};

export default Stats;
