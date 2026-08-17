import { useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Gauge } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { ImageField } from "@/components/admin/FieldsEditor";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { SchemaBuilder } from "@/components/admin/SchemaBuilder";
import { pageSpeedUrl, slugify, stripHtml, type SeoRecord } from "@/lib/cms";

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
  cover_alt: string;
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
  cover_alt: "",
  read_time: "6 min read",
  body: "<p>Start writing your article here.</p>",
  status: "draft",
};

const emptySeo = (path: string): SeoRecord => ({
  path,
  title: "",
  description: "",
  keywords: "",
  og_title: "",
  og_description: "",
  og_image: "",
  canonical: "",
  noindex: false,
  jsonld: "",
});

function PostEditor() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const isNew = id === "new";
  const [draft, setDraft] = useState<Draft>(empty);
  const [seo, setSeo] = useState<SeoRecord>(emptySeo("/blog/"));
  const [status, setStatus] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const { data } = useQuery({
    queryKey: ["admin-post", id],
    enabled: !isNew,
    queryFn: async () => {
      const { data: post, error } = await supabase.from("posts").select("*").eq("id", id).maybeSingle();
      if (error) throw error;
      let seoRow: SeoRecord | null = null;
      if (post) {
        const { data: s } = await supabase.from("seo_meta").select("*").eq("path", `/blog/${post.slug}`).maybeSingle();
        seoRow = (s as SeoRecord | null) ?? null;
      }
      return { post, seoRow };
    },
  });

  useEffect(() => {
    const post = data?.post;
    if (post) {
      setDraft({
        slug: post.slug,
        title: post.title,
        excerpt: post.excerpt ?? "",
        category: post.category ?? "General",
        cover_image: post.cover_image ?? "",
        cover_alt: (post as { cover_alt?: string }).cover_alt ?? "",
        read_time: post.read_time ?? "",
        body: post.body ?? "",
        status: post.status,
      });
      setSeo({ ...emptySeo(`/blog/${post.slug}`), ...(data?.seoRow ?? {}) });
    }
  }, [data]);

  const set = <K extends keyof Draft>(key: K, value: Draft[K]) => setDraft((d) => ({ ...d, [key]: value }));
  const setSeoField = <K extends keyof SeoRecord>(key: K, value: SeoRecord[K]) =>
    setSeo((s) => ({ ...s, [key]: value }));

  const path = `/blog/${draft.slug || "your-slug"}`;

  const save = async (publish?: boolean) => {
    setSaving(true);
    setStatus(null);
    const nextStatus = publish === undefined ? draft.status : publish ? "published" : "draft";
    const slug = draft.slug || slugify(draft.title);
    const payload = {
      ...draft,
      slug,
      status: nextStatus,
      excerpt: draft.excerpt || stripHtml(draft.body).slice(0, 180),
      cover_image: draft.cover_image || null,
      published_at:
        nextStatus === "published" ? (data?.post?.published_at ?? new Date().toISOString()) : null,
    };
    if (!payload.title.trim()) {
      setSaving(false);
      setStatus("Add a title first.");
      return;
    }

    const saveSeo = async () => {
      const hasSeo =
        seo.title || seo.description || seo.keywords || seo.og_title || seo.og_description || seo.og_image ||
        seo.canonical || seo.jsonld || seo.noindex;
      if (!hasSeo) return;
      await supabase.from("seo_meta").upsert(
        {
          path: `/blog/${slug}`,
          title: seo.title || null,
          description: seo.description || null,
          keywords: seo.keywords || null,
          og_title: seo.og_title || null,
          og_description: seo.og_description || null,
          og_image: seo.og_image || draft.cover_image || null,
          canonical: seo.canonical || null,
          noindex: seo.noindex,
          jsonld: seo.jsonld || null,
        },
        { onConflict: "path" },
      );
    };

    if (isNew) {
      const { data: created, error } = await supabase.from("posts").insert(payload).select("id").single();
      if (!error) await saveSeo();
      setSaving(false);
      if (error) return setStatus(error.message);
      navigate({ to: "/admin/blog/$id", params: { id: created.id } });
      return;
    }
    const { error } = await supabase.from("posts").update(payload).eq("id", id);
    if (!error) await saveSeo();
    setSaving(false);
    setStatus(error ? error.message : nextStatus === "published" ? "Published — live on the site." : "Saved as draft.");
    setDraft((d) => ({ ...d, status: nextStatus, slug }));
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
            <a href={path} target="_blank" rel="noreferrer" className="text-xs font-semibold text-blue-700">
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
          Excerpt (used on the blog listing — left blank, it is generated from your article)
          <textarea rows={3} value={draft.excerpt} onChange={(e) => set("excerpt", e.target.value)} className={input} />
        </label>
        <div className="grid gap-5 sm:grid-cols-2">
          <ImageField label="Cover image" value={draft.cover_image} onChange={(v) => set("cover_image", v)} />
          <label className={label}>
            Cover image ALT text
            <input
              value={draft.cover_alt}
              onChange={(e) => set("cover_alt", e.target.value)}
              placeholder="Describe the image for search engines and screen readers"
              className={input}
            />
          </label>
        </div>
        <RichTextEditor
          label="Article"
          value={draft.body}
          onChange={(html) => set("body", html)}
          minHeight={420}
          help="Use the toolbar for headings, bold, lists, quotes, links and images. Every image you insert asks for ALT text."
        />
      </div>

      <div className="grid gap-5 rounded-2xl border border-line bg-card p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold tracking-tight text-ink">SEO for this article</h2>
            <p className="mt-1 text-xs text-muted-foreground">Saved against {path}</p>
          </div>
          <a
            href={pageSpeedUrl(path)}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700"
          >
            <Gauge className="h-3.5 w-3.5" /> PageSpeed score
          </a>
        </div>
        <label className={label}>
          Meta title ({(seo.title ?? "").length}/60)
          <input value={seo.title ?? ""} onChange={(e) => setSeoField("title", e.target.value)} className={input} />
        </label>
        <label className={label}>
          Meta description ({(seo.description ?? "").length}/160)
          <textarea
            rows={3}
            value={seo.description ?? ""}
            onChange={(e) => setSeoField("description", e.target.value)}
            className={input}
          />
        </label>
        <div className="grid gap-5 sm:grid-cols-2">
          <label className={label}>
            Keywords
            <input
              value={seo.keywords ?? ""}
              onChange={(e) => setSeoField("keywords", e.target.value)}
              className={input}
            />
          </label>
          <label className={label}>
            Canonical URL
            <input
              value={seo.canonical ?? ""}
              onChange={(e) => setSeoField("canonical", e.target.value)}
              placeholder={`https://jugalshukla.lovable.app${path}`}
              className={input}
            />
          </label>
        </div>
        <label className={label}>
          Social (OG) title
          <input value={seo.og_title ?? ""} onChange={(e) => setSeoField("og_title", e.target.value)} className={input} />
        </label>
        <label className={label}>
          Social (OG) description
          <textarea
            rows={2}
            value={seo.og_description ?? ""}
            onChange={(e) => setSeoField("og_description", e.target.value)}
            className={input}
          />
        </label>
        <ImageField
          label="Social share image (defaults to the cover image)"
          value={seo.og_image ?? ""}
          onChange={(v) => setSeoField("og_image", v)}
        />
        <label className="flex items-center gap-3 text-sm font-medium text-ink">
          <input
            type="checkbox"
            checked={seo.noindex}
            onChange={(e) => setSeoField("noindex", e.target.checked)}
            className="h-4 w-4 accent-blue-700"
          />
          Hide this article from search engines (noindex)
        </label>
        <SchemaBuilder
          value={seo.jsonld ?? ""}
          onChange={(json) => setSeoField("jsonld", json)}
          path={path}
          title={seo.title || draft.title}
          description={seo.description || draft.excerpt || stripHtml(draft.body).slice(0, 160)}
          image={seo.og_image || draft.cover_image}
        />
      </div>
    </div>
  );
}
