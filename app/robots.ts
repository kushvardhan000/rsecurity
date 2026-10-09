import { MetadataRoute } from "next";
import { SITE } from "@/src/data/site";

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