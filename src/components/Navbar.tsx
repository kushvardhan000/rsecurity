"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { X, Phone, Menu, MessageCircle } from "lucide-react";
import {
  NAV_LINKS,
  SECONDARY_LINKS,
  type NavLink,
} from "@/src/data/nav";
import { SITE } from "@/src/data/site";
import { MagneticButton } from "./ui/MagneticButton";
import { usePreloaderDone } from "@/src/lib/preloader";
import { useLenis } from "@/src/lib/lenis";
import { cn } from "@/src/lib/cn";

/* ── Constants ───────────────────────────────────── */

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
const SCROLL_SHRINK = 30;
const SCROLL_HIDE = 80;
const SCROLL_DELTA = 4;

const MOBILE_PRIMARY = [
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Awards", href: "/awards" },
  { label: "Clients", href: "/clients" },
  { label: "Contact", href: "/contact" },
];

const MOBILE_SECONDARY = [
  { label: "Events", href: "/events" },
  { label: "Gallery", href: "/gallery" },
  { label: "Careers", href: "/careers" },
];

/* ── Overlay lock hook ───────────────────────────── */

function useOverlayLock(
  isOpen: boolean,
  containerRef: React.RefObject<HTMLDivElement | null>,
  triggerRef: React.RefObject<HTMLButtonElement | null>,
  onClose: () => void,
  lenis: ReturnType<typeof useLenis>
) {
  useEffect(() => {
    if (!isOpen) return;

    // Use counter-based stop/start from Lenis context
    lenis?.stop();

    const container = containerRef.current;
    const trigger = triggerRef.current;
    const focusables = container?.querySelectorAll<HTMLElement>(
      "a[href], button:not([disabled])"
    );
    focusables?.[0]?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key === "Tab" && focusables?.length) {
        const list = Array.from(focusables);
        const idx = list.indexOf(document.activeElement as HTMLElement);
        if (e.shiftKey && idx <= 0) {
          e.preventDefault();
          list[list.length - 1].focus();
        } else if (!e.shiftKey && idx === list.length - 1) {
          e.preventDefault();
          list[0].focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);

    return () => {
      lenis?.start();
      document.removeEventListener("keydown", onKey);
      trigger?.focus();
    };
  }, [isOpen, containerRef, triggerRef, onClose, lenis]);
}

/* ── Navbar ──────────────────────────────────────── */

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  const [active, setActive] = useState<string>("");

  const pathname = usePathname();
  const menuBtnRef = useRef<HTMLButtonElement>(null);
  const panelBtnRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const lastYRef = useRef(0);
  const rafIdRef = useRef(0);
  const lenis = useLenis();
  const preloaderDone = usePreloaderDone();

  /* ── Scroll: shrink + hide/show ────────────────── */

  useEffect(() => {
    const onScroll = () => {
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
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(rafIdRef.current);
    };
  }, [menuOpen, panelOpen]);

  /* ── Active section via IntersectionObserver ────── */

  useEffect(() => {
    if (pathname !== "/") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setActive(pathname.slice(1).split("/")[0]);
      return;
    }
    const ids = NAV_LINKS.map((l) => l.href.slice(1)).filter(Boolean);
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (!sections.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(e.target.id);
        }
      },
      { rootMargin: "-30% 0px -60% 0px" }
    );

    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, [pathname]);

  /* ── Close on route change ─────────────────────── */

  useEffect(() => {
    setMenuOpen(false);
    setPanelOpen(false);
  }, [pathname]);

  /* ── Open / close handlers ─────────────────────── */

  const closeMenu = useCallback(() => setMenuOpen(false), []);
  const closePanel = useCallback(() => setPanelOpen(false), []);

  const openMenu = useCallback(() => {
    setPanelOpen(false);
    setMenuOpen(true);
  }, []);

  const openPanel = useCallback(() => {
    setMenuOpen(false);
    setPanelOpen(true);
  }, []);

  /* ── Overlay locks ─────────────────────────────── */

  useOverlayLock(menuOpen, menuRef, menuBtnRef, closeMenu, lenis);
  useOverlayLock(panelOpen, panelRef, panelBtnRef, closePanel, lenis);

  const navReady = preloaderDone;
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 1024;

  return (
    <>
      <header
        role="banner"
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-300 pointer-events-auto",
          "lg:bg-white/90 lg:backdrop-blur-md lg:border-b",
          scrolled
            ? "bg-white/92 backdrop-blur-md border-b border-neutral-200/90 shadow-sm h-[64px] lg:h-[72px]"
            : "bg-transparent border-transparent lg:border-neutral-200/50 h-[64px] lg:h-[84px]",
          /* removed pt-[env...] so logo tab hits true ceiling */
        )}
        style={{
          opacity: navReady ? 1 : 0,
          transform: navReady
            ? visible
              ? "translateY(0)"
              : "translateY(-100%)"
            : "translateY(-100%)",
          transition:
            "opacity 0.5s ease, transform 0.4s cubic-bezier(0.22,1,0.36,1), background-color 0.3s ease, height 0.3s ease",
        }}
      >
        <div className="mx-auto flex items-center justify-between px-0 lg:px-8 max-w-[1360px] w-full h-[calc(64px+env(safe-area-inset-top))] lg:h-full">
          {/* ── Logo Tab (100% Seamless & Transparent) ──── */}
          <a
            href="/"
            aria-label={`${SITE.companyName} — home`}
            className="relative z-10 flex shrink-0 items-center justify-center bg-white h-full pt-[env(safe-area-inset-top)] lg:pt-0 px-[20px] transition-opacity hover:opacity-95"
          >
            <img
              src="/logos/rsfullllogoBGTRANSPARENT.png"
              alt={`${SITE.companyName} logo`}
              className={cn(
                "w-auto object-contain transition-all duration-300 mix-blend-multiply py-2",
                scrolled
                  ? "h-[44px] lg:h-[64px]"
                  : "h-[44px] sm:h-[48px] lg:h-[72px]"
              )}
            />
          </a>

          {/* ── Desktop primary links (>=1024px) ──── */}
          <nav
            aria-label="Primary navigation"
            className="hidden lg:flex items-center gap-1 xl:gap-2"
          >
            {NAV_LINKS.map((link: NavLink) => {
              const isActive = active === link.href.slice(1);
              return (
                <a
                  key={link.label}
                  href={link.href}
                  aria-current={isActive ? "true" : undefined}
                  className={cn(
                    "group relative px-3 py-2 text-[13px] font-semibold tracking-[0.05em] uppercase transition-colors duration-200",
                    isActive
                      ? "text-[#800020]"
                      : "text-neutral-700 hover:text-[#800020]"
                  )}
                >
                  {link.label}
                  <span
                    aria-hidden="true"
                    className={cn(
                      "absolute left-3 right-3 bottom-[3px] h-[2px] rounded-full bg-[#800020] transition-transform duration-300 ease-out origin-left",
                      isActive
                        ? "scale-x-100"
                        : "scale-x-0 group-hover:scale-x-100"
                    )}
                  />
                </a>
              );
            })}
          </nav>

          {/* ── Right actions ────────────────────────── */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 lg:gap-3 h-full pt-[env(safe-area-inset-top)] lg:pt-0 pr-3.5 sm:pr-6 lg:pr-0">
            {/* Phone (Desktop) */}
            <a
              href="/contact"
              aria-label="Call us"
              className={cn(
                "hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-md border text-[13px] font-semibold tracking-[0.03em] transition-all duration-200",
                "text-neutral-800 border-neutral-300 hover:border-[#800020] hover:text-[#800020] bg-white/70"
              )}
            >
              <Phone aria-hidden="true" className="h-3.5 w-3.5 text-[#800020]" />
              <span>{SITE.contact.phone.split(",")[0].trim()}</span>
            </a>

            {/* Request a Quote (Desktop) */}
            <MagneticButton
              href="/contact"
              variant="primary"
              className="hidden lg:inline-flex h-[38px] !px-4 xl:!px-5 !text-[12px] xl:!text-[13px] uppercase font-semibold tracking-wider bg-[#800020] hover:bg-[#600018] text-white shadow-sm rounded-md"
            >
              Request a Quote
            </MagneticButton>

            {/* Desktop More Menu */}
            <button
              ref={panelBtnRef}
              type="button"
              onClick={openPanel}
              aria-label="More navigation"
              aria-expanded={panelOpen}
              aria-controls="desktop-panel"
              className={cn(
                "hidden lg:flex h-[38px] items-center gap-1.5 px-3 rounded-md border text-[12px] xl:text-[13px] font-semibold tracking-wider uppercase transition-colors cursor-pointer",
                "text-neutral-700 border-neutral-300 hover:border-[#800020] hover:text-[#800020] bg-white/70"
              )}
            >
              <Menu aria-hidden="true" className="h-4 w-4" />
              <span>More</span>
            </button>

            {/* Hamburger trigger (Mobile) */}
            <button
              ref={menuBtnRef}
              type="button"
              onClick={openMenu}
              aria-label="Open menu"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              className="lg:hidden flex h-[44px] w-[44px] shrink-0 items-center justify-center bg-white/95 text-maroon-950 shadow-sm active:scale-95 transition-all cursor-pointer rounded-md border border-neutral-200/50"
            >
              <Menu aria-hidden="true" className="h-6 w-6" />
            </button>
          </div>
        </div>
      </header>

      {/* ═══════════════════════════════════════════════
          MOBILE FULL-SCREEN MENU (<1024px)
          ═══════════════════════════════════════════════ */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            ref={menuRef}
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            className="fixed inset-0 z-[60] flex flex-col bg-[#2a060c] text-white overflow-hidden overscroll-contain select-none"
            style={{
              /* paddingTop handled inside Top Bar */
              paddingRight: "env(safe-area-inset-right)",
              paddingBottom: "env(safe-area-inset-bottom)",
              paddingLeft: "env(safe-area-inset-left)",
              height: "100dvh",
            }}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: EASE }}
          >
            {/* Top Bar inside Menu (Matches Navbar) */}
            <div className="flex items-center justify-between pr-3.5 sm:pr-6 h-[calc(64px+env(safe-area-inset-top))] shrink-0">
              <a href="/" className="h-full pt-[env(safe-area-inset-top)] px-[20px] bg-white flex items-center justify-center">
                <img
                  src="/logos/rsfullllogoBGTRANSPARENT.png"
                  alt={`${SITE.companyName} logo`}
                  className="h-[44px] sm:h-[48px] w-auto object-contain mix-blend-multiply py-2"
                />
              </a>
              <button
                type="button"
                onClick={closeMenu}
                aria-label="Close menu"
                className="flex h-[44px] w-[44px] mt-[env(safe-area-inset-top)] items-center justify-center bg-white/10 text-white hover:bg-white/20 active:scale-95 transition-colors cursor-pointer rounded-md"
              >
                <X aria-hidden="true" className="h-6 w-6" />
              </button>
            </div>

            {/* Links Stack (Main area) - landscape-aware scrolling */}
            <div className="flex-1 flex flex-col px-6 sm:px-10 overflow-y-auto pb-[130px] justify-center landscape:justify-start landscape:pt-6">
              <nav aria-label="Mobile navigation" className="flex flex-col">
                {MOBILE_PRIMARY.map((link, i) => {
                  const isActive = active === link.href.slice(1) || (pathname === link.href);
                  return (
                    <a
                      key={link.label}
                      href={link.href}
                      onClick={closeMenu}
                      className="group relative flex items-center h-[60px] border-b border-white/10 text-white pl-4 -ml-4"
                    >
                      {/* Active Indicator */}
                      <span className={cn(
                        "absolute left-0 top-[14px] bottom-[14px] w-[2px] bg-[var(--color-rose)] transition-opacity duration-300",
                        isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                      )} />

                      <span className="w-10 text-[11px] font-mono tracking-wider text-rose">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span
                        className="text-[30px]"
                        style={{ fontFamily: "var(--font-display-serif)" }}
                      >
                        {link.label}
                      </span>
                    </a>
                  );
                })}
              </nav>

              {/* Secondary links (Events • Gallery • Careers) */}
              <div className="mt-5 flex flex-wrap items-center gap-3 text-[14px] text-white/70">
                {MOBILE_SECONDARY.map((link, i) => (
                  <div key={link.label} className="flex items-center gap-3">
                    <a href={link.href} onClick={closeMenu} className="hover:text-white transition-colors">
                      {link.label}
                    </a>
                    {i < MOBILE_SECONDARY.length - 1 && (
                      <span aria-hidden="true" className="text-white/30">&bull;</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Footer / Pinned Area (Safe-area aware) */}
            <div className="absolute bottom-0 inset-x-0 px-6 sm:px-10 pb-[calc(env(safe-area-inset-bottom)+20px)] pt-5 shrink-0 bg-maroon-950/95 backdrop-blur-md border-t border-white/10">
              <div className="flex flex-col gap-4">
                <a
                  href="/contact"
                  onClick={closeMenu}
                  className="w-full h-[52px] flex items-center justify-center rounded-sm bg-white text-maroon-950 font-semibold text-[15px] tracking-[0.03em] shadow-md active:scale-[0.99] transition-transform"
                >
                  Request a Quote
                </a>

                <div className="flex items-center justify-between text-[14px] text-white/85">
                  <a href={`tel:${SITE.contact.phone.split(",")[0].replace(/\s+/g, "")}`} className="flex items-center gap-2 hover:text-white transition-colors">
                    <Phone className="w-4 h-4" />
                    <span>Call us</span>
                  </a>
                  <a href={`https://wa.me/91${SITE.contact.phone.split(",")[0].replace(/\s+/g, "").replace("+91", "")}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-white transition-colors">
                    <MessageCircle className="w-4 h-4" />
                    <span>WhatsApp</span>
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
            {/* Scrim */}
            <motion.div
              className="fixed inset-0 z-[55] bg-neutral-950/40 backdrop-blur-xs"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={closePanel}
              aria-hidden="true"
            />

            {/* Panel */}
            <motion.div
              ref={panelRef}
              id="desktop-panel"
              role="dialog"
              aria-modal="true"
              aria-label="More links"
              className="fixed top-0 right-0 bottom-0 z-[60] w-full max-w-[360px] flex flex-col bg-white text-neutral-800 shadow-2xl border-l border-neutral-200 overflow-y-auto"
              data-lenis-prevent
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.45, ease: EASE }}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-neutral-100">
                <span className="text-[12px] font-bold tracking-[0.2em] uppercase text-[#800020]">
                  Menu
                </span>
                <button
                  type="button"
                  onClick={closePanel}
                  aria-label="Close panel"
                  className="flex h-[36px] w-[36px] items-center justify-center rounded-full hover:bg-neutral-100 text-neutral-600 hover:text-neutral-900 transition-colors cursor-pointer"
                >
                  <X aria-hidden="true" className="h-5 w-5" />
                </button>
              </div>

              {/* Secondary links */}
              <nav
                aria-label="Secondary navigation"
                className="flex-1 flex flex-col px-6 py-4"
              >
                {SECONDARY_LINKS.map((link, i) => (
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
                    className="group flex items-center h-[52px] border-b border-neutral-100 text-[16px] font-medium text-neutral-700 transition-colors hover:text-[#800020]"
                  >
                    {link.label}
                  </motion.a>
                ))}
              </nav>

              {/* Social icons */}
              <div className="flex gap-2.5 px-6 py-5 border-t border-neutral-100 bg-neutral-50/70">
                {SITE.socials.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    aria-label={s.label}
                    className="h-[38px] w-[38px] flex items-center justify-center rounded-md border border-neutral-200 bg-white text-neutral-600 transition-colors hover:border-[#800020] hover:text-[#800020] hover:bg-neutral-50 shadow-2xs"
                  >
                    <span className="text-xs font-semibold">
                      {s.label.charAt(0)}
                    </span>
                  </a>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
