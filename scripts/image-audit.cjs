/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require("fs");
const path = require("path");
const sizeFinder = require("image-size").imageSize;

const dir = path.join(process.cwd(), "public", "hero");
const files = fs.readdirSync(dir).filter((f) => /\.(jpg|jpeg|png)$/i.test(f));

console.log("Analyzing images in /public/hero:\n");

let layouts = { full: [], framed: [] };

for (const file of files) {
  const p = path.join(dir, file);
  const size = sizeFinder(p);
  const w = size.width;
  const h = size.height;

  const layout = w >= 1600 ? "FULL-BLEED" : "FRAMED";
  if (w >= 1600) layouts.full.push(file);
  else layouts.framed.push(file);

  console.log(`${file}: ${w}x${h} => ${layout}`);
}

console.log("\nLayouts chosen:");
console.log(`FULL-BLEED: ${layouts.full.join(", ") || "none"}`);
console.log(`FRAMED: ${layouts.framed.join(", ") || "none"}`);
console.log("\nOriginals that should be supplied by client (currently framed):");
layouts.framed.forEach(f => console.log(`- ${f}`));
