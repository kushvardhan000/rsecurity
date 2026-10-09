const fs = require('fs');

let text = fs.readFileSync('D:/rsecurity/src/components/hero/Stats.tsx', 'utf-8');

if (!text.includes('SectionHeader')) {
  text = 'import { SectionHeader } from "../ui/SectionHeader";\n' + text;
}

text = text.replace(/<section className="w-full bg-white py-16 sm:py-24 px-4 sm:px-8 flex justify-center items-center">/, 
  '<section id="stats" data-tone="light" className="relative isolate w-full bg-white py-[var(--section-y)] flex flex-col justify-center items-center">');

text = text.replace(/<div className="relative w-full max-w-6xl">/, 
  `<div className="relative w-full max-w-[1320px] px-5 sm:px-8 lg:px-12">
        <SectionHeader eyebrow="Overview" heading="A proven track record." accent="proven" />`);

// Stats has an ugly overlapping sunburst badge which relies on md:-translate-y-1/2, it might overlap the SectionHeader!
// We should check that. 
text = text.replace(/<div className="relative bg-\[#9e1c27\] text-white shadow-xl min-h-\[160px\] sm:min-h-\[190px\] md:min-h-\[220px\]/, `<div className="relative bg-maroon-theme rounded-[2px] text-white shadow-xl min-h-[160px] sm:min-h-[190px] md:min-h-[220px]`);

fs.writeFileSync('D:/rsecurity/src/components/hero/Stats.tsx', text);
