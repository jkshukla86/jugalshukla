import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { assertAdmin } from "@/lib/assert-admin.server";

export interface PageSpeedResult {
  ok: boolean;
  error?: string | undefined;
  performance?: number | undefined;
  seo?: number | undefined;
  accessibility?: number | undefined;
  bestPractices?: number | undefined;
  lcp?: string | undefined;
  cls?: string | undefined;
  tbt?: string | undefined;
}


/** Runs a Google PageSpeed Insights (Lighthouse) test for one URL. */
export const runPageSpeed = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { url: string; strategy?: string }) => ({
    url: String(data.url).slice(0, 400),
    strategy: data.strategy === "desktop" ? "desktop" : "mobile",
  }))
  .handler(async ({ data, context }): Promise<PageSpeedResult> => {
    await assertAdmin(context as never);

    const endpoint = new URL("https://www.googleapis.com/pagespeedonline/v5/runPagespeed");
    endpoint.searchParams.set("url", data.url);
    endpoint.searchParams.set("strategy", data.strategy);
    for (const c of ["performance", "seo", "accessibility", "best-practices"]) {
      endpoint.searchParams.append("category", c);
    }
    const key = process.env["PAGESPEED_API_KEY"];
    if (key) endpoint.searchParams.set("key", key);

    try {
      const res = await fetch(endpoint.toString());
      if (!res.ok) {
        return {
          ok: false,
          error:
            res.status === 429
              ? "Google is rate-limiting the free test right now. Try again in a minute, or open the full report."
              : `Google could not test this page (${res.status}). Make sure the page is published and publicly reachable.`,
        };
      }
      const json = (await res.json()) as {
        lighthouseResult?: {
          categories?: Record<string, { score?: number }>;
          audits?: Record<string, { displayValue?: string }>;
        };
      };
      const cats = json.lighthouseResult?.categories ?? {};
      const audits = json.lighthouseResult?.audits ?? {};
      const pct = (id: string) => {
        const score = cats[id]?.score;
        return typeof score === "number" ? Math.round(score * 100) : undefined;
      };
      return {
        ok: true,
        performance: pct("performance"),
        seo: pct("seo"),
        accessibility: pct("accessibility"),
        bestPractices: pct("best-practices"),
        lcp: audits["largest-contentful-paint"]?.displayValue,
        cls: audits["cumulative-layout-shift"]?.displayValue,
        tbt: audits["total-blocking-time"]?.displayValue,
      };
    } catch {
      return { ok: false, error: "The test request failed. Please try again." };
    }
  });
