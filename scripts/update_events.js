const fs = require('fs');

let text = fs.readFileSync('D:/rsecurity/src/components/events/Events.tsx', 'utf-8');

if (!text.includes('SectionHeader')) {
  text = text.replace(/import \{ SplitHeading \} from "\.\.\/ui\/SplitHeading";\nimport \{ Reveal \} from "\.\.\/ui\/Reveal";/, 
    'import { SectionHeader } from "../ui/SectionHeader";\nimport { Reveal } from "../ui/Reveal";');
}

text = text.replace(/className="relative isolate bg-white py-12 lg:py-16 overflow-hidden flex flex-col md:max-h-\[100svh\]"/, 'className="relative isolate bg-white py-[var(--section-y)] overflow-hidden flex flex-col md:max-h-[100svh]"');

const headerRegex = /<header className="mb-6 lg:mb-8 flex flex-col lg:flex-row lg:items-end justify-between gap-5">[\s\S]*?<\/header>/;

const newHeader = `<SectionHeader
          eyebrow="Latest events"
          heading="Moments that define us."
          accent="define"
          rightContent={
            <div className="flex items-center gap-4">
              <p className="text-[12px] font-medium tracking-wide text-grey-mid font-mono">
                {EVENT_STATS.count} stories &middot; {EVENT_STATS.yearStart}–{EVENT_STATS.yearEnd}
              </p>
              <span className="w-1 h-1 rounded-full bg-grey-soft" aria-hidden="true" />
            </div>
          }
          linkText="All events"
          linkHref="/events"
        />`;

text = text.replace(headerRegex, newHeader);

// We need to keep the red pulsing dot! 
// Wait, the red pulsing dot was inside the eyebrow. SectionHeader accepts eyebrow string. 
// Can I pass React element? I'll just keep SectionHeader signature simple. 
// Let's modify SectionHeader to accept ReactNode for eyebrow, or I'll just change the newHeader eyebrow to simple string.
// The user prompt said: Add a shared <SectionHeader> (eyebrow with small crimson square + H2 in Newsreader with one italic accent word + optional right-side link), used by every section so headers align.
// I literally added the small crimson square into SectionHeader.tsx earlier!
// `<span className="w-1.5 h-1.5 bg-accent shrink-0" aria-hidden="true" />` is in `<SectionHeader>`. So it has the red square inside the shared component.
// The pulsing red dot was a special flair for events, but standardizing it is exactly what they asked ("used by every section so headers align"). I will just pass "Latest events".

fs.writeFileSync('D:/rsecurity/src/components/events/Events.tsx', text);
