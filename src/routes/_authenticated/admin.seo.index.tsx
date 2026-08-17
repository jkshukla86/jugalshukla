import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ImageField } from "@/components/admin/FieldsEditor";
import { normalizePath, type SeoRecord } from "@/lib/cms";
import { services } from "@/data/services";

export const Route = createFileRoute("/_authenticated/admin/seo/")({
  component: SeoAdmin,
});

const input =
  "w-full rounded-lg border border-line bg-background px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20";
const label = "grid gap-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase";

const staticPaths = ["/", "/about", "/services", "/blog", "/contact", "/thank-you"];

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

function SeoAdmin() {
  const qc = useQueryClient();
  const [selected, setSelected] = useState("/");
  const [draft, setDraft] = useState<SeoRecord>(emptySeo("/"));
  const [message, setMessage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const { data: rows } = useQuery({
    queryKey: ["admin-seo"],
    queryFn: async () => {
      const [seo, pages, posts] = await Promise.all([
        supabase.from("seo_meta").select("*"),
        supabase.from("pages").select("path, title"),
        supabase.from("posts").select("slug, title"),
      ]);
      return {
        seo: (seo.data ?? []) as SeoRecord[],
        pages: pages.data ?? [],
        posts: posts.data ?? [],
      };
    },
  });

  const paths = useMemo(() => {
    const set = new Map<string, string>();
    staticPaths.forEach((p) => set.set(p, p === "/" ? "Home" : p));
    services.forEach((s) => set.set(`/services/${s.slug}`, s.name));
    (rows?.pages ?? []).forEach((p) => set.set(p.path, p.title));
    (rows?.posts ?? []).forEach((p) => set.set(`/blog/${p.slug}`, p.title));
    (rows?.seo ?? []).forEach((s) => {
      if (!set.has(s.path)) set.set(s.path, s.path);
    });
    return [...set.entries()].map(([path, title]) => ({ path, title }));
  }, [rows]);

  useEffect(() => {
    const found = rows?.seo.find((s) => s.path === selected);
    setDraft(found ? { ...emptySeo(selected), ...found } : emptySeo(selected));
    setMessage(null);
  }, [selected, rows]);

  const set = <K extends keyof SeoRecord>(key: K, value: SeoRecord[K]) => setDraft((d) => ({ ...d, [key]: value }));

  const save = async () => {
    setSaving(true);
    setMessage(null);
    const { error } = await supabase.from("seo_meta").upsert(
      {
        path: normalizePath(draft.path),
        title: draft.title || null,
        description: draft.description || null,
        keywords: draft.keywords || null,
        og_title: draft.og_title || null,
        og_description: draft.og_description || null,
        og_image: draft.og_image || null,
        canonical: draft.canonical || null,
        noindex: draft.noindex,
        jsonld: draft.jsonld || null,
      },
      { onConflict: "path" },
    );
    setSaving(false);
    if (error) return setMessage(error.message);
    setMessage("SEO saved for " + draft.path);
    void qc.invalidateQueries({ queryKey: ["admin-seo"] });
  };

  const configured = new Set((rows?.seo ?? []).map((s) => s.path));

  return (
    <div className="grid gap-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-ink">SEO</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Set the title, meta description, social preview and indexing rules for every page and article.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
        <div className="max-h-[560px] overflow-auto rounded-2xl border border-line bg-card p-2">
          {paths.map((p) => (
            <button
              key={p.path}
              type="button"
              onClick={() => setSelected(p.path)}
              className={`flex w-full items-center justify-between gap-2 rounded-xl px-3 py-2 text-left text-sm ${
                selected === p.path ? "bg-ink text-white" : "text-ink hover:bg-mist"
              }`}
            >
              <span className="truncate">
                <span className="block truncate font-semibold">{p.title}</span>
                <span className="block truncate text-xs opacity-70">{p.path}</span>
              </span>
              {configured.has(p.path) && (
                <span className={`h-2 w-2 shrink-0 rounded-full ${selected === p.path ? "bg-white" : "bg-blue-600"}`} />
              )}
            </button>
          ))}
        </div>

        <div className="grid gap-5 rounded-2xl border border-line bg-card p-6">
          <p className="text-sm font-semibold text-ink">{selected}</p>
          <label className={label}>
            Meta title ({(draft.title ?? "").length}/60)
            <input value={draft.title ?? ""} onChange={(e) => set("title", e.target.value)} className={input} />
          </label>
          <label className={label}>
            Meta description ({(draft.description ?? "").length}/160)
            <textarea
              rows={3}
              value={draft.description ?? ""}
              onChange={(e) => set("description", e.target.value)}
              className={input}
            />
          </label>
          <label className={label}>
            Keywords
            <input value={draft.keywords ?? ""} onChange={(e) => set("keywords", e.target.value)} className={input} />
          </label>
          <div className="grid gap-5 sm:grid-cols-2">
            <label className={label}>
              Social (OG) title
              <input value={draft.og_title ?? ""} onChange={(e) => set("og_title", e.target.value)} className={input} />
            </label>
            <label className={label}>
              Canonical URL
              <input
                value={draft.canonical ?? ""}
                onChange={(e) => set("canonical", e.target.value)}
                placeholder="https://jugalshukla.lovable.app/about"
                className={input}
              />
            </label>
          </div>
          <label className={label}>
            Social (OG) description
            <textarea
              rows={2}
              value={draft.og_description ?? ""}
              onChange={(e) => set("og_description", e.target.value)}
              className={input}
            />
          </label>
          <ImageField label="Social share image" value={draft.og_image ?? ""} onChange={(v) => set("og_image", v)} />
          <label className="flex items-center gap-3 text-sm font-medium text-ink">
            <input
              type="checkbox"
              checked={draft.noindex}
              onChange={(e) => set("noindex", e.target.checked)}
              className="h-4 w-4 accent-blue-700"
            />
            Hide this page from search engines (noindex)
          </label>
          <label className={label}>
            Structured data (JSON-LD)
            <textarea
              rows={5}
              value={draft.jsonld ?? ""}
              onChange={(e) => set("jsonld", e.target.value)}
              className={input}
            />
          </label>

          <div className="rounded-xl border border-line bg-mist p-4">
            <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">Google preview</p>
            <p className="mt-2 truncate text-sm text-blue-700">{draft.title || "Page title will appear here"}</p>
            <p className="text-xs text-green-700">jugalshukla.lovable.app{draft.path === "/" ? "" : draft.path}</p>
            <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
              {draft.description || "Your meta description will appear here."}
            </p>
          </div>

          {message && <p className="text-sm text-ink">{message}</p>}
          <button
            type="button"
            disabled={saving}
            onClick={() => void save()}
            className="grad-cta w-fit rounded-full px-6 py-2.5 text-sm font-semibold disabled:opacity-60"
          >
            Save SEO
          </button>
        </div>
      </div>
    </div>
  );
}
