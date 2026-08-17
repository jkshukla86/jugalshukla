import { services } from "@/data/services";

export const BASE_URL = "https://jugalshukla.com";

export interface SitemapEntry {
  path: string;
  lastmod?: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: string;
}

const CORE_ROUTES: SitemapEntry[] = [
  { path: "/", changefreq: "weekly", priority: "1.0" },
  { path: "/about", changefreq: "monthly", priority: "0.8" },
  { path: "/services", changefreq: "monthly", priority: "0.9" },
  { path: "/blog", changefreq: "weekly", priority: "0.8" },
  { path: "/contact", changefreq: "yearly", priority: "0.6" },
];

const EXCLUDED = new Set(["/auth", "/thank-you", "/not-found"]);

const isIndexable = (path: string) =>
  path.startsWith("/") && !EXCLUDED.has(path) && !path.startsWith("/admin") && !path.startsWith("/lovable");

export function renderUrlset(entries: SitemapEntry[]) {
  const urls = entries.map((e) =>
    [
      `  <url>`,
      `    <loc>${BASE_URL}${e.path}</loc>`,
      e.lastmod ? `    <lastmod>${e.lastmod}</lastmod>` : null,
      e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
      e.priority ? `    <priority>${e.priority}</priority>` : null,
      `  </url>`,
    ]
      .filter(Boolean)
      .join("\n"),
  );
  return [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
    ...urls,
    `</urlset>`,
  ].join("\n");
}

export function xmlResponse(xml: string) {
  return new Response(xml, {
    headers: { "Content-Type": "application/xml", "Cache-Control": "public, max-age=3600" },
  });
}

/** Every indexable non-blog page: hardcoded routes, service pages and admin-created pages. */
export async function getPageEntries(): Promise<SitemapEntry[]> {
  const entries = new Map<string, SitemapEntry>();
  for (const r of CORE_ROUTES) entries.set(r.path, r);
  for (const s of services) {
    entries.set(`/services/${s.slug}`, {
      path: `/services/${s.slug}`,
      changefreq: "monthly",
      priority: "0.7",
    });
  }

  try {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data } = await supabaseAdmin
      .from("pages")
      .select("path, updated_at")
      .eq("status", "published");
    for (const row of (data ?? []) as { path: string; updated_at: string | null }[]) {
      if (!isIndexable(row.path)) continue;
      const existing = entries.get(row.path);
      entries.set(row.path, {
        path: row.path,
        lastmod: row.updated_at ? row.updated_at.slice(0, 10) : existing?.lastmod,
        changefreq: existing?.changefreq ?? "monthly",
        priority: existing?.priority ?? "0.6",
      });
    }

    const { data: seoRows } = await supabaseAdmin.from("seo_meta").select("path, noindex");
    for (const row of (seoRows ?? []) as { path: string; noindex: boolean }[]) {
      if (row.noindex) entries.delete(row.path);
    }
  } catch {
    // fall back to the static route list
  }

  return [...entries.values()];
}

/** Every published blog post. */
export async function getPostEntries(): Promise<SitemapEntry[]> {
  try {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const [{ data }, { data: seoRows }] = await Promise.all([
      supabaseAdmin
        .from("posts")
        .select("slug, published_at, updated_at")
        .eq("status", "published")
        .order("published_at", { ascending: false }),
      supabaseAdmin.from("seo_meta").select("path, noindex"),
    ]);
    const noindex = new Set(
      ((seoRows ?? []) as { path: string; noindex: boolean }[]).filter((r) => r.noindex).map((r) => r.path),
    );
    return ((data ?? []) as { slug: string; published_at: string | null; updated_at: string | null }[])
      .filter((p) => !noindex.has(`/blog/${p.slug}`))
      .map((p) => ({
        path: `/blog/${p.slug}`,
        lastmod: (p.updated_at ?? p.published_at ?? "").slice(0, 10) || undefined,
        changefreq: "monthly" as const,
        priority: "0.7",
      }));
  } catch {
    return [];
  }
}
