const fs = require('fs');
let content = fs.readFileSync('src/components/Navbar.tsx', 'utf8');

const mobileMenuStartSplit = content.split('{/* ═══════════════════════════════════════════════\n          MOBILE FULL-SCREEN MENU (<1024px)\n          ═══════════════════════════════════════════════ */}');

if (mobileMenuStartSplit.length < 2) {
  console.error('Marker 1 not found');
  process.exit(1);
}

const newMenus = `
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            ref={menuRef}
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            className="fixed inset-0 z-[60] flex flex-col bg-[#2a060c] bg-gradient-to-br from-[#2a060c] to-[#4a0012]/80 text-white overflow-hidden select-none w-full max-w-full h-[100dvh]"
            style={{
              paddingTop: "env(safe-area-inset-top)",
              paddingRight: "env(safe-area-inset-right)",
              paddingBottom: "env(safe-area-inset-bottom)",
              paddingLeft: "env(safe-area-inset-left)",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: EASE }}
          >
            {/* 1.a WATERMARK LAYER */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none [@media(max-height:640px)]:hidden" aria-hidden="true">
              <img
                src="/logos/rsshortlogoBGTRANSPARENT.png"
                alt=""
                className="absolute bottom-[-10%] right-[-12%] w-[70vw] md:w-[340px] max-w-none opacity-[0.06] object-contain filter brightness-0 invert"
              />
            </div>

            {/* 1.b HEADER (shrink-0, relative z-10) */}
            <div className="relative z-10 shrink-0 flex items-center justify-between px-4 sm:px-6 h-[68px]">
              <a href="/" onClick={closeMenu} className="flex group items-center gap-2.5 hover:opacity-90 transition-opacity min-w-0">
                <div className="relative flex shrink-0 items-center justify-center h-[48px] w-[72px]">
                  <img
                    src="/logos/rsshortlogoBGTRANSPARENT.png"
                    alt={\`\${SITE.companyName} logo\`}
                    className="absolute inset-0 h-full w-full object-contain filter brightness-0 invert"
                  />
                </div>
                <div className="hidden min-[340px]:flex flex-col justify-center text-white min-w-0">
                  <span
                    className="text-[18px] font-semibold leading-tight truncate"
                    style={{ fontFamily: "var(--font-display-serif)" }}
                  >
                    Ranchi Security
                  </span>
                  <span className="text-[11px] tracking-[0.1em] uppercase leading-[1.2] mt-[1px] opacity-90 truncate">
                    Est. 1995
                  </span>
                </div>
              </a>
              <button
                type="button"
                onClick={closeMenu}
                aria-label="Close menu"
                className="flex shrink-0 h-[44px] w-[44px] items-center justify-center text-white hover:bg-white/10 transition-colors cursor-pointer rounded-md"
              >
                <X aria-hidden="true" className="h-6 w-6" />
              </button>
            </div>

            {/* 1.c SCROLL AREA */}
            <div className="relative z-10 min-h-0 flex-1 flex flex-col overflow-y-auto overflow-x-hidden overscroll-contain px-6 sm:px-8 landscape:pt-4" data-lenis-prevent>
              <nav aria-label="Mobile navigation" className="flex flex-col flex-1 justify-center landscape:justify-start pt-8 pb-4 min-w-0">
                {MOBILE_PRIMARY.map((link) => {
                  const isActive = active === link.href.slice(1) || pathname === link.href;
                  return (
                    <a
                      key={link.label}
                      href={link.href}
                      onClick={closeMenu}
                      className="group flex items-center h-[56px] [@media(max-height:640px)]:h-[44px] border-b border-white/10 text-white min-w-0"
                    >
                      <span
                        className="text-[30px] [@media(max-height:640px)]:text-[22px] min-w-0 truncate"
                        style={{ fontFamily: "var(--font-display-serif)" }}
                      >
                        {link.label}
                      </span>
                      {isActive && (
                        <span className="w-1.5 h-1.5 rounded-full bg-[#800020] ml-3 shrink-0 shadow-sm" />
                      )}
                    </a>
                  );
                })}
              </nav>

              {/* Secondary links */}
              <div className="mt-4 mb-4 flex items-center gap-5 text-[14px] text-white/75 shrink-0 flex-wrap min-w-0">
                {MOBILE_SECONDARY.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={closeMenu}
                    className="hover:text-white transition-colors truncate min-w-0"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>

            {/* 1.d FOOTER BLOCK */}
            <div className="relative z-10 shrink-0 border-t border-white/10 p-5 [@media(max-height:640px)]:p-3">
              <div className="flex flex-col gap-4 landscape:flex-row landscape:items-center [@media(max-height:640px)]:flex-row [@media(max-height:640px)]:items-center [@media(max-height:640px)]:gap-2">
                <a
                  href="/contact"
                  onClick={closeMenu}
                  className="flex-1 h-[52px] [@media(max-height:640px)]:h-[44px] flex items-center justify-center rounded-sm bg-white text-[#800020] font-semibold text-[15px] tracking-[0.03em] shadow-md active:scale-[0.99] transition-transform shrink-0 whitespace-nowrap min-w-0 px-2"
                >
                  Request a Quote
                </a>

                <div className="flex-1 flex items-center justify-between text-[14px] text-white/85 bg-white/5 rounded-sm overflow-hidden h-[52px] [@media(max-height:640px)]:h-[44px] shrink-0 min-w-0">
                  <a
                    href={\`tel:\${SITE.contact.phone.split(",")[0].replace(/\\s+/g, "")}\`}
                    className="flex-1 h-full min-w-0 flex justify-center items-center gap-2 hover:bg-white/10 transition-colors px-2"
                  >
                    <Phone className="w-4 h-4 shrink-0" />
                    <span className="truncate">Call us</span>
                  </a>
                  <div className="w-[1px] h-6 bg-white/20 shrink-0" />
                  <a
                    href={\`https://wa.me/91\${SITE.contact.phone
                      .split(",")[0]
                      .replace(/\\s+/g, "")
                      .replace("+91", "")}\`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 h-full min-w-0 flex justify-center items-center gap-2 hover:bg-white/10 transition-colors px-2"
                  >
                    <MessageCircle className="w-4 h-4 shrink-0" />
                    <span className="truncate">WhatsApp</span>
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══════════════════════════════════════════════
          DESKTOP SIDE PANEL (>=1024px)
          ═══════════════════════════════════════════════ */}
      <AnimatePresence>
        {panelOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-[55] bg-neutral-950/40 backdrop-blur-xs"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={closePanel}
              aria-hidden="true"
            />

            <motion.div
              ref={panelRef}
              id="desktop-panel"
              role="dialog"
              aria-modal="true"
              aria-label="More links"
              className="fixed inset-y-0 right-0 z-[60] w-[min(420px,100vw)] max-w-full flex flex-col bg-[#2a060c] bg-gradient-to-br from-[#2a060c] to-[#4a0012]/80 text-white shadow-2xl overflow-hidden h-[100dvh]"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.45, ease: EASE }}
            >
              {/* WATERMARK LAYER */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none [@media(max-height:640px)]:hidden" aria-hidden="true">
                <img
                  src="/logos/rsshortlogoBGTRANSPARENT.png"
                  alt=""
                  className="absolute bottom-[-10%] right-[-12%] w-[340px] max-w-none opacity-[0.06] object-contain filter brightness-0 invert"
                />
              </div>

              {/* HEADER */}
              <div className="relative z-10 shrink-0 flex justify-end px-8 pt-6 pb-4">
                <button
                  type="button"
                  onClick={closePanel}
                  aria-label="Close panel"
                  className="flex shrink-0 h-[44px] w-[44px] items-center justify-center rounded-md hover:bg-white/10 text-white transition-colors cursor-pointer"
                >
                  <X aria-hidden="true" className="h-6 w-6" />
                </button>
              </div>

              {/* SCROLL AREA */}
              <div className="relative z-10 min-h-0 flex-1 flex flex-col overflow-y-auto overflow-x-hidden overscroll-contain px-12 py-4" data-lenis-prevent>
                <nav aria-label="Secondary navigation" className="flex flex-col gap-6 justify-center flex-1 min-w-0">
                  {DESKTOP_PANEL_LINKS.map((link, i) => (
                    <motion.a
                      key={link.label}
                      href={link.href}
                      onClick={closePanel}
                      initial={{ opacity: 0, x: 15 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        duration: 0.35,
                        delay: 0.08 + i * 0.05,
                        ease: EASE,
                      }}
                      className="text-[24px] [@media(max-height:640px)]:text-[20px] text-white transition-colors hover:text-white/70 min-w-0 truncate"
                      style={{ fontFamily: "var(--font-display-serif)" }}
                    >
                      {link.label}
                    </motion.a>
                  ))}
                </nav>
              </div>

              {/* FOOTER BLOCK */}
              <div className="relative z-10 shrink-0 border-t border-white/10 p-6 px-12 [@media(max-height:640px)]:p-4 [@media(max-height:640px)]:px-12 bg-black/10">
                <div className="flex flex-col gap-6 [@media(max-height:640px)]:gap-4">
                  <div className="flex flex-col gap-3 text-[14px] text-white/80 leading-relaxed min-w-0">
                    <p className="max-w-[280px]" style={{ overflowWrap: "anywhere" }}>{SITE.contact.address}</p>
                    <div className="flex flex-col gap-1 w-full min-w-0">
                      {SITE.contact.phone.split(",").map((p) => {
                        const trimmed = p.trim();
                        if (!trimmed) return null;
                        return (
                          <a key={p} href={\`tel:\${trimmed.replace(/\\s+/g, "")}\`} className="hover:text-white transition-colors underline-offset-4 w-fit min-w-0 truncate">
                            {trimmed}
                          </a>
                        );
                      })}
                    </div>
                    {SITE.contact.email && (
                       <a href={\`mailto:\${SITE.contact.email}\`} className="hover:text-white transition-colors w-fit break-all">
                         {SITE.contact.email}
                       </a>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-[12px] pt-2">
                    {SITE.socials.map((s) => (
                      <a
                        key={s.label}
                        href={s.href}
                        aria-label={s.label}
                        className="text-white hover:text-white transition-colors text-sm font-semibold h-[44px] min-w-[44px] flex items-center justify-center bg-white/5 rounded-md hover:bg-white/10 shrink-0 px-3 cursor-pointer"
                      >
                        {s.label}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
`;

const newContent = mobileMenuStartSplit[0] + '{/* ═══════════════════════════════════════════════\n          MOBILE FULL-SCREEN MENU (<1024px)\n          ═══════════════════════════════════════════════ */}\n' + newMenus;

fs.writeFileSync('src/components/Navbar.tsx', newContent);
console.log('Update complete.');