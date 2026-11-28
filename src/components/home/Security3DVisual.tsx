"use client";

import Image from "next/image";

export function SecurityPillar3DModels() {
  return (
    <div
      aria-hidden="true"
      className="relative inline-flex h-[52px] w-[52px] select-none items-center justify-center rounded-full border border-[#C8A265] bg-[#FAF8F5] p-0.5 shadow-[0_14px_26px_-4px_rgba(42,6,12,0.42)] sm:h-[58px] sm:w-[58px]"
    >
      {/* Orbiting Circular Stamp */}
      <svg
        viewBox="0 0 100 100"
        className="h-full w-full animate-[spin_22s_linear_infinite] motion-reduce:animate-none"
      >
        <defs>
          <path
            id="rsCompactSeal"
            d="M 50, 50 m -40, 0 a 40,40 0 1,1 80,0 a 40,40 0 1,1 -80,0"
          />
        </defs>
        <text
          fill="#2A060C"
          fontSize="8.4"
          fontWeight="800"
          letterSpacing="2.2"
        >
          <textPath href="#rsCompactSeal" startOffset="0%">
            ESTD 1995 &bull; RANCHI SECURITY &bull;
          </textPath>
        </text>
      </svg>

      {/* Enlarged RS Crest Filling Center (Zero Extra Padding) */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="relative h-7 w-7 sm:h-8 sm:w-8">
          <Image
            src="/logos/rsshortlogoBGTRANSPARENT.png"
            alt=""
            fill
            unoptimized
            className="object-contain drop-shadow-[0_2px_4px_rgba(42,6,12,0.18)]"
          />
        </div>
      </div>
    </div>
  );
}