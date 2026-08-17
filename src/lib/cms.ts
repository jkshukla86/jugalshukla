import type { Block } from "@/lib/blocks";

export interface PageRecord {
  id: string;
  path: string;
  title: string;
  kind: string;
  status: string;
  blocks: Block[];
  show_in_nav: boolean;
  nav_label: string | null;
  sort_order: number;
}

export interface PostRecord {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  cover_image: string | null;
  read_time: string;
  body: string;
  status: string;
  published_at: string | null;
}

export interface SeoRecord {
  path: string;
  title: string | null;
  description: string | null;
  keywords: string | null;
  og_title: string | null;
  og_description: string | null;
  og_image: string | null;
  canonical: string | null;
  noindex: boolean;
  jsonld: string | null;
}

export interface SeoDefaults {
  title: string;
  description: string;
  ogTitle?: string;
  ogDescription?: string;
  ogType?: string;
}

type MetaTag = Record<string, string>;

/** Merges admin-managed SEO overrides with the route's built-in defaults. */
export function seoMeta(defaults: SeoDefaults, seo?: SeoRecord | null): MetaTag[] {
  const title = seo?.title?.trim() || defaults.title;
  const description = seo?.description?.trim() || defaults.description;
  const ogTitle = seo?.og_title?.trim() || defaults.ogTitle || title;
  const ogDescription = seo?.og_description?.trim() || defaults.ogDescription || description;

  const meta: MetaTag[] = [
    { title },
    { name: "description", content: description },
    { property: "og:title", content: ogTitle },
    { property: "og:description", content: ogDescription },
    { property: "og:type", content: defaults.ogType || "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ];
  if (seo?.keywords?.trim()) meta.push({ name: "keywords", content: seo.keywords.trim() });
  if (seo?.og_image?.trim()) {
    meta.push({ property: "og:image", content: seo.og_image.trim() });
    meta.push({ name: "twitter:image", content: seo.og_image.trim() });
  }
  if (seo?.noindex) meta.push({ name: "robots", content: "noindex, nofollow" });
  return meta;
}

export function seoLinks(seo?: SeoRecord | null) {
  const canonical = seo?.canonical?.trim();
  return canonical ? [{ rel: "canonical", href: canonical }] : [];
}

export const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);

export const normalizePath = (value: string) => {
  const cleaned = `/${value.trim().replace(/^\/+/, "").replace(/\/+$/, "")}`;
  return cleaned === "/" ? "/" : cleaned;
};

export const formatDate = (value?: string | null) =>
  value
    ? new Date(value).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
    : "";
