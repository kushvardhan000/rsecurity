const fs = require('fs');

let text = fs.readFileSync('D:/rsecurity/src/components/gallery/Gallery.tsx', 'utf-8');

if (!text.includes('SectionHeader')) {
  text = text.replace(/import \{ SplitHeading \} from "\.\.\/ui\/SplitHeading";/, 
    'import { SectionHeader } from "../ui/SectionHeader";');
}

// Remove its heights and use --section-y
text = text.replace(/className="relative isolate w-full overflow-x-clip bg-maroon-theme flex flex-col h-\[70svh\] md:h-\[76svh\]"/, 
  'className="relative isolate w-full overflow-x-clip bg-maroon-theme flex flex-col py-[var(--section-y)] h-[70svh] md:h-[76svh]"');

const headerRegex = /<header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6 md:mb-8">[\s\S]*?<\/header>/;
const newHeader = `<SectionHeader
          eyebrow="Our Journey"
          eyebrowColor="text-white/70"
          textColor="text-white"
          heading="A legacy, in pictures."
          accent="pictures."
          linkText="View full gallery"
          linkHref="#contact"
        />`;

text = text.replace(headerRegex, newHeader);
fs.writeFileSync('D:/rsecurity/src/components/gallery/Gallery.tsx', text);
