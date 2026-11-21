import sharp from "sharp";
import { readdirSync, statSync, existsSync, mkdirSync, writeFileSync } from "fs";
import { join, extname, basename, dirname } from "path";

const PUBLIC_DIR = "D:\\rsecurity\\public";

const TARGET_DIRS = [
  "hero",
  "gallery",
  "Trophiessss",
  "clients",
  "events",
  "membership",
  "membership/membership-marquee-logo",
  "services",
  "certificates",
  "about",
];

const QUALITY = 80;
const AVIF_QUALITY = 50;
const MAX_WIDTH = 2560;
const MAX_HEIGHT = 2560;

function getAllImages(dir) {
  const results = [];
  if (!existsSync(dir)) return results;
  
  const files = readdirSync(dir);
  for (const file of files) {
    const fullPath = join(dir, file);
    const stat = statSync(fullPath);
    if (stat.isDirectory()) {
      results.push(...getAllImages(fullPath));
    } else {
      const ext = extname(file).toLowerCase();
      if ([".jpg", ".jpeg", ".png", ".webp"].includes(ext)) {
        results.push(fullPath);
      }
    }
  }
  return results;
}

async function optimizeImage(inputPath) {
  const ext = extname(inputPath).toLowerCase();
  const name = basename(inputPath, ext);
  const dir = dirname(inputPath);
  
  try {
    const image = sharp(inputPath);
    const metadata = await image.metadata();
    
    // Skip if already small enough
    if (metadata.width <= MAX_WIDTH && metadata.height <= MAX_HEIGHT && statSync(inputPath).size < 300000) {
      console.log(`⏭️  Skipping (already optimized): ${inputPath}`);
      return;
    }
    
    // Resize if needed
    let pipeline = image;
    if (metadata.width > MAX_WIDTH || metadata.height > MAX_HEIGHT) {
      pipeline = pipeline.resize(MAX_WIDTH, MAX_HEIGHT, {
        fit: "inside",
        withoutEnlargement: true,
      });
    }
    
    // Convert to WebP
    const webpPath = join(dir, `${name}.webp`);
    await pipeline.clone().webp({ quality: QUALITY, effort: 6 }).toFile(webpPath);
    const webpSize = statSync(webpPath).size;
    console.log(`✅ WebP: ${inputPath} (${(statSync(inputPath).size / 1024).toFixed(1)}KB) -> ${webpPath} (${(webpSize / 1024).toFixed(1)}KB) - ${((1 - webpSize / statSync(inputPath).size) * 100).toFixed(1)}% reduction`);
    
    // Convert to AVIF (better compression)
    const avifPath = join(dir, `${name}.avif`);
    await pipeline.clone().avif({ quality: AVIF_QUALITY, effort: 6 }).toFile(avifPath);
    const avifSize = statSync(avifPath).size;
    console.log(`✅ AVIF: ${inputPath} -> ${avifPath} (${(avifSize / 1024).toFixed(1)}KB) - ${((1 - avifSize / statSync(inputPath).size) * 100).toFixed(1)}% reduction`);
    
    // Keep original as fallback, but we could delete it to save space
    // For now, keep both for compatibility
    
  } catch (error) {
    console.error(`❌ Failed to optimize ${inputPath}:`, error.message);
  }
}

async function main() {
  console.log("🚀 Starting image optimization...\n");
  
  let totalOriginal = 0;
  let totalWebP = 0;
  let totalAVIF = 0;
  let count = 0;
  
  for (const targetDir of TARGET_DIRS) {
    const fullPath = join(PUBLIC_DIR, targetDir);
    const images = getAllImages(fullPath);
    
    for (const img of images) {
      const originalSize = statSync(img).size;
      totalOriginal += originalSize;
      
      await optimizeImage(img);
      
      // Check output sizes
      const name = basename(img, extname(img));
      const dir = dirname(img);
      const webpPath = join(dir, `${name}.webp`);
      const avifPath = join(dir, `${name}.avif`);
      
      if (existsSync(webpPath)) totalWebP += statSync(webpPath).size;
      if (existsSync(avifPath)) totalAVIF += statSync(avifPath).size;
      count++;
    }
  }
  
  console.log(`\n📊 Summary:`);
  console.log(`   Images processed: ${count}`);
  console.log(`   Original total: ${(totalOriginal / 1024 / 1024).toFixed(2)} MB`);
  console.log(`   WebP total: ${(totalWebP / 1024 / 1024).toFixed(2)} MB (${((1 - totalWebP / totalOriginal) * 100).toFixed(1)}% reduction)`);
  console.log(`   AVIF total: ${(totalAVIF / 1024 / 1024).toFixed(2)} MB (${((1 - totalAVIF / totalOriginal) * 100).toFixed(1)}% reduction)`);
}

main().catch(console.error);