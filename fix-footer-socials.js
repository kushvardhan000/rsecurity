const fs = require('fs');

let footer = fs.readFileSync('src/components/Footer.tsx', 'utf8');
footer = footer.replace(/<div className="flex items-center gap-2\.5 mt-4">[\s\S]*?<\/div>/, '');
fs.writeFileSync('src/components/Footer.tsx', footer);
// Restore from data instead if it was there? Actually maybe just leave it removed.
