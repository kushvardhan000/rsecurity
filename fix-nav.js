const fs = require('fs');
let code = fs.readFileSync('src/components/Navbar.tsx', 'utf8');

// 1. imports
code = code.replace(
  'import { useEffect, useRef, useState, useCallback } from "react";',
  'import { useEffect, useLayoutEffect, useRef, useState, useCallback } from "react";'
);

// 2. states
code = code.replace(
  'const [tone, setTone] = useState<string | null>(null);',
  'const [tone, setTone] = useState<string | null>(pathname === "/" ? "light" : "dark");\n  const [noAnim, setNoAnim] = useState(true);'
);

// 3. effect logic
let effectMatch = `useEffect(() => {
    const compute = () => {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = requestAnimationFrame(() => {
        const y = window.scrollY;
        setScrolled(y > SCROLL_SHRINK);

        if (
          y > SCROLL_HIDE &&
          y > lastYRef.current + SCROLL_DELTA &&
          !menuOpen &&
          !panelOpen
        ) {
          setVisible(false);
        } else if (y < lastYRef.current - SCROLL_DELTA) {
          setVisible(true);
        }
        lastYRef.current = y;

        const currentHeaderHeight = (window.innerWidth >= 1024 && !(y > SCROLL_SHRINK)) ? 80 : 68;
        const el = document.elementFromPoint(window.innerWidth / 2, currentHeaderHeight + 2);
        const t = el?.closest("[data-tone]")?.getAttribute("data-tone") || null;
        setTone(t);
      });
    };

    compute();
    window.addEventListener("scroll", compute, { passive: true });
    window.addEventListener("resize", compute, { passive: true });
    return () => {
      window.removeEventListener("scroll", compute);
      window.removeEventListener("resize", compute);
      cancelAnimationFrame(rafIdRef.current);
    };
  }, [menuOpen, panelOpen]);`;

let newEffect = `useLayoutEffect(() => {
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
    const compute = () => {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = requestAnimationFrame(() => {
        const y = window.scrollY;
        setScrolled(y > SCROLL_SHRINK);

        if (
          y > SCROLL_HIDE &&
          y > lastYRef.current + SCROLL_DELTA &&
          !menuOpen &&
          !panelOpen
        ) {
          setVisible(false);
        } else if (y < lastYRef.current - SCROLL_DELTA) {
          setVisible(true);
        }
        lastYRef.current = y;

        const currentHeaderHeight = (window.innerWidth >= 1024 && !(y > SCROLL_SHRINK)) ? 80 : 68;
        const els = document.elementsFromPoint(window.innerWidth / 2, currentHeaderHeight + 4);
        let t = null;
        for (const el of els) {
          if (!el.closest("header")) {
            t = el.closest("[data-tone]")?.getAttribute("data-tone") || null;
            break;
          }
        }
        if (t) setTone(t);
      });
    };

    compute();
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(compute);
    }

    window.addEventListener("scroll", compute, { passive: true });
    window.addEventListener("resize", compute, { passive: true });
    return () => {
      window.removeEventListener("scroll", compute);
      window.removeEventListener("resize", compute);
      cancelAnimationFrame(rafIdRef.current);
    };
  }, [menuOpen, panelOpen, preloaderDone, pathname]);`;

code = code.replace(effectMatch, newEffect);

// 4. scrim logic & class logic
code = code.replace(
  'transition: "opacity 0.5s ease, transform 0.4s cubic-bezier(0.22,1,0.36,1)",',
  'transition: noAnim ? "none" : "opacity 0.5s ease, transform 0.4s cubic-bezier(0.22,1,0.36,1)",'
);

code = code.replace(
  'className="fixed inset-x-0 top-0 z-50 pointer-events-auto"',
  'className={cn("fixed inset-x-0 top-0 z-50 pointer-events-auto", noAnim && "nav-no-anim")}'
);

const scrimMatch = `{/* Scrim */}
        <div
          className={cn(
            "absolute inset-x-0 top-0 pointer-events-none transition-opacity duration-300",
            solid ? "opacity-0" : "opacity-100"
          )}
          style={{
            height: "140px",
            background: "linear-gradient(to bottom, rgba(42,6,12,.7), transparent)",
          }}
        />`;

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

code = code.replace(scrimMatch, newScrim);

fs.writeFileSync('src/components/Navbar.tsx', code);
