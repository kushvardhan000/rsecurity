import { test, expect } from '@playwright/test';

const urls = ['/services', '/awards', '/events', '/clients'];

for (const url of urls) {
  test(`Test ${url}`, async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`http://localhost:3000${url}`);
    await page.waitForTimeout(2000); 

    const solidProps = await page.evaluate(() => {
      const divs = Array.from(document.querySelectorAll('header > div'));
      const scrimDiv = divs.find(d => d.style.background.includes('linear-gradient'));
      
      return {
        scrimFound: !!scrimDiv,
      };
    });
    console.log(`${url}: Scrim? ${solidProps.scrimFound}`);
  });
}
