import { chromium } from "playwright";

const URLS = [
  "http://localhost:3000/",
  // We will just test the home page with and without menus for now,
  // since the main bug was the menus.
  "http://localhost:3000/about",
];

const VIEWPORTS = [
  { width: 320, height: 568 },
  { width: 360, height: 640 },
  { width: 360, height: 740 },
  { width: 390, height: 844 },
  { width: 740, height: 360 }, // landscape phone
  { width: 768, height: 1024 }, // tablet
  { width: 1024, height: 900 },
  { width: 1440, height: 900 }
];

async function run() {
  console.log("Starting overflow audit...");
  const browser = await chromium.launch();
  const page = await browser.newPage();

  const audit = async (prefix) => {
    // Wait for the app to be stable
    await page.waitForTimeout(500);

    const issues = await page.evaluate(() => {
      const badElements = [];
      const vw = window.innerWidth;

      document.querySelectorAll("*").forEach(el => {
        // Exclude script, style, head, etc.
        if (["SCRIPT", "STYLE", "HEAD", "META", "TITLE", "LINK", "NOSCRIPT"].includes(el.tagName)) return;

        const rect = el.getBoundingClientRect();

        let reason = [];
        // Check if bounding box extends past viewport width
        if (rect.right > vw + 1) { // 1px tolerance
          reason.push(`extends past viewport (right: ${rect.right.toFixed(1)}, vw: ${vw})`);
        }

        // Check if element has internal scroll
        if (el.scrollWidth > el.clientWidth && el.clientWidth > 0 &&
            window.getComputedStyle(el).overflowX !== 'hidden' &&
            window.getComputedStyle(el).overflowX !== 'clip') {
          reason.push(`scrollWidth > clientWidth (${el.scrollWidth} > ${el.clientWidth})`);
        }

        if (reason.length > 0) {
          // get a CSS path or simplified snippet
          let tag = el.tagName.toLowerCase();
          if (el.id) tag += "#" + el.id;
          if (el.className && typeof el.className === "string") tag += "." + el.className.split(" ").join(".");

          badElements.push({ element: tag, reason: reason.join(" | ") });
        }
      });
      return badElements;
    });

    if (issues.length > 0) {
      console.log(`[${prefix}] Found overflow issues:`);
      issues.forEach(i => console.log(`  - ${i.element}: ${i.reason}`));
    } else {
      console.log(`[${prefix}] All good - no overflow!`);
    }
  };

  for (const url of URLS) {
    for (const vp of VIEWPORTS) {
      await page.setViewportSize(vp);
      const prefix = `${url} | ${vp.width}x${vp.height}`;
      console.log(`\nTesting ${prefix}...`);

      try {
        await page.goto(url, { waitUntil: "networkidle" });
        await audit(prefix + " (default)");

        // try to open menu if button exists
        // Desktop uses "More" button (aria-label="More navigation"), Mobile uses aria-label="Open menu"
        const mobileMenuBtn = await page.$('button[aria-label="Open menu"]');
        const desktopMenuBtn = await page.$('button[aria-label="More navigation"]');

        let opened = false;
        if (mobileMenuBtn && await mobileMenuBtn.isVisible()) {
          await mobileMenuBtn.click();
          opened = true;
        } else if (desktopMenuBtn && await desktopMenuBtn.isVisible()) {
          await desktopMenuBtn.click();
          opened = true;
        }

        if (opened) {
           await audit(prefix + " (Menu Open)");
           // close it
           const closeBtn = await page.$('button[aria-label="Close menu"], button[aria-label="Close panel"]');
           if (closeBtn && await closeBtn.isVisible()) {
              await closeBtn.click();
           }
        }
      } catch (e) {
        console.error(`Error on ${prefix}:`, e.message);
      }
    }
  }

  await browser.close();
  console.log("\\nAudit Complete.");
}

run();