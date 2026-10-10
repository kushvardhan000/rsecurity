const fs = require('fs');

let navbar = fs.readFileSync('src/components/Navbar.tsx', 'utf8');
navbar = navbar.replace(/transform:\s*visible\s*\?\s*"translateY\(0\)"\n\s*:\s*"translateY\(-100%\)"\n\s*:\s*"translateY\(-100%\)",/, 'transform: visible ? "translateY(0)" : "translateY(-100%)",');
fs.writeFileSync('src/components/Navbar.tsx', navbar);

let careers = fs.readFileSync('src/components/careers/CareersClient.tsx', 'utf8');
careers = careers.replace(/<\/motion\.div>/g, '</div>');
fs.writeFileSync('src/components/careers/CareersClient.tsx', careers);

let cta = fs.readFileSync('src/components/cta/CTA.tsx', 'utf8');
cta = cta.replace(/<\/motion\.div>/g, '</div>');
fs.writeFileSync('src/components/cta/CTA.tsx', cta);
