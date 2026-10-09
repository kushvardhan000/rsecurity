const fs = require('fs');

let text = fs.readFileSync('D:/rsecurity/src/components/awards/Awards.tsx', 'utf-8');

if (!text.includes('SectionHeader')) {
  text = 'import { SectionHeader } from "../ui/SectionHeader";\n' + text.replace(/import \{ SplitHeading \} from "\.\.\/ui\/SplitHeading";/, '');
}

text = text.replace(/className="relative isolate bg-paper pt-12 pb-16 lg:pt-16 lg:pb-0 overflow-hidden min-h-\[560px\] md:min-h-\[640px\] max-h-\[100svh\]"/, 
  'className="relative isolate bg-paper overflow-hidden py-[var(--section-y)] min-h-[560px] md:min-h-[640px] max-h-[100svh]"');

const headerRegex = /<header className="mb-8 lg:mb-12 flex flex-col md:flex-row md:items-end justify-between gap-5 shrink-0">[\s\S]*?<\/header>/;

const newHeader = `<SectionHeader
          eyebrow="Awards"
          heading="Recognised at the highest levels."
          accent="highest"
          rightContent={
            <p className="text-[12px] font-bold tracking-[0.14em] uppercase text-grey-mid">
              {AWARDS.length} honours &middot; 2013–2019
            </p>
          }
        />`;

text = text.replace(headerRegex, newHeader);
fs.writeFileSync('D:/rsecurity/src/components/awards/Awards.tsx', text);

let galleryText = fs.readFileSync('D:/rsecurity/src/components/gallery/Gallery.tsx', 'utf-8');
galleryText = galleryText.replace(/pt-8 md:pt-10 shrink-0/, 'shrink-0');
fs.writeFileSync('D:/rsecurity/src/components/gallery/Gallery.tsx', galleryText);
