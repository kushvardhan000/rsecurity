import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const membershipDir = path.join(__dirname, '../public/membership');

async function main() {
  const files = await fs.readdir(membershipDir, { withFileTypes: true });
  
  for (const file of files) {
    if (!file.isFile()) continue;
    
    // Check if jpg/jpeg
    const ext = path.extname(file.name).toLowerCase();
    if (ext !== '.jpg' && ext !== '.jpeg') continue;

    // strip duplicate extensions: "name.jpg.jpeg" -> "name", "name.jpg" -> "name"
    let base = file.name;
    while (base.toLowerCase().endsWith('.jpg') || base.toLowerCase().endsWith('.jpeg')) {
      base = base.substring(0, base.lastIndexOf('.'));
    }

    // sanitize to kebab-case
    const kebab = base
      .replace(/[^a-zA-Z0-9]+/g, '-') // replace non-alphanumeric with dash
      .replace(/^-+|-+$/g, '')        // trim dashes
      .toLowerCase();

    // Prefer jpeg if it had jpeg, else default to .jpg
    const finalExt = ext === '.jpeg' ? '.jpeg' : '.jpg';
    const newName = `${kebab}${finalExt}`;

    if (newName !== file.name) {
      const oldPath = path.join(membershipDir, file.name);
      const newPath = path.join(membershipDir, newName);
      
      try {
        await fs.access(newPath);
        console.log(`[SKIP] ${newName} already exists, skipping ${file.name}`);
      } catch {
        // file does not exist, safe to rename
        await fs.rename(oldPath, newPath);
        console.log(`[RENAME] ${file.name} -> ${newName}`);
      }
    }
  }
}

main().catch(console.error);
