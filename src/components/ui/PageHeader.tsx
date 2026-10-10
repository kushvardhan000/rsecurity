import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface PageHeaderProps {
  breadcrumbs: Array<{ label: string; href?: string }>;
  title: string;
  subtitle?: string;
}

export function PageHeader({ breadcrumbs, title, subtitle }: PageHeaderProps) {
  return (
    <header className="bg-[var(--color-maroon-950)] text-white py-12 lg:py-16">
      <div className="mx-auto max-w-[1240px] px-[clamp(16px,4vw,48px)]">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex flex-wrap items-center gap-2 text-sm text-white/70">
            <li>
              <Link
                href="/"
                className="flex items-center gap-1.5 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Home
              </Link>
            </li>
            {breadcrumbs.map((crumb) => (
              <li key={crumb.label} className="flex items-center gap-2">
                <span className="text-white/30" aria-hidden="true">/</span>
                {crumb.href ? (
                  <Link
                    href={crumb.href}
                    className="hover:text-white transition-colors"
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span aria-current="page">{crumb.label}</span>
                )}
              </li>
            ))}
          </ol>
        </nav>

        {/* Title */}
        <div>
          <h1 className="font-serif text-3xl md:text-5xl lg:text-[56px] leading-tight font-medium tracking-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-4 text-white/80 text-base md:text-lg max-w-2xl leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </header>
  );
}