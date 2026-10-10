import { chromium } from "playwright";
import fs from "fs";

const viewports = [
  { width: 1440, height: 900, name: "1440x900" },
  { width: 1366, height: 768, name: "1366x768" },
  { width: 1280, height: 600, name: "1280x600" },
  { width: 1024, height: 640, name: "1024x640" },
  { width: 900, height: 500, name: "900x500" },
  { width: 430, height: 609, name: "430x609" }
];

(async () => {
  console.log("Starting Next.js server for Playwright...");
  const devServer = await import("child_process").then(cp => {
    return cp.spawn("npm", ["run", "start"], { stdio: "ignore", detached: true });
  });

  await new Promise(r => setTimeout(r, 4000)); // wait for start

  const browser = await chromium.launch();
  try {
    for (const v of viewports) {
      console.log(`\nEvaluating ${v.name}...`);
      const context = await browser.newContext({ viewport: { width: v.width, height: v.height } });
      const page = await context.newPage();
      await page.goto("http://localhost:3000/");
      
      // Open panel
      if (v.width >= 1024) {
        await page.click("button[aria-label='More navigation']");
      } else {
        await page.click("button[aria-label='Open menu']");
      }
      await page.waitForTimeout(600); // Wait for transition

      // Check horizontals
      const scrollState = await page.evaluate(() => {
        const pan = document.getElementById("desktop-panel") || document.getElementById("mobile-menu");
        return {
          id: pan?.id,
          scrollW: pan.scrollWidth,
          clientW: pan.clientWidth,
          hasScrollbarX: window.innerWidth < document.documentElement.scrollWidth
        };
      });
      console.log(scrollState);
      
      // Check verticals for >=480
      if(v.height >= 480 && v.width >= 1024) {
          const linksArea = await page.evaluate(() => {
                const nav = document.querySelector("#desktop-panel nav");
                if(!nav) return null;
                const wrapper = nav.parentElement; // The scroll area
                return {
                    scrollH: wrapper.scrollHeight,
                    clientH: wrapper.clientHeight,
                    needsScroll: wrapper.scrollHeight > wrapper.clientHeight
                }
          })
          console.log("Links overflow:", linksArea);
      }
      
      await context.close();
    }
  } catch (e) {
    console.error(e);
  } finally {
    await browser.close();
    process.kill(-devServer.pid);
  }
})();
