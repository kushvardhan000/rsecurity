const fs = require('fs');

let site = fs.readFileSync('src/data/site.ts', 'utf8');
site = site.replace(/\{\s*label:\s*"Facebook",\s*href:\s*"https:\/\/www\.facebook\.com\/"\s*},/, '/* { label: "Facebook", href: "https://www.facebook.com/" }, */');
site = site.replace(/\{\s*label:\s*"Instagram",\s*href:\s*"https:\/\/www\.instagram\.com\/"\s*},/, '/* { label: "Instagram", href: "https://www.instagram.com/" }, */');
site = site.replace(/\{\s*label:\s*"Twitter",\s*href:\s*"https:\/\/twitter\.com\/"\s*},/, '/* { label: "Twitter", href: "https://twitter.com/" }, */');
fs.writeFileSync('src/data/site.ts', site);

let footer = fs.readFileSync('src/components/Footer.tsx', 'utf8');
footer = footer.replace(/href="https:\/\/www\.facebook\.com\/"/g, 'href="#"');
footer = footer.replace(/href="https:\/\/www\.instagram\.com\/"/g, 'href="#"');
fs.writeFileSync('src/components/Footer.tsx', footer);
