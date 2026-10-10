const fs = require('fs');
let layout = fs.readFileSync('app/layout.tsx', 'utf8');

const jsonld = `
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
        />`;

layout = layout.replace(/<\/head>/, jsonld + '\n      </head>');
fs.writeFileSync('app/layout.tsx', layout);
