import { chromium } from 'playwright';
import * as fs from 'fs';
import * as path from 'path';

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await page.waitForSelector('#home', { timeout: 15000 });
  await page.waitForTimeout(2000);
  
  const breakpoints = [
    { name: 'mobile-375', width: 375, height: 667 },
    { name: 'mobile-414', width: 414, height: 896 },
    { name: 'tablet-768', width: 768, height: 1024 },
    { name: 'tablet-landscape-1024', width: 1024, height: 768 },
    { name: 'laptop-1366', width: 1366, height: 768 },
    { name: 'desktop-1440', width: 1440, height: 900 },
    { name: 'desktop-1920', width: 1920, height: 1080 },
    { name: 'ultrawide-2560', width: 2560, height: 1440 },
  ];
  
  const outputDir = path.join(__dirname, 'hero-test-output');
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });
  
  for (const bp of breakpoints) {
    await page.setViewportSize({ width: bp.width, height: bp.height });
    await page.waitForTimeout(500);
    
    for (let slideIdx = 0; slideIdx < 15; slideIdx++) {
      // Get the active slide image
      const activeImg = await page.$('[class*="absolute inset-0"][class*="z-10"] img');
      if (!activeImg) {
        // Try keyboard navigation to next slide
        await page.keyboard.press('ArrowRight');
        await page.waitForTimeout(1000);
        continue;
      }
      
      const box = await activeImg.boundingBox();
      if (!box) {
        await page.keyboard.press('ArrowRight');
        await page.waitForTimeout(1000);
        continue;
      }
      
      const natural = await activeImg.evaluate((el: HTMLImageElement) => ({
        naturalWidth: el.naturalWidth,
        naturalHeight: el.naturalHeight,
        objectFit: getComputedStyle(el).objectFit,
        objectPosition: getComputedStyle(el).objectPosition,
      }));
      
      const screenshotPath = path.join(outputDir, `${bp.name}-slide${slideIdx + 1}.png`);
      await activeImg.screenshot({ path: screenshotPath });
      
      const aspectRatio = natural.naturalWidth / natural.naturalHeight;
      const containerAspect = box.width / box.height;
      
      let cropInfo = '';
      if (containerAspect > aspectRatio) {
        const visibleRatio = aspectRatio / containerAspect;
        cropInfo = `CROPPED TOP/BOTTOM: ${((1 - visibleRatio) * 100).toFixed(1)}% total vertical crop`;
      } else if (containerAspect < aspectRatio) {
        const visibleRatio = containerAspect / aspectRatio;
        cropInfo = `CROPPED SIDES: ${((1 - visibleRatio) * 100).toFixed(1)}% total horizontal crop`;
      } else {
        cropInfo = 'FULL IMAGE VISIBLE';
      }
      
      console.log(`[${bp.name}] Slide ${slideIdx + 1}: container=${box.width.toFixed(0)}x${box.height.toFixed(0)} natural=${natural.naturalWidth}x${natural.naturalHeight} fit=${natural.objectFit} pos=${natural.objectPosition} ${cropInfo}`);
      
      // Navigate to next slide
      await page.keyboard.press('ArrowRight');
      await page.waitForTimeout(1000);
    }
  }
  
  await browser.close();
}

main().catch(console.error);