import { MetadataRoute } from "next";
import { FEATURED_SERVICES, ALSO_SERVICES } from "@/src/data/services";
import { EVENTS } from "@/src/data/events";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://rsecurity.in";

  const staticPages = [
    "",
    "/about",
    "/services",
    "/events",
    "/gallery",
    "/awards",
    "/clients",
    "/careers",
    "/contact",
    "/privacy-policy",
    "/terms-and-conditions",
  ].map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: path === "" ? 1 : 0.8,
  }));

  const servicePages = [...FEATURED_SERVICES, ...ALSO_SERVICES].map((service) => ({
    url: `${baseUrl}/services/${service.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const eventPages = EVENTS.map((event) => ({
    url: `${baseUrl}/events/${event.slug}`,
    lastModified: new Date(event.date),
    changeFrequency: "yearly" as const,
    priority: 0.6,
  }));

  return [...staticPages, ...servicePages, ...eventPages];
}