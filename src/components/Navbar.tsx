/* eslint-disable */
"use client";

import { useEffect, useLayoutEffect, useRef, useState, useCallback } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { X, Phone, Menu, MessageCircle, ChevronRight } from "lucide-react";
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

const DESKTOP_PANEL_LINKS = [
  { label: "Events", href: "/events" },
  { label: "Gallery", href: "/gallery" },
  { label: "Careers", href: "/careers" },
  { label: "Training", href: "/training" },
  { label: "Press", href: "/press" },
];

/* ── Overlay lock hook ───────────────────────────── */

const lockCountRef = { current: 0 };

function useOverlayLock(
  isOpen: boolean,
  containerRef: React.RefObject<HTMLDivElement | null>,
  triggerRef: React.RefObject<HTMLButtonElement | null>,
  onClose: () => void,
  lenis: ReturnType<typeof useLenis>
) {
  useEffect(() => {
    if (!isOpen) return;

    lockCountRef.current += 1;
    if (lockCountRef.current === 1) {
      lenis?.stop();
      document.documentElement.style.overflow = "hidden";
      document.documentElement.style.scrollbarGutter = "stable";
    }

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
      lockCountRef.current -= 1;
      if (lockCountRef.current === 0) {
        lenis?.start();
        document.documentElement.style.overflow = "";
        document.documentElement.style.scrollbarGutter = "";
      }
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

  /* ── Scroll: shrink + hide/show + Tone compute ──── */
  const [tone, setTone] = useState<string | null>(pathname === "/" ? "light" : "dark");
  const [noAnim, setNoAnim] = useState(true);
  
  useEffect(() => {
    const compute = () => {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = requestAnimationFrame(() => {
        const y = window.scrollY;
        setScrolled(y > SCROLL_SHRINK);

        if (y < 80) {
          setVisible(true);
        }
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
        if (t !== null) {
          setTone(t);
        }
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
  }, [menuOpen, panelOpen, preloaderDone, pathname]);

  const solid = scrolled || tone === "light";

  /* ── Active section via IntersectionObserver ────── */

  useEffect(() => {
    if (pathname !== "/") {
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
    setVisible(true);
  }, [pathname]);

  // Window focus listener
  useEffect(() => {
    const onFocus = () => setVisible(true);
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, []);

  // When menu/panel opens or scroll < 80, setVisible(true) handles by effect


  /* ── Resize listener ─────────────────────────────── */
  useEffect(() => {
    const mql = window.matchMedia("(min-width: 1024px)");
    const handleChange = (e: MediaQueryListEvent | MediaQueryList) => {
      if (e.matches) {
        setMenuOpen(false);
      } else {
        setPanelOpen(false);
      }
    };
    mql.addEventListener("change", handleChange);
    return () => mql.removeEventListener("change", handleChange);
  }, []);

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

  const [navReady, setNavReady] = useState(preloaderDone);

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
  }, [preloaderDone, navReady]);

  // Generate clean telecom paths
  let mobileWa = "";
  let callWa = "";
  const phoneParts = SITE.contact.phone.split(",");
  if (phoneParts.length > 0) {
      let firstClean = phoneParts[0].trim().replace(/\D/g, "");
      if (firstClean.startsWith("0")) firstClean = firstClean.slice(1);
      callWa = firstClean;
  }
  for (const p of phoneParts) {
    let clean = p.trim().replace(/\D/g, "");
    if (clean.startsWith("0")) clean = clean.slice(1);
    if (clean.length >= 10 && /^[6-9]/.test(clean.slice(-10))) {
      mobileWa = clean.slice(-10);
      break;
    }
  }

  const callHref = callWa ? `tel:+91${callWa}` : "#";
  const waHref = mobileWa ? `https://wa.me/91${mobileWa}` : "#";

  return (
    <>
      <header
        role="banner"
        className={cn("fixed inset-x-0 top-0 z-50 pointer-events-auto", noAnim && "nav-no-anim")}
        style={{
          paddingTop: "env(safe-area-inset-top)",
          opacity: 1,
          transform: visible ? "translateY(0)" : "translateY(-100%)",
          transition: noAnim ? "none" : "opacity 0.5s ease, transform 0.4s cubic-bezier(0.22,1,0.36,1)",
        }}
      >
        {noAnim && (<style>{'.nav-no-anim, .nav-no-anim * { transition: none !important; }'}</style>)}
        {/* Scrim */}
        {!solid && (
          <div
            className="absolute inset-x-0 top-0 pointer-events-none transition-opacity duration-300 opacity-100"
            style={{
              height: "140px",
              background: "linear-gradient(to bottom, rgba(42,6,12,.7), transparent)",
            }}
          />
        )}

        {/* White BG */}
        <div
          className={cn(
            "absolute inset-0 pointer-events-none transition-all duration-300",
            solid
              ? "opacity-100 bg-white/94 backdrop-blur-md border-b border-neutral-200"
              : "opacity-0 bg-transparent border-transparent"
          )}
        />

        <div
          className={cn(
            "relative z-10 mx-auto flex items-center justify-between px-4 lg:px-6 xl:px-8 max-w-[1360px] w-full transition-[height] duration-300",
            scrolled ? "h-[68px]" : "h-[68px] lg:h-[80px]"
          )}
        >
          {/* Logo Lockup */}
          <Link
            href="/"
            aria-label={`${SITE.companyName} — home`}
            className="flex items-center gap-2.5 lg:gap-3 transition-opacity hover:opacity-90 py-4 lg:py-2 sm:pl-4"
          >
            <div className="relative flex shrink-0 items-center justify-center transition-all duration-300 h-[56px] lg:h-[66px] w-[80px] lg:w-[92px]">
              <img
                src="/logos/rsfullllogoBGTRANSPARENT.png"
                alt={`${SITE.companyName} lockup white`}
                className={cn(
                  "absolute inset-0 h-full w-full object-contain filter transition-opacity duration-300",
                  solid ? "opacity-0" : "opacity-100 "
                )}
              />
              <img
                src="/logos/rsfullllogoBGTRANSPARENT.png"
                alt={`${SITE.companyName} lockup color`}
                className={cn(
                  "absolute inset-0 h-full w-full object-contain transition-opacity duration-300",
                  solid ? "opacity-100" : "opacity-0"
                )}
              />
            </div>
          </Link>

          {/* Desktop Links (>=1024px) */}
          <nav
            aria-label="Primary navigation"
            className="hidden lg:flex items-center gap-1 xl:gap-2"
          >
            {NAV_LINKS.map((link: NavLink) => {
              const isActive = active === link.href.slice(1);
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  aria-current={isActive ? "true" : undefined}
                  className={cn(
                    "group relative px-3 py-2 text-[13px] font-semibold tracking-[0.05em] uppercase transition-colors duration-200",
                    solid
                      ? isActive
                        ? "text-[#800020]"
                        : "text-neutral-700 hover:text-[#800020]"
                      : isActive
                      ? "text-white"
                      : "text-white/80 hover:text-white"
                  )}
                >
                  {link.label}
                  <span
                    aria-hidden="true"
                    className={cn(
                      "absolute left-3 right-3 bottom-[3px] h-[2px] rounded-full transition-transform duration-300 ease-out origin-left",
                      solid ? "bg-[#800020]" : "bg-white",
                      isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                    )}
                  />
                </Link>
              );
            })}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-3 lg:gap-4 shrink-0">
            

            {/* Desktop More Menu */}
            <button
              ref={panelBtnRef}
              type="button"
              onClick={openPanel}
              aria-label="More navigation"
              aria-expanded={panelOpen}
              aria-controls="desktop-panel"
              className={cn(
                "hidden lg:flex h-[44px] items-center gap-1.5 px-4 rounded-md border text-[13px] font-semibold tracking-wider uppercase transition-colors cursor-pointer",
                solid
                  ? "text-neutral-700 border-neutral-300 hover:border-[#800020] hover:text-[#800020] bg-white/70"
                  : "text-white border-white/35 hover:border-white hover:bg-white/10 bg-transparent backdrop-blur-xs"
              )}
            >
              <Menu aria-hidden="true" className="h-4 w-4" />
              <span>More</span>
            </button>

            {/* Mobile Hamburger trigger (<1024px) */}
            <button
              ref={menuBtnRef}
              type="button"
              onClick={openMenu}
              aria-label="Open menu"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              className={cn(
                "lg:hidden flex relative h-[40px] w-[40px] shrink-0 items-center justify-center rounded-md border transition-all cursor-pointer backdrop-blur-xs",
                solid
                  ? "border-[#800020]/25 bg-white/50 hover:bg-white"
                  : "border-white/35 bg-white/10 hover:bg-white/20"
              )}
            >
              <Menu
                aria-hidden="true"
                className={cn(
                  "absolute inset-0 m-auto h-6 w-6 transition-opacity duration-300",
                  solid ? "opacity-0 text-white" : "opacity-100 text-white"
                )}
              />
              <Menu
                aria-hidden="true"
                className={cn(
                  "absolute inset-0 m-auto h-6 w-6 transition-opacity duration-300",
                  solid ? "opacity-100 text-[#800020]" : "opacity-0"
                )}
              />
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
            <div className="absolute inset-0 overflow-hidden pointer-events-none [@media(max-height:520px)]:hidden" aria-hidden="true">
              <img
                src="/logos/rsshortlogoBGTRANSPARENT.png"
                alt=""
                className="absolute bottom-[-10%] right-[-12%] w-[70vw] md:w-[340px] max-w-none opacity-[0.06] object-contain filter brightness-0 invert"
              />
            </div>

            {/* 1.b HEADER (shrink-0, relative z-10) */}
            <div className="relative z-10 shrink-0 flex items-center justify-between px-4 sm:px-6 h-[68px]">
              <Link href="/" onClick={closeMenu} className="flex group items-center gap-2.5 hover:opacity-90 transition-opacity min-w-0">
                <div className="relative flex shrink-0 items-center justify-center h-[48px] w-[72px]">
                  <img
                    src="/logos/rsshortlogoBGTRANSPARENT.png"
                    alt={`${SITE.companyName} logo`}
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
              </Link>
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
              <div className="flex flex-col flex-1 justify-center min-w-0">
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
                            className="text-[24px] sm:text-[26px] min-w-0 leading-tight"
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
              </div>

              {/* Secondary links */}
              <div className="mt-4 mb-4 flex items-center gap-5 text-[14px] text-white/75 shrink-0 flex-wrap min-w-0 h-[clamp(2.5rem,6dvh,3.5rem)]">
                {MOBILE_SECONDARY.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    onClick={closeMenu}
                    className="hover:text-white transition-colors truncate min-w-0"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* 1.d FOOTER BLOCK */}
            <div className="relative z-10 shrink-0 border-t border-white/10 p-5 [@media(max-height:640px)]:p-3" style={{ paddingBottom: "max(16px, env(safe-area-inset-bottom))" }}>
              <div className="grid gap-3 [@media(max-height:520px)]:grid-cols-2 landscape:grid-cols-2">
                <Link
                  href="/contact"
                  onClick={closeMenu}
                  className="flex items-center justify-center h-[52px] [@media(max-height:640px)]:h-[48px] w-full rounded-md bg-white text-[#800020] font-semibold text-[15px] tracking-[0.03em] shadow-md active:scale-[0.99] transition-transform pointer-events-auto shrink-0"
                >
                  Request a Quote
                </Link>

                <div className="grid grid-cols-2 gap-2 h-12 shrink-0 w-full">
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
              <div className="absolute inset-0 overflow-hidden pointer-events-none [@media(max-height:520px)]:hidden" aria-hidden="true">
                <img
                  src="/logos/rsshortlogoBGTRANSPARENT.png"
                  alt=""
                  className="absolute bottom-[-10%] right-[-12%] w-[340px] max-w-none opacity-[0.06] object-contain filter brightness-0 invert"
                />
              </div>

              {/* HEADER */}
              <div className="relative z-10 shrink-0 flex justify-end px-6 pt-4 pb-0" style={{ paddingTop: "max(1rem, env(safe-area-inset-top))" }}>
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
              <div className="relative z-10 min-h-0 flex-1 flex flex-col justify-center px-12 overflow-y-auto overscroll-contain overflow-x-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" data-lenis-prevent>
                <nav aria-label="Secondary navigation" className="flex flex-col justify-center min-w-0">
                  {DESKTOP_PANEL_LINKS.map((link, i) => (
                    <motion.div
                      key={link.label}
                      initial={{ opacity: 0, x: 15 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        duration: 0.35,
                        delay: 0.08 + i * 0.05,
                        ease: EASE,
                      }}
                    >
                      <Link
                        href={link.href}
                        onClick={closePanel}
                        className="block text-white transition-colors hover:text-white/70 min-w-0 leading-[1.2]"
                        style={{
                          fontFamily: "var(--font-display-serif)",
                          fontSize: "clamp(1.25rem, 3.6dvh, 1.75rem)",
                          paddingBlock: "clamp(0.35rem, 1.3dvh, 0.9rem)"
                        }}
                      >
                        {link.label}
                      </Link>
                    </motion.div>
                  ))}
                </nav>
              </div>

              {/* BUTTON BLOCK */}
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
              <div className="relative z-10 shrink-0 px-12 pt-3" style={{ paddingBottom: "max(1.25rem, env(safe-area-inset-bottom))" }}>
                <p className="text-[14px] leading-[1.5] text-white/85 max-w-[34ch] [@media(max-height:520px)]:hidden" style={{ overflowWrap: "anywhere" }}>
                  {SITE.contact.address}
                </p>
                <p className="text-[13px] sm:text-[14px] text-white/85 mt-2 flex flex-wrap gap-x-1">
                  {SITE.contact.phone.split(",").map((p, idx, arr) => {
                    const trimmed = p.trim();
                    if (!trimmed) return null;
                    let clean = trimmed.replace(/\D/g, "");
                    if (clean.startsWith("0")) clean = clean.slice(1);
                    const telLink = `tel:+91${clean}`;
                    return (
                      <span key={trimmed} className="whitespace-nowrap">
                        <a href={telLink} className="hover:text-white transition-colors underline-offset-4 pointer-events-auto">
                          {trimmed}
                        </a>
                        {idx < arr.length - 1 && <span>, </span>}
                      </span>
                    );
                  })}
                </p>
                <div className="flex flex-wrap gap-x-5 mt-1">
                  {SITE.contact.email && (
                    <a href={`mailto:${SITE.contact.email}`} className="inline-flex min-h-[44px] items-center text-[14px] font-semibold underline underline-offset-4 decoration-white/60 hover:text-[#F2B8BF] transition-colors pointer-events-auto">
                      Email
                    </a>
                  )}
                  {SITE.socials.map((s) => {
                    if ((s.href as string) === "https://twitter.com/" || (s.href as string) === "https://www.facebook.com/") return null;
                    return (
                      <a
                        key={s.label}
                        href={s.href}
                        aria-label={s.label}
                        className="inline-flex min-h-[44px] items-center text-[14px] font-semibold underline underline-offset-4 decoration-white/60 hover:text-[#F2B8BF] transition-colors pointer-events-auto"
                      >
                        {s.label}
                      </a>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}