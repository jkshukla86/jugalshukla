import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { formatDate } from "@/lib/cms";

export const Route = createFileRoute("/_authenticated/admin/blog/")({
  component: BlogList,
});

function BlogList() {
  const qc = useQueryClient();
  const { data: posts, isLoading } = useQuery({
    queryKey: ["admin-posts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("posts")
        .select("id, slug, title, category, status, published_at, updated_at")
        .order("updated_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const remove = async (id: string) => {
    if (!confirm("Delete this post permanently?")) return;
    await supabase.from("posts").delete().eq("id", id);
    void qc.invalidateQueries({ queryKey: ["admin-posts"] });
  };

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-ink">Blog posts</h1>
          <p className="mt-1 text-sm text-muted-foreground">Write, save as draft, and publish to the live site.</p>
        </div>
        <Link
          to="/admin/blog/$id"
          params={{ id: "new" }}
          className="grad-cta inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold"
        >
          <Plus className="h-4 w-4" /> New post
        </Link>
      </div>

      <div className="overflow-hidden rounded-2xl border border-line bg-card">
        {isLoading && <p className="p-5 text-sm text-muted-foreground">Loading…</p>}
        {posts?.length === 0 && <p className="p-5 text-sm text-muted-foreground">No posts yet.</p>}
        <ul className="divide-y divide-line">
          {posts?.map((p) => (
            <li key={p.id} className="flex flex-wrap items-center justify-between gap-3 p-5">
              <div>
                <Link to="/admin/blog/$id" params={{ id: p.id }} className="text-sm font-semibold text-ink hover:text-blue-700">
                  {p.title}
                </Link>
                <p className="mt-1 text-xs text-muted-foreground">
                  /blog/{p.slug} · {p.category} · {p.status === "published" ? `published ${formatDate(p.published_at)}` : "draft"}
                </p>
              </div>
              <div className="flex items-center gap-4 text-xs font-semibold">
                <span
                  className={
                    p.status === "published"
                      ? "rounded-full bg-mist px-3 py-1 text-blue-700"
                      : "rounded-full bg-muted px-3 py-1 text-muted-foreground"
                  }
                >
                  {p.status}
                </span>
                <Link to="/admin/blog/$id" params={{ id: p.id }} className="text-blue-700">
                  Edit
                </Link>
                <button type="button" onClick={() => void remove(p.id)} className="text-destructive">
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
