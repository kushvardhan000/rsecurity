import type { ReactNode } from "react";
import { cn } from "@/src/lib/cn";

type Tone = "light" | "offwhite" | "dark";

type SectionShellProps = {
  children: ReactNode;
  tone?: Tone;
  /** eyebrow label rendered above the heading (red rule + uppercase small-caps) */
  eyebrow?: string;
  /** heading node, usually <SplitHeading/> */
  heading?: ReactNode;
  /** id used by aria-labelledby when a heading is present */
  headingId?: string;
  /** soft vignette overlay for dark cinematic sections */
  vignette?: boolean;
  className?: string;
  id?: string;
};

const tones: Record<Tone, string> = {
  light: "bg-white text-grey-dark",
  offwhite: "bg-offwhite text-grey-dark",
  dark: "bg-maroon-950 text-white",
};

/**
 * Consistent section wrapper: mobile-first padding,
 * 1320px container, optional dark/light tone, eyebrow + heading slots.
 */
export function SectionShell({
  children,
  tone = "light",
  eyebrow,
  heading,
  headingId,
  vignette = false,
  className,
  id,
}: SectionShellProps) {
  const labelledBy = heading && headingId ? { "aria-labelledby": headingId } : {};

  return (
    <section
      id={id}
      data-tone={tone}
      className={cn(
        "relative isolate overflow-x-clip",
        tones[tone],
        vignette && "vignette",
        className,
      )}
      {...labelledBy}
    >
      <div className="mx-auto w-full max-w-[1320px] px-5 py-20 sm:px-8 md:py-28 lg:px-12 lg:py-36">
        {(eyebrow || heading) && (
          <header className="mb-12 max-w-3xl md:mb-16">
            {eyebrow && <p className="eyebrow mb-5">{eyebrow}</p>}
            {heading}
          </header>
        )}
        {children}
      </div>
    </section>
  );
}
