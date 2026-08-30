import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/explore", "/standard/", "/verify", "/compliance", "/compare"],
      disallow: ["/api/", "/admin/"],
    },
    sitemap: "https://bis-expert.gov.in/sitemap.xml",
  };
}
