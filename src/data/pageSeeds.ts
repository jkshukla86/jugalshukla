import type { Block } from "@/lib/blocks";
import { services } from "@/data/services";
import { defaultBlocks } from "@/data/defaultBlocks";

const b = (type: string, data: Block["data"]): Block => ({
  id: `${type}-${Math.random().toString(36).slice(2, 9)}`,
  type,
  data,
});

/** The /services hub, expressed as editable sections. */
export const servicesHubBlocks = (): Block[] => [
  b("pageHero", {
    eyebrow: "Services",
    heading: "Growth services, end to end.",
    body: "Twenty-one ways to grow — SEO, paid media, automation and content. Pick the lever you need, or let me sequence them for you.",
  }),
  b("servicesGrid", {
    eyebrow: "All services",
    heading: "Pick the lever. I'll own it end to end.",
    limit: 21,
    ctaLabel: "",
    bg: "white",
  }),
  b("cta", {
    heading: "Not sure which service you need?",
    body: "Tell me what you're trying to grow and I'll tell you where I'd start.",
  }),
];

/** The /blog listing, expressed as editable sections. */
export const blogHubBlocks = (): Block[] => [
  b("pageHero", {
    eyebrow: "Blog",
    heading: "Notes on marketing that compounds.",
    body: "Playbooks, teardowns and automation experiments from live client work.",
  }),
  b("postsGrid", { eyebrow: "Latest", heading: "Recent articles", limit: 24, bg: "white" }),
  b("cta", { heading: "Want this applied to your funnel?", body: "Book a free 30-minute strategy call." }),
];

/** One service page, expressed as editable sections that mirror the live design. */
export const serviceBlocks = (slug: string): Block[] => {
  const s = services.find((x) => x.slug === slug);
  if (!s) return [];
  return [
    b("pageHero", { eyebrow: s.category, heading: s.name, body: s.outcome }),
    b("cards", {
      eyebrow: "Is this you?",
      heading: "If any of these sound familiar, we should talk.",
      columns: "3",
      bg: "mist",
      items: s.pains.map((p) => ({ title: p, text: "" })),
      footnote: "",
    }),
    b("cards", {
      eyebrow: "What I do",
      heading: "The actual work, not a wish list.",
      columns: "3",
      bg: "white",
      items: s.deliverables.map((d) => ({ title: d.title, text: d.text })),
      footnote: "",
    }),
    b("steps", {
      eyebrow: "My process",
      heading: "How this engagement runs.",
      bg: "paper",
      items: s.steps.map((st) => ({ step: st.title, text: st.text })),
    }),
    b("pills", { eyebrow: "Tools I use", heading: "The stack behind the work.", bg: "white", items: s.tools }),
    b("pills", { eyebrow: "What you get", heading: "Deliverables and reporting.", bg: "mist", items: s.checklist }),
    b("cards", {
      eyebrow: "Proof",
      heading: "Results this work has produced.",
      columns: "3",
      bg: "white",
      items: s.proof.map((p) => ({ title: p.metric, text: p.label })),
      footnote: "",
    }),
    b("faq", {
      eyebrow: "FAQ",
      heading: `${s.name} questions.`,
      bg: "mist",
      items: s.faqs.map((f) => ({ q: f.q, a: f.a })),
    }),
    b("cta", {
      heading: `Ready to fix ${s.name.toLowerCase()}?`,
      body: "Book a free 30-minute call and I'll tell you what I'd do first.",
    }),
  ];
};

export interface PageSeed {
  path: string;
  title: string;
  blocks: () => Block[];
  group: "Main pages" | "Service pages";
}

/** Every page of the live site, with the sections used to import it into the editor. */
export const allPageSeeds: PageSeed[] = [
  { path: "/", title: "Home", blocks: defaultBlocks["/"]!, group: "Main pages" },
  { path: "/about", title: "About", blocks: defaultBlocks["/about"]!, group: "Main pages" },
  { path: "/services", title: "Services", blocks: servicesHubBlocks, group: "Main pages" },
  { path: "/blog", title: "Blog", blocks: blogHubBlocks, group: "Main pages" },
  { path: "/contact", title: "Contact", blocks: defaultBlocks["/contact"]!, group: "Main pages" },
  ...services.map((s) => ({
    path: `/services/${s.slug}`,
    title: s.name,
    blocks: () => serviceBlocks(s.slug),
    group: "Service pages" as const,
  })),
];

export const seedByPath = (path: string) => allPageSeeds.find((s) => s.path === path);
