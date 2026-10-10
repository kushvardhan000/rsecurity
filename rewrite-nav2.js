const fs = require('fs');

let code = fs.readFileSync('src/components/Navbar.tsx', 'utf8');

// The effect for compute tone:
const oldEffectStart = `useEffect(() => {
    const compute = () => {`;

const newEffectStart = `useLayoutEffect(() => {
    let raf2 = 0;
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => {
        setNoAnim(false);
      });
    });
    return () => {
      cancelAnimationFrame(raf1);
      if (raf2) cancelAnimationFrame(raf2);
    };
  }, []);

  useLayoutEffect(() => {
    const compute = () => {`;

code = code.replace(oldEffectStart, newEffectStart);

// find document.elementFromPoint
code = code.replace(
  'const el = document.elementFromPoint(window.innerWidth / 2, currentHeaderHeight + 2);',
  'const els = document.elementsFromPoint(window.innerWidth / 2, currentHeaderHeight + 4);'
);

code = code.replace(
  'const t = el?.closest("[data-tone]")?.getAttribute("data-tone") || null;\n        setTone(t);',
  `let t = null;
        for (const el of els) {
          if (!el.closest("header")) {
            t = el.closest("[data-tone]")?.getAttribute("data-tone") || null;
            break;
          }
        }
        if (t) setTone(t);`
);

code = code.replace(
  'compute();',
  'compute();\n    if (document.fonts && document.fonts.ready) {\n      document.fonts.ready.then(compute);\n    }'
);

code = code.replace(
  '}, [menuOpen, panelOpen]);',
  '}, [menuOpen, panelOpen, preloaderDone, pathname]);'
);

// find the scrim and replace it:
const scrimRegex = /\{\/\* Scrim \*\/\}\s*<div\s*className=\{cn\(\s*"absolute inset-x-0 top-0 pointer-events-none transition-opacity duration-300",\s*solid \? "opacity-0" : "opacity-100"\s*\)\}\s*style=\{\{\s*height: "140px",\s*background: "linear-gradient\(to bottom, rgba\(42,6,12,\.7\), transparent\)",\s*\}\}\s*\/>/m;

const newScrim = `{/* Scrim */}
        {!solid && (
          <div
            className="absolute inset-x-0 top-0 pointer-events-none transition-opacity duration-300 opacity-100"
            style={{
              height: "140px",
              background: "linear-gradient(to bottom, rgba(42,6,12,.7), transparent)",
            }}
          />
        )}`;

code = code.replace(scrimRegex, newScrim);

fs.writeFileSync('src/components/Navbar.tsx', code);
