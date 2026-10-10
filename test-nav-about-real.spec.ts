import { test, expect } from '@playwright/test';

test('Test About page real props', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('http://localhost:3000/about');
  
  await page.waitForTimeout(2000); 

  const solidProps = await page.evaluate(() => {
    const divs = Array.from(document.querySelectorAll('header > div'));
    const scrimDiv = divs.find(d => d.style.background.includes('linear-gradient'));
    const solidDiv = divs.find(d => d.className.includes('bg-white') && d.className.includes('backdrop-blur'));
    
    return {
      scrimFound: !!scrimDiv,
      solidFound: !!solidDiv,
      solidOp: solidDiv ? window.getComputedStyle(solidDiv).opacity : null,
    };
  });
  console.log(solidProps);
});
