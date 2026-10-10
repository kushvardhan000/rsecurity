import fs from 'fs';
import path from 'path';

function walk(dir, fList = []) {
    if (!fs.existsSync(dir)) return fList;
    const files = fs.readdirSync(dir);
    for (const f of files) {
        const p = path.join(dir, f);
        if (fs.statSync(p).isDirectory()) walk(p, fList);
        else fList.push(p);
    }
    return fList;
}

const codeFiles = walk(path.join(process.cwd(), 'src')).concat(walk(path.join(process.cwd(), 'app')));

const links = new Set();
for(let file of codeFiles) {
    if(!file.endsWith('.ts') && !file.endsWith('.tsx') && !file.endsWith('.js')) continue;
    let content = fs.readFileSync(file, 'utf8');
    // Find href="..."
    let regex = /href=(?:["']|{`([^`]+)`}|{"([^"]+)"}|{'([^']+)'}|{([^}]+)})|href=["']([^"']+)["']/g;
    let match;
    while((match = regex.exec(content)) !== null) {
        links.add(match[1] || match[2] || match[3] || match[5]);
    }
}

// Map available routes
// We know from build:
// /, /about, /awards, /careers, /clients, /contact, /dev/primitives, /events, /events/[slug], /gallery, /privacy-policy, /services, /services/[slug], /terms-and-conditions
const validRoutes = [
    '/', '/about', '/awards', '/careers', '/clients', '/contact', 
    '/events', '/gallery', '/privacy-policy', '/services', '/terms-and-conditions',
    '/api/contact'
];
// Also get static service/event slugs
const serviceData = fs.readFileSync('src/data/services.ts', 'utf8');
let slugRegex = /slug:\s*["']([^"']+)["']/g;
let ms;
while((ms = slugRegex.exec(serviceData)) !== null) {
    validRoutes.push(`/services/${ms[1]}`);
}
const eventData = fs.readFileSync('src/data/events.ts', 'utf8');
while((ms = slugRegex.exec(eventData)) !== null) {
    validRoutes.push(`/events/${ms[1]}`);
}

const issues = [];
for (let link of links) {
    if (!link || link.startsWith('http') || link.startsWith('#') || link.startsWith('mailto:') || link.startsWith('tel:') || link.includes('$') || link.includes('?')) continue;
    // Normalize trailing slash
    let check = link.endsWith('/') && link.length > 1 ? link.slice(0, -1) : link;
    if (!validRoutes.includes(check)) {
        issues.push(`Broken link found in code: ${link}`);
    }
}
console.log("Broken links:");
console.log(issues.join('\n') || "None");
