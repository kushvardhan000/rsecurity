import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-DNS-Prefetch-Control", value: "on" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-XSS-Protection", value: "1; mode=block" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), browsing-topics=()" }
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [75, 100],
    deviceSizes: [320, 420, 640, 768, 1024, 1280, 1536, 1920, 2560, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.pexels.com",
        pathname: "/photos/35562107/pexels-photo-35562107.png",
      },
    ],
  },
  experimental: {
    agentFeedback: true,
    optimizePackageImports: ["lucide-react", "framer-motion", "motion", "@radix-ui/react-icons"],
  },
  cacheComponents: true,
  partialPrefetching: true,
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
      {
        source: "/:path*.(jpg|jpeg|png|webp|avif|svg|gif|ico)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        source: "/:path*.(woff|woff2)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
    ];
  },
  async redirects() {
    return [
      { source: "/about.htm", destination: "/about", permanent: true },
      { source: "/advantage.htm", destination: "/about", permanent: true },
      { source: "/awards.htm", destination: "/awards", permanent: true },
      { source: "/client.htm", destination: "/clients", permanent: true },
      { source: "/dog-squad.htm", destination: "/services", permanent: true },
      { source: "/gallery.htm", destination: "/gallery", permanent: true },
      { source: "/latest-event.htm", destination: "/events", permanent: true },
      { source: "/press-gallery.htm", destination: "/gallery", permanent: true },
      { source: "/security-services.htm", destination: "/services", permanent: true },
      { source: "/infra.htm", destination: "/about", permanent: true },
      { source: "/objective.htm", destination: "/about", permanent: true },
      { source: "/career.htm", destination: "/careers", permanent: true },
      { source: "/contact.php", destination: "/contact", permanent: true },
      { source: "/contact.htm", destination: "/contact", permanent: true },
      { source: "/training.html", destination: "/services", permanent: true }
    ];
  }
};

export default nextConfig;
