import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-DNS-Prefetch-Control", value: "on" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-XSS-Protection", value: "1; mode=block" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" }, // matches frame-ancestors
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), browsing-topics=()" }
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    remotePatterns: [],
  },
  experimental: {
    agentFeedback: true,
  },
  cacheComponents: true,
  partialPrefetching: true,
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
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
