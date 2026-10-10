import fs from 'fs';
import path from 'path';

function walk(dir, fList = []) {
    const files = fs.readdirSync(dir);
    for (const f of files) {
        const p = path.join(dir, f);
        if (fs.statSync(p).isDirectory()) {
            walk(p, fList);
        } else {
            fList.push(p);
        }
    }
    return fList;
}

const publicDir = path.join(process.cwd(), 'public');
const assets = walk(publicDir).map(p => p.slice(publicDir.length).replace(/\\/g, '/'));
const assetMap = new Map();
const lowerAssetMap = new Map();

for (const p of assets) {
    if (p.startsWith('/')) {
        assetMap.set(p, p);
        lowerAssetMap.set(p.toLowerCase(), p);
    } else {
        assetMap.set('/' + p, '/' + p);
        lowerAssetMap.set('/' + p.toLowerCase(), '/' + p);
    }
}

// Find all code references in src/ and app/
const codeFiles = walk(path.join(process.cwd(), 'src')).concat(walk(path.join(process.cwd(), 'app')));

for (const file of codeFiles) {
    if(!file.endsWith('.ts') && !file.endsWith('.tsx') && !file.endsWith('.css')) continue;
    let content = fs.readFileSync(file, 'utf8');
    
    // Find strings like "/brand/APDI.png"
    const regex = /["'](\/[a-zA-Z0-9_./-]+\.(webp|avif|png|jpg|jpeg|svg|ico|pdf))["']/gi;
    let match;
    let dirty = false;
    
    // Using simple replacement for all matches
    const replaced = content.replace(regex, (full, ref) => {
        if (!assetMap.has(ref)) {
            const lowerRef = ref.toLowerCase();
            const realName = lowerAssetMap.get(lowerRef);
            if (realName && realName !== ref) {
                console.log(`Mismatch in ${path.basename(file)}:\n  Code has: ${ref}\n  Real is:  ${realName}`);
                dirty = true;
                return full.replace(ref, realName); // retain quotes
            }
        }
        return full;
    });
    
    if (dirty) {
        fs.writeFileSync(file, replaced, 'utf8');
    }
}
