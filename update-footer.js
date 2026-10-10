const fs = require('fs');

const wordmark = fs.readFileSync('wordmark.svg', 'utf8').trim() || '<svg viewBox="0 0 1000 70" preserveAspectRatio="xMidYMax slice" className="w-full h-auto block select-none"><text x="500" y="60" textAnchor="middle" fontSize="60" fontFamily="serif" fill="currentColor">RANCHI SECURITY</text></svg>';

const content = `"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUp, Mail, MapPin, Phone, ShieldCheck, Twitter, Facebook, Linkedin, Instagram } from "lucide-react";
import { SITE } from "@/src/data/site";
import { cn } from "@/src/lib/cn";

export function Footer() {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [footerInView, setFooterInView] = useState(false);
  const footerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const onScroll = () => {
      setShowScrollTop(window.scrollY > 250);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const ob = new IntersectionObserver(([e]) => setFooterInView(e.isIntersecting), { rootMargin: "0px" });
    if (footerRef.current) ob.observe(footerRef.current);
    return () => ob.disconnect();
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
    });
  };

  const COMPANY_LINKS = [
    { label: "About", href: "/about" },
    { label: "Awards", href: "/awards" },
    { label: "Gallery", href: "/gallery" },
    { label: "Events", href: "/events" },
    { label: "Careers", href: "/careers" },
  ];

  const SERVICES_LINKS = [
    { label: "Industrial", href: "/services/industrial" },
    { label: "Mining", href: "/services/mining" },
    { label: "Escort", href: "/services/escort" },
    { label: "Institutional", href: "/services/institutional" },
    { label: "Event", href: "/services/event" },
  ];

  const QUICK_LINKS = [
    { label: "About", href: "/about" },
    { label: "Services", href: "/services" },
    { label: "Awards", href: "/awards" },
    { label: "Gallery", href: "/gallery" },
    { label: "Events", href: "/events" },
    { label: "Careers", href: "/careers" },
    { label: "Contact", href: "/contact" },
  ];

  const getSocialIcon = (label: string) => {
    const l = label.toLowerCase();
    if (l === "email") return <Mail className="w-5 h-5 sm:w-4 sm:h-4" />;
    if (l === "twitter" || l === "x") return <Twitter className="w-5 h-5 sm:w-4 sm:h-4" />;
    if (l === "facebook") return <Facebook className="w-5 h-5 sm:w-4 sm:h-4" />;
    if (l === "linkedin") return <Linkedin className="w-5 h-5 sm:w-4 sm:h-4" />;
    if (l === "instagram") return <Instagram className="w-5 h-5 sm:w-4 sm:h-4" />;
    return <Mail className="w-5 h-5 sm:w-4 sm:h-4" />;
  };

  const formatAddress = (address: string) => {
    if (!address.includes("Ranchi-834001")) return address;
    const parts = address.split("Ranchi-834001");
    return (
      <>
        {parts[0]}
        <span className="whitespace-nowrap">Ranchi&#8209;834001</span>
        {parts[1]}
      </>
    );
  };

  return (
    <>
      <footer ref={footerRef} className="relative bg-[#FAF6F6] text-slate-900 border-t-2 border-[#E7D6D8] overflow-hidden flex flex-col font-sans">
        {/* Soft Ambient Maroon Glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-32 right-1/4 h-96 w-[560px] rounded-full bg-[#800020]/[0.05] blur-[120px]"
        />

        {/* ── Main Content Container ── */}
        <div className="relative z-10 mx-auto w-full max-w-[1380px] px-5 sm:px-8 lg:px-12 pt-10 sm:pt-14 lg:pt-16 pb-8 lg:pb-12 flex flex-col justify-between flex-1">

          {/* MOBILE (<min-1024px) Layout.
              The task specifies Desktop >=1024px, and Mobile <640px.
              We'll make Tablet (640-1023) an intermediate stack. */}
          <div className="lg:hidden flex flex-col gap-8 md:gap-10">
            {/* Brand Row */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
              <div className="shrink-0 flex items-start justify-between w-full sm:w-auto gap-4">
                <Image
                  src="/logos/rsfullllogoBGTRANSPARENT.png"
                  alt={\`\${SITE.companyName} logo\`}
                  width={447}
                  height={407}
                  className="w-[120px] sm:w-[170px] h-auto object-contain shrink-0"
                />

                {/* Right side block on mobile only */}
                <div className="flex flex-col items-end text-right sm:hidden">
                  <p className="text-[13px] leading-snug text-neutral-600 line-clamp-3 max-w-[180px]">
                    {SITE.tagline}
                  </p>
                  <div className="flex gap-[12px] mt-4">
                    {SITE.socials.map((s) => (
                      <a
                        key={s.label}
                        href={s.href}
                        aria-label={s.label}
                        className="flex shrink-0 items-center justify-center w-[40px] h-[40px] rounded-full bg-white border border-[#E7D6D8] text-[#800020] hover:bg-[#800020] hover:text-white hover:border-[#800020] transition-colors"
                      >
                        {getSocialIcon(s.label)}
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              {/* Tagline & Socials for tablet (sm to lg) */}
              <div className="hidden sm:flex flex-col items-end text-right flex-1 max-w-[320px]">
                <p className="text-sm leading-relaxed text-neutral-600">
                  {SITE.tagline}
                </p>
                <div className="flex gap-4 mt-6">
                  {SITE.socials.map((s) => (
                    <a
                      key={s.label}
                      href={s.href}
                      aria-label={s.label}
                      className="flex items-center justify-center w-10 h-10 rounded-full bg-white border border-[#E7D6D8] text-[#800020] hover:bg-[#800020] hover:text-white transition-colors shrink-0"
                    >
                      {getSocialIcon(s.label)}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="flex flex-wrap gap-x-[20px] gap-y-[12px]">
              {QUICK_LINKS.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-[14px] font-medium text-slate-800 hover:text-[#800020] transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Contact Rows */}
            <div className="flex flex-col gap-[12px]">
              <a href={\`tel:\${SITE.contact.phone.split(',')[0].replace(/\\s+/g, '')}\`} className="flex items-center gap-3 min-h-[44px] text-[14px] text-slate-700 hover:text-[#800020] transition-colors group">
                <span className="flex shrink-0 items-center justify-center w-8 h-8 rounded-full bg-[#800020]/10 text-[#800020] group-hover:bg-[#800020] group-hover:text-white transition-colors">
                  <Phone className="w-4 h-4" />
                </span>
                <span className="font-medium">{SITE.contact.phone}</span>
              </a>
              <a href={\`mailto:\${SITE.contact.email}\`} className="flex items-center gap-3 min-h-[44px] text-[14px] text-slate-700 hover:text-[#800020] transition-colors group">
                <span className="flex shrink-0 items-center justify-center w-8 h-8 rounded-full bg-[#800020]/10 text-[#800020] group-hover:bg-[#800020] group-hover:text-white transition-colors">
                  <Mail className="w-4 h-4" />
                </span>
                <span className="font-medium break-all">{SITE.contact.email}</span>
              </a>
              <div className="flex items-start gap-3 min-h-[44px] text-[13px] text-slate-700">
                <span className="flex shrink-0 items-center justify-center w-8 h-8 rounded-full bg-[#800020]/10 text-[#800020]">
                  <MapPin className="w-4 h-4" />
                </span>
                <span className="font-medium leading-relaxed line-clamp-2 mt-0.5" style={{ overflowWrap: "anywhere" }}>
                  {formatAddress(SITE.contact.address)}
                </span>
              </div>
            </div>

            {/* ISO Line */}
            <div className="flex items-center gap-2 text-[12px] text-[#800020] font-medium pt-2">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>ISO 9001, 14001, 45001 and 27001 certified</span>
            </div>
          </div>

          {/* DESKTOP (>=1024px) 12-col Layout */}
          <div className="hidden lg:grid grid-cols-12 gap-10">
            {/* Col 4: Logo + tagline */}
            <div className="col-span-4 flex flex-col gap-6">
              <Image
                src="/logos/rsfullllogoBGTRANSPARENT.png"
                alt={\`\${SITE.companyName} logo\`}
                width={447}
                height={407}
                className="w-[220px] xl:w-[250px] h-auto object-contain drop-shadow-sm shrink-0"
              />
              <p className="text-[14px] text-neutral-600 leading-relaxed max-w-[90%] font-medium line-clamp-3">
                {SITE.tagline}
              </p>
            </div>

            {/* Col 2: Company */}
            <div className="col-span-2 flex flex-col">
              <span className="text-[13px] font-bold uppercase tracking-widest text-[#800020] mb-6">
                Company
              </span>
              <ul className="flex flex-col gap-4">
                {COMPANY_LINKS.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-[14px] font-medium text-slate-700 hover:text-[#800020] transition-colors inline-block"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Col 2: Services */}
            <div className="col-span-2 flex flex-col">
              <span className="text-[13px] font-bold uppercase tracking-widest text-[#800020] mb-6">
                Services
              </span>
              <ul className="flex flex-col gap-4">
                {SERVICES_LINKS.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-[14px] font-medium text-slate-700 hover:text-[#800020] transition-colors inline-block"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Col 4: Head office */}
            <div className="col-span-4 flex flex-col">
              <span className="text-[13px] font-bold uppercase tracking-widest text-[#800020] mb-6">
                Head Office
              </span>
              <ul className="flex flex-col gap-4">
                <li>
                  <a
                    href={\`tel:\${SITE.contact.phone.split(',')[0].replace(/\\s+/g, '')}\`}
                    className="flex items-center gap-3 text-[14px] text-slate-700 hover:text-[#800020] transition-colors group"
                  >
                    <span className="flex shrink-0 items-center justify-center w-8 h-8 rounded-full bg-[#800020]/10 text-[#800020] group-hover:bg-[#800020] group-hover:text-white transition-colors">
                      <Phone className="w-4 h-4" />
                    </span>
                    <span className="font-medium truncate">{SITE.contact.phone}</span>
                  </a>
                </li>
                <li>
                  <a
                    href={\`mailto:\${SITE.contact.email}\`}
                    className="flex items-center gap-3 text-[14px] text-slate-700 hover:text-[#800020] transition-colors group"
                  >
                    <span className="flex shrink-0 items-center justify-center w-8 h-8 rounded-full bg-[#800020]/10 text-[#800020] group-hover:bg-[#800020] group-hover:text-white transition-colors">
                      <Mail className="w-4 h-4" />
                    </span>
                    <span className="font-medium break-all">{SITE.contact.email}</span>
                  </a>
                </li>
                <li className="flex items-start gap-3 text-[14px] text-slate-700">
                  <span className="flex shrink-0 items-center justify-center w-8 h-8 rounded-full bg-[#800020]/10 text-[#800020]">
                    <MapPin className="w-4 h-4" />
                  </span>
                  <span className="font-medium leading-relaxed max-w-[280px]" style={{ overflowWrap: "anywhere" }}>
                    {formatAddress(SITE.contact.address)}
                  </span>
                </li>
              </ul>

              {/* Social icons below */}
              <div className="flex flex-wrap gap-[12px] mt-8">
                {SITE.socials.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    aria-label={s.label}
                    className="flex shrink-0 items-center justify-center min-w-[44px] h-[44px] w-[44px] rounded-full bg-white border border-[#E7D6D8] text-[#800020] hover:bg-[#800020] hover:text-white transition-colors touch-manipulation shadow-xs"
                  >
                    {getSocialIcon(s.label)}
                  </a>
                ))}
              </div>

              {/* ISO block below */}
              <div className="flex items-center gap-2 mt-6 text-[13px] text-[#800020] font-medium">
                <ShieldCheck className="w-[18px] h-[18px] shrink-0" />
                <span>ISO 9001, 14001, 45001 and 27001 certified</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Legal Bar ── */}
        <div className="relative z-10 w-full bg-white/70 border-t border-[#E7D6D8]/50 pb-[env(safe-area-inset-bottom)]">
          <div className="mx-auto w-full max-w-[1380px] px-5 sm:px-8 lg:px-12 py-5 sm:py-6">
            <div className="flex flex-col sm:flex-row items-center sm:justify-between text-[12px] font-medium text-slate-500 gap-[8px] sm:gap-[16px]">
              <div className="flex flex-col sm:flex-row items-center gap-[8px] sm:gap-6 text-center sm:text-left">
                <span>&copy; {new Date().getFullYear()} {SITE.companyName}. All rights reserved.</span>
                <div className="flex items-center gap-4">
                  <Link href="/privacy-policy" className="hover:text-[#800020] transition-colors">Privacy Policy</Link>
                  <span className="text-slate-300">•</span>
                  <Link href="/terms-and-conditions" className="hover:text-[#800020] transition-colors">Terms & Conditions</Link>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-[8px] sm:gap-4 text-center sm:text-right">
                <span>Crafted by HITCS Pvt. Ltd.</span>

                {/* Back to top text inside the legal bar */}
                <button
                  type="button"
                  onClick={scrollToTop}
                  className="flex items-center gap-1.5 text-[#800020] font-bold uppercase tracking-wider hover:opacity-75 transition-opacity sm:ml-2 mt-1 sm:mt-0"
                >
                  Back to top <ArrowUp className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ── Background Wordmark block ── */}
        <div className="w-full flex justify-center opacity-[0.035] pointer-events-none mt-auto">
          ${wordmark}
        </div>
      </footer>

      {/* Floating Back to Top Button (Hidden when footer is visible) */}
      {!footerInView && (
        <button
          type="button"
          onClick={scrollToTop}
          aria-label="Scroll to top"
          className={cn(
            "fixed bottom-6 right-6 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-white text-slate-900 shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-slate-100 transition-all duration-300 ease-out hover:scale-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#800020] focus:ring-offset-2",
            showScrollTop
              ? "translate-y-0 opacity-100"
              : "translate-y-8 opacity-0 pointer-events-none"
          )}
        >
          <ArrowUp aria-hidden="true" className="h-5 w-5" />
        </button>
      )}
    </>
  );
}
`;

fs.writeFileSync('src/components/Footer.tsx', content, 'utf8');
console.log('Footer updated.');
