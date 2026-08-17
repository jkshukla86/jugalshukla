import { useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { BlockEditor } from "@/components/admin/BlockEditor";
import { isBlockArray, type Block } from "@/lib/blocks";
import { normalizePath } from "@/lib/cms";
import { seedByPath } from "@/data/pageSeeds";


export const Route = createFileRoute("/_authenticated/admin/pages/$id")({
  component: PageEditor,
});

const input =
  "w-full rounded-lg border border-line bg-background px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20";
const label = "grid gap-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase";

function PageEditor() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [path, setPath] = useState("/");
  const [pageStatus, setPageStatus] = useState("draft");
  const [showInNav, setShowInNav] = useState(false);
  const [navLabel, setNavLabel] = useState("");
  const [sortOrder, setSortOrder] = useState(0);
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const { data } = useQuery({
    queryKey: ["admin-page", id],
    queryFn: async () => {
      const { data, error } = await supabase.from("pages").select("*").eq("id", id).maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    if (!data) return;
    setTitle(data.title);
    setPath(data.path);
    setPageStatus(data.status);
    setShowInNav(data.show_in_nav);
    setNavLabel(data.nav_label ?? "");
    setSortOrder(data.sort_order ?? 0);
    const saved = isBlockArray(data.blocks) ? data.blocks : [];
    // Empty page but we know its live design? Load it so there is always something to edit.
    setBlocks(saved.length > 0 ? saved : (seedByPath(data.path)?.blocks() ?? []));
  }, [data]);

  const seed = data ? seedByPath(data.path) : undefined;


  const save = async (publish?: boolean) => {
    setSaving(true);
    setMessage(null);
    const nextStatus = publish === undefined ? pageStatus : publish ? "published" : "draft";
    const { error } = await supabase
      .from("pages")
      .update({
        title,
        path: normalizePath(path),
        status: nextStatus,
        show_in_nav: showInNav,
        nav_label: navLabel || null,
        sort_order: sortOrder,
        blocks: blocks as unknown as never,
      })
      .eq("id", id);
    setSaving(false);
    if (error) return setMessage(error.message);
    setPageStatus(nextStatus);
    setMessage(nextStatus === "published" ? "Saved and live." : "Saved as draft.");
  };

  const remove = async () => {
    if (!confirm("Delete this page permanently?")) return;
    await supabase.from("pages").delete().eq("id", id);
    navigate({ to: "/admin/pages" });
  };

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link to="/admin/pages" className="text-xs font-semibold text-muted-foreground">
            ← All pages
          </Link>
          <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-ink">{title || "Page"}</h1>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <a href={path} target="_blank" rel="noreferrer" className="text-xs font-semibold text-blue-700">
            View page
          </a>
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
            {pageStatus === "published" ? "Update live page" : "Publish"}
          </button>
        </div>
      </div>

      {message && <p className="rounded-xl border border-line bg-card p-3 text-sm text-ink">{message}</p>}

      <div className="grid gap-5 rounded-2xl border border-line bg-card p-6">
        <div className="grid gap-5 sm:grid-cols-2">
          <label className={label}>
            Page title
            <input value={title} onChange={(e) => setTitle(e.target.value)} className={input} />
          </label>
          <label className={label}>
            URL path
            <input
              value={path}
              onChange={(e) => setPath(e.target.value)}
              disabled={data?.kind === "system"}
              className={`${input} disabled:opacity-60`}
            />
          </label>
        </div>
        <div className="grid gap-5 sm:grid-cols-3 sm:items-end">
          <label className="flex items-center gap-3 text-sm font-medium text-ink">
            <input
              type="checkbox"
              checked={showInNav}
              onChange={(e) => setShowInNav(e.target.checked)}
              className="h-4 w-4 accent-blue-700"
            />
            Show in site menu
          </label>
          <label className={label}>
            Menu label
            <input value={navLabel} onChange={(e) => setNavLabel(e.target.value)} className={input} />
          </label>
          <label className={label}>
            Menu order
            <input
              type="number"
              value={sortOrder}
              onChange={(e) => setSortOrder(Number(e.target.value))}
              className={input}
            />
          </label>
        </div>
      </div>

      <div>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-bold tracking-tight text-ink">Sections</h2>
          {seed && (
            <button
              type="button"
              onClick={() => {
                if (confirm("Replace the sections below with the original live design?")) setBlocks(seed.blocks());
              }}
              className="text-xs font-semibold text-blue-700"
            >
              Reset to original design
            </button>
          )}
        </div>
        <BlockEditor blocks={blocks} onChange={setBlocks} />
      </div>


      {data?.kind !== "system" && (
        <button type="button" onClick={() => void remove()} className="w-fit text-xs font-semibold text-destructive">
          Delete this page
        </button>
      )}
    </div>
  );
}
