import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { GripVertical, Plus, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { services } from "@/data/services";

export const Route = createFileRoute("/_authenticated/admin/menu/")({
  component: MenuAdmin,
});

interface Item {
  id: string;
  label: string;
  url: string;
  parent_id: string | null;
  sort_order: number;
  visible: boolean;
}

type DragPayload = { kind: "page"; label: string; url: string } | { kind: "item"; id: string };

const newId = () => `new-${Math.random().toString(36).slice(2, 10)}`;
const input =
  "w-full rounded-lg border border-line bg-background px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20";

function MenuAdmin() {
  const [items, setItems] = useState<Item[]>([]);
  const [removed, setRemoved] = useState<string[]>([]);
  const [drag, setDrag] = useState<DragPayload | null>(null);
  const [over, setOver] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const { data, refetch } = useQuery({
    queryKey: ["admin-menu"],
    queryFn: async () => {
      const [menu, pages] = await Promise.all([
        supabase.from("nav_items").select("*").order("sort_order", { ascending: true }),
        supabase.from("pages").select("path, title, status").order("path", { ascending: true }),
      ]);
      if (menu.error) throw menu.error;
      return { menu: (menu.data ?? []) as Item[], pages: pages.data ?? [] };
    },
  });

  useEffect(() => {
    if (data?.menu) setItems(data.menu.map((m) => ({ ...m })));
  }, [data?.menu]);

  const available = useMemo(() => {
    const map = new Map<string, string>();
    map.set("/", "Home");
    map.set("/about", "About Me");
    map.set("/services", "Services");
    map.set("/blog", "Blog");
    map.set("/contact", "Contact Us");
    (data?.pages ?? []).forEach((p) => map.set(p.path, p.title));
    services.forEach((s) => map.set(`/services/${s.slug}`, s.name));
    return [...map.entries()].map(([url, label]) => ({ url, label }));
  }, [data?.pages]);

  const top = items.filter((i) => !i.parent_id).sort((a, b) => a.sort_order - b.sort_order);
  const childrenOf = (id: string) =>
    items.filter((i) => i.parent_id === id).sort((a, b) => a.sort_order - b.sort_order);

  const reindex = (list: Item[]) => {
    const next = [...list];
    const groups = new Map<string, Item[]>();
    next.forEach((i) => {
      const key = i.parent_id ?? "root";
      groups.set(key, [...(groups.get(key) ?? []), i]);
    });
    groups.forEach((group) => group.forEach((item, idx) => (item.sort_order = idx)));
    return next;
  };

  const addItem = (label: string, url: string, parentId: string | null) => {
    const siblings = items.filter((i) => i.parent_id === parentId);
    setItems((prev) =>
      reindex([
        ...prev,
        { id: newId(), label, url, parent_id: parentId, sort_order: siblings.length, visible: true },
      ]),
    );
  };

  const moveItem = (id: string, parentId: string | null, beforeId?: string | null) => {
    if (id === parentId) return;
    // prevent nesting an item under its own child
    if (parentId && items.some((i) => i.id === parentId && i.parent_id === id)) return;
    setItems((prev) => {
      const moving = prev.find((i) => i.id === id);
      if (!moving) return prev;
      const rest = prev.filter((i) => i.id !== id);
      const siblings = rest.filter((i) => i.parent_id === parentId).sort((a, b) => a.sort_order - b.sort_order);
      const index = beforeId ? siblings.findIndex((s) => s.id === beforeId) : siblings.length;
      const ordered = [...siblings];
      ordered.splice(index < 0 ? siblings.length : index, 0, { ...moving, parent_id: parentId });
      const others = rest.filter((i) => i.parent_id !== parentId);
      return reindex([...others, ...ordered.map((o, idx) => ({ ...o, parent_id: parentId, sort_order: idx }))]);
    });
  };

  const drop = (parentId: string | null, beforeId?: string | null) => {
    if (!drag) return;
    if (drag.kind === "page") addItem(drag.label, drag.url, parentId);
    else moveItem(drag.id, parentId, beforeId);
    setDrag(null);
    setOver(null);
  };

  const remove = (id: string) => {
    const kids = childrenOf(id).map((k) => k.id);
    setRemoved((prev) => [...prev, ...[id, ...kids].filter((x) => !x.startsWith("new-"))]);
    setItems((prev) => reindex(prev.filter((i) => i.id !== id && i.parent_id !== id)));
  };

  const save = async () => {
    setSaving(true);
    setMessage(null);
    try {
      if (removed.length) {
        const { error } = await supabase.from("nav_items").delete().in("id", removed);
        if (error) throw error;
      }
      // Insert new parents first so children can reference real ids.
      const idMap = new Map<string, string>();
      const ordered = [...items].sort((a, b) => (a.parent_id ? 1 : 0) - (b.parent_id ? 1 : 0));
      for (const item of ordered) {
        const parent = item.parent_id ? (idMap.get(item.parent_id) ?? item.parent_id) : null;
        const payload = {
          label: item.label,
          url: item.url,
          parent_id: parent && parent.startsWith("new-") ? null : parent,
          sort_order: item.sort_order,
          visible: item.visible,
        };
        if (item.id.startsWith("new-")) {
          const { data: row, error } = await supabase.from("nav_items").insert(payload).select("id").single();
          if (error) throw error;
          idMap.set(item.id, row.id);
        } else {
          const { error } = await supabase.from("nav_items").update(payload).eq("id", item.id);
          if (error) throw error;
        }
      }
      setRemoved([]);
      await refetch();
      setMessage("Menu saved. Refresh the site to see it.");
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Could not save the menu.");
    } finally {
      setSaving(false);
    }
  };

  const dropZone = (key: string, parentId: string | null, beforeId?: string | null) => ({
    onDragOver: (e: React.DragEvent) => {
      e.preventDefault();
      setOver(key);
    },
    onDragLeave: () => setOver((o) => (o === key ? null : o)),
    onDrop: (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      drop(parentId, beforeId);
    },
    "data-active": over === key ? "true" : undefined,
  });

  const Row = ({ item, child = false }: { item: Item; child?: boolean }) => (
    <div
      draggable
      onDragStart={() => setDrag({ kind: "item", id: item.id })}
      onDragEnd={() => setDrag(null)}
      className={`flex flex-wrap items-center gap-2 rounded-xl border border-line bg-card px-3 py-2 ${child ? "ml-8" : ""}`}
    >
      <GripVertical className="h-4 w-4 shrink-0 cursor-grab text-muted-foreground" />
      <input
        value={item.label}
        onChange={(e) =>
          setItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, label: e.target.value } : i)))
        }
        className={`${input} w-40`}
      />
      <input
        value={item.url}
        onChange={(e) => setItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, url: e.target.value } : i)))}
        className={`${input} w-56`}
      />
      <label className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
        <input
          type="checkbox"
          checked={item.visible}
          onChange={(e) =>
            setItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, visible: e.target.checked } : i)))
          }
          className="h-4 w-4 accent-blue-700"
        />
        Visible
      </label>
      <button type="button" aria-label="Remove item" onClick={() => remove(item.id)} className="ml-auto text-muted-foreground hover:text-destructive">
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-ink">Menu</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Drag a page from the left into the menu. Drop it on top of a menu item to nest it as a dropdown link.
          </p>
        </div>
        <button
          type="button"
          disabled={saving}
          onClick={() => void save()}
          className="grad-cta rounded-full px-6 py-2.5 text-sm font-semibold disabled:opacity-60"
        >
          Save menu
        </button>
      </div>

      {message && <p className="rounded-xl border border-line bg-card p-3 text-sm text-ink">{message}</p>}

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <div className="max-h-[560px] overflow-auto rounded-2xl border border-line bg-card p-3">
          <p className="px-1 pb-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase">Your pages</p>
          {available.map((p) => (
            <div
              key={p.url}
              draggable
              onDragStart={() => setDrag({ kind: "page", label: p.label, url: p.url })}
              onDragEnd={() => setDrag(null)}
              className="mb-1 cursor-grab rounded-xl border border-line px-3 py-2 hover:bg-mist"
            >
              <span className="block truncate text-sm font-semibold text-ink">{p.label}</span>
              <span className="block truncate text-xs text-muted-foreground">{p.url}</span>
            </div>
          ))}
        </div>

        <div className="grid gap-3 rounded-2xl border border-line bg-mist/40 p-4">
          {top.length === 0 && (
            <p className="rounded-xl border border-dashed border-line p-6 text-sm text-muted-foreground">
              Your menu is empty — drag pages here. While the menu is empty the site keeps its default navigation.
            </p>
          )}

          {top.map((item) => (
            <div key={item.id} className="grid gap-2">
              <div
                {...dropZone(`before-${item.id}`, null, item.id)}
                className="h-2 rounded-full data-[active=true]:bg-blue-500"
              />
              <div {...dropZone(`into-${item.id}`, item.id)} className="rounded-xl data-[active=true]:ring-2 data-[active=true]:ring-blue-500">
                <Row item={item} />
              </div>
              {childrenOf(item.id).map((child) => (
                <div key={child.id} {...dropZone(`before-${child.id}`, item.id, child.id)}>
                  <Row item={child} child />
                </div>
              ))}
            </div>
          ))}

          <div
            {...dropZone("root-end", null)}
            className="rounded-xl border border-dashed border-line p-4 text-center text-xs font-semibold text-muted-foreground data-[active=true]:border-blue-500 data-[active=true]:bg-mist"
          >
            Drop here to add to the end of the menu
          </div>

          <button
            type="button"
            onClick={() => addItem("New link", "/", null)}
            className="inline-flex w-fit items-center gap-2 rounded-full border-[1.5px] border-blue-500 px-5 py-2 text-sm font-semibold text-blue-700"
          >
            <Plus className="h-4 w-4" /> Add custom link
          </button>
        </div>
      </div>
    </div>
  );
}
