"use client";

import { useEffect } from "react";
import { ArrowLeft, RefreshCcw } from "lucide-react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <main className="flex min-h-[70vh] items-center justify-center bg-[var(--color-paper)] px-[clamp(16px,4vw,48px)]">
      <div className="text-center max-w-md">
        <h1 className="font-serif text-5xl md:text-7xl font-medium text-[var(--color-accent)] leading-none mb-4">
          Error
        </h1>
        <h2 className="font-semibold text-2xl md:text-3xl text-[var(--color-grey-dark)] mb-4">
          Something went wrong
        </h2>
        <p className="text-[var(--color-grey-mid)] text-lg mb-8 max-w-sm mx-auto">
          We encountered an unexpected error. Please try again or go back to the homepage.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => reset()}
            className="inline-flex items-center gap-2 h-12 px-6 rounded-sm bg-[var(--color-accent)] text-white font-bold tracking-widest uppercase text-[12px] hover:bg-[var(--color-accent-hover)] transition-colors w-full sm:w-auto justify-center"
          >
            <RefreshCcw className="w-4 h-4" />
            Try Again
          </button>
          <Link
            href="/"
            className="inline-flex items-center gap-2 h-12 px-6 rounded-sm bg-white border border-[var(--color-grey-soft)] text-[var(--color-grey-dark)] font-bold tracking-widest uppercase text-[12px] hover:bg-neutral-50 transition-colors w-full sm:w-auto justify-center"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}
