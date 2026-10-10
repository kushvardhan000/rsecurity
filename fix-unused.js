const fs = require('fs');

function removeMatches(file, matches) {
    let content = fs.readFileSync(file, 'utf8');
    for (const match of matches) {
        content = content.replace(match, '');
    }
    fs.writeFileSync(file, content, 'utf8');
}

removeMatches('app/sitemap.ts', [
    /import { SITE } from "@\/src\/data\/site";\n/g,
    /import { AWARDS } from "@\/src\/data\/awards";\n/g,
    /import { GALLERY } from "@\/src\/data\/gallery";\n/g,
    /import { CLIENTS } from "@\/src\/data\/clients";\n/g,
]);

removeMatches('app/services/[slug]/page.tsx', [
    /, type AlsoService/g,
    /type AlsoService,/g,
    /type AlsoService/g
]);

fs.writeFileSync('app/services/page.tsx', fs.readFileSync('app/services/page.tsx', 'utf8').replace(/import { FEATURED_SERVICES, ALSO_SERVICES } from "@\/src\/data\/services";/, 'import { ALSO_SERVICES } from "@/src/data/services";').replace(/const _FEATURED_SERVICES/g, 'const FEATURED_SERVICES'));

fs.writeFileSync('src/components/ui/PageHeader.tsx', fs.readFileSync('src/components/ui/PageHeader.tsx', 'utf8').replace(/map\(\(path, index\)/, 'map((path)'));
