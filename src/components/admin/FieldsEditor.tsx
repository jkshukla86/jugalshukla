import { useRef, useState } from "react";
import { Loader2, Plus, Trash2, Upload } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { uploadMedia } from "@/lib/media.functions";
import { RichTextEditor } from "@/components/admin/RichTextEditor";

import type { BlockData, Field, Json } from "@/lib/blocks";
import { bool, list, num, str } from "@/lib/blocks";

const input =
  "w-full rounded-lg border border-line bg-background px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20";

export function ImageField({ value, onChange, label }: { value: string; onChange: (v: string) => void; label: string }) {
  const upload = useServerFn(uploadMedia);
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onFile = async (file: File) => {
    setBusy(true);
    setError(null);
    try {
      const buffer = await file.arrayBuffer();
      let binary = "";
      const bytes = new Uint8Array(buffer);
      for (let i = 0; i < bytes.length; i += 8192) {
        binary += String.fromCharCode(...bytes.subarray(i, i + 8192));
      }
      const res = await upload({ data: { name: file.name, contentType: file.type, base64: btoa(binary) } });
      onChange(res.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="grid gap-2">
      <span className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">{label}</span>
      <div className="flex flex-wrap items-center gap-3">
        {value && <img src={value} alt="" className="h-16 w-16 rounded-lg border border-line object-cover" />}
        <input value={value} onChange={(e) => onChange(e.target.value)} placeholder="/api/public/media/… or https://…" className={input} />
      </div>
      <div className="flex items-center gap-3">
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) void onFile(f);
          }}
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={busy}
          className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-xs font-semibold text-ink disabled:opacity-60"
        >
          {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />} Upload image
        </button>
        {value && (
          <button type="button" onClick={() => onChange("")} className="text-xs font-semibold text-destructive">
            Remove
          </button>
        )}
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

export function FieldsEditor({
  fields,
  data,
  onChange,
}: {
  fields: Field[];
  data: BlockData;
  onChange: (data: BlockData) => void;
}) {
  const set = (name: string, value: Json) => onChange({ ...data, [name]: value });

  return (
    <div className="grid gap-5">
      {fields.map((field) => {
        if (field.kind === "rich") {
          return (
            <RichTextEditor
              key={field.name}
              label={field.label}
              help={field.help}
              value={str(data, field.name)}
              onChange={(html) => set(field.name, html)}
              minHeight={200}
            />
          );
        }
        if (field.kind === "image") {
          return (
            <ImageField key={field.name} label={field.label} value={str(data, field.name)} onChange={(v) => set(field.name, v)} />
          );
        }

        if (field.kind === "boolean") {
          return (
            <label key={field.name} className="flex items-center gap-3 text-sm font-medium text-ink">
              <input
                type="checkbox"
                checked={bool(data, field.name)}
                onChange={(e) => set(field.name, e.target.checked)}
                className="h-4 w-4 accent-blue-700"
              />
              {field.label}
            </label>
          );
        }
        if (field.kind === "select") {
          return (
            <label key={field.name} className="grid gap-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
              {field.label}
              <select value={str(data, field.name)} onChange={(e) => set(field.name, e.target.value)} className={input}>
                {(field.options ?? []).map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            </label>
          );
        }
        if (field.kind === "number") {
          return (
            <label key={field.name} className="grid gap-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
              {field.label}
              <input
                type="number"
                value={num(data, field.name)}
                onChange={(e) => set(field.name, Number(e.target.value))}
                className={input}
              />
            </label>
          );
        }
        if (field.kind === "stringList") {
          const items = list<string>(data, field.name);
          return (
            <div key={field.name} className="grid gap-2">
              <span className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">{field.label}</span>
              {items.map((item, i) => (
                <div key={i} className="flex items-start gap-2">
                  <textarea
                    value={item}
                    rows={2}
                    onChange={(e) => {
                      const next = [...items];
                      next[i] = e.target.value;
                      set(field.name, next);
                    }}
                    className={input}
                  />
                  <button
                    type="button"
                    onClick={() => set(field.name, items.filter((_, j) => j !== i))}
                    className="mt-1 text-muted-foreground hover:text-destructive"
                    aria-label="Remove"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => set(field.name, [...items, ""])}
                className="inline-flex w-fit items-center gap-2 rounded-full border border-line px-3 py-1.5 text-xs font-semibold"
              >
                <Plus className="h-3.5 w-3.5" /> Add
              </button>
            </div>
          );
        }
        if (field.kind === "objectList") {
          const items = list<Record<string, Json>>(data, field.name);
          const itemFields = field.itemFields ?? [];
          return (
            <div key={field.name} className="grid gap-3">
              <span className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">{field.label}</span>
              {items.map((item, i) => (
                <div key={i} className="rounded-xl border border-line bg-muted/30 p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-xs font-semibold text-muted-foreground">#{i + 1}</span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        disabled={i === 0}
                        onClick={() => {
                          const next = [...items];
                          const prev = next[i - 1]!;
                          next[i - 1] = next[i]!;
                          next[i] = prev;
                          set(field.name, next as Json);
                        }}
                        className="text-xs font-semibold text-muted-foreground disabled:opacity-40"
                      >
                        Up
                      </button>
                      <button
                        type="button"
                        disabled={i === items.length - 1}
                        onClick={() => {
                          const next = [...items];
                          const following = next[i + 1]!;
                          next[i + 1] = next[i]!;
                          next[i] = following;
                          set(field.name, next as Json);
                        }}
                        className="text-xs font-semibold text-muted-foreground disabled:opacity-40"
                      >
                        Down
                      </button>
                      <button
                        type="button"
                        onClick={() => set(field.name, items.filter((_, j) => j !== i) as Json)}
                        className="text-muted-foreground hover:text-destructive"
                        aria-label="Remove item"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <FieldsEditor
                    fields={itemFields}
                    data={item as BlockData}
                    onChange={(next) => {
                      const copy = [...items];
                      copy[i] = next as Record<string, Json>;
                      set(field.name, copy as Json);
                    }}
                  />
                </div>
              ))}
              <button
                type="button"
                onClick={() =>
                  set(field.name, [
                    ...items,
                    Object.fromEntries(itemFields.map((f) => [f.name, f.kind === "number" ? 0 : ""])),
                  ] as Json)
                }
                className="inline-flex w-fit items-center gap-2 rounded-full border border-line px-3 py-1.5 text-xs font-semibold"
              >
                <Plus className="h-3.5 w-3.5" /> Add item
              </button>
            </div>
          );
        }
        return (
          <label key={field.name} className="grid gap-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            {field.label}
            {field.kind === "textarea" ? (
              <textarea
                rows={3}
                value={str(data, field.name)}
                placeholder={field.placeholder ?? ""}
                onChange={(e) => set(field.name, e.target.value)}
                className={input}
              />
            ) : (
              <input
                value={str(data, field.name)}
                placeholder={field.placeholder ?? ""}
                onChange={(e) => set(field.name, e.target.value)}
                className={input}
              />
            )}
          </label>
        );
      })}
    </div>
  );
}
