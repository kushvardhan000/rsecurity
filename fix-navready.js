const fs = require('fs');

let content = fs.readFileSync('src/components/Navbar.tsx', 'utf8');
content = content.replace(
  /opacity:\s*navReady\s*\?\s*1\s*:\s*0,/,
  'opacity: 1,'
);
content = content.replace(
  /transform:\s*navReady[\s\S]*?\?\s*"translateY\(0\)"/,
  'transform: visible ? "translateY(0)"'
);
fs.writeFileSync('src/components/Navbar.tsx', content, 'utf8');
