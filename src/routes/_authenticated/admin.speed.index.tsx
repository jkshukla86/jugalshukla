import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { ExternalLink, Gauge, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { absoluteUrl, pageSpeedUrl } from "@/lib/cms";
import { runPageSpeed, type PageSpeedResult } from "@/lib/pagespeed.functions";
import { services } from "@/data/services";

export const Route = createFileRoute("/_authenticated/admin/speed/")({
  component: SpeedAdmin,
});

const staticPaths: { path: string; title: string }[] = [
  { path: "/", title: "Home" },
  { path: "/about", title: "About" },
  { path: "/services", title: "Services" },
  { path: "/blog", title: "Blog" },
  { path: "/contact", title: "Contact" },
];

const scoreTone = (score?: number) =>
  score === undefined
    ? "bg-mist text-muted-foreground"
    : score >= 90
      ? "bg-green-100 text-green-800"
      : score >= 50
        ? "bg-amber-100 text-amber-800"
        : "bg-red-100 text-red-800";

function Score({ label, value }: { label: string; value?: number | undefined }) {
  return (
    <div className={`rounded-xl px-3 py-2 text-center ${scoreTone(value)}`}>
      <span className="block text-lg font-extrabold">{value ?? "—"}</span>
      <span className="block text-[10px] font-semibold tracking-wide uppercase">{label}</span>
    </div>
  );
}

function SpeedAdmin() {
  const test = useServerFn(runPageSpeed);
  const [selected, setSelected] = useState("/");
  const [strategy, setStrategy] = useState<"mobile" | "desktop">("mobile");
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<PageSpeedResult | null>(null);

  const { data } = useQuery({
    queryKey: ["speed-paths"],
    queryFn: async () => {
      const [pages, posts] = await Promise.all([
        supabase.from("pages").select("path, title").eq("status", "published"),
        supabase.from("posts").select("slug, title").eq("status", "published"),
      ]);
      return { pages: pages.data ?? [], posts: posts.data ?? [] };
    },
  });

  const paths = useMemo(() => {
    const map = new Map<string, string>();
    staticPaths.forEach((p) => map.set(p.path, p.title));
    services.forEach((s) => map.set(`/services/${s.slug}`, s.name));
    (data?.pages ?? []).forEach((p) => map.set(p.path, p.title));
    (data?.posts ?? []).forEach((p) => map.set(`/blog/${p.slug}`, p.title));
    return [...map.entries()].map(([path, title]) => ({ path, title }));
  }, [data]);

  const run = async () => {
    setRunning(true);
    setResult(null);
    try {
      setResult(await test({ data: { url: absoluteUrl(selected), strategy } }));
    } catch {
      setResult({ ok: false, error: "The test could not be started. Please try again." });
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="grid gap-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-ink">Page speed</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Run Google PageSpeed Insights on any page of the live site and see the scores right here.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
        <div className="max-h-[520px] overflow-auto rounded-2xl border border-line bg-card p-2">
          {paths.map((p) => (
            <button
              key={p.path}
              type="button"
              onClick={() => {
                setSelected(p.path);
                setResult(null);
              }}
              className={`flex w-full items-center rounded-xl px-3 py-2 text-left text-sm ${
                selected === p.path ? "bg-ink text-white" : "text-ink hover:bg-mist"
              }`}
            >
              <span className="truncate">
                <span className="block truncate font-semibold">{p.title}</span>
                <span className="block truncate text-xs opacity-70">{p.path}</span>
              </span>
            </button>
          ))}
        </div>

        <div className="grid gap-5 rounded-2xl border border-line bg-card p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm font-semibold text-ink">{absoluteUrl(selected)}</p>
            <div className="flex items-center gap-1 rounded-full border border-line p-1 text-xs font-semibold">
              {(["mobile", "desktop"] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setStrategy(s)}
                  className={`rounded-full px-3 py-1 capitalize ${strategy === s ? "bg-ink text-white" : "text-ink"}`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <button
              type="button"
              disabled={running}
              onClick={() => void run()}
              className="grad-cta inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-semibold disabled:opacity-60"
            >
              {running ? <Loader2 className="h-4 w-4 animate-spin" /> : <Gauge className="h-4 w-4" />}
              {running ? "Testing… (up to 30s)" : "Run speed test"}
            </button>
            <a
              href={pageSpeedUrl(selected)}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700"
            >
              Open full report on PageSpeed Insights <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>

          {result && !result.ok && (
            <p className="rounded-xl border border-line bg-mist p-3 text-sm text-ink">{result.error}</p>
          )}

          {result?.ok && (
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <Score label="Performance" value={result.performance} />
                <Score label="SEO" value={result.seo} />
                <Score label="Accessibility" value={result.accessibility} />
                <Score label="Best practices" value={result.bestPractices} />
              </div>
              <div className="grid gap-2 rounded-xl border border-line bg-mist p-4 text-sm text-ink sm:grid-cols-3">
                <p>
                  <span className="block text-xs text-muted-foreground">Largest content paint</span>
                  {result.lcp ?? "—"}
                </p>
                <p>
                  <span className="block text-xs text-muted-foreground">Layout shift</span>
                  {result.cls ?? "—"}
                </p>
                <p>
                  <span className="block text-xs text-muted-foreground">Blocking time</span>
                  {result.tbt ?? "—"}
                </p>
              </div>
              <p className="text-xs text-muted-foreground">
                Scores come from Google's live Lighthouse test of the published page, so publish your changes before
                re-testing.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
