const fs = require('fs');
function replaceInFile(path, replacements) {
    if(!fs.existsSync(path)) return;
    let content = fs.readFileSync(path, 'utf8');
    for (const {from, to} of replacements) {
        content = content.replace(from, to);
    }
    fs.writeFileSync(path, content, 'utf8');
}
// Fix app/not-found.tsx
replaceInFile('app/not-found.tsx', [
    { from: /You're lost\./g, to: 'You&apos;re lost.' },
    { from: /We can't find/g, to: 'We can&apos;t find' },
    { from: /let's get you/g, to: 'let&apos;s get you' }
]);
// src/components/careers/CareersClient.tsx
replaceInFile('src/components/careers/CareersClient.tsx', [
    { from: /We're/g, to: 'We&apos;re' },
    { from: /don't/g, to: 'don&apos;t' },
    { from: /doesn't/g, to: 'doesn&apos;t' }
]);
// app/about/page.tsx
replaceInFile('app/about/page.tsx', [
    { from: /<img /g, to: '<Image ' }
]);
// Add proper imports or ignore next/image
