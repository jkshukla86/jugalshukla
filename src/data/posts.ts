export interface Post {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  body: string[];
}

export const posts: Post[] = [
  {
    slug: "ai-workflows-that-halve-content-time",
    title: "The AI workflow that cut my content production time in half",
    excerpt:
      "Not prompts you copy from Twitter. A four-stage pipeline — research, brief, draft, human edit — with quality gates that keep the output publishable.",
    category: "AI & Automation",
    date: "2026-07-28",
    readTime: "7 min read",
    body: [
      "Most teams use AI as a faster typist. That's why the output reads like everyone else's. The gain isn't in drafting — it's in research, briefing and editing structure.",
      "My pipeline has four stages. Research pulls SERP intent, competitor gaps and real customer objections. Briefing turns that into a structured outline with the angle decided by a human. Drafting is AI-assisted, section by section, against the brief. Editing is entirely human: claims verified, voice restored, examples added.",
      "The measurable result across my own work is roughly a 50% reduction in production time with no drop in ranking performance — because the thinking still happens where it always did.",
    ],
  },
  {
    slug: "ga4-mistakes-costing-you-money",
    title: "Five GA4 mistakes quietly wrecking your reporting",
    excerpt:
      "Migrated GA4 properties are usually half-configured. Here's what I find in almost every audit, and the order I fix it in.",
    category: "Analytics",
    date: "2026-07-14",
    readTime: "6 min read",
    body: [
      "Nearly every GA4 property I audit was migrated, not configured. The data flows, but the numbers don't mean anything yet.",
      "The usual suspects: multiple conversions marked as primary, form submissions counted on page load, no channel grouping fixes for paid social, internal traffic unfiltered, and Ads conversions imported twice.",
      "Fix tracking before you touch bidding. Smart bidding optimised against a wrong conversion will confidently spend your budget in the wrong direction.",
    ],
  },
  {
    slug: "seo-that-compounds",
    title: "Why SEO only pays off when you stop chasing keywords",
    excerpt:
      "Ranking for a keyword is a tactic. Owning a topic — technically, editorially and commercially — is what actually compounds.",
    category: "SEO",
    date: "2026-06-30",
    readTime: "8 min read",
    body: [
      "A keyword list is not a strategy. It's a shopping list without a recipe.",
      "The B2B brand that doubled organic traffic in six months didn't publish more. It fixed indexation, consolidated four thin pages into one strong one, and built support content around a single commercial topic.",
      "Compounding comes from depth plus internal linking plus technical health. Everything else is decoration.",
    ],
  },
];

export const postBySlug = (slug: string) => posts.find((p) => p.slug === slug);
