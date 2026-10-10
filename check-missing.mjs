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

const publicDir = path.join(process.cwd(), 'public');
const assets = walk(publicDir).map(p => {
    let rel = p.slice(publicDir.length).replace(/\\/g, '/');
    if (!rel.startsWith('/')) rel = '/' + rel;
    return rel;
});

const assetMap = new Set(assets);
const lowerAssetMap = new Map();
for(let a of assets) lowerAssetMap.set(a.toLowerCase(), a);

const codeFiles = walk(path.join(process.cwd(), 'src')).concat(walk(path.join(process.cwd(), 'app')));

for (const file of codeFiles) {
    if(!file.endsWith('.ts') && !file.endsWith('.tsx')) continue;
    let content = fs.readFileSync(file, 'utf8');
    const regex = /["'](\/[a-zA-Z0-9_./-]+\.(webp|avif|png|jpg|jpeg|svg|ico|pdf))["']/gi;
    let match;
    while ((match = regex.exec(content)) !== null) {
        const ref = match[1];
        if (!assetMap.has(ref)) {
            console.log(`Missing in ${path.basename(file)}: ${ref}`);
            let real = lowerAssetMap.get(ref.toLowerCase());
            if (real) console.log(`  (Could be ${real} ?)`);
        }
    }
}
