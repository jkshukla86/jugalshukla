import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { isBlockArray, type Block } from "@/lib/blocks";
import type { PageRecord, PostRecord, SeoRecord } from "@/lib/cms";

function publicClient() {
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
  const url = process.env["SUPABASE_URL"]!;
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => {
        const headers = new Headers(init?.headers);
        if (key.startsWith("sb_") && headers.get("Authorization") === `Bearer ${key}`) {
          headers.delete("Authorization");
        }
        headers.set("apikey", key);
        return fetch(input, { ...init, headers });
      },
    },
  });
}

const asBlocks = (value: unknown): Block[] => (isBlockArray(value) ? value : []);

export const getPublicPage = createServerFn({ method: "GET" })
  .inputValidator((data: { path: string }) => ({ path: String(data.path).slice(0, 200) }))
  .handler(async ({ data }): Promise<PageRecord | null> => {
    const { data: row } = await publicClient()
      .from("pages")
      .select("id, path, title, kind, status, blocks, show_in_nav, nav_label, sort_order")
      .eq("path", data.path)
      .eq("status", "published")
      .maybeSingle();
    if (!row) return null;
    return { ...(row as unknown as PageRecord), blocks: asBlocks((row as { blocks: unknown }).blocks) };
  });

export const getSeo = createServerFn({ method: "GET" })
  .inputValidator((data: { path: string }) => ({ path: String(data.path).slice(0, 200) }))
  .handler(async ({ data }): Promise<SeoRecord | null> => {
    const { data: row } = await publicClient()
      .from("seo_meta")
      .select("path, title, description, keywords, og_title, og_description, og_image, canonical, noindex, jsonld")
      .eq("path", data.path)
      .maybeSingle();
    return (row as SeoRecord | null) ?? null;
  });

export const getPageWithSeo = createServerFn({ method: "GET" })
  .inputValidator((data: { path: string }) => ({ path: String(data.path).slice(0, 200) }))
  .handler(async ({ data }): Promise<{ page: PageRecord | null; seo: SeoRecord | null }> => {
    const client = publicClient();
    const [pageRes, seoRes] = await Promise.all([
      client
        .from("pages")
        .select("id, path, title, kind, status, blocks, show_in_nav, nav_label, sort_order")
        .eq("path", data.path)
        .eq("status", "published")
        .maybeSingle(),
      client
        .from("seo_meta")
        .select("path, title, description, keywords, og_title, og_description, og_image, canonical, noindex, jsonld")
        .eq("path", data.path)
        .maybeSingle(),
    ]);
    const row = pageRes.data as unknown as PageRecord | null;
    return {
      page: row ? { ...row, blocks: asBlocks((pageRes.data as { blocks: unknown }).blocks) } : null,
      seo: (seoRes.data as SeoRecord | null) ?? null,
    };
  });

export const listNavPages = createServerFn({ method: "GET" }).handler(async () => {
  const { data } = await publicClient()
    .from("pages")
    .select("path, title, nav_label, sort_order")
    .eq("status", "published")
    .eq("show_in_nav", true)
    .order("sort_order", { ascending: true });
  return (data ?? []) as { path: string; title: string; nav_label: string | null; sort_order: number }[];
});

export const listPublicPosts = createServerFn({ method: "GET" }).handler(async (): Promise<PostRecord[]> => {
  const { data } = await publicClient()
    .from("posts")
    .select("id, slug, title, excerpt, category, cover_image, read_time, body, status, published_at")
    .eq("status", "published")
    .order("published_at", { ascending: false });
  return (data ?? []) as unknown as PostRecord[];
});

export const getPublicPost = createServerFn({ method: "GET" })
  .inputValidator((data: { slug: string }) => ({ slug: String(data.slug).slice(0, 200) }))
  .handler(async ({ data }): Promise<{ post: PostRecord | null; seo: SeoRecord | null; more: PostRecord[] }> => {
    const client = publicClient();
    const [postRes, seoRes, moreRes] = await Promise.all([
      client
        .from("posts")
        .select("id, slug, title, excerpt, category, cover_image, read_time, body, status, published_at")
        .eq("slug", data.slug)
        .eq("status", "published")
        .maybeSingle(),
      client
        .from("seo_meta")
        .select("path, title, description, keywords, og_title, og_description, og_image, canonical, noindex, jsonld")
        .eq("path", `/blog/${data.slug}`)
        .maybeSingle(),
      client
        .from("posts")
        .select("id, slug, title, excerpt, category, cover_image, read_time, body, status, published_at")
        .eq("status", "published")
        .neq("slug", data.slug)
        .order("published_at", { ascending: false })
        .limit(2),
    ]);
    return {
      post: (postRes.data as unknown as PostRecord | null) ?? null,
      seo: (seoRes.data as SeoRecord | null) ?? null,
      more: (moreRes.data ?? []) as unknown as PostRecord[],
    };
  });
