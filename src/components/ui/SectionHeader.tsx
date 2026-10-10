import { cn } from "@/src/lib/cn";

export interface SectionHeaderProps {
  hideEyebrowSquare?: boolean;
  eyebrow?: string;
  title: string;
  accentWord: string;
  titleSuffix?: string;
  linkHref?: string;
  linkLabel?: string;
  className?: string;
  dark?: boolean;
}

export function SectionHeader({
  hideEyebrowSquare,
  eyebrow,
  title,
  accentWord,
  titleSuffix,
  linkHref,
  linkLabel,
  className,
  dark = false,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "mb-[clamp(32px,4vw,56px)] flex flex-col md:flex-row md:items-end justify-between gap-4",
        className
      )}
    >
      <div className="flex flex-col gap-4">
        {/* Eyebrow with small crimson square */}
        {eyebrow && (
        <div
          className={cn(
            "inline-flex items-center gap-3 text-[13px] font-semibold tracking-[0.28em] uppercase",
            dark ? "text-neutral-300" : "text-neutral-500"
          )}
        >
          {!hideEyebrowSquare && <div className={cn("w-1.5 h-1.5 shrink-0", dark ? "bg-rose-400" : "bg-[#A6192E]")} />}
          {eyebrow}
        </div>
        )}

        {/* H2 in Newsreader font (displaySerif) with one italic accent word */}
        <h2
          className={cn(
            "text-4xl md:text-5xl lg:text-6xl font-serif text-balance font-medium tracking-tight",
            dark ? "text-white" : "text-maroon-950",
            "var(--font-display-serif)"
          )}
        >
          {title}{" "}
          <span className={cn("italic", dark ? "text-rose-400" : "text-[#A6192E]")}>{accentWord}</span>
          {titleSuffix && ` ${titleSuffix}`}
        </h2>
      </div>

      {/* Optional right-side link */}
      {linkHref && linkLabel && (
        <a
          href={linkHref}
          className={cn(
            "text-sm font-semibold uppercase tracking-wider underline underline-offset-4 decoration-2 transition-colors md:mb-2",
            dark ? "text-white hover:text-rose-200 decoration-rose-400" : "text-neutral-900 hover:text-[#A6192E] decoration-[#A6192E]"
          )}
        >
          {linkLabel}
        </a>
      )}
    </div>
  );
}