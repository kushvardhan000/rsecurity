import type { Metadata } from "next";
import "./globals.css";
import { SmoothScroll } from "@/src/components/SmoothScroll";
import { Preloader } from "@/src/components/Preloader";
import { Navbar } from "@/src/components/Navbar";
import { Footer } from "@/src/components/Footer";
import { SITE } from "@/src/data/site";

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
      className="antialiased"
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
