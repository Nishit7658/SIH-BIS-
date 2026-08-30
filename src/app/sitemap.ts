import { MetadataRoute } from "next";
import { STANDARDS_DATABASE } from "@/lib/standards-data";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://bis-expert.gov.in";

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "daily", priority: 1.0 },
    { url: `${baseUrl}/explore`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/chat`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/compliance`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/verify`, lastModified: new Date(), changeFrequency: "daily", priority: 0.8 },
    { url: `${baseUrl}/compare`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
  ];

  const standardRoutes: MetadataRoute.Sitemap = STANDARDS_DATABASE.map((std) => ({
    url: `${baseUrl}/standard/${std.id}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.85,
  }));

  return [...staticRoutes, ...standardRoutes];
}
