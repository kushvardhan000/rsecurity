import { test, expect } from '@playwright/test';

test('Test Home scrim', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('http://localhost:3000/');
  await page.waitForTimeout(2000); 

  const solidProps = await page.evaluate(() => {
    const divs = Array.from(document.querySelectorAll('header > div'));
    const scrimDiv = divs.find(d => d.style.background.includes('linear-gradient'));
    
    return { scrimFound: !!scrimDiv };
  });
  console.log(`/ Scrim? ${solidProps.scrimFound}`);
});
