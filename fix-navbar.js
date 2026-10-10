const fs = require('fs');

let content = fs.readFileSync('src/components/Navbar.tsx', 'utf8');

// Replace navReady definition
content = content.replace(
  /const navReady = preloaderDone;/,
`const [navReady, setNavReady] = useState(preloaderDone);

  useEffect(() => {
    if (navReady) return;
    if (
      preloaderDone ||
      document.documentElement.dataset.ready === "1" ||
      document.documentElement.dataset.preloaded === "1"
    ) {
      setNavReady(true);
      return;
    }
    const t = setTimeout(() => setNavReady(true), 3000);
    return () => clearTimeout(t);
  }, [preloaderDone, navReady]);`
);
// Reset visible on route change, menu / panel open
content = content.replace(
  /setMenuOpen\(false\);\n    setPanelOpen\(false\);\n  \}, \[pathname\]\);/,
`setMenuOpen(false);
    setPanelOpen(false);
    setVisible(true);
  }, [pathname]);

  // Window focus listener
  useEffect(() => {
    const onFocus = () => setVisible(true);
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, []);

  // When menu/panel opens or scroll < 80, setVisible(true) handles by effect
`
);

// We need to also add it in compute function when y<80
content = content.replace(
  /if \(\n\s*y > SCROLL_HIDE/,
  `if (y < 80) {
          setVisible(true);
        }
        if (
          y > SCROLL_HIDE`
);

fs.writeFileSync('src/components/Navbar.tsx', content, 'utf8');
