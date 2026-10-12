import { chromium } from "playwright";

async function checkHoverStyle() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({
    viewport: { width: 1280, height: 720 },
    hasTouch: false,
  });

  await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
  const section = page.locator("#services");
  await section.scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);

  const tabs = page.locator('div[role="tablist"] button[role="tab"]');
  const tab1 = tabs.nth(1); // collapsed tab

  // Get initial style
  const initialBrightness = await tab1.evaluate((btn) => {
    const img = btn.querySelector("img");
    return {
      btnOpacity: window.getComputedStyle(btn).opacity,
      imgFilter: img ? window.getComputedStyle(img).filter : "none",
    };
  });
  console.log("Initial (inactive tab 1):", initialBrightness);

  // Hover over tab 1
  const box = await tab1.boundingBox();
  if (box) {
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await page.waitForTimeout(200);

    const hoveredBrightness = await tab1.evaluate((btn) => {
      const img = btn.querySelector("img");
      return {
        btnOpacity: window.getComputedStyle(btn).opacity,
        imgFilter: img ? window.getComputedStyle(img).filter : "none",
        transitionDuration: window.getComputedStyle(btn).transitionDuration,
      };
    });
    console.log("Hovered (inactive tab 1):", hoveredBrightness);
  }

  await browser.close();
}

checkHoverStyle().catch(console.error);
