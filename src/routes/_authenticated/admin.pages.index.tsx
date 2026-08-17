import { useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { normalizePath, slugify } from "@/lib/cms";
import { allPageSeeds } from "@/data/pageSeeds";

export const Route = createFileRoute("/_authenticated/admin/pages/")({
  component: PagesList,
});

const input =
  "w-full rounded-lg border border-line bg-background px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20";

interface PageRow {
  id: string;
  path: string;
  title: string;
  kind: string;
  status: string;
  show_in_nav: boolean;
  blocks: unknown;
  updated_at: string;
}

const blockCount = (blocks: unknown) => (Array.isArray(blocks) ? blocks.length : 0);

function PagesList() {
  const qc = useQueryClient();
  const navigate = useNavigate();
  const [creating, setCreating] = useState(false);
  const [title, setTitle] = useState("");
  const [path, setPath] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [importing, setImporting] = useState(false);

  const { data: pages, isLoading } = useQuery({
    queryKey: ["admin-pages"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("pages")
        .select("id, path, title, kind, status, show_in_nav, blocks, updated_at")
        .order("path", { ascending: true });
      if (error) throw error;
      return data as unknown as PageRow[];
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

  /** Creates missing pages and fills any page that has no sections yet with its live design. */
  const importPages = async (paths: string[]) => {
    if (paths.length === 0) return;
    setImporting(true);
    setError(null);
    const rows = allPageSeeds
      .filter((seed) => paths.includes(seed.path))
      .map((seed) => ({
        path: seed.path,
        title: seed.title,
        kind: "system",
        status: "published",
        blocks: seed.blocks() as unknown as never,
        show_in_nav: false,
      }));
    const { error: err } = await supabase.from("pages").upsert(rows, { onConflict: "path" });
    setImporting(false);
    if (err) return setError(err.message);
    await qc.invalidateQueries({ queryKey: ["admin-pages"] });
  };

  const byPath = new Map((pages ?? []).map((p) => [p.path, p]));
  // A page needs importing when it doesn't exist yet, or exists with zero editable sections.
  const needsImport = allPageSeeds
    .filter((seed) => {
      const row = byPath.get(seed.path);
      return !row || blockCount(row.blocks) === 0;
    })
    .map((s) => s.path);

  // Import automatically once, so every page of the site is editable right away.
  useEffect(() => {
    if (!pages || needsImport.length === 0 || importing) return;
    void importPages(needsImport);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pages, needsImport.length]);

  const seedPaths = new Set(allPageSeeds.map((s) => s.path));
  const groups: { label: string; rows: PageRow[] }[] = [
    {
      label: "Main pages",
      rows: (pages ?? []).filter((p) => ["/", "/about", "/services", "/blog", "/contact"].includes(p.path)),
    },
    { label: "Service pages", rows: (pages ?? []).filter((p) => p.path.startsWith("/services/")) },
    {
      label: "Custom pages",
      rows: (pages ?? []).filter((p) => !seedPaths.has(p.path) && !p.path.startsWith("/services/")),
    },
  ];

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-ink">Pages</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Every page of your site — main pages, all {allPageSeeds.length - 5} service pages and anything you build
            yourself. Edit section by section.
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

      {(importing || needsImport.length > 0) && (
        <div className="rounded-2xl border border-line bg-card p-5">
          <p className="text-sm font-semibold text-ink">
            {importing ? "Importing your live pages for editing…" : `${needsImport.length} page(s) not imported yet`}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Importing copies the current live design into editable sections. Your site keeps looking exactly the same.
          </p>
          {!importing && (
            <button
              type="button"
              onClick={() => void importPages(needsImport)}
              className="mt-4 rounded-full border-[1.5px] border-blue-500 px-5 py-2.5 text-sm font-semibold text-blue-700"
            >
              Import now
            </button>
          )}
        </div>
      )}

      {isLoading && <p className="text-sm text-muted-foreground">Loading…</p>}

      {groups
        .filter((g) => g.rows.length > 0)
        .map((group) => (
          <div key={group.label}>
            <h2 className="mb-3 text-xs font-semibold tracking-wide text-muted-foreground uppercase">{group.label}</h2>
            <div className="overflow-hidden rounded-2xl border border-line bg-card">
              <ul className="divide-y divide-line">
                {group.rows.map((p) => (
                  <li key={p.id} className="flex flex-wrap items-center justify-between gap-3 p-5">
                    <div>
                      <Link
                        to="/admin/pages/$id"
                        params={{ id: p.id }}
                        className="text-sm font-semibold text-ink hover:text-blue-700"
                      >
                        {p.title}
                      </Link>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {p.path} · {p.status} · {blockCount(p.blocks)} section{blockCount(p.blocks) === 1 ? "" : "s"}
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
        ))}
    </div>
  );
}
