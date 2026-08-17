import portrait from "@/assets/jugal-portrait.jpeg.asset.json";
import type { Block } from "@/lib/blocks";
import { faqs, miniCases, process, stats, testimonials } from "@/data/site";

const b = (type: string, data: Block["data"]): Block => ({
  id: `${type}-${Math.random().toString(36).slice(2, 9)}`,
  type,
  data,
});

/** The built-in layout of each designed page, expressed as editable blocks. */
export const defaultBlocks: Record<string, () => Block[]> = {
  "/": () => [
    b("hero", {
      eyebrow: "Digital Marketing · Automation · Growth",
      heading: "I Build",
      highlight: "Growth Engines, Not Just Campaigns.",
      body: "10+ years turning SEO, paid media and AI-powered automation into qualified leads, lower CPA and revenue you can measure. Certified by IIT Roorkee & Purdue University.",
      primaryLabel: "Book a Free Strategy Call",
      primaryTo: "/contact",
      secondaryLabel: "Get a Free Website Audit",
      secondaryTo: "/services/website-audit",
      note: "10+ Years · 200+ Campaigns · 15+ Certifications",
      image: portrait.url,
      slider: true,
    }),
    b("cards", {
      eyebrow: "Sound familiar?",
      heading: "Most marketing fails for three boring reasons.",
      columns: "3",
      bg: "mist",
      items: [
        { title: "Traffic that doesn't convert.", text: "Visitors arrive, wander, leave. Nobody knows which page loses them." },
        { title: "Ad spend with no clear ROI.", text: "Platform dashboards look healthy while the bank account disagrees." },
        { title: "Marketing that eats your time.", text: "You're the strategist, the copywriter and the reporting analyst." },
      ],
      footnote:
        "My answer is one line: marketing that compounds — SEO, paid media and automation engineered around qualified pipeline.",
    }),
    b("servicesGrid", {
      eyebrow: "What I do",
      heading: "Pick the lever. I'll own it end to end.",
      limit: 6,
      ctaLabel: "View all services",
      bg: "white",
    }),
    b("cards", {
      eyebrow: "Why work with me",
      heading: "An expert, not an account manager.",
      columns: "2",
      bg: "paper",
      items: [
        { title: "Data-Driven Decisions", text: "Tracking gets fixed before budgets grow. Every decision points back to a number in GA4 or your CRM." },
        { title: "AI + Automation First", text: "Research, briefs, competitor tracking and reporting run through AI workflows — roughly half the production time." },
        { title: "Full-Funnel Ownership", text: "From first impression to closed deal. No throwing leads over the wall and calling it done." },
        { title: "Transparent Reporting", text: "A live dashboard and a monthly note in plain English. What worked, what didn't, what's next." },
      ],
      footnote: "",
    }),
    b("stats", {
      eyebrow: "Proof",
      heading: "Numbers, not adjectives.",
      items: stats.map((s) => ({ value: s.value, suffix: s.suffix, label: s.label })),
      cases: miniCases.map((c) => ({ challenge: c.challenge, action: c.action, result: c.result })),
    }),
    b("steps", {
      eyebrow: "How I work",
      heading: "A five-step process, run in the open.",
      bg: "white",
      items: process.map((p) => ({ step: p.step, text: p.text })),
    }),
    b("imageText", {
      eyebrow: "About me",
      heading: "Marketing became interesting when it became measurable.",
      paragraphs: [
        "I got into digital marketing because it was the only kind of marketing where you could prove what worked. Ten years and 200+ campaigns later, that's still the part I care about.",
        "I build AI and automation into SEO audits, competitor research, content production and reporting — not as a gimmick, but because it removes grunt work and leaves more room for judgement.",
      ],
      image: portrait.url,
      imageSide: "left",
      ctaLabel: "More about me",
      ctaTo: "/about",
      bg: "mist",
    }),
    b("testimonials", {
      eyebrow: "Kind words",
      heading: "What clients say.",
      bg: "white",
      items: testimonials.map((t) => ({ quote: t.quote, name: t.name, role: t.role, company: t.company })),
    }),
    b("postsGrid", { eyebrow: "Insights", heading: "Recent thinking.", limit: 3, bg: "mist" }),
    b("faq", { eyebrow: "FAQ", heading: "Questions I get asked a lot.", bg: "white", items: faqs.map((f) => ({ q: f.q, a: f.a })) }),
    b("cta", { heading: "Let's build your growth engine.", body: "Tell me what you're trying to grow. I'll tell you honestly whether I'm the right person, and what I'd do first." }),
  ],
  "/about": () => [
    b("pageHero", {
      eyebrow: "About",
      heading: "About Jugal K. Shukla",
      body: "I build growth engines for founders and marketing heads who are tired of dashboards that look busy and pipelines that stay flat.",
    }),
    b("imageText", {
      eyebrow: "My story",
      heading: "Marketing became interesting when it became measurable.",
      paragraphs: [
        "I got into digital marketing because it was the only kind of marketing where you could prove what worked. Ten years and 200+ campaigns later, that's still the part I care about: the line between effort and outcome.",
        "Somewhere along the way the work stopped being about channels and started being about systems. I began building AI and automation into SEO audits, competitor research, content production, campaign reporting and lead nurturing.",
        "I'm not here to throw jargon at you. I'm here to make marketing work — strategically, honestly, and with the right mix of human creativity and AI speed.",
      ],
      image: portrait.url,
      imageSide: "left",
      ctaLabel: "",
      ctaTo: "",
      bg: "white",
    }),
    b("pills", {
      eyebrow: "What I do best",
      heading: "The full stack of demand.",
      bg: "mist",
      items: [
        "Technical SEO",
        "On-page & Off-page SEO",
        "Google Ads",
        "Meta Ads",
        "LinkedIn Ads",
        "GA4 & GTM",
        "CRO & A/B Testing",
        "Marketing Automation",
        "Prompt Engineering",
        "Content Strategy",
        "Analytics & Attribution",
        "Local SEO",
      ],
    }),
    b("cta", { heading: "Let's talk about your pipeline.", body: "One honest conversation beats three agency proposals." }),
  ],
  "/contact": () => [
    b("pageHero", {
      eyebrow: "Contact",
      heading: "Tell me what you're trying to grow.",
      body: "One honest conversation beats three agency proposals. Reach out however suits you — I reply within 24 hours.",
    }),
    b("contact", { heading: "Send a brief", body: "I read every message myself and reply within 24 hours.", bg: "white" }),
    b("faq", {
      eyebrow: "Before you write",
      heading: "Quick answers.",
      bg: "mist",
      items: [
        { q: "What happens after I submit the form?", a: "I read it myself and reply within 24 hours, usually with two or three specific questions and a suggested time to talk." },
        { q: "Is the first call really free?", a: "Yes — 30 minutes, no deck, no pitch. If I'm not the right fit I'll say so and point you elsewhere." },
        { q: "Do you sign NDAs?", a: "Happily, before any account or data access is shared." },
      ],
    }),
  ],
};

export const hasDefaultBlocks = (path: string) => Boolean(defaultBlocks[path]);

const seedTitles: Record<string, string> = {
  "/": "Home",
  "/about": "About",
  "/contact": "Contact",
};

export interface PageSeed {
  path: string;
  title: string;
  blocks: Block[];
}

/** Seeds used by the admin to import the currently designed pages as editable sections. */
export const defaultPageSeeds: PageSeed[] = Object.keys(defaultBlocks).map((path) => ({
  path,
  title: seedTitles[path] ?? path,
  blocks: defaultBlocks[path]!(),
}));
