import type { MetadataRoute } from "next";
import { destinations } from "@/data/destinations";
import { site } from "@/data/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: site.url, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${site.url}/hot-tours`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${site.url}/destinations`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${site.url}/health-tours`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${site.url}/reviews`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${site.url}/contacts`, lastModified: now, changeFrequency: "yearly", priority: 0.6 },
  ];

  const destinationPages: MetadataRoute.Sitemap = destinations.map((d) => ({
    url: `${site.url}/destinations/${d.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticPages, ...destinationPages];
}
