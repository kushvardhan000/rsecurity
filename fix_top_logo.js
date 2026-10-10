const fs = require('fs');
let content = fs.readFileSync('src/components/Navbar.tsx', 'utf8');

// Fix white top logo
content = content.replace(
  /scrolled \? "opacity-0" \: "opacity-100 "/,
  'solid ? "opacity-0" : "opacity-100 brightness-0 invert"'
);

// Look for any remaining 'scrolled' visually driving things inside top bar (Links map).
content = content.replace(
  /className=\{cn\(\n\s*"group relative px-3 py-2 text-\[13px\] font-semibold tracking-\[0\.05em\] uppercase transition-colors duration-200",\n\s*scrolled/g,
  'className={cn(\n                    "group relative px-3 py-2 text-[13px] font-semibold tracking-[0.05em] uppercase transition-colors duration-200",\n                    solid'
);

// We need to double check the "More Menu" toggle:
// "text-neutral-700 border-neutral-300 hover:border-[#800020] hover:text-[#800020] bg-white/70"
content = content.replace(
  /scrolled\n\s*\? "text-neutral-700 border-neutral-300 hover:border-\[\#800020\] hover:text-\[\#800020\] bg-white\/70"/g,
  'solid\n                  ? "text-neutral-700 border-neutral-300 hover:border-[#800020] hover:text-[#800020] bg-white/70"'
);

// "border-[#800020]/25 bg-white/50 hover:bg-white"
content = content.replace(
  /scrolled\n\s*\? "border-\[\#800020\]\/25 bg-white\/50 hover:bg-white"/g,
  'solid\n                  ? "border-[#800020]/25 bg-white/50 hover:bg-white"'
);

fs.writeFileSync('src/components/Navbar.tsx', content, 'utf8');
console.log('Fixed Top Logo and replaced Remaining Scrolled triggers');
