import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/recursos", "/clinicas", "/portal"],
        disallow: ["/api/*"],
      },
    ],
    sitemap: "https://crei.mx/sitemap.xml",
    host: "https://crei.mx",
  };
}
