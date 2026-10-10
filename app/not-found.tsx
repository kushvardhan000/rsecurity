import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Page Not Found | Ranchi Security",
  description: "The page you're looking for doesn't exist or has been moved.",
};

export default function NotFound() {
  return (
    <main className="flex min-h-[70vh] items-center justify-center bg-[var(--color-paper)] px-[clamp(16px,4vw,48px)]">
      <div className="text-center max-w-md">
        <h1 className="font-serif text-6xl md:text-8xl font-medium text-[var(--color-accent)] leading-none mb-4">
          404
        </h1>
        <h2 className="font-semibold text-2xl md:text-3xl text-[var(--color-grey-dark)] mb-4">
          Page Not Found
        </h2>
        <p className="text-[var(--color-grey-mid)] text-lg mb-8 max-w-sm mx-auto">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
          Let&apos;s get you back on track.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 h-12 px-6 rounded-sm bg-[var(--color-accent)] text-white font-bold tracking-widest uppercase text-[12px] hover:bg-[var(--color-accent-hover)] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
      </div>
    </main>
  );
}