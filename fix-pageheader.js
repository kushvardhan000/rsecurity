const fs = require('fs');
let c = fs.readFileSync('src/components/ui/PageHeader.tsx', 'utf8');
c = c.replace(/map\(\(path, index\)/, 'map((path)');
c = c.replace(/key={index}/, 'key={path.label}');
fs.writeFileSync('src/components/ui/PageHeader.tsx', c);
