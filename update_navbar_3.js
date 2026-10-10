const fs = require('fs');
let content = fs.readFileSync('src/components/Navbar.tsx', 'utf8');

// 1. Insert ChevronRight import
content = content.replace(
  /import { X, Phone, Menu, MessageCircle } from "lucide-react";/,
  'import { X, Phone, Menu, MessageCircle, ChevronRight } from "lucide-react";'
);

// 2. Remove Request a Quote from top bar
const tabletRegex = /\{\/\*\s*Tablet Request a Quote \([^)]+\)\s*\*\/\}\s*<div className="hidden sm:flex lg:hidden">[\s\S]*?<\/div>\s*\{\/\*\s*Desktop Request a Quote \([^)]+\)\s*\*\/\}\s*<div className="hidden lg:flex">[\s\S]*?<\/div>/;
content = content.replace(tabletRegex, '');

// 3. Mobile Menu Links (MOBILE_PRIMARY)
const scrollAreaRegex = /<nav aria-label="Mobile navigation" className="flex flex-col flex-1 justify-center landscape:justify-start pt-8 pb-4 min-w-0">[\s\S]*?<\/nav>/;
content = content.replace(
  scrollAreaRegex,
  `<div className="flex flex-col flex-1 justify-center min-w-0">
                <nav aria-label="Mobile navigation" className="rounded-2xl bg-[#5A0F1C] border border-white/10 p-2 mt-4 flex flex-col min-w-0 shrink-0">
                  {MOBILE_PRIMARY.map((link, idx, arr) => {
                    const isActive = active === link.href.slice(1) || pathname === link.href;
                    return (
                      <div key={link.label}>
                        <Link
                          href={link.href}
                          onClick={closeMenu}
                          className={cn(
                            "group flex items-center justify-between rounded-xl px-4 text-white min-w-0 min-h-[52px] [@media(max-height:640px)]:min-h-[44px] hover:bg-[#7A1426] transition-colors active:bg-[#7A1426]",
                            isActive && "bg-[#7A1426]"
                          )}
                        >
                          <span
                            className="text-[24px] xl:text-[26px] min-w-0 leading-tight"
                            style={{ fontFamily: "var(--font-display-serif)" }}
                          >
                            {link.label}
                          </span>
                          <ChevronRight className="w-5 h-5 text-white/50 shrink-0" />
                        </Link>
                        {idx < arr.length - 1 && (
                          <div className="h-[1px] w-full bg-white/10 my-0.5 pointer-events-none" />
                        )}
                      </div>
                    );
                  })}
                </nav>
              </div>`
);

// 4. Mobile Menu Footer Buttons
const footerBlockRegex = /\{\/\*\s*1\.d FOOTER BLOCK\s*\*\/\}\s*<div className="relative z-10 shrink-0 border-t border-white\/10 p-5 \[\@media\(max-height:640px\)\]:p-3">[\s\S]*?<\/div>\s*<\/div>\s*<\/motion\.div>/;
content = content.replace(
  footerBlockRegex,
  `{/* 1.d FOOTER BLOCK */}
            <div className="relative z-10 shrink-0 border-t border-white/10 p-5 [@media(max-height:640px)]:p-3" style={{ paddingBottom: "max(16px, env(safe-area-inset-bottom))" }}>
              <div className="grid gap-3 [@media(max-height:520px)]:grid-cols-2 landscape:grid-cols-2">
                <Link
                  href="/contact"
                  onClick={closeMenu}
                  className="flex items-center justify-center h-[52px] [@media(max-height:640px)]:h-[48px] w-full rounded-md bg-white text-[#800020] font-semibold text-[15px] tracking-[0.03em] shadow-md active:scale-[0.99] transition-transform pointer-events-auto shrink-0"
                >
                  Request a Quote
                </Link>

                <div className="grid grid-cols-2 gap-2 h-[52px] [@media(max-height:640px)]:h-[48px] shrink-0 w-full">
                  <a
                    href={callHref}
                    className="flex items-center justify-center gap-2 h-full w-full rounded-md border border-white/20 bg-white/5 hover:bg-white/10 transition-colors px-2 text-[14px] min-w-0 shrink-0"
                  >
                    <Phone className="w-4 h-4 shrink-0" />
                    <span>Call us</span>
                  </a>
                  <a
                    href={waHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 h-full w-full rounded-md border border-white/20 bg-white/5 hover:bg-white/10 transition-colors px-2 text-[14px] min-w-0 shrink-0"
                  >
                    <MessageCircle className="w-4 h-4 shrink-0" />
                    <span>WhatsApp</span>
                  </a>
                </div>
              </div>
            </div>
          </motion.div>`
);

// 5. Desktop Side Panel Padding and Button
// First fix paddings
content = content.replace(
  /justify-center px-8 sm:px-10 overflow-y-auto overscroll-contain overflow-x-hidden \[scrollbar-width:none\] \[\&\:\:-webkit-scrollbar\]:hidden/,
  'justify-center px-12 overflow-y-auto overscroll-contain overflow-x-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'
);
content = content.replace(
  /shrink-0 px-8 sm:px-10 pt-3" style=\{\{ paddingBottom: "max\(1.25rem, env\(safe-area-inset-bottom\)\)" \}\}/,
  'shrink-0 px-12 pt-1" style={{ paddingBottom: "max(1.25rem, env(safe-area-inset-bottom))" }}'
);

// Inject Button
const desktopFooterRegex = /\{\/\*\s*FOOTER BLOCK\s*\*\/\}\s*<div className="relative z-10 shrink-0 px-12 pt-1" style=\{\{ paddingBottom: "max\(1.25rem, env\(safe-area-inset-bottom\)\)" \}\}>/;
content = content.replace(
  desktopFooterRegex,
  `{/* BUTTON BLOCK */}
              <div className="relative z-10 shrink-0 px-12 mt-2">
                <Link
                  href="/contact"
                  onClick={closePanel}
                  className="flex w-full items-center justify-center h-[48px] rounded-md bg-white text-[#800020] font-semibold text-[15px] hover:bg-white/90 transition-colors pointer-events-auto shrink-0"
                >
                  Request a Quote
                </Link>
              </div>

              {/* FOOTER BLOCK */}
              <div className="relative z-10 shrink-0 px-12 pt-3" style={{ paddingBottom: "max(1.25rem, env(safe-area-inset-bottom))" }}>`
);

fs.writeFileSync('src/components/Navbar.tsx', content, 'utf8');
console.log('Update 3 successful');
