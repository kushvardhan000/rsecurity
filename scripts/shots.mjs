import { chromium } from "playwright";
import fs from "fs";
import path from "path";

const VIEWPORTS = [
  { width: 360, height: 640 },
  { width: 390, height: 844 },
  { width: 768, height: 1024 },
  { width: 1280, height: 600 },
  { width: 1440, height: 900 },
  { width: 1920, height: 1080 }
];

const TARGET_URL = process.env.URL || "http://localhost:3000";
const SHOTS_DIR = path.resolve(process.cwd(), "shots");

async function run() {
  console.log(`Starting captures for ${TARGET_URL}...`);

  if (!fs.existsSync(SHOTS_DIR)) {
    fs.mkdirSync(SHOTS_DIR, { recursive: true });
  }

  const browser = await chromium.launch({ headless: true });

  for (const vp of VIEWPORTS) {
    const vpName = `${vp.width}x${vp.height}`;
    const outDir = path.join(SHOTS_DIR, vpName);

    if (!fs.existsSync(outDir)) {
      fs.mkdirSync(outDir, { recursive: true });
    }

    console.log(`\n📸 Capturing ${vpName}...`);
    const context = await browser.newContext({ viewport: vp });
    const page = await context.newPage();

    // Capture console logs
    const consoleLogs = [];
    page.on("console", msg => {
      if (msg.type() === "error" || msg.type() === "warning") {
        consoleLogs.push({ type: msg.type(), text: msg.text() });
      }
    });

    // Capture page errors
    const pageErrors = [];
    page.on("pageerror", err => {
      pageErrors.push(err.message);
    });

    // Emulate session storage to bypass preloader if it exists
    await page.addInitScript(() => {
      window.sessionStorage.setItem("rspl-preloader-seen", "1");
    });

    await page.goto(TARGET_URL, { waitUntil: "networkidle" });

    // Ensure we trigger intersection observers
    const scrollHeight = await page.evaluate(() => document.body.scrollHeight);
    console.log(`Scrolling ${scrollHeight}px to trigger reveals...`);

    let currentScroll = 0;
    while (currentScroll < scrollHeight) {
      currentScroll += 400;
      await page.evaluate((y) => window.scrollTo(0, y), currentScroll);
      await page.waitForTimeout(150);
    }

    // Wait a moment for any final animations (like the SplitHeadings the 1.5s timeout)
    await page.waitForTimeout(1000);

    // Scroll back to top
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(500);

    // Measure section heights at 1440x900
    if (vp.width === 1440 && vp.height === 900) {
      const sectionHeights = await page.evaluate(() => {
        const sections = Array.from(document.querySelectorAll("section[id]"));
        return sections.map(el => ({
          id: el.id,
          height: el.getBoundingClientRect().height,
          top: el.getBoundingClientRect().top,
          bottom: el.getBoundingClientRect().bottom,
          outerHTML: el.outerHTML.substring(0, 200)
        }));
      });
      console.log(`\n📐 Section heights at 1440x900:`);
      sectionHeights.forEach(s => {
        console.log(`  #${s.id}: ${Math.round(s.height)}px (top: ${Math.round(s.top)}, bottom: ${Math.round(s.bottom)})`);
      });
      fs.writeFileSync(path.join(outDir, "section-heights.json"), JSON.stringify(sectionHeights, null, 2));
    }

    // Check for adjacent maroon sections
    const maroonCheck = await page.evaluate(() => {
      const sections = Array.from(document.querySelectorAll("section[data-tone]"));
      const issues = [];
      for (let i = 0; i < sections.length - 1; i++) {
        const current = sections[i].getAttribute("data-tone");
        const next = sections[i+1].getAttribute("data-tone");
        if (current === "dark" && next === "dark") {
          issues.push(`Adjacent dark sections: #${sections[i].id} and #${sections[i+1].id}`);
        }
      }
      return issues;
    });
    if (maroonCheck.length > 0) {
      console.log(`⚠️ Maroon section issues at ${vpName}:`, maroonCheck);
    }

    // Check for Next.js issues (hydration mismatches)
    const nextIssues = await page.evaluate(() => {
      const issues = [];
      // Check for hydration mismatch markers
      if (document.querySelector("[data-nextjs-hydration-mismatch]")) {
        issues.push("Hydration mismatch detected");
      }
      return issues;
    });
    if (nextIssues.length > 0) {
      console.log(`⚠️ Next.js issues at ${vpName}:`, nextIssues);
    }

    // Hide fixed elements: navbar, overlays, etc.
    await page.addStyleTag({
      content: `
        header[role="banner"],
        .nextjs-portal,
        [data-lenis-prevent],
        #nprogress,
        .fixed {
          display: none !important;
          opacity: 0 !important;
          visibility: hidden !important;
        }
      `,
    });

    // 1. Full page screenshot
    console.log(`Saving full page screenshot...`);
    await page.screenshot({
      path: path.join(outDir, "full-page.png"),
      fullPage: true,
      animations: "disabled",
    });

    // 2. Section screenshots
    const sectionIds = await page.evaluate(() => {
      return Array.from(document.querySelectorAll("section[id]")).map(
        (el) => el.id
      );
    });

    for (const id of sectionIds) {
      const section = page.locator(`section#${id}`);
      if (await section.isVisible()) {
        console.log(`Saving section: #${id}...`);
        try {
          await section.screenshot({
            path: path.join(outDir, `section-${id}.png`),
            animations: "disabled",
          });
        } catch (e) {
          console.error(`Failed to screenshot #${id}:`, e.message);
        }
      }
    }

    // Log console errors/warnings
    if (consoleLogs.length > 0) {
      console.log(`\n⚠️ Console logs at ${vpName}:`);
      consoleLogs.forEach(log => console.log(`  [${log.type}] ${log.text}`));
    }

    // Log page errors
    if (pageErrors.length > 0) {
      console.log(`\n❌ Page errors at ${vpName}:`);
      pageErrors.forEach(err => console.log(`  ${err}`));
    }

    await context.close();
  }

  await browser.close();
  console.log(`\n✅ Done! Screenshots saved in ${SHOTS_DIR}`);
}

run().catch(console.error);
