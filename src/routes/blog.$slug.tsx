import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import portrait from "@/assets/jugal-portrait.jpeg.asset.json";
import { CtaBand } from "@/components/CtaBand";
import { PageHero, PageShell } from "@/components/PageShell";
import { Reveal } from "@/components/Reveal";
import { postBySlug, posts as staticPosts } from "@/data/posts";
import { getPublicPost } from "@/lib/cms.functions";
import { seoLinks, seoMeta } from "@/lib/cms";
import { site } from "@/data/site";

export const Route = createFileRoute("/blog/$slug")({
  loader: async ({ params }) => {
    const { post: dbPost, seo, more } = await getPublicPost({ data: { slug: params.slug } });
    if (dbPost) {
      const raw = dbPost.body ?? "";
      const isHtml = /<\/?(p|h2|h3|ul|ol|li|figure|img|blockquote|strong|em|a|br)\b/i.test(raw);
      return {
        post: {
          slug: dbPost.slug,
          title: dbPost.title,
          excerpt: dbPost.excerpt,
          category: dbPost.category,
          date: dbPost.published_at ?? "",
          readTime: dbPost.read_time,
          html: isHtml ? raw : null,
          body: isHtml
            ? []
            : raw
                .split(/\n\s*\n/)
                .map((s) => s.trim())
                .filter(Boolean),
          coverImage: dbPost.cover_image,
          coverAlt: (dbPost as { cover_alt?: string }).cover_alt ?? "",
        },
        related: more.map((m) => ({ slug: m.slug, title: m.title, category: m.category })),
        seo,
      };
    }
    const post = postBySlug(params.slug);
    if (!post) throw notFound();
    return {
      post: { ...post, html: null as string | null, coverImage: null as string | null, coverAlt: "" },
      related: staticPosts
        .filter((p) => p.slug !== post.slug)
        .slice(0, 2)
        .map((m) => ({ slug: m.slug, title: m.title, category: m.category })),
      seo: null,
    };
  },
  head: ({ loaderData }) => {
    const p = loaderData?.post;
    if (!p) return { meta: [{ title: "Article not found" }, { name: "robots", content: "noindex" }] };
    return {
      meta: seoMeta(
        {
          title: `${p.title.slice(0, 55)} | Jugal K. Shukla`,
          description: p.excerpt.slice(0, 155),
          ogTitle: p.title,
          ogType: "article",
        },
        loaderData?.seo,
      ),
      links: seoLinks(loaderData?.seo),
      scripts: seoScripts(loaderData?.seo),
    };
  },
  component: Post,
});


function Post() {
  const { post, related } = Route.useLoaderData();

  return (
    <PageShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: post.title,
            description: post.excerpt,
            datePublished: post.date,
            author: { "@type": "Person", name: site.name, url: site.linkedin },
          }),
        }}
      />
      <PageHero
        eyebrow={post.category}
        title={post.title}
        crumb={[{ label: "Home", to: "/" }, { label: "Blog", to: "/blog" }, { label: post.category }]}
      >
        <p className="mt-6 text-sm text-white/60">
          {post.date
            ? new Date(post.date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })
            : ""}{" "}
          ·{" "}
          {post.readTime}
        </p>
      </PageHero>

      <article className="section-y">
        <div className="container-page">
          <div className="mx-auto max-w-[760px]">
            {post.coverImage && (
              <img
                src={post.coverImage}
                alt={post.title}
                loading="lazy"
                className="mb-10 w-full rounded-2xl object-cover"
              />
            )}
            {post.body.map((para, i) =>
              para.startsWith("## ") ? (
                <h2 key={i} className="mt-10 mb-4 text-2xl font-bold tracking-tight text-ink">
                  {para.slice(3)}
                </h2>
              ) : para.startsWith("- ") ? (
                <ul key={i} className="mb-6 grid gap-2">
                  {para.split("\n").map((line, j) => (
                    <li key={j} className="flex gap-3 text-[1.0625rem] leading-[1.8] text-muted-foreground">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-600" />
                      {line.replace(/^-\s*/, "")}
                    </li>
                  ))}
                </ul>
              ) : (
                <p key={i} className="mb-6 text-[1.0625rem] leading-[1.8] text-muted-foreground">
                  {para}
                </p>
              ),
            )}

            <div className="surface-card mt-12 flex flex-col gap-5 p-7 sm:flex-row sm:items-center">
              <img
                src={portrait.url}
                alt="Jugal K. Shukla"
                width={96}
                height={96}
                loading="lazy"
                className="h-20 w-20 rounded-2xl object-cover"
              />
              <div className="text-sm">
                <p className="font-semibold text-ink">{site.name}</p>
                <p className="mt-1 text-muted-foreground">
                  Digital marketing, automation and growth expert. 10+ years of SEO, paid media and AI-powered
                  workflows.
                </p>
                <a
                  href={site.linkedin}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="mt-2 inline-flex font-semibold text-blue-700 hover:underline"
                >
                  Connect on LinkedIn →
                </a>
              </div>
            </div>

            <div className="mt-12">
              <p className="eyebrow">Keep reading</p>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {related.map((r, i) => (
                  <Reveal key={r.slug} delay={i * 90}>
                    <Link to="/blog/$slug" params={{ slug: r.slug }} className="surface-card block h-full p-6">
                      <span className="text-xs font-semibold text-blue-700">{r.category}</span>
                      <h3 className="mt-2 text-base font-semibold">{r.title}</h3>
                    </Link>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </div>
      </article>

      <CtaBand title="Want help applying this?" />
    </PageShell>
  );
}
