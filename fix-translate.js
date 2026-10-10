const fs = require('fs');

let content = fs.readFileSync('app/layout.tsx', 'utf8');

// Add to layout tags
content = content.replace(/<html\s+lang="en"/, '<html\n      lang="en"\n      translate="no"');
content = content.replace(/<\/head>/, '  <meta name="google" content="notranslate" />\n      </head>');
fs.writeFileSync('app/layout.tsx', content);

