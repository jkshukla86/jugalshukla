import { useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ImageField } from "@/components/admin/FieldsEditor";
import { slugify } from "@/lib/cms";

export const Route = createFileRoute("/_authenticated/admin/blog/$id")({
  component: PostEditor,
});

const input =
  "w-full rounded-lg border border-line bg-background px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20";
const label = "grid gap-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase";

interface Draft {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  cover_image: string;
  read_time: string;
  body: string;
  status: string;
}

const empty: Draft = {
  slug: "",
  title: "",
  excerpt: "",
  category: "SEO",
  cover_image: "",
  read_time: "6 min read",
  body: "",
  status: "draft",
};

function PostEditor() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const isNew = id === "new";
  const [draft, setDraft] = useState<Draft>(empty);
  const [status, setStatus] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const { data } = useQuery({
    queryKey: ["admin-post", id],
    enabled: !isNew,
    queryFn: async () => {
      const { data, error } = await supabase.from("posts").select("*").eq("id", id).maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    if (data) {
      setDraft({
        slug: data.slug,
        title: data.title,
        excerpt: data.excerpt ?? "",
        category: data.category ?? "General",
        cover_image: data.cover_image ?? "",
        read_time: data.read_time ?? "",
        body: data.body ?? "",
        status: data.status,
      });
    }
  }, [data]);

  const set = <K extends keyof Draft>(key: K, value: Draft[K]) => setDraft((d) => ({ ...d, [key]: value }));

  const save = async (publish?: boolean) => {
    setSaving(true);
    setStatus(null);
    const nextStatus = publish === undefined ? draft.status : publish ? "published" : "draft";
    const payload = {
      ...draft,
      slug: draft.slug || slugify(draft.title),
      status: nextStatus,
      cover_image: draft.cover_image || null,
      published_at: nextStatus === "published" ? (data?.published_at ?? new Date().toISOString()) : null,
    };
    if (!payload.title.trim()) {
      setSaving(false);
      setStatus("Add a title first.");
      return;
    }
    if (isNew) {
      const { data: created, error } = await supabase.from("posts").insert(payload).select("id").single();
      setSaving(false);
      if (error) return setStatus(error.message);
      navigate({ to: "/admin/blog/$id", params: { id: created.id } });
      return;
    }
    const { error } = await supabase.from("posts").update(payload).eq("id", id);
    setSaving(false);
    setStatus(error ? error.message : nextStatus === "published" ? "Published — live on the site." : "Saved as draft.");
    setDraft((d) => ({ ...d, status: nextStatus }));
  };

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link to="/admin/blog" className="text-xs font-semibold text-muted-foreground">
            ← All posts
          </Link>
          <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-ink">
            {isNew ? "New blog post" : "Edit post"}
          </h1>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {!isNew && draft.status === "published" && (
            <a
              href={`/blog/${draft.slug}`}
              target="_blank"
              rel="noreferrer"
              className="text-xs font-semibold text-blue-700"
            >
              View live
            </a>
          )}
          <button
            type="button"
            disabled={saving}
            onClick={() => void save(false)}
            className="rounded-full border border-line bg-card px-5 py-2.5 text-sm font-semibold text-ink disabled:opacity-60"
          >
            Save draft
          </button>
          <button
            type="button"
            disabled={saving}
            onClick={() => void save(true)}
            className="grad-cta rounded-full px-6 py-2.5 text-sm font-semibold disabled:opacity-60"
          >
            {draft.status === "published" ? "Update live post" : "Publish"}
          </button>
        </div>
      </div>

      {status && <p className="rounded-xl border border-line bg-card p-3 text-sm text-ink">{status}</p>}

      <div className="grid gap-5 rounded-2xl border border-line bg-card p-6">
        <label className={label}>
          Title
          <input
            value={draft.title}
            onChange={(e) => {
              const value = e.target.value;
              setDraft((d) => ({ ...d, title: value, slug: isNew && !d.slug ? slugify(value) : d.slug }));
            }}
            className={input}
          />
        </label>
        <div className="grid gap-5 sm:grid-cols-3">
          <label className={label}>
            URL slug
            <input value={draft.slug} onChange={(e) => set("slug", slugify(e.target.value))} className={input} />
          </label>
          <label className={label}>
            Category
            <input value={draft.category} onChange={(e) => set("category", e.target.value)} className={input} />
          </label>
          <label className={label}>
            Read time
            <input value={draft.read_time} onChange={(e) => set("read_time", e.target.value)} className={input} />
          </label>
        </div>
        <label className={label}>
          Excerpt
          <textarea rows={3} value={draft.excerpt} onChange={(e) => set("excerpt", e.target.value)} className={input} />
        </label>
        <ImageField label="Cover image" value={draft.cover_image} onChange={(v) => set("cover_image", v)} />
        <label className={label}>
          Body — one paragraph per blank line. Start a line with ## for a subheading or - for a bullet.
          <textarea rows={18} value={draft.body} onChange={(e) => set("body", e.target.value)} className={input} />
        </label>
      </div>

      <p className="text-xs text-muted-foreground">
        SEO title, description and social image for this article live in the SEO section under the path /blog/
        {draft.slug || "your-slug"}.
      </p>
    </div>
  );
}
