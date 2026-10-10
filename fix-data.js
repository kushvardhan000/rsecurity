const fs = require('fs');

// Fix clients
let c = fs.readFileSync('src/data/clients.ts', 'utf8');
c = c.replace(/\/\/ SAMPLE PLACEHOLDERS[\s\S]*?\];/m, '];');
fs.writeFileSync('src/data/clients.ts', c);

