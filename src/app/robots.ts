import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",
          "/es",
          "/en",
          "/es/blog",
          "/en/blog",
          "/es/clinicas",
          "/en/clinicas",
          "/es/portal",
          "/en/portal",
          "/es/tecnologia",
          "/en/tecnologia",
          "/es/aviso-de-privacidad",
          "/en/aviso-de-privacidad"
        ],
        disallow: ["/api/*"],
      },
    ],
    sitemap: "https://crei.mx/sitemap.xml",
    host: "https://crei.mx",
  };
}
