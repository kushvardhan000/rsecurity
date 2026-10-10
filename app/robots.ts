import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/_next/", "/private/", "/*.json$"],
    },
    sitemap: "https://rsecurity.in/sitemap.xml",
    host: "https://rsecurity.in",
  };
}