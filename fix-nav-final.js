const fs = require('fs');

let code = fs.readFileSync('src/components/Navbar.tsx', 'utf8');

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

code = code.replace('useEffect(() => {\n    const compute', 'useLayoutEffect(() => {\n    let raf2 = 0;\n    const raf1 = requestAnimationFrame(() => {\n      raf2 = requestAnimationFrame(() => {\n        setNoAnim(false);\n      });\n    });\n    return () => {\n      cancelAnimationFrame(raf1);\n      if (raf2) cancelAnimationFrame(raf2);\n    };\n  }, []);\n\n  useLayoutEffect(() => {\n    const compute');

fs.writeFileSync('src/components/Navbar.tsx', code);
