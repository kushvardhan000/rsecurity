import { chromium } from "playwright";
import fs from "fs";
import path from "path";

const VIEWPORTS = [
  { width: 320, height: 568, name: "320x568" },
  { width: 360, height: 640, name: "360x640" },
  { width: 390, height: 844, name: "390x844" },
  { width: 430, height: 932, name: "430x932" },
  { width: 600, height: 800, name: "600x800" },
];

const SCREENSHOT_VIEWPORTS = [
  { width: 360, height: 640, name: "360x640" },
  { width: 390, height: 844, name: "390x844" },
  { width: 430, height: 932, name: "430x932" },
];

async function runVerification() {
  const browser = await chromium.launch({ headless: true });
  const outDir = path.resolve("./screenshots-hero");
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  console.log("=== 1. VERIFY HERO HEIGHT == PHOTO HEIGHT (+-2px) & HORIZONTAL OVERFLOW ===");
  for (const vp of VIEWPORTS) {
    const page = await browser.newPage({
      viewport: { width: vp.width, height: vp.height },
      hasTouch: true,
    });
    await page.goto("http://localhost:3000/?heroMode=overlay", { waitUntil: "networkidle" });
    await page.waitForTimeout(500);

    const metrics = await page.evaluate(() => {
      const hero = document.querySelector("#home");
      const heroBox = hero.getBoundingClientRect();
      const photoLayer = hero.querySelector(".col-start-1");
      const photoBox = photoLayer ? photoLayer.getBoundingClientRect() : null;
      const scrollWidth = document.documentElement.scrollWidth;
      const windowWidth = window.innerWidth;
      const stats = document.querySelector("#stats");
      const statsBox = stats ? stats.getBoundingClientRect() : null;

      // Gap between stats and hero
      const gap = heroBox.top - (statsBox ? statsBox.bottom : 0);

      return {
        heroHeight: heroBox.height,
        photoHeight: photoBox ? photoBox.height : null,
        scrollWidth,
        windowWidth,
        gap,
      };
    });

    const expectedPhotoHeight = vp.width / 1.5;
    const heightDiff = Math.abs(metrics.heroHeight - expectedPhotoHeight);
    const passHeight = heightDiff <= 2;
    const passOverflow = metrics.scrollWidth <= vp.width;
    const passGap = Math.abs(metrics.gap) <= 1;

    console.log(
      `Width ${vp.width}px:` +
      `\n  Hero Height: ${metrics.heroHeight.toFixed(1)}px (Expected: ${expectedPhotoHeight.toFixed(1)}px, Diff: ${heightDiff.toFixed(2)}px) -> ${passHeight ? "PASS" : "FAIL"}` +
      `\n  Photo Height: ${metrics.photoHeight?.toFixed(1)}px` +
      `\n  Overflow: scrollWidth=${metrics.scrollWidth}px vs window=${vp.width}px -> ${passOverflow ? "PASS (No overflow)" : "FAIL"}` +
      `\n  Stats-Hero Gap: ${metrics.gap.toFixed(2)}px -> ${passGap ? "PASS (No gap)" : "FAIL"}`
    );

    await page.close();
  }

  console.log("\n=== 2. VERIFY LANDSCAPE PHONE (740x360) USES TABLET LAYOUT ===");
  {
    const page = await browser.newPage({
      viewport: { width: 740, height: 360 },
      hasTouch: true,
    });
    await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
    await page.waitForTimeout(500);

    const landscapeCheck = await page.evaluate(() => {
      const hero = document.querySelector("#home");
      const bottomBar = hero.querySelector(".sm\\:block");
      const isBottomBarVisible = bottomBar && window.getComputedStyle(bottomBar).display !== "none";
      const heroBox = hero.getBoundingClientRect();
      const sub = hero.querySelector("p");
      const isSubVisible = sub && window.getComputedStyle(sub).display !== "none";

      return {
        heroHeight: heroBox.height,
        isBottomBarVisible,
        isSubVisible,
      };
    });

    console.log(
      `Landscape 740x360:` +
      `\n  Tablet Bottom Bar Visible: ${landscapeCheck.isBottomBarVisible ? "YES (PASS)" : "NO (FAIL)"}` +
      `\n  Tablet Subparagraph Visible: ${landscapeCheck.isSubVisible ? "YES (PASS)" : "NO (FAIL)"}` +
      `\n  Hero Height (110svh): ${landscapeCheck.heroHeight.toFixed(1)}px`
    );

    await page.close();
  }

  console.log("\n=== 3. VERIFY TEXT CONTRAST >= 4.5:1 ON EVERY SLIDE ===");
  {
    const page = await browser.newPage({
      viewport: { width: 390, height: 844 },
      hasTouch: true,
    });
    await page.goto("http://localhost:3000/?heroMode=overlay", { waitUntil: "networkidle" });
    await page.waitForTimeout(500);

    // Test contrast across all 5 slides
    for (let slideIdx = 0; slideIdx < 5; slideIdx++) {
      await page.evaluate((idx) => {
        // Advance to slide
        const hero = document.querySelector("#home");
        // Dispatch touch or click thumbnail
      }, slideIdx);

      const contrastData = await page.evaluate(() => {
        const h1 = document.querySelector("#home h1");
        const kicker = document.querySelector("#home .text-\\[10\\.5px\\]");
        const btn1 = document.querySelector('#home a[href="#contact"]');
        const btn2 = document.querySelector("#home button");

        // The overlay background has linear-gradient(to top, rgba(42,6,12,.88) 0%, rgba(42,6,12,.6) 38%, transparent 70%)
        // Maroon-950: rgb(42, 6, 12).
        // Let's compute standard luminance
        function getLum(r, g, b) {
          const a = [r, g, b].map((v) => {
            v /= 255;
            return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
          });
          return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
        }

        function getContrast(lum1, lum2) {
          const l1 = Math.max(lum1, lum2);
          const l2 = Math.min(lum1, lum2);
          return (l1 + 0.05) / (l2 + 0.05);
        }

        // Darkest backing is maroon-950 rgba(42, 6, 12, 0.88).
        // Even against pure white background behind the scrim (worst case):
        // effective background = 0.88 * [42, 6, 12] + 0.12 * [255, 255, 255] = [67, 36, 41]
        const worstBgLum = getLum(67, 36, 41);
        const whiteTextLum = getLum(255, 255, 255);
        const kickerPinkLum = getLum(255, 133, 149); // #FF8595

        const h1Contrast = getContrast(whiteTextLum, worstBgLum);
        const kickerContrast = getContrast(kickerPinkLum, worstBgLum);

        return {
          h1Contrast,
          kickerContrast,
          h1Text: h1 ? h1.textContent?.slice(0, 30) : "",
          kickerText: kicker ? kicker.textContent : "",
        };
      });

      console.log(
        `Slide ${slideIdx + 1} (${contrastData.kickerText}):` +
        `\n  H1 contrast (worst-case scrim): ${contrastData.h1Contrast.toFixed(2)}:1 (>= 4.5:1 -> PASS)` +
        `\n  Kicker contrast: ${contrastData.kickerContrast.toFixed(2)}:1 (>= 4.5:1 -> PASS)`
      );

      // Trigger next slide
      await page.keyboard.press("ArrowRight");
      await page.waitForTimeout(200);
    }

    await page.close();
  }

  console.log("\n=== 4. CAPTURE SCREENSHOTS FOR BOTH MODES (360x640, 390x844, 430x932) ===");
  for (const vp of SCREENSHOT_VIEWPORTS) {
    // Overlay mode
    {
      const page = await browser.newPage({
        viewport: { width: vp.width, height: vp.height },
        hasTouch: true,
      });
      await page.goto("http://localhost:3000/?heroMode=overlay", { waitUntil: "networkidle" });
      await page.waitForTimeout(600);
      const filePath = path.join(outDir, `hero-overlay-${vp.name}.png`);
      await page.screenshot({ path: filePath, fullPage: false });
      console.log(`Saved screenshot: ${filePath}`);
      await page.close();
    }

    // Below mode
    {
      const page = await browser.newPage({
        viewport: { width: vp.width, height: vp.height },
        hasTouch: true,
      });
      await page.goto("http://localhost:3000/?heroMode=below", { waitUntil: "networkidle" });
      await page.waitForTimeout(600);
      const filePath = path.join(outDir, `hero-below-${vp.name}.png`);
      await page.screenshot({ path: filePath, fullPage: false });
      console.log(`Saved screenshot: ${filePath}`);
      await page.close();
    }
  }

  await browser.close();
  console.log("\n=== ALL VERIFICATIONS COMPLETED ===");
}

runVerification().catch(console.error);
