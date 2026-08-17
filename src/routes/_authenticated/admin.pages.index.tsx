import { useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { normalizePath, slugify } from "@/lib/cms";
import { defaultPageSeeds } from "@/data/defaultBlocks";

export const Route = createFileRoute("/_authenticated/admin/pages/")({
  component: PagesList,
});

const input =
  "w-full rounded-lg border border-line bg-background px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20";

function PagesList() {
  const qc = useQueryClient();
  const navigate = useNavigate();
  const [creating, setCreating] = useState(false);
  const [title, setTitle] = useState("");
  const [path, setPath] = useState("");
  const [error, setError] = useState<string | null>(null);

  const { data: pages, isLoading } = useQuery({
    queryKey: ["admin-pages"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("pages")
        .select("id, path, title, kind, status, show_in_nav, updated_at")
        .order("kind", { ascending: true })
        .order("path", { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  const create = async () => {
    setError(null);
    const cleanPath = normalizePath(path || slugify(title));
    if (!title.trim() || cleanPath === "/") return setError("Give the page a title and a URL path.");
    const { data, error: err } = await supabase
      .from("pages")
      .insert({ title, path: cleanPath, kind: "custom", status: "draft", blocks: [], show_in_nav: false })
      .select("id")
      .single();
    if (err) return setError(err.message);
    navigate({ to: "/admin/pages/$id", params: { id: data.id } });
  };

  const seedSystemPages = async () => {
    setError(null);
    const rows = defaultPageSeeds.map((seed) => ({
      path: seed.path,
      title: seed.title,
      kind: "system",
      status: "published",
      blocks: seed.blocks as unknown as never,
      show_in_nav: false,
    }));
    const { error: err } = await supabase.from("pages").upsert(rows, { onConflict: "path" });
    if (err) return setError(err.message);
    void qc.invalidateQueries({ queryKey: ["admin-pages"] });
  };

  const existing = new Set((pages ?? []).map((p) => p.path));
  const missingSeeds = defaultPageSeeds.filter((s) => !existing.has(s.path));

  // Import the live designs automatically the first time, so every existing page is editable
  // right away instead of waiting for a manual import.
  useEffect(() => {
    if (!pages || missingSeeds.length === 0) return;
    void (async () => {
      await supabase.from("pages").upsert(
        missingSeeds.map((seed) => ({
          path: seed.path,
          title: seed.title,
          kind: "system",
          status: "published",
          blocks: seed.blocks as unknown as never,
          show_in_nav: false,
        })),
        { onConflict: "path" },
      );
      void qc.invalidateQueries({ queryKey: ["admin-pages"] });
    })();
  }, [pages, missingSeeds.length, qc]);


  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-ink">Pages</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Edit existing pages section by section, or build brand-new pages from scratch.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setCreating((v) => !v)}
          className="grad-cta inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold"
        >
          <Plus className="h-4 w-4" /> New page
        </button>
      </div>

      {error && <p className="rounded-xl border border-line bg-card p-3 text-sm text-destructive">{error}</p>}

      {creating && (
        <div className="grid gap-4 rounded-2xl border border-line bg-card p-6 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
          <label className="grid gap-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            Page title
            <input
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (!path) setPath(`/${slugify(e.target.value)}`);
              }}
              className={input}
            />
          </label>
          <label className="grid gap-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            URL path
            <input value={path} onChange={(e) => setPath(e.target.value)} placeholder="/case-studies" className={input} />
          </label>
          <button type="button" onClick={() => void create()} className="grad-cta rounded-full px-6 py-2.5 text-sm font-semibold">
            Create
          </button>
        </div>
      )}

      {missingSeeds.length > 0 && (
        <div className="rounded-2xl border border-line bg-card p-6">
          <h2 className="text-sm font-semibold text-ink">Import your current pages for editing</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {missingSeeds.map((s) => s.path).join(", ")} — import them as editable sections matching what's live today.
          </p>
          <button
            type="button"
            onClick={() => void seedSystemPages()}
            className="mt-4 rounded-full border-[1.5px] border-blue-500 px-5 py-2.5 text-sm font-semibold text-blue-700"
          >
            Import pages
          </button>
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-line bg-card">
        {isLoading && <p className="p-5 text-sm text-muted-foreground">Loading…</p>}
        <ul className="divide-y divide-line">
          {pages?.map((p) => (
            <li key={p.id} className="flex flex-wrap items-center justify-between gap-3 p-5">
              <div>
                <Link to="/admin/pages/$id" params={{ id: p.id }} className="text-sm font-semibold text-ink hover:text-blue-700">
                  {p.title}
                </Link>
                <p className="mt-1 text-xs text-muted-foreground">
                  {p.path} · {p.kind} page · {p.status}
                  {p.show_in_nav ? " · in menu" : ""}
                </p>
              </div>
              <div className="flex items-center gap-4 text-xs font-semibold">
                <a href={p.path} target="_blank" rel="noreferrer" className="text-muted-foreground">
                  View
                </a>
                <Link to="/admin/pages/$id" params={{ id: p.id }} className="text-blue-700">
                  Edit
                </Link>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
