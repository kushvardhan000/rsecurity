const fs = require('fs');

let text = fs.readFileSync('D:/rsecurity/src/components/cta/CTA.tsx', 'utf-8');

if (!text.includes('SectionHeader')) {
  text = text.replace(/import \{ SplitHeading \} from "@\/src\/components\/ui\/SplitHeading";/, 
    'import { SectionHeader } from "@/src/components/ui/SectionHeader";');
}

text = text.replace(/className="relative bg-white pt-20 pb-20 lg:pt-28 lg:pb-28"/, 
  'className="relative bg-white py-[var(--section-y)]"');

const headerRegex = /<p className="text-accent font-semibold tracking-\[0.18em\] uppercase text-sm sm:text-base">\s*Let&apos;s talk\s*<\/p>[\s\S]*?<\/Reveal>/;
const newHeader = `<SectionHeader
                    eyebrow="Let's talk"
                    heading="Let's secure what matters."
                    accent="matters"
                    textColor="text-white"
                  />`;

text = text.replace(headerRegex, newHeader);

fs.writeFileSync('D:/rsecurity/src/components/cta/CTA.tsx', text);
