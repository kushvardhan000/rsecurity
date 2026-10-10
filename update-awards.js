const fs = require('fs');

let content = fs.readFileSync('src/components/awards/Awards.tsx', 'utf8');

// 1. Remove eyebrow="Excellence"
content = content.replace(/eyebrow="Excellence"\s*\n\s*/, '');

// 2. Add properties to physics ref
content = content.replace(
  /velocity: 0,\n\s*\});/,
  `velocity: 0,\n    dragged: false,\n  });`
);

// 3. Add cardDimensions and captionsRef
content = content.replace(
  /const itemsRef = useRef<\(HTMLDivElement \| null\)\[\]>\(\[\]\);/,
  `const itemsRef = useRef<(HTMLDivElement | null)[]>([]);\n  const captionsRef = useRef<(HTMLElement | null)[]>([]);\n  const cardDimensions = useRef({ w: 0, h: 0 });\n  const stylesCache = useRef<Record<number, string>>({});`
);

// 4. ResizeObserver
content = content.replace(
  /const observer = new IntersectionObserver/,
  `// Measure first card
    const firstCard = itemsRef.current[0];
    let resizeObserver = null;
    if (firstCard) {
      resizeObserver = new ResizeObserver(() => {
        cardDimensions.current.w = firstCard.offsetWidth;
        cardDimensions.current.h = firstCard.offsetHeight;
      });
      resizeObserver.observe(firstCard);
    }
    
    const observer = new IntersectionObserver`
);

content = content.replace(
  /observer\.disconnect\(\);\n\s*};\n\s*\}, \[\]\);/,
  `observer.disconnect();\n      if (resizeObserver) resizeObserver.disconnect();\n    };\n  }, []);`
);

fs.writeFileSync('src/components/awards/Awards.tsx', content);
