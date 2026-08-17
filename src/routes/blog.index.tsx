import { Link, createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CtaBand } from "@/components/CtaBand";
import { PageHero, PageShell } from "@/components/PageShell";
import { Reveal } from "@/components/Reveal";
import { posts as staticPosts } from "@/data/posts";
import { getPageWithSeo, listPublicPosts } from "@/lib/cms.functions";
import { BlockRenderer } from "@/components/blocks/BlockRenderer";

import { seoLinks, seoMeta, seoScripts } from "@/lib/cms";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/blog/")({
  loader: async () => {
    const [dbPosts, { page, seo }] = await Promise.all([
      listPublicPosts(),
      getPageWithSeo({ data: { path: "/blog" } }),
    ]);
    return { dbPosts, seo, page };
  },

  head: ({ loaderData }) => ({
    meta: seoMeta(
      {
        title: "Marketing Notes & Playbooks | Jugal K. Shukla",
        description:
          "Practical notes on SEO, paid media, GA4 and AI marketing workflows — written from client work, not from theory.",
        ogDescription: "Notes on SEO, paid media, analytics and AI marketing workflows.",
      },
      loaderData?.seo,
    ),
    links: seoLinks(loaderData?.seo),
    scripts: seoScripts(loaderData?.seo),
  }),
  component: Blog,
});

const fmt = (d: string) =>
  !d ? "" : new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

function Blog() {
  const { dbPosts, page } = Route.useLoaderData();
  if (page?.edited && page.blocks.length > 0) {
    return (
      <PageShell>
        <BlockRenderer blocks={page.blocks} posts={dbPosts} />
      </PageShell>
    );
  }

  const posts = dbPosts.length
    ? dbPosts.map((p) => ({
        slug: p.slug,
        title: p.title,
        excerpt: p.excerpt,
        category: p.category,
        date: p.published_at ?? "",
        readTime: p.read_time,
      }))
    : staticPosts;
  const cats = ["All", ...new Set(posts.map((p) => p.category))];
  const [cat, setCat] = useState("All");
  const [query, setQuery] = useState("");

  const list = posts.filter(
    (p) =>
      (cat === "All" || p.category === cat) &&
      (p.title + p.excerpt).toLowerCase().includes(query.toLowerCase()),
  );
  const [featured, ...rest] = list;

  return (
    <PageShell>
      <PageHero
        eyebrow="Blog"
        title="Notes from the work, not the theory."
        subtitle="Short, specific write-ups on what actually moved the numbers — and what quietly wasted budget."
        crumb={[{ label: "Home", to: "/" }, { label: "Blog" }]}
      />

      <section className="section-y">
        <div className="container-page">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div className="flex flex-wrap gap-3">
              {cats.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCat(c)}
                  aria-pressed={cat === c}
                  className={cn(
                    "rounded-full border px-5 py-2.5 text-sm font-semibold transition-colors",
                    cat === c
                      ? "grad-cta border-transparent"
                      : "border-line bg-card text-ink hover:border-blue-500 hover:text-blue-700",
                  )}
                >
                  {c}
                </button>
              ))}
            </div>
            <label className="w-full max-w-xs">
              <span className="sr-only">Search articles</span>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search articles…"
                className="w-full rounded-full border border-line bg-background px-5 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/25"
              />
            </label>
          </div>

          {featured && (
            <Reveal className="mt-12">
              <Link
                to="/blog/$slug"
                params={{ slug: featured.slug }}
                className="surface-card block overflow-hidden p-8 md:p-12"
              >
                <span className="rounded-full bg-mist px-3 py-1 text-xs font-semibold text-blue-700">
                  {featured.category}
                </span>
                <h2 className="h2-display mt-5 max-w-3xl">{featured.title}</h2>
                <p className="mt-5 max-w-2xl text-muted-foreground">{featured.excerpt}</p>
                <p className="mt-6 text-xs text-muted-foreground">
                  {fmt(featured.date)} · {featured.readTime}
                </p>
              </Link>
            </Reveal>
          )}

          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            {rest.map((p, i) => (
              <Reveal key={p.slug} delay={i * 90}>
                <Link
                  to="/blog/$slug"
                  params={{ slug: p.slug }}
                  className="surface-card flex h-full flex-col p-7"
                >
                  <span className="w-fit rounded-full bg-mist px-3 py-1 text-xs font-semibold text-blue-700">
                    {p.category}
                  </span>
                  <h3 className="mt-5 text-lg font-semibold">{p.title}</h3>
                  <p className="mt-3 flex-1 text-sm text-muted-foreground">{p.excerpt}</p>
                  <span className="mt-6 text-xs text-muted-foreground">
                    {fmt(p.date)} · {p.readTime}
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>

          {!list.length && <p className="mt-12 text-muted-foreground">No articles match that search yet.</p>}
        </div>
      </section>

      <CtaBand title="Want this applied to your funnel?" />
    </PageShell>
  );
}
