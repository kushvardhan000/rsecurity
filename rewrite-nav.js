const fs = require('fs');

let code = fs.readFileSync('src/components/Navbar.tsx', 'utf8');

// Replace the tone state and noAnim
code = code.replace(
  'const [tone, setTone] = useState<string | null>(null);',
  'const [tone, setTone] = useState<string | null>(pathname === "/" ? "light" : "dark");\n  const [noAnim, setNoAnim] = useState(true);\n  import { useLayoutEffect } from "react";'
);

fs.writeFileSync('src/components/Navbar.tsx', code);
