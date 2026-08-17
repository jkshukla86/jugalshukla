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

/** Renders admin-managed JSON-LD (one object or an array) as head script entries. */
export function seoScripts(seo?: SeoRecord | null) {
  const raw = seo?.jsonld?.trim();
  if (!raw) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    const items = Array.isArray(parsed) ? parsed : [parsed];
    return items.map((item) => ({
      type: "application/ld+json",
      children: JSON.stringify(item),
    }));
  } catch {
    return [];
  }
}

export interface SchemaPreset {
  id: string;
  label: string;
  description: string;
  build: (ctx: { url: string; title: string; description: string; image: string }) => Record<string, unknown>;
}

export const schemaPresets: SchemaPreset[] = [
  {
    id: "Article",
    label: "Article / blog post",
    description: "Best for blog articles and guides.",
    build: ({ url, title, description, image }) => ({
      "@context": "https://schema.org",
      "@type": "Article",
      headline: title,
      description,
      image: image || undefined,
      mainEntityOfPage: { "@type": "WebPage", "@id": url },
      author: { "@type": "Person", name: "Jugal K. Shukla", url: "https://jugalshukla.lovable.app/about" },
      publisher: { "@type": "Person", name: "Jugal K. Shukla" },
      datePublished: new Date().toISOString().slice(0, 10),
    }),
  },
  {
    id: "Service",
    label: "Service",
    description: "Best for service pages.",
    build: ({ url, title, description }) => ({
      "@context": "https://schema.org",
      "@type": "Service",
      name: title,
      description,
      url,
      serviceType: title,
      provider: { "@type": "Person", name: "Jugal K. Shukla" },
      areaServed: { "@type": "Country", name: "India" },
    }),
  },
  {
    id: "WebPage",
    label: "Web page",
    description: "A safe default for any standard page.",
    build: ({ url, title, description }) => ({
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: title,
      description,
      url,
    }),
  },
  {
    id: "Person",
    label: "Person (personal brand)",
    description: "Best for the homepage and about page.",
    build: ({ url, description, image }) => ({
      "@context": "https://schema.org",
      "@type": "Person",
      name: "Jugal K. Shukla",
      jobTitle: "Digital Marketing, Automation & Growth Expert",
      description,
      url,
      image: image || undefined,
      knowsAbout: ["SEO", "Marketing Automation", "Performance Marketing", "Growth Strategy"],
    }),
  },
  {
    id: "FAQPage",
    label: "FAQ page",
    description: "Use only when the page really shows questions and answers.",
    build: () => ({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Replace with your question",
          acceptedAnswer: { "@type": "Answer", text: "Replace with your answer." },
        },
      ],
    }),
  },
  {
    id: "BreadcrumbList",
    label: "Breadcrumbs",
    description: "Helps Google show the page path in results.",
    build: ({ url, title }) => ({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://jugalshukla.lovable.app/" },
        { "@type": "ListItem", position: 2, name: title, item: url },
      ],
    }),
  },
];

export const SITE_ORIGIN = "https://jugalshukla.lovable.app";

export const absoluteUrl = (path: string) => `${SITE_ORIGIN}${path === "/" ? "/" : path}`;

export const pageSpeedUrl = (path: string) =>
  `https://pagespeed.web.dev/analysis?url=${encodeURIComponent(absoluteUrl(path))}&form_factor=mobile`;

export const prettyJson = (value: string) => {
  try {
    return JSON.stringify(JSON.parse(value), null, 2);
  } catch {
    return value;
  }
};

/** Strips HTML tags for excerpt/description generation. */
export const stripHtml = (html: string) =>
  html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
