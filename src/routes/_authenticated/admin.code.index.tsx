import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/admin/code/")({
  component: CodeAdmin,
});

const box =
  "w-full rounded-lg border border-line bg-background px-3 py-2 font-mono text-xs outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20";

interface Draft {
  head_code: string;
  body_code: string;
  footer_code: string;
}

const slots: { key: keyof Draft; title: string; help: string }[] = [
  {
    key: "head_code",
    title: "Header code (inside <head>)",
    help: "Google Tag Manager container script, Google Analytics, site verification tags, Meta Pixel, fonts.",
  },
  {
    key: "body_code",
    title: "Body start code (right after <body>)",
    help: "The Google Tag Manager <noscript> snippet goes here.",
  },
  {
    key: "footer_code",
    title: "Footer code (end of page)",
    help: "Chat widgets, heatmaps, or anything that should load last.",
  },
];

function CodeAdmin() {
  const qc = useQueryClient();
  const [draft, setDraft] = useState<Draft>({ head_code: "", body_code: "", footer_code: "" });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const { data } = useQuery({
    queryKey: ["site-settings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_settings")
        .select("head_code, body_code, footer_code")
        .eq("id", "default")
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    if (data) {
      setDraft({
        head_code: data.head_code ?? "",
        body_code: data.body_code ?? "",
        footer_code: data.footer_code ?? "",
      });
    }
  }, [data]);

  const save = async () => {
    setSaving(true);
    setMessage(null);
    const { error } = await supabase.from("site_settings").upsert({ id: "default", ...draft }, { onConflict: "id" });
    setSaving(false);
    setMessage(error ? error.message : "Saved — reload the site to see your tags load.");
    if (!error) void qc.invalidateQueries({ queryKey: ["site-settings"] });
  };

  return (
    <div className="grid gap-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-ink">Custom code</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Paste tracking or verification snippets here and they load on every page of the site. Only add code you trust —
          it runs for every visitor.
        </p>
      </div>

      {slots.map((slot) => (
        <div key={slot.key} className="grid gap-2 rounded-2xl border border-line bg-card p-6">
          <p className="text-sm font-semibold text-ink">{slot.title}</p>
          <p className="text-xs text-muted-foreground">{slot.help}</p>
          <textarea
            rows={7}
            spellCheck={false}
            value={draft[slot.key]}
            onChange={(e) => setDraft((d) => ({ ...d, [slot.key]: e.target.value }))}
            placeholder="<!-- Paste your snippet here, including the <script> tags -->"
            className={`${box} mt-2`}
          />
        </div>
      ))}

      {message && <p className="rounded-xl border border-line bg-card p-3 text-sm text-ink">{message}</p>}

      <button
        type="button"
        disabled={saving}
        onClick={() => void save()}
        className="grad-cta w-fit rounded-full px-6 py-2.5 text-sm font-semibold disabled:opacity-60"
      >
        Save custom code
      </button>
    </div>
  );
}
