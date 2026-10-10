import type { Metadata } from "next";
import { Inter, Newsreader, Noto_Serif_Devanagari, Noto_Sans_Devanagari } from "next/font/google";
import "./globals.css";
import { SmoothScroll } from "@/src/components/SmoothScroll";
import { Preloader } from "@/src/components/Preloader";
import { Navbar } from "@/src/components/Navbar";
import { Footer } from "@/src/components/Footer";
import { SITE } from "@/src/data/site";

const displaySerif = Newsreader({
  subsets: ["latin"],
  variable: "--font-display-serif",
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
  fallback: ["Noto Serif Devanagari", "serif"],
});

const groteskSans = Inter({
  subsets: ["latin"],
  variable: "--font-sans-grotesk",
  weight: ["400", "500", "600", "700"],
  display: "swap",
  fallback: ["Noto Sans Devanagari", "system-ui", "sans-serif"],
});

const devanagariSerif = Noto_Serif_Devanagari({
  subsets: ["devanagari"],
  variable: "--font-devanagari-serif",
  weight: ["400", "500", "700"],
  display: "swap",
  preload: false,
});

const devanagariSans = Noto_Sans_Devanagari({
  subsets: ["devanagari"],
  variable: "--font-devanagari-sans",
  weight: ["400", "500", "600", "700"],
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL("https://rsecurity.in"),
  title: {
    template: `%s | ${SITE.companyName}`,
    default: `${SITE.companyName} — Private Security, Skill Training & Manpower`
  },
  description: SITE.tagline,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      translate="no"
      className={`${displaySerif.variable} ${groteskSans.variable} ${devanagariSerif.variable} ${devanagariSans.variable} antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `try { if (sessionStorage.getItem("rs-preloaded")) document.documentElement.setAttribute("data-preloaded","1") } catch(e){} `,
          }}
        />
      
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Ranchi Security Private Limited",
              "url": "https://rsecurity.in",
              "logo": "https://rsecurity.in/logo.png",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "6th Floor, Hari Om Tower, Circular Road",
                "addressLocality": "Ranchi",
                "addressRegion": "Jharkhand",
                "postalCode": "834001",
                "addressCountry": "IN"
              },
              "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+91-9955110111",
                "contactType": "customer service"
              },
              "sameAs": [
                "https://www.facebook.com/",
                "https://twitter.com/",
                "https://www.instagram.com/"
              ]
            })
          }}
        />
        <meta name="google" content="notranslate" />
      </head>
      <body className="bg-paper font-sans text-maroon-950" suppressHydrationWarning>
        <Preloader />
        <SmoothScroll>
          <Navbar />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </SmoothScroll>
        {/* film-grain overlay, 3% opacity, dark sections only */}
        <div className="grain" aria-hidden="true" />
      </body>
    </html>
  );
}
