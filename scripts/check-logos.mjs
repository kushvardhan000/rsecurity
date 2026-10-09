#!/usr/bin/env node

/**
 * check-logos.mjs
 * Lists clients that are still using sample placeholder logos instead of actual image assets.
 */

import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

const clientsFile = join(process.cwd(), 'src/data/clients.ts');
let clientsContent = '';
try {
  clientsContent = readFileSync(clientsFile, 'utf8');
} catch (e) {
  console.error('Error reading clients.ts:', e.message);
  process.exit(1);
}

// We parse using simple regex or just string operations for this check script.
const placeholders = [];
const lines = clientsContent.split('\n');

for (const line of lines) {
  if (line.includes('placeholder: true')) {
    const slugMatch = line.match(/slug:\s*"([^"]+)"/);
    const nameMatch = line.match(/name:\s*"([^"]+)"/);
    if (nameMatch && slugMatch) {
      placeholders.push({ name: nameMatch[1], slug: slugMatch[1] });
    }
  }
}

if (placeholders.length > 0) {
  console.log('WARNING: The following brands are sample placeholders, not official clients.');
  console.log('Please replace these with official logos once available (or remove them):\n');
  placeholders.forEach(p => console.log(` - ${p.name} (${p.slug})`));
} else {
  console.log('Great! All clients specify real assets (no placeholders found).');
}
