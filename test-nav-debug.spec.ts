import { test, expect } from '@playwright/test';

test('Debug Navbar state 2', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('http://localhost:3000/about');
  await page.waitForTimeout(2000);

  const solidProps = await page.evaluate(() => {
    return {
      scrollY: window.scrollY,
      els: document.elementsFromPoint(window.innerWidth / 2, 84).map(el => el.tagName + '#' + el.id + '.' + el.className),
    };
  });
  console.log(solidProps);
});
