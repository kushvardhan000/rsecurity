const fs = require('fs');

let text = fs.readFileSync('D:/rsecurity/app/globals.css', 'utf-8');

// Add --color-blush if missing
if (!text.includes('--color-blush')) {
  text = text.replace('--color-paper: #FBFAF8;', '--color-paper: #FBFAF8;\n  --color-blush: #F6E9EB;');
}

// Add generic spacing variables if missing
if (!text.includes('--section-y')) {
  text = text.replace('--ease-premium:', `  --section-y: clamp(64px, 9vw, 128px);\n  --header-mb: clamp(32px, 4vw, 56px);\n  --ease-premium:`);
}

fs.writeFileSync('D:/rsecurity/app/globals.css', text);
