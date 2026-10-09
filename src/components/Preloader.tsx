import Image from "next/image";
import { PreloaderController } from "./PreloaderController";

const LOGO = "/logos/rsfullllogoBGTRANSPARENT.png";
const circumference = 276.46; // 2 * Math.PI * 44

export function Preloader() {
  return (
    <>
      <PreloaderController />
      <div
        id="preloader"
        className="fixed inset-0 z-[99999] flex h-[100dvh] w-full items-center justify-center overflow-hidden bg-white text-slate-900 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
        aria-label="Loading Ranchi Security"
        role="status"
      >
        {/* Soft Ambient Maroon Glow */}
        <div
          className="pointer-events-none absolute inset-0 select-none"
          aria-hidden="true"
          style={{
            background:
              "radial-gradient(circle at center, rgba(128,0,32,0.06) 0%, transparent 65%)",
          }}
        />

        <div className="relative z-10 flex h-full w-full flex-col items-center justify-center px-5 sm:px-8">
          {/* Logo & Circular Ring Wrapper */}
          <div className="relative flex h-40 w-40 items-center justify-center sm:h-48 sm:w-48 md:h-52 md:w-52">
            <svg
              viewBox="0 0 100 100"
              className="absolute inset-0 h-full w-full -rotate-90 select-none"
              aria-hidden="true"
            >
              {/* Track Ring */}
              <circle
                cx="50"
                cy="50"
                r="44"
                fill="none"
                stroke="#800020"
                strokeOpacity="0.12"
                strokeWidth="1.5"
              />
              {/* Progress Ring */}
              <circle
                id="preloader-ring"
                cx="50"
                cy="50"
                r="44"
                fill="none"
                stroke="#800020"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeDasharray={circumference}
                style={{
                  strokeDashoffset: circumference,
                  transition: "stroke-dashoffset 0.12s linear",
                }}
              />
            </svg>

            {/* Unaltered Maroon Logo */}
            <div
              className="relative h-24 w-24 sm:h-28 sm:w-28 md:h-32 md:w-32 select-none [user-drag:none] [-webkit-user-drag:none]"
            >
              <Image
                src={LOGO}
                alt="Ranchi Security"
                fill
                priority
                draggable={false}
                sizes="(max-width: 640px) 96px, (max-width: 768px) 112px, 128px"
                className="object-contain pointer-events-none select-none [user-drag:none] [-webkit-user-drag:none]"
              />
            </div>
          </div>

          {/* Typography Content */}
          <div className="mt-8 flex flex-col items-center text-center sm:mt-10">
            <span className="text-xs font-bold uppercase tracking-[0.35em] sm:text-sm text-[#68001A]">
              Ranchi Security
            </span>

            <span className="mt-2 text-[9px] font-semibold uppercase tracking-[0.22em] sm:text-[10px] text-slate-700">
              Security • Training • Manpower
            </span>

            <div className="mt-4 h-px w-14 sm:w-20 bg-[#800020]/25" />

            <span className="mt-3.5 text-[9px] font-medium uppercase tracking-[0.22em] sm:text-[10px] text-slate-500">
              Securing your experience
            </span>
          </div>
        </div>
      </div>
    </>
  );
}