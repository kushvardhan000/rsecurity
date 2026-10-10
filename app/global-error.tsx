"use client";

import { useEffect } from "react";
import { ArrowLeft, RefreshCcw } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global error:", error);
  }, [error]);

  return (
    <html lang="en">
      <body className="bg-[#FAF8F5] text-[#220002] font-sans antialiased">
        <main className="flex min-h-[100dvh] items-center justify-center p-6">
          <div className="text-center max-w-md">
            <h1 className="font-serif text-5xl md:text-7xl font-medium text-[#A6192E] leading-none mb-4">
              Error
            </h1>
            <h2 className="font-semibold text-2xl md:text-3xl text-neutral-800 mb-4">
              Critical Error
            </h2>
            <p className="text-neutral-600 text-lg mb-8 max-w-sm mx-auto">
              Something went fundamentally wrong. Please refresh the page.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => reset()}
                className="inline-flex items-center gap-2 h-12 px-6 rounded-sm bg-[#A6192E] text-white font-bold tracking-widest uppercase text-[12px] hover:bg-[#800020] transition-colors w-full sm:w-auto justify-center"
              >
                <RefreshCcw className="w-4 h-4" />
                Try Again
              </button>
              <a
                href="/"
                className="inline-flex items-center gap-2 h-12 px-6 rounded-sm bg-white border border-neutral-200 text-neutral-800 font-bold tracking-widest uppercase text-[12px] hover:bg-neutral-50 transition-colors w-full sm:w-auto justify-center"
              >
                <ArrowLeft className="w-4 h-4" />
                Reload Home
              </a>
            </div>
          </div>
        </main>
      </body>
    </html>
  );
}
