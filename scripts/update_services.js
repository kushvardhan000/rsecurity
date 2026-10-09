const fs = require('fs');

let text = fs.readFileSync('D:/rsecurity/src/components/services/Services.tsx', 'utf-8');

// Insert SectionHeader import
if (!text.includes('SectionHeader')) {
  text = text.replace(/import \{ SplitHeading \} from "\.\.\/ui\/SplitHeading";\nimport \{ Reveal \} from "\.\.\/ui\/Reveal";/, 
    'import { SectionHeader } from "../ui/SectionHeader";\nimport { Reveal } from "../ui/Reveal";');
}

// Replace spacing
text = text.replace(/style=\{\{ paddingTop: "var\(--section-y\)", paddingBottom: "var\(--section-y\)" \}\}/g, '');
text = text.replace(/className="bg-paper border-t border-grey-soft"/g, 'className="bg-paper border-t border-grey-soft py-[var(--section-y)]"');
text = text.replace(/className="relative bg-paper border-t border-grey-soft overflow-hidden"/g, 'className="relative bg-paper border-t border-grey-soft overflow-hidden py-[var(--section-y)]"');

// Replace header
const oldHeaderRegex = /<div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-10">[\s\S]*?<\/div>/;
const newHeader = `<SectionHeader
          eyebrow="What we do"
          heading="Security, built around your site."
          accent="your"
          rightContent={
            <p className="text-base text-grey-mid lg:text-right max-w-xl">
              Five core disciplines, each staffed by trained ex-servicemen and backed by MEPSC certification.
            </p>
          }
        />`;

text = text.replace(oldHeaderRegex, newHeader);

fs.writeFileSync('D:/rsecurity/src/components/services/Services.tsx', text);
