const fs = require('fs');

let text = fs.readFileSync('D:/rsecurity/src/components/Clients.tsx', 'utf-8');

if (!text.includes('SectionHeader')) {
  text = text.replace(/import \{ Reveal \} from "@\/src\/components\/ui\/Reveal";/, 
    'import { Reveal } from "@/src/components/ui/Reveal";\nimport { SectionHeader } from "./ui/SectionHeader";');
}

// Remove ad-hoc styles padding
text = text.replace(/className="relative isolate overflow-x-clip bg-white"/, 'className="relative isolate overflow-x-clip bg-white py-[var(--section-y)]"');
text = text.replace(/style=\{\{[\s\S]*?paddingTop: "var\(--section-y\)",\s*paddingBottom: "var\(--section-y\)",\s*\}\}/, 'style={{ height: reduce ? "auto" : "clamp(70svh, 80svh, 80svh)" }}');

// Replace header
const headerRegex = /<div className="text-center mb-8 lg:mb-10">[\s\S]*?<\/h2>\s*<\/Reveal>\s*<\/div>/;
const newHeader = `<SectionHeader
          eyebrow="Our clients"
          heading="Trusted by the biggest."
          accent="biggest"
        />`;

// Replace specifically:
text = text.replace(/<div className="text-center mb-8 lg:mb-10">[\s\S]*?(?:<\/h2>\s*<\/Reveal>|<\/div>)\s*<\/div>/, newHeader);

fs.writeFileSync('D:/rsecurity/src/components/Clients.tsx', text);
