import { test, expect } from '@playwright/test';

test('Navbar first paint verify', async ({ page }) => {
  // Add dark/light tone checking logic
  await page.setViewportSize({ width: 1440, height: 900 });
  
  await page.goto('http://localhost:3000', { waitUntil: 'commit' });
  await page.waitForTimeout(500); // Wait a tiny bit just in case

  const headerBox = await page.locator('header').boundingBox();
  const headerScrim = await page.evaluate(() => {
    const el = document.querySelector('header > div:first-child');
    return el ? window.getComputedStyle(el).opacity : 'no-scrim';
  });

  const solidBgOpacity = await page.evaluate(() => {
    const el = document.querySelector('header > div:nth-child(2)'); // the White BG div
    return el ? window.getComputedStyle(el).opacity : '0';
  });

  console.log('Scrim opacity:', headerScrim);
  console.log('Solid BG opacity:', solidBgOpacity);
});
