import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/admin/")({
  component: Dashboard,
});

function Dashboard() {
  const { data } = useQuery({
    queryKey: ["admin-summary"],
    queryFn: async () => {
      const [posts, pages, seo] = await Promise.all([
        supabase.from("posts").select("id, status"),
        supabase.from("pages").select("id, status"),
        supabase.from("seo_meta").select("path"),
      ]);
      const p = posts.data ?? [];
      const g = pages.data ?? [];
      return {
        published: p.filter((x) => x.status === "published").length,
        drafts: p.filter((x) => x.status !== "published").length,
        pages: g.length,
        seo: (seo.data ?? []).length,
      };
    },
  });

  const cards = [
    { label: "Published posts", value: data?.published ?? "—", to: "/admin/blog" },
    { label: "Draft posts", value: data?.drafts ?? "—", to: "/admin/blog" },
    { label: "Pages", value: data?.pages ?? "—", to: "/admin/pages" },
    { label: "Pages with SEO set", value: data?.seo ?? "—", to: "/admin/seo" },
  ] as const;

  return (
    <div className="grid gap-8">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-ink">Content dashboard</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Write and publish articles, rebuild page content section by section, manage SEO, and create new pages.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <Link key={c.label} to={c.to} className="rounded-2xl border border-line bg-card p-5 hover:border-blue-500">
            <p className="text-3xl font-extrabold text-ink">{c.value}</p>
            <p className="mt-1 text-xs font-semibold tracking-wide text-muted-foreground uppercase">{c.label}</p>
          </Link>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Link to="/admin/blog/$id" params={{ id: "new" }} className="grad-cta rounded-2xl p-5 text-sm font-semibold">
          Write a new blog post
        </Link>
        <Link to="/admin/pages" className="rounded-2xl border border-line bg-card p-5 text-sm font-semibold text-ink">
          Create or edit a page
        </Link>
        <Link to="/admin/seo" className="rounded-2xl border border-line bg-card p-5 text-sm font-semibold text-ink">
          Work on page SEO
        </Link>
      </div>
    </div>
  );
}
