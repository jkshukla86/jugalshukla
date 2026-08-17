import { useState } from "react";
import { Check, Plus, TriangleAlert, Wand2 } from "lucide-react";
import { absoluteUrl, prettyJson, schemaPresets } from "@/lib/cms";

/**
 * JSON-LD schema editor: one-click presets, validation and formatting.
 * Multiple schemas are stored as a JSON array.
 */
export function SchemaBuilder({
  value,
  onChange,
  path,
  title,
  description,
  image = "",
}: {
  value: string;
  onChange: (json: string) => void;
  path: string;
  title: string;
  description: string;
  image?: string;
}) {
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);

  const context = { url: absoluteUrl(path), title, description, image };

  const addPreset = (id: string) => {
    const preset = schemaPresets.find((p) => p.id === id);
    if (!preset) return;
    const next = preset.build(context);
    const current = value.trim();
    if (!current) {
      onChange(JSON.stringify(next, null, 2));
    } else {
      try {
        const parsed: unknown = JSON.parse(current);
        const items = Array.isArray(parsed) ? parsed : [parsed];
        onChange(JSON.stringify([...items, next], null, 2));
      } catch {
        onChange(JSON.stringify(next, null, 2));
      }
    }
    setError(null);
    setOk(`${preset.label} schema added.`);
  };

  const validate = () => {
    setOk(null);
    if (!value.trim()) return setError("Nothing to check yet — add a schema first.");
    try {
      JSON.parse(value);
      setError(null);
      setOk("Valid JSON-LD — it will be added to this page's HTML.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid JSON");
    }
  };

  return (
    <div className="grid gap-3 rounded-xl border border-line bg-mist/60 p-4">
      <div>
        <p className="text-sm font-semibold text-ink">Structured data (schema)</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Pick a type to generate it, then edit the details. This is what powers rich results in Google.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {schemaPresets.map((preset) => (
          <button
            key={preset.id}
            type="button"
            title={preset.description}
            onClick={() => addPreset(preset.id)}
            className="inline-flex items-center gap-1.5 rounded-full border border-line bg-card px-3 py-1.5 text-xs font-semibold text-ink hover:border-blue-500 hover:text-blue-700"
          >
            <Plus className="h-3.5 w-3.5" /> {preset.label}
          </button>
        ))}
      </div>

      <textarea
        rows={10}
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setError(null);
          setOk(null);
        }}
        spellCheck={false}
        placeholder='{ "@context": "https://schema.org", "@type": "WebPage" }'
        className="w-full rounded-lg border border-line bg-background px-3 py-2 font-mono text-xs outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
      />

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={validate}
          className="inline-flex items-center gap-1.5 rounded-full border border-line bg-card px-4 py-1.5 text-xs font-semibold text-ink"
        >
          <Check className="h-3.5 w-3.5" /> Check schema
        </button>
        <button
          type="button"
          onClick={() => onChange(prettyJson(value))}
          className="inline-flex items-center gap-1.5 rounded-full border border-line bg-card px-4 py-1.5 text-xs font-semibold text-ink"
        >
          <Wand2 className="h-3.5 w-3.5" /> Tidy up
        </button>
        {value.trim() && (
          <button type="button" onClick={() => onChange("")} className="text-xs font-semibold text-destructive">
            Remove schema
          </button>
        )}
        <a
          href={`https://search.google.com/test/rich-results?url=${encodeURIComponent(absoluteUrl(path))}`}
          target="_blank"
          rel="noreferrer"
          className="text-xs font-semibold text-blue-700"
        >
          Test in Google Rich Results →
        </a>
      </div>

      {error && (
        <p className="flex items-center gap-1.5 text-xs font-semibold text-destructive">
          <TriangleAlert className="h-3.5 w-3.5" /> {error}
        </p>
      )}
      {ok && <p className="text-xs font-semibold text-blue-700">{ok}</p>}
    </div>
  );
}
