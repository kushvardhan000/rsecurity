import { SectionHeader } from "../ui/SectionHeader";
import { AWARDS } from "@/src/data/awards";

import { Reveal } from "../ui/Reveal";
import { AwardsInteractive } from "./AwardsInteractive";
import { SplitHeading } from "../ui/SplitHeading";

export function Awards() {
  return (
    <section
      id="awards"
      data-tone="light"
      className="relative isolate bg-paper py-16 md:py-20 overflow-hidden"
    >
      <div className="mx-auto max-w-[1320px] px-4 sm:px-8 lg:px-12 w-full">
        {/* Header Section */}
        <SectionHeader
          eyebrow="Excellence"
          title="Recognised at the"
          accentWord="highest levels."
        />

        {/* Interactive Desktop / Mobile Display */}
        <div className="w-full">
          <AwardsInteractive awards={AWARDS} />
        </div>
      </div>
    </section>
  );
}