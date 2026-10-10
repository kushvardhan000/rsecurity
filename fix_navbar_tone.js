const fs = require('fs');
let content = fs.readFileSync('src/components/Navbar.tsx', 'utf8');

const scrollLogicOld = /\/\* ── Scroll: shrink \+ hide\/show ────────────────── \*\/[\s\S]*?lastYRef\.current = y;\n      \}\);\n    \};\n\n    window\.addEventListener\("scroll", onScroll, \{ passive: true \}\);\n    return \(\) => \{\n      window\.removeEventListener\("scroll", onScroll\);\n      cancelAnimationFrame\(rafIdRef\.current\);\n    \};\n  \}, \[menuOpen, panelOpen\]\);/;

const scrollLogicNew = `/* ── Scroll: shrink + hide/show + Tone compute ──── */
  const [tone, setTone] = useState<string | null>(null);
  
  useEffect(() => {
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
  }, [menuOpen, panelOpen]);

  const solid = scrolled || tone === "light";`;

content = content.replace(scrollLogicOld, scrollLogicNew);

// Now, replace scrolled with solid for all visual styles
// {scrolled ? "opacity-0" : "opacity-100"} -> {solid ? "opacity-0" : "opacity-100"} when it relates to SCRIM and visuals.

// Scrim:
content = content.replace(
  /scrolled \? "opacity-0" \: "opacity-100"/,
  'solid ? "opacity-0" : "opacity-100"'
);

// White BG:
content = content.replace(
  /scrolled\n\s*\? "opacity-100 bg-white\/94 backdrop-blur-md border-b border-neutral-200"\n\s*\: "opacity-0 bg-transparent border-transparent"/g,
  'solid\n              ? "opacity-100 bg-white/94 backdrop-blur-md border-b border-neutral-200"\n              : "opacity-0 bg-transparent border-transparent"'
);

// Logo (white):
content = content.replace(
  /scrolled \? "opacity-0" \: "opacity-100 brightness-0 invert"/g,
  'solid ? "opacity-0" : "opacity-100 brightness-0 invert"'
);

// Logo (color):
content = content.replace(
  /scrolled \? "opacity-100" \: "opacity-0"/g,
  'solid ? "opacity-100" : "opacity-0"'
);

// Links map (desktop):
content = content.replace(
  /scrolled\n\s*\? isActive\n\s*\* "text-\[\#800020\]"\n\s*\* "text-neutral-700 hover:text-\[\#800020\]"\n\s*\: isActive/g,
  'solid\n                      ? isActive\n                        ? "text-[#800020]"\n                        : "text-neutral-700 hover:text-[#800020]"\n                      : isActive'
);
// It's probably easier to just replace scrolled with solid in the NavLink loop manually:
content = content.replace(
  /className=\{cn\([\s\S]*?transition-transform duration-300 ease-out origin-left",\n\s*scrolled \? "bg-\[\#800020\]" \: "bg-white",/g,
  function(match) {
    let replaced = match.replace(/scrolled\n\s*\? isActive/g, 'solid\n                      ? isActive');
    replaced = replaced.replace(/scrolled \? "bg-\[\#800020\]" \: "bg-white"/, 'solid ? "bg-[#800020]" : "bg-white"');
    return replaced;
  }
);

// Desktop More Menu and Hamburger borders 
// More:
content = content.replace(
  /scrolled\n\s*\? "text-neutral-700 border-neutral-300 hover:border-\[\#800020\] hover:text-\[\#800020\] bg-white\/70"\n\s*\: "text-white border-white\/35 hover:border-white hover:bg-white\/10 bg-transparent backdrop-blur-xs"/,
  'solid\n                  ? "text-neutral-700 border-neutral-300 hover:border-[#800020] hover:text-[#800020] bg-white/70"\n                  : "text-white border-white/35 hover:border-white hover:bg-white/10 bg-transparent backdrop-blur-xs"'
);
content = content.replace(
  /scrolled\n\s*\? "border-\[\#800020\]\/25 bg-white\/50 hover:bg-white"\n\s*\: "border-white\/35 bg-white\/10 hover:bg-white\/20"/,
  'solid\n                  ? "border-[#800020]/25 bg-white/50 hover:bg-white"\n                  : "border-white/35 bg-white/10 hover:bg-white/20"'
);
content = content.replace(
  /scrolled \? "opacity-0 text-white" \: "opacity-100 text-white"/,
  'solid ? "opacity-0 text-white" : "opacity-100 text-white"'
);
content = content.replace(
  /scrolled \? "opacity-100 text-\[\#800020\]" \: "opacity-0"/,
  'solid ? "opacity-100 text-[#800020]" : "opacity-0"'
);

fs.writeFileSync('src/components/Navbar.tsx', content, 'utf8');
console.log('Done Navbar Tone adjustments part 1');
