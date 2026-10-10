const fs = require('fs');
let c = fs.readFileSync('src/components/Clients.tsx', 'utf8');
c = c.replace(/useEffect\(\(\) => \{\n\s*const hasPlaceholders.*?},\s*\[\]\);\n/s, '');
fs.writeFileSync('src/components/Clients.tsx', c);
