const fs = require('fs');
let content = fs.readFileSync('app/globals.css', 'utf8');

const insertAfter = `  body {`;
const insertVariables = `  :root {
    --nav-h: 68px;
  }
  @media (min-width: 1024px) {
    :root {
      --nav-h: 80px;
    }
  }

  body {`;

content = content.replace(insertAfter, insertVariables);
fs.writeFileSync('app/globals.css', content, 'utf8');
console.log('Added --nav-h');
