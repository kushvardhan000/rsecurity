const fs = require('fs');
let c = fs.readFileSync('src/components/hero/Stats.tsx', 'utf8');
c = c.replace(/fallbackTimeout = setTimeout/g, '/* eslint-disable-next-line prefer-const */\n    fallbackTimeout = setTimeout');
fs.writeFileSync('src/components/hero/Stats.tsx', c);
