const fs = require('fs');
let code = fs.readFileSync('src/components/Navbar.tsx', 'utf8');

code = code.replace(
  '{/* Scrim */}',
  `{noAnim && (<style>{'.nav-no-anim, .nav-no-anim * { transition: none !important; }'}</style>)}\n        {/* Scrim */}`
);

fs.writeFileSync('src/components/Navbar.tsx', code);
