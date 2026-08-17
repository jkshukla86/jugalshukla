import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import portrait from "@/assets/jugal-portrait.jpeg.asset.json";
import { CtaBand } from "@/components/CtaBand";
import { PageHero, PageShell } from "@/components/PageShell";
import { Reveal } from "@/components/Reveal";
import { postBySlug, posts } from "@/data/posts";
import { site } from "@/data/site";

export const Route = createFileRoute("/blog/$slug")({
  loader: ({ params }) => {
    const post = postBySlug(params.slug);
    if (!post) throw notFound();
    return { post };
  },
  head: ({ loaderData }) => {
    const p = loaderData?.post;
    return {
      meta: p
        ? [
            { title: `${p.title.slice(0, 55)} | Jugal K. Shukla` },
            { name: "description", content: p.excerpt.slice(0, 155) },
            { property: "og:title", content: p.title },
            { property: "og:description", content: p.excerpt.slice(0, 155) },
            { property: "og:type", content: "article" },
            { name: "twitter:card", content: "summary_large_image" },
          ]
        : [],
    };
  },
  component: Post,
});

function Post() {
  const { post } = Route.useLoaderData();
  const related = posts.filter((p) => p.slug !== post.slug).slice(0, 2);

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
          {new Date(post.date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })} ·{" "}
          {post.readTime}
        </p>
      </PageHero>

      <article className="section-y">
        <div className="container-page">
          <div className="mx-auto max-w-[760px]">
            {post.body.map((para) => (
              <p key={para} className="mb-6 text-[1.0625rem] leading-[1.8] text-muted-foreground">
                {para}
              </p>
            ))}

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
