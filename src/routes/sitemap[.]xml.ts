import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const { BASE_URL, xmlResponse } = await import("@/lib/sitemap.server");
        const now = new Date().toISOString();
        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
          `  <sitemap>`,
          `    <loc>${BASE_URL}/sitemap-pages.xml</loc>`,
          `    <lastmod>${now}</lastmod>`,
          `  </sitemap>`,
          `  <sitemap>`,
          `    <loc>${BASE_URL}/sitemap-blog.xml</loc>`,
          `    <lastmod>${now}</lastmod>`,
          `  </sitemap>`,
          `</sitemapindex>`,
        ].join("\n");
        return xmlResponse(xml);
      },
    },
  },
});
