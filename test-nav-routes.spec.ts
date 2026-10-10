import { test, expect } from '@playwright/test';

test('Other routes have dark tone initially', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('http://localhost:3000/about', { waitUntil: 'commit' });
  await page.waitForTimeout(500);

  const scrimOpacity = await page.evaluate(() => {
    const el = document.querySelector('header > div:first-child');
    return el && window.getComputedStyle(el).backgroundImage.includes('gradient') 
      ? window.getComputedStyle(el).opacity 
      : 'no-scrim';
  });

  const solidBgOpacity = await page.evaluate(() => {
    const el = document.querySelector('header > div:nth-child(2)');
    return el ? window.getComputedStyle(el).opacity : '0';
  });

  console.log('About page:');
  console.log('Scrim opacity:', scrimOpacity);
  console.log('Solid BG opacity:', solidBgOpacity);
});
