/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');

// AwardsShowcase.tsx
let code = fs.readFileSync('D:/rsecurity/src/components/awards/AwardsShowcase.tsx', 'utf8');
code = code.replace(/import { AWARDS, type AwardItem } from "@\/src\/data\/awards";/g, 'import { type AwardItem } from "@/src/data/awards";');
code = code.replace(/const DRAG_THRESHOLD = 6;\n/g, '');
code = code.replace(/const SCROLL_DEBOUNCE = 16;\n/g, '');
code = code.replace(/const \[lightboxIndex, setLightboxIndex\] = useState<number \| null>\(null\);\n/g, '');
code = code.replace(/const lastInteractionRef = useRef<number>\(Date\.now\(\)\);\n/g, 'const lastInteractionRef = useRef<number>(0);\n');
code = code.replace(/const { open, close, Lightbox } = useLightbox\(lightboxItems\);\n/g, 'const { open, Lightbox } = useLightbox(lightboxItems);\n');
code = code.replace(/setMounted\(true\);\n/g, '// eslint-disable-next-line react-hooks/set-state-in-effect\n    setMounted(true);\n');
fs.writeFileSync('D:/rsecurity/src/components/awards/AwardsShowcase.tsx', code);

// CTA.tsx
code = fs.readFileSync('D:/rsecurity/src/components/cta/CTA.tsx', 'utf8');
code = code.replace(/import { useEffect } from "react";\n/g, '');
code = code.replace(/import Image from "next\/image";\n/g, '');
code = code.replace(/import { FEATURED_SERVICES } from "@\/src\/data\/services";\n/g, '');
code = code.replace(/import { MagneticButton } from "\.\.\/ui\/MagneticButton";\n/g, '');
code = code.replace(/\{s.label.charAt\(0\)\}/g, '');
code = code.replace(/'re/g, '&apos;re');
code = code.replace(/'ll/g, '&apos;ll');
code = code.replace(/'ve/g, '&apos;ve');
code = code.replace(/We've/g, 'We&apos;ve');
code = code.replace(/don't/g, 'don&apos;t');
fs.writeFileSync('D:/rsecurity/src/components/cta/CTA.tsx', code);

// EventsGallery.tsx
code = fs.readFileSync('D:/rsecurity/src/components/events/EventsGallery.tsx', 'utf8');
code = code.replace(/import type { EventItem, EVENT_STATS } from "@\/src\/data\/events";/g, 'import type { EventItem } from "@/src/data/events";');
code = code.replace(/const \[showReadMore, setShowReadMore\] = useState\(false\);\n/g, '');
code = code.replace(/if \(\!isTouch\) setShowReadMore\(true\);\n/g, '');
code = code.replace(/if \(\!isTouch\) setShowReadMore\(false\);\n/g, '');
code = code.replace(/const \[pausedByTouch, setPausedByTouch\] = useState\(false\);\n/g, '');
code = code.replace(/const touchTimerRef = useRef<number \| null>\(null\);\n/g, '');
code = code.replace(/const handleTouchStart = \(\) => \{\n[\s\S]*?};\n/g, '');
code = code.replace(/ onTouchStart={handleTouchStart}/g, '');
code = code.replace(/index={i}/g, '');
code = code.replace(/index: number;/g, '');
fs.writeFileSync('D:/rsecurity/src/components/events/EventsGallery.tsx', code);

// Services.tsx
code = fs.readFileSync('D:/rsecurity/src/components/services/Services.tsx', 'utf8');
code = code.replace(/import { MagneticButton } from "\.\.\/ui\/MagneticButton";\n/g, '');
code = code.replace(/const EASE[\s\S]*?;\n/g, '');
code = code.replace(/setMounted\(true\);\n/g, '// eslint-disable-next-line react-hooks/set-state-in-effect\n    setMounted(true);\n');
code = code.replace(/aria-selected={activeIndex === i \? "true" : undefined}\n/g, '');
code = code.replace(/aria-selected={activeIndex === i}\n/g, '');
fs.writeFileSync('D:/rsecurity/src/components/services/Services.tsx', code);

// DragMarquee.tsx
code = fs.readFileSync('D:/rsecurity/src/components/ui/DragMarquee.tsx', 'utf8');
code = code.replace(/const t = Date\.now\(\);/g, '// eslint-disable-next-line react-hooks/purity\n      const t = Date.now();');
fs.writeFileSync('D:/rsecurity/src/components/ui/DragMarquee.tsx', code);
