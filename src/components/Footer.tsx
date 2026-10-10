"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ArrowUp, Mail, MapPin, Phone, ShieldCheck } from "lucide-react";
import { SITE } from "@/src/data/site";
import { cn } from "@/src/lib/cn";

export function Footer() {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setShowScrollTop(window.scrollY > 250);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
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
    { label: "All Services", href: "/services" },
  ];

  return (
    <>
      <footer className="relative bg-[#FAF6F6] text-slate-900 border-t-2 border-[#E7D6D8] overflow-hidden flex flex-col">
        {/* Soft Ambient Maroon Glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-32 right-1/4 h-96 w-[560px] rounded-full bg-[#800020]/[0.05] blur-[120px]"
        />

        {/* ── Main Content Container ── */}
        <div className="relative z-10 mx-auto w-full max-w-[1380px] px-5 sm:px-8 lg:px-12 pt-12 sm:pt-14 lg:pt-16 pb-6 flex flex-col justify-between flex-1">
          
          {/* === Main Links & Columns Grid === */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 pb-8 sm:pb-10 border-b border-[#E3D3D5]">
            
            {/* Brand Col (5 cols Desktop) */}
            <div className="lg:col-span-5 flex flex-col items-start gap-3.5 sm:gap-4">
              {/* Perfectly Proportioned Maroon Logo (Drag/Copy Protected) */}
              <div
                className="relative inline-flex items-center select-none [user-drag:none] [-webkit-user-drag:none]"
              >
                <Image
                  src="/logos/rsfullllogoBGTRANSPARENT.png"
                  alt="Ranchi Security Logo"
                  width={300}
                  height={100}
                  priority
                  draggable={false}
                  className="w-[170px] sm:w-[210px] lg:w-[240px] xl:w-[265px] h-auto object-contain select-none pointer-events-none [user-drag:none] [-webkit-user-drag:none]"
                />
              </div>

              <p className="text-slate-800 text-xs sm:text-sm lg:text-base leading-relaxed max-w-md font-medium">
                Ex-servicemen led security, skill training, and manpower services
                delivering disciplined protection across India since 1995.
              </p>
            </div>

            {/* Combined Company & Services + ISO Certification Block (4 cols Desktop) */}
            <div className="lg:col-span-4 flex flex-col justify-between">
              <div className="grid grid-cols-2 gap-4 sm:gap-8">
                {/* Company Links */}
                <nav aria-label="Company links">
                  <h3 className="text-[#630018] text-xs font-mono font-extrabold tracking-widest uppercase mb-3 sm:mb-4 flex items-center gap-1.5">
                    Company
                    <span className="h-px w-4 bg-[#800020]/30" />
                  </h3>
                  <ul className="space-y-2 sm:space-y-2.5">
                    {COMPANY_LINKS.map((link) => (
                      <li key={link.label}>
                        <a
                          href={link.href}
                          className="text-slate-800 hover:text-[#800020] text-xs sm:text-sm font-semibold transition-colors duration-150 inline-block"
                        >
                          {link.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </nav>

                {/* Services Links */}
                <nav aria-label="Services links">
                  <h3 className="text-[#630018] text-xs font-mono font-extrabold tracking-widest uppercase mb-3 sm:mb-4 flex items-center gap-1.5">
                    Services
                    <span className="h-px w-4 bg-[#800020]/30" />
                  </h3>
                  <ul className="space-y-2 sm:space-y-2.5">
                    {SERVICES_LINKS.map((link) => (
                      <li key={link.label}>
                        <a
                          href={link.href}
                          className="text-slate-800 hover:text-[#800020] text-xs sm:text-sm font-semibold transition-colors duration-150 inline-block"
                        >
                          {link.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>

              {/* Certified ISO Standards Block (Fills the gap below navigation) */}
              <div className="mt-6 sm:mt-8 flex items-start gap-2.5 rounded-md border border-[#D9C4C6] bg-white/80 backdrop-blur-xs px-3 py-2 shadow-2xs max-w-sm">
                <ShieldCheck className="h-4 sm:h-5 w-4 sm:w-5 text-[#800020] shrink-0 mt-0.5" />
                <div className="text-[11px] sm:text-xs leading-snug">
                  <span className="font-bold text-[#630018] tracking-wider uppercase font-mono block">
                    Certified ISO Standards
                  </span>
                  <span className="font-semibold text-slate-800 font-mono tracking-tight">
                    ISO 27001:2022, 45001:2018, 14001:2015, 9001:2015
                  </span>
                </div>
              </div>
            </div>

            {/* Head Office & Contacts (3 cols Desktop) */}
            <div className="lg:col-span-3 flex flex-col">
              <h3 className="text-[#630018] text-xs font-mono font-extrabold tracking-widest uppercase mb-3 sm:mb-4 flex items-center gap-1.5">
                Head Office
                <span className="h-px w-4 bg-[#800020]/30" />
              </h3>

              <address className="not-italic space-y-2.5 sm:space-y-3 text-xs sm:text-sm text-slate-800 leading-snug font-semibold">
                <div className="flex items-center gap-2.5">
                  <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-md bg-[#800020]/10 flex items-center justify-center shrink-0 text-[#800020]">
                    <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4" aria-hidden="true" />
                  </span>
                  <a
                    href={`tel:+91${SITE.contact.phone
                      .split(",")[0]
                      .replace(/\D/g, "")
                      .replace(/^0/, "")}`}
                    className="hover:text-[#800020] font-mono transition-colors"
                  >
                    {SITE.contact.phone.split(",")[0].trim()}
                  </a>
                </div>

                <div className="flex items-center gap-2.5">
                  <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-md bg-[#800020]/10 flex items-center justify-center shrink-0 text-[#800020]">
                    <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4" aria-hidden="true" />
                  </span>
                  <a
                    href={`mailto:${SITE.contact.email}`}
                    className="hover:text-[#800020] truncate block transition-colors"
                  >
                    {SITE.contact.email}
                  </a>
                </div>

                <div className="flex items-start gap-2.5">
                  <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-md bg-[#800020]/10 flex items-center justify-center shrink-0 text-[#800020] mt-0.5">
                    <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4" aria-hidden="true" />
                  </span>
                  <span className="leading-snug text-slate-800 font-medium">
                    {SITE.contact.address}
                  </span>
                </div>
              </address>

              {/* Social Channels */}
              
            </div>
          </div>

          {/* === Legal & Copyright Bar === */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs sm:text-sm text-slate-800 font-semibold">
            <span>© 2026 Ranchi Security Pvt. Ltd. All rights reserved.</span>

            <div className="flex items-center gap-3">
              <a href="/privacy-policy" className="hover:text-[#800020] transition-colors">
                Privacy Policy
              </a>
              <span className="text-[#C2ABAF] select-none">·</span>
              <a href="/terms-and-conditions" className="hover:text-[#800020] transition-colors">
                Terms & Conditions
              </a>
            </div>

            <div>
              <a
                href="http://hitcs.in/"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-1.5 text-slate-800 hover:text-[#800020] transition-colors"
              >
                <span className="font-medium text-slate-600">Crafted by</span>
                <span className="text-[#800020] font-bold tracking-wide group-hover:underline">
                  HITCS.Pvt.Ltd
                </span>
              </a>
            </div>
          </div>
        </div>

        {/* ── Background Watermark: Touches the Absolute Bottom Edge with Zero Gap ── */}
        {/* <div
          className="absolute bottom-0 inset-x-0 w-full overflow-hidden pointer-events-none select-none z-0 leading-none"
          aria-hidden="true"
        >
          <svg
            viewBox="0 0 1000 70"
            className="w-full h-auto block select-none"
            preserveAspectRatio="xMidYMax slice"
          >
            <defs>
              <linearGradient id="wordmarkFloorSnap" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#630018" stopOpacity="0.28" />
                <stop offset="60%" stopColor="#630018" stopOpacity="0.14" />
                <stop offset="100%" stopColor="#630018" stopOpacity="0.04" />
              </linearGradient>
            </defs>
            <text
              x="50%"
              y="68"
              textAnchor="middle"
              fill="url(#wordmarkFloorSnap)"
              className="font-display uppercase tracking-[-0.03em]"
              style={{
                fontSize: "100px",
                fontWeight: 900,
                whiteSpace: "nowrap",
              }}
              textLength="980"
              lengthAdjust="spacingAndGlyphs"
            >
              Ranchi.Security
            </text>
          </svg>
        </div> */}
      </footer>

      {/* ── Floating Back-to-Top Button ── */}
      <div
        className={cn(
          "fixed bottom-4 sm:bottom-6 right-4 sm:right-6 z-50 transition-all duration-300",
          showScrollTop
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 translate-y-4 pointer-events-none"
        )}
      >
        <button
          type="button"
          onClick={scrollToTop}
          aria-label="Back to top"
          className={cn(
            "group relative grid h-10 w-10 sm:h-12 sm:w-12 place-items-center rounded-full cursor-pointer select-none",
            "bg-gradient-to-b from-[#800020] via-[#65031B] to-[#450212]",
            "border-t border-rose-300/40 border-x border-rose-400/20 border-b border-black/80",
            "shadow-[0_8px_16px_-4px_rgba(128,0,32,0.45),0_4px_8px_-2px_rgba(0,0,0,0.3)]",
            "transition-all duration-300 ease-out hover:-translate-y-1 active:translate-y-0.5 active:scale-95"
          )}
        >
          <span
            aria-hidden="true"
            className="absolute -inset-1 rounded-full bg-rose-600/25 blur-md transition-opacity duration-300 group-hover:opacity-100 opacity-60 pointer-events-none -z-10"
          />

          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-2 top-1 h-[45%] rounded-t-full bg-gradient-to-b from-white/25 to-transparent"
          />

          <ArrowUp
            aria-hidden="true"
            className="relative z-10 h-4 w-4 sm:h-5 sm:w-5 text-rose-50 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] transition-transform duration-300 ease-out group-hover:-translate-y-0.5"
            strokeWidth={2.5}
          />
        </button>
      </div>
    </>
  );
}









// "use client";

// import { useEffect, useState } from "react";
// import Image from "next/image";
// import { ArrowUp, Mail, MapPin, Phone, ShieldCheck } from "lucide-react";
// import { SITE } from "@/src/data/site";
// import { cn } from "@/src/lib/cn";

// export function Footer() {
//   const [showScrollTop, setShowScrollTop] = useState(false);

//   useEffect(() => {
//     const onScroll = () => {
//       setShowScrollTop(window.scrollY > 250);
//     };

//     onScroll();
//     window.addEventListener("scroll", onScroll, { passive: true });
//     return () => window.removeEventListener("scroll", onScroll);
//   }, []);

//   const scrollToTop = () => {
//     window.scrollTo({
//       top: 0,
//       behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
//         ? "auto"
//         : "smooth",
//     });
//   };

//   const COMPANY_LINKS = [
//     { label: "About", href: "/about" },
//     { label: "Awards", href: "/awards" },
//     { label: "Gallery", href: "/gallery" },
//     { label: "Events", href: "/events" },
//     { label: "Careers", href: "/careers" },
//   ];

//   const SERVICES_LINKS = [
//     { label: "Industrial", href: "/services/industrial" },
//     { label: "Mining", href: "/services/mining" },
//     { label: "Escort", href: "/services/escort" },
//     { label: "Institutional", href: "/services/institutional" },
//     { label: "Event", href: "/services/event" },
//     { label: "All Services", href: "/services" },
//   ];

 
//   return (
//     <>
//       <footer className="relative bg-[#FAF6F6] text-slate-900 border-t-2 border-[#E7D6D8] overflow-hidden flex flex-col">
//         {/* Soft Ambient Maroon Glow */}
//         <div
//           aria-hidden="true"
//           className="pointer-events-none absolute -top-32 right-1/4 h-96 w-[560px] rounded-full bg-[#800020]/[0.05] blur-[120px]"
//         />

//         {/* ── Main Content Container ── */}
//         <div className="relative z-10 mx-auto w-full max-w-[1380px] px-5 sm:px-8 lg:px-12 pt-14 sm:pt-16 lg:pt-20 pb-6 flex flex-col justify-between flex-1">
          
//           {/* === Main Links & Columns Grid === */}
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12 pb-14 border-b border-[#E3D3D5]">
            
//             {/* Brand Col (5 cols Desktop) */}
//            <div className="lg:col-span-5 flex flex-col items-start gap-3.5 sm:gap-4">
//               {/* Extra Large Logo Container */}
//               <div
//                 className="relative inline-flex items-center select-none"
//                 onContextMenu={(e) => e.preventDefault()}
//               >
//                 <Image
//                   src="/logos/rsfullllogoBGTRANSPARENT.png"
//                   alt="Ranchi Security Logo"
//                   width={380}
//                   height={130}
//                   priority
//                   draggable={false}
//                   className="w-[100px] sm:w-[160px] lg:w-[200px] xl:w-[250px] h-auto object-contain select-none pointer-events-none [user-drag:none] [-webkit-user-drag:none]"
//                 />
//               </div>

//               <p className="text-slate-800 text-xs sm:text-sm lg:text-base leading-relaxed max-w-md font-medium">
//                 Ex-servicemen led security, skill training, and manpower services
//                 delivering disciplined protection across India since 1995.
//               </p>

//               {/* Certified ISO Standards Block */}
//               <div className="flex items-start gap-2.5 rounded-md border border-[#D9C4C6] bg-white/80 backdrop-blur-xs px-3 py-2 shadow-2xs max-w-md">
//                 <ShieldCheck className="h-4 sm:h-5 w-4 sm:w-5 text-[#800020] shrink-0 mt-0.5" />
//                 <div className="text-[11px] sm:text-xs leading-snug">
//                   <span className="font-bold text-[#630018] tracking-wider uppercase font-mono block">
//                     Certified ISO Standards
//                   </span>
//                   <span className="font-semibold text-slate-800 font-mono tracking-tight">
//                     ISO 27001:2022, 45001:2018, 14001:2015, 9001:2015
//                   </span>
//                 </div>
//               </div>
//             </div>

//             {/* Company Links (2 cols) */}
//             <nav aria-label="Company links" className="sm:col-span-1 lg:col-span-2">
//               <h3 className="text-[#630018] text-xs font-mono font-extrabold tracking-widest uppercase mb-5 flex items-center gap-2">
//                 Company
//                 <span className="h-px w-5 bg-[#800020]/25" />
//               </h3>
//               <ul className="space-y-3">
//                 {COMPANY_LINKS.map((link) => (
//                   <li key={link.label}>
//                     <a
//                       href={link.href}
//                       className="text-slate-800 hover:text-[#800020] text-sm sm:text-base font-semibold transition-colors duration-150 inline-block hover:translate-x-1 transform"
//                     >
//                       {link.label}
//                     </a>
//                   </li>
//                 ))}
//               </ul>
//             </nav>

//             {/* Services Links (2 cols) */}
//             <nav aria-label="Services links" className="sm:col-span-1 lg:col-span-2">
//               <h3 className="text-[#630018] text-xs font-mono font-extrabold tracking-widest uppercase mb-5 flex items-center gap-2">
//                 Services
//                 <span className="h-px w-5 bg-[#800020]/25" />
//               </h3>
//               <ul className="space-y-3">
//                 {SERVICES_LINKS.map((link) => (
//                   <li key={link.label}>
//                     <a
//                       href={link.href}
//                       className="text-slate-800 hover:text-[#800020] text-sm sm:text-base font-semibold transition-colors duration-150 inline-block hover:translate-x-1 transform"
//                     >
//                       {link.label}
//                     </a>
//                   </li>
//                 ))}
//               </ul>
//             </nav>

//             {/* Head Office (3 cols) */}
//             <div className="sm:col-span-2 lg:col-span-3 flex flex-col">
//               <h3 className="text-[#630018] text-xs font-mono font-extrabold tracking-widest uppercase mb-5 flex items-center gap-2">
//                 Head Office
//                 <span className="h-px w-5 bg-[#800020]/25" />
//               </h3>

//               <address className="not-italic space-y-3.5 text-sm sm:text-base text-slate-800 leading-relaxed font-semibold">
//                 <div className="flex items-center gap-3">
//                   <span className="w-8 h-8 rounded-md bg-[#800020]/10 flex items-center justify-center shrink-0 text-[#800020]">
//                     <Phone className="w-4 h-4" aria-hidden="true" />
//                   </span>
//                   <a
//                     href={`tel:+91${SITE.contact.phone
//                       .split(",")[0]
//                       .replace(/\D/g, "")
//                       .replace(/^0/, "")}`}
//                     className="hover:text-[#800020] font-mono transition-colors"
//                   >
//                     {SITE.contact.phone.split(",")[0].trim()}
//                   </a>
//                 </div>

//                 <div className="flex items-center gap-3">
//                   <span className="w-8 h-8 rounded-md bg-[#800020]/10 flex items-center justify-center shrink-0 text-[#800020]">
//                     <Mail className="w-4 h-4" aria-hidden="true" />
//                   </span>
//                   <a
//                     href={`mailto:${SITE.contact.email}`}
//                     className="hover:text-[#800020] truncate block transition-colors"
//                   >
//                     {SITE.contact.email}
//                   </a>
//                 </div>

//                 <div className="flex items-start gap-3">
//                   <span className="w-8 h-8 rounded-md bg-[#800020]/10 flex items-center justify-center shrink-0 text-[#800020] mt-0.5">
//                     <MapPin className="w-4 h-4" aria-hidden="true" />
//                   </span>
//                   <span className="leading-snug text-slate-800 font-medium">
//                     {SITE.contact.address}
//                   </span>
//                 </div>
//               </address>

//               {/* Social Channels */}
//               <div className="flex items-center gap-3 mt-6">
//                 {/* Facebook */}
//                 <a
//                   href="#"
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   aria-label="Facebook"
//                   className="w-9 h-9 rounded-full bg-white border border-[#D5C2C4] hover:bg-[#800020] hover:border-[#800020] hover:text-white text-[#630018] flex items-center justify-center shadow-xs transition-all hover:scale-105"
//                 >
//                   <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
//                     <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
//                   </svg>
//                 </a>

//                 {/* Instagram */}
//                 <a
//                   href="#"
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   aria-label="Instagram"
//                   className="w-9 h-9 rounded-full bg-white border border-[#D5C2C4] hover:bg-[#800020] hover:border-[#800020] hover:text-white text-[#630018] flex items-center justify-center shadow-xs transition-all hover:scale-105"
//                 >
//                   <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
//                     <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
//                   </svg>
//                 </a>

//                 {/* X (Twitter) */}
//                 <a
//                   href="https://twitter.com/RSPL6"
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   aria-label="X (Twitter)"
//                   className="w-9 h-9 rounded-full bg-white border border-[#D5C2C4] hover:bg-[#800020] hover:border-[#800020] hover:text-white text-[#630018] flex items-center justify-center shadow-xs transition-all hover:scale-105"
//                 >
//                   <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
//                     <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
//                   </svg>
//                 </a>
//               </div>
//             </div>
//           </div>

         

//           {/* === Legal & Copyright Bar === */}
//           <div className="pt-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-sm text-slate-800 font-semibold">
//             <span>© 2026 Ranchi Security Pvt. Ltd. All rights reserved.</span>

//             <div className="flex items-center gap-4">
//               <a
//                 href="/privacy-policy"
//                 className="hover:text-[#800020] transition-colors"
//               >
//                 Privacy Policy
//               </a>
//               <span className="text-[#C2ABAF] select-none">·</span>
//               <a
//                 href="/terms-and-conditions"
//                 className="hover:text-[#800020] transition-colors"
//               >
//                 Terms & Conditions
//               </a>
//             </div>

//             <div>
//               <a
//                 href="http://hitcs.in/"
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="group inline-flex items-center gap-1.5 text-slate-800 hover:text-[#800020] transition-colors"
//               >
//                 <span className="font-medium text-slate-600">Crafted by</span>
//                 <span className="text-[#800020] font-bold tracking-wide group-hover:underline">
//                   HITCS.Pvt.Ltd
//                 </span>
//               </a>
//             </div>
//           </div>
//         </div>

//         {/* ── Background Watermark: 70% of Top Text Visible, Darker & Prominent ── */}
//         <div
//           className="relative w-full h-16 sm:h-22 lg:h-26 overflow-hidden pointer-events-none select-none z-0 mt-3"
//           aria-hidden="true"
//         >
//           {/* Subtle Bottom Floor Gradient Fade */}
//           <div className="absolute inset-0 bg-gradient-to-t from-[#FAF6F6] via-[#FAF6F6]/30 to-transparent z-10" />

//           <svg
//             viewBox="0 0 1000 78"
//             className="w-full h-auto select-none"
//             preserveAspectRatio="xMidYMin slice"
//           >
//             <defs>
//               <linearGradient
//                 id="wordmarkDarkerFade"
//                 x1="0%"
//                 y1="0%"
//                 x2="0%"
//                 y2="100%"
//               >
//                 <stop offset="0%" stopColor="#630018" stopOpacity="0.22" />
//                 <stop offset="50%" stopColor="#630018" stopOpacity="0.12" />
//                 <stop offset="85%" stopColor="#630018" stopOpacity="0.04" />
//                 <stop offset="100%" stopColor="#630018" stopOpacity="0.0" />
//               </linearGradient>
//             </defs>
//             <text
//               x="50%"
//               y="74"
//               textAnchor="middle"
//               fill="url(#wordmarkDarkerFade)"
//               className="font-display uppercase tracking-[-0.03em]"
//               style={{
//                 fontSize: "108px",
//                 fontWeight: 900,
//                 whiteSpace: "nowrap",
//               }}
//               textLength="980"
//               lengthAdjust="spacingAndGlyphs"
//             >
//               Ranchi.Security
//             </text>
//           </svg>
//         </div>
//       </footer>

//       {/* ── FLOATING CORNER BACK-TO-TOP BUTTON ── */}
//       <div
//         className={cn(
//           "fixed bottom-6 right-6 z-50 transition-all duration-300",
//           showScrollTop
//             ? "opacity-100 translate-y-0 pointer-events-auto"
//             : "opacity-0 translate-y-4 pointer-events-none"
//         )}
//       >
//         <button
//           type="button"
//           onClick={scrollToTop}
//           aria-label="Back to top"
//           className={cn(
//             "group relative grid h-12 w-12 sm:h-14 sm:w-14 place-items-center rounded-full cursor-pointer select-none",
//             "bg-gradient-to-b from-[#800020] via-[#65031B] to-[#450212]",
//             "border-t border-rose-300/40 border-x border-rose-400/20 border-b border-black/80",
//             "shadow-[0_12px_24px_-4px_rgba(128,0,32,0.45),0_4px_8px_-2px_rgba(0,0,0,0.3)]",
//             "transition-all duration-300 ease-out hover:-translate-y-1 active:translate-y-0.5 active:scale-95"
//           )}
//         >
//           <span
//             aria-hidden="true"
//             className="absolute -inset-1 rounded-full bg-rose-600/25 blur-md transition-opacity duration-300 group-hover:opacity-100 opacity-60 pointer-events-none -z-10"
//           />

//           <span
//             aria-hidden="true"
//             className="pointer-events-none absolute inset-x-2 top-1 h-[45%] rounded-t-full bg-gradient-to-b from-white/25 to-transparent"
//           />

//           <ArrowUp
//             aria-hidden="true"
//             className="relative z-10 h-5 w-5 sm:h-6 sm:w-6 text-rose-50 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] transition-transform duration-300 ease-out group-hover:-translate-y-0.5"
//             strokeWidth={2.5}
//           />
//         </button>
//       </div>
//     </>
//   );
// }