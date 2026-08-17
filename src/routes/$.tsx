import { createFileRoute, notFound } from "@tanstack/react-router";
import { BlockRenderer } from "@/components/blocks/BlockRenderer";
import { PageShell } from "@/components/PageShell";
import { getPageWithSeo, listPublicPosts } from "@/lib/cms.functions";
import { seoLinks, seoMeta } from "@/lib/cms";

export const Route = createFileRoute("/$")({
  loader: async ({ params }) => {
    const path = `/${String(params._splat ?? "").replace(/^\/+/, "").replace(/\/+$/, "")}`;
    const [{ page, seo }, posts] = await Promise.all([
      getPageWithSeo({ data: { path } }),
      listPublicPosts(),
    ]);
    if (!page) throw notFound();
    return { page, seo, posts };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Page not found" }, { name: "robots", content: "noindex" }] };
    }
    return {
      meta: seoMeta(
        { title: `${loaderData.page.title} | Jugal K. Shukla`, description: `${loaderData.page.title}.` },
        loaderData.seo,
      ),
      links: seoLinks(loaderData.seo),
    };
  },
  component: CustomPage,
});

function CustomPage() {
  const { page, posts } = Route.useLoaderData();
  return (
    <PageShell>
      <BlockRenderer blocks={page.blocks} posts={posts} />
    </PageShell>
  );
}
