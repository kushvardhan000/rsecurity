const fs = require('fs');
let text = fs.readFileSync('D:/rsecurity/src/components/cta/CTA.tsx', 'utf-8');

// Container fixes
text = text.replace(/className="relative bg-maroon-theme[^"]*"/, 'className="relative isolate bg-white py-[var(--section-y)]"');
text = text.replace(/style=\{\{ marginTop: "-48px", zIndex: 10 \}\}/, '');

// Extricate SectionHeader
const innerHeaderRegex = /<SectionHeader[\s\S]*?\/>/;
text = text.replace(innerHeaderRegex, '');

// Insert it at the top level container
text = text.replace(/<div className="relative rounded-sharp overflow-hidden bg-maroon-950"/, `<SectionHeader
          eyebrow="Let's talk"
          heading="Let's secure what matters."
          accent="matters"
        />
        <div className="relative rounded-sharp overflow-hidden bg-maroon-950"`);

// Put a smaller nice title inside the card since we pulled the big one out
text = text.replace(/<Reveal delay=\{0.2\} className="mt-4 text-white\/80 text-base leading-relaxed max-w-xl">/, 
  `<h3 className="display text-3xl font-bold text-white mb-2" style={{fontFamily: "'Newsreader', serif"}}>Get in touch</h3>
  <Reveal delay={0.2} className="mt-4 text-white/80 text-base leading-relaxed max-w-xl">`);

fs.writeFileSync('D:/rsecurity/src/components/cta/CTA.tsx', text);
