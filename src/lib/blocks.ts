export type Json = string | number | boolean | null | Json[] | { [key: string]: Json };

export type BlockData = Record<string, Json>;

export interface Block {
  id: string;
  type: string;
  data: BlockData;
}

export type FieldKind =
  | "text"
  | "textarea"
  | "image"
  | "number"
  | "boolean"
  | "select"
  | "stringList"
  | "objectList";

export interface Field {
  name: string;
  label: string;
  kind: FieldKind;
  options?: string[];
  itemFields?: Field[];
  placeholder?: string;
  help?: string;
}

export interface BlockDef {
  type: string;
  label: string;
  description: string;
  fields: Field[];
  defaults: BlockData;
}

const bgField: Field = {
  name: "bg",
  label: "Background",
  kind: "select",
  options: ["white", "mist", "paper", "dark"],
};

export const blockDefs: BlockDef[] = [
  {
    type: "hero",
    label: "Hero",
    description: "Full-width dark hero with headline, buttons and optional portrait.",
    fields: [
      { name: "eyebrow", label: "Eyebrow", kind: "text" },
      { name: "heading", label: "Headline", kind: "text" },
      { name: "highlight", label: "Highlighted words (gradient)", kind: "text" },
      { name: "body", label: "Sub-headline", kind: "textarea" },
      { name: "primaryLabel", label: "Primary button label", kind: "text" },
      { name: "primaryTo", label: "Primary button link", kind: "text", placeholder: "/contact" },
      { name: "secondaryLabel", label: "Secondary button label", kind: "text" },
      { name: "secondaryTo", label: "Secondary button link", kind: "text" },
      { name: "note", label: "Small note under buttons", kind: "text" },
      { name: "image", label: "Image", kind: "image" },
      { name: "slider", label: "Use background image slider", kind: "boolean" },
    ],
    defaults: {
      eyebrow: "Digital Marketing · Automation · Growth",
      heading: "I Build",
      highlight: "Growth Engines",
      body: "10+ years turning SEO, paid media and AI-powered automation into qualified leads and revenue you can measure.",
      primaryLabel: "Book a Free Strategy Call",
      primaryTo: "/contact",
      secondaryLabel: "",
      secondaryTo: "",
      note: "10+ Years · 200+ Campaigns · 15+ Certifications",
      image: "",
      slider: true,
    },
  },
  {
    type: "pageHero",
    label: "Page header",
    description: "Dark page header with breadcrumb-style eyebrow, title and intro.",
    fields: [
      { name: "eyebrow", label: "Eyebrow", kind: "text" },
      { name: "heading", label: "Title", kind: "text" },
      { name: "body", label: "Intro", kind: "textarea" },
    ],
    defaults: { eyebrow: "Page", heading: "New page", body: "" },
  },
  {
    type: "richText",
    label: "Text section",
    description: "Heading plus paragraphs.",
    fields: [
      { name: "eyebrow", label: "Eyebrow", kind: "text" },
      { name: "heading", label: "Heading", kind: "text" },
      { name: "paragraphs", label: "Paragraphs", kind: "stringList" },
      bgField,
    ],
    defaults: { eyebrow: "", heading: "A section heading", paragraphs: ["Write your copy here."], bg: "white" },
  },
  {
    type: "cards",
    label: "Card grid",
    description: "2–4 column grid of titled cards.",
    fields: [
      { name: "eyebrow", label: "Eyebrow", kind: "text" },
      { name: "heading", label: "Heading", kind: "text" },
      { name: "columns", label: "Columns", kind: "select", options: ["2", "3", "4"] },
      {
        name: "items",
        label: "Cards",
        kind: "objectList",
        itemFields: [
          { name: "title", label: "Title", kind: "text" },
          { name: "text", label: "Text", kind: "textarea" },
        ],
      },
      { name: "footnote", label: "Closing line", kind: "textarea" },
      bgField,
    ],
    defaults: {
      eyebrow: "",
      heading: "Card grid",
      columns: "3",
      items: [
        { title: "First card", text: "Describe the point." },
        { title: "Second card", text: "Describe the point." },
        { title: "Third card", text: "Describe the point." },
      ],
      footnote: "",
      bg: "mist",
    },
  },
  {
    type: "imageText",
    label: "Image + text",
    description: "Image on one side, copy on the other.",
    fields: [
      { name: "eyebrow", label: "Eyebrow", kind: "text" },
      { name: "heading", label: "Heading", kind: "text" },
      { name: "paragraphs", label: "Paragraphs", kind: "stringList" },
      { name: "image", label: "Image", kind: "image" },
      { name: "imageSide", label: "Image side", kind: "select", options: ["left", "right"] },
      { name: "ctaLabel", label: "Button label", kind: "text" },
      { name: "ctaTo", label: "Button link", kind: "text" },
      bgField,
    ],
    defaults: {
      eyebrow: "",
      heading: "Section heading",
      paragraphs: ["Write your copy here."],
      image: "",
      imageSide: "left",
      ctaLabel: "",
      ctaTo: "",
      bg: "white",
    },
  },
  {
    type: "pills",
    label: "Tag pills",
    description: "A wrapped row of short labels — skills, tools, industries.",
    fields: [
      { name: "eyebrow", label: "Eyebrow", kind: "text" },
      { name: "heading", label: "Heading", kind: "text" },
      { name: "items", label: "Labels", kind: "stringList" },
      bgField,
    ],
    defaults: { eyebrow: "", heading: "What I do best", items: ["Technical SEO", "Google Ads", "GA4 & GTM"], bg: "mist" },
  },
  {
    type: "stats",
    label: "Results band",
    description: "Dark band with animated counters and optional mini case studies.",
    fields: [
      { name: "eyebrow", label: "Eyebrow", kind: "text" },
      { name: "heading", label: "Heading", kind: "text" },
      {
        name: "items",
        label: "Numbers",
        kind: "objectList",
        itemFields: [
          { name: "value", label: "Number", kind: "number" },
          { name: "suffix", label: "Suffix", kind: "text", placeholder: "%" },
          { name: "label", label: "Label", kind: "text" },
        ],
      },
      {
        name: "cases",
        label: "Mini cases",
        kind: "objectList",
        itemFields: [
          { name: "challenge", label: "Challenge", kind: "textarea" },
          { name: "action", label: "Action", kind: "textarea" },
          { name: "result", label: "Result", kind: "text" },
        ],
      },
    ],
    defaults: {
      eyebrow: "Proof",
      heading: "Numbers, not adjectives.",
      items: [
        { value: 10, suffix: "+", label: "Years in the trenches" },
        { value: 200, suffix: "+", label: "Campaigns managed" },
      ],
      cases: [],
    },
  },
  {
    type: "steps",
    label: "Process steps",
    description: "Numbered steps with a short description each.",
    fields: [
      { name: "eyebrow", label: "Eyebrow", kind: "text" },
      { name: "heading", label: "Heading", kind: "text" },
      {
        name: "items",
        label: "Steps",
        kind: "objectList",
        itemFields: [
          { name: "step", label: "Step name", kind: "text" },
          { name: "text", label: "Description", kind: "textarea" },
        ],
      },
      bgField,
    ],
    defaults: {
      eyebrow: "How I work",
      heading: "A process, not a guess.",
      items: [{ step: "Audit", text: "Understand the data before promising anything." }],
      bg: "white",
    },
  },
  {
    type: "servicesGrid",
    label: "Services grid",
    description: "Pulls cards from your services list.",
    fields: [
      { name: "eyebrow", label: "Eyebrow", kind: "text" },
      { name: "heading", label: "Heading", kind: "text" },
      { name: "limit", label: "How many to show", kind: "number" },
      { name: "ctaLabel", label: "Link label", kind: "text" },
      bgField,
    ],
    defaults: {
      eyebrow: "What I do",
      heading: "Pick the lever. I'll own it end to end.",
      limit: 6,
      ctaLabel: "See all services",
      bg: "white",
    },
  },
  {
    type: "postsGrid",
    label: "Blog teaser",
    description: "Latest published articles.",
    fields: [
      { name: "eyebrow", label: "Eyebrow", kind: "text" },
      { name: "heading", label: "Heading", kind: "text" },
      { name: "limit", label: "How many to show", kind: "number" },
      bgField,
    ],
    defaults: { eyebrow: "Insights", heading: "Latest from the blog", limit: 3, bg: "mist" },
  },
  {
    type: "testimonials",
    label: "Testimonials",
    description: "Quote cards with name, role and company.",
    fields: [
      { name: "eyebrow", label: "Eyebrow", kind: "text" },
      { name: "heading", label: "Heading", kind: "text" },
      {
        name: "items",
        label: "Quotes",
        kind: "objectList",
        itemFields: [
          { name: "quote", label: "Quote", kind: "textarea" },
          { name: "name", label: "Name", kind: "text" },
          { name: "role", label: "Role", kind: "text" },
          { name: "company", label: "Company", kind: "text" },
        ],
      },
      bgField,
    ],
    defaults: {
      eyebrow: "Kind words",
      heading: "What clients say",
      items: [{ quote: "Add a client quote here.", name: "", role: "", company: "" }],
      bg: "white",
    },
  },
  {
    type: "faq",
    label: "FAQ",
    description: "Accordion of questions and answers (also emits FAQ structured data).",
    fields: [
      { name: "eyebrow", label: "Eyebrow", kind: "text" },
      { name: "heading", label: "Heading", kind: "text" },
      {
        name: "items",
        label: "Questions",
        kind: "objectList",
        itemFields: [
          { name: "q", label: "Question", kind: "text" },
          { name: "a", label: "Answer", kind: "textarea" },
        ],
      },
      bgField,
    ],
    defaults: {
      eyebrow: "FAQ",
      heading: "Questions I get asked a lot",
      items: [{ q: "A question?", a: "The answer." }],
      bg: "mist",
    },
  },
  {
    type: "image",
    label: "Image",
    description: "A single full-width image with optional caption.",
    fields: [
      { name: "image", label: "Image", kind: "image" },
      { name: "alt", label: "Alt text", kind: "text" },
      { name: "caption", label: "Caption", kind: "text" },
      bgField,
    ],
    defaults: { image: "", alt: "", caption: "", bg: "white" },
  },
  {
    type: "contact",
    label: "Contact block",
    description: "Contact details plus the enquiry form.",
    fields: [
      { name: "heading", label: "Heading", kind: "text" },
      { name: "body", label: "Intro", kind: "textarea" },
      bgField,
    ],
    defaults: { heading: "Send a brief", body: "I reply within 24 hours.", bg: "white" },
  },
  {
    type: "cta",
    label: "CTA band",
    description: "Dark closing band with contact details and a short form.",
    fields: [
      { name: "heading", label: "Heading", kind: "text" },
      { name: "body", label: "Text", kind: "textarea" },
    ],
    defaults: { heading: "Let's build your growth engine.", body: "Tell me what you're trying to grow." },
  },
];

export const blockDefByType = (type: string) => blockDefs.find((d) => d.type === type);

export const makeBlock = (type: string): Block => {
  const def = blockDefByType(type);
  return {
    id: `${type}-${Math.random().toString(36).slice(2, 9)}`,
    type,
    data: def ? JSON.parse(JSON.stringify(def.defaults)) : {},
  };
};

export const str = (data: BlockData, key: string, fallback = ""): string => {
  const v = data[key];
  return typeof v === "string" ? v : fallback;
};

export const num = (data: BlockData, key: string, fallback = 0): number => {
  const v = data[key];
  const n = typeof v === "string" ? Number(v) : v;
  return typeof n === "number" && Number.isFinite(n) ? n : fallback;
};

export const bool = (data: BlockData, key: string, fallback = false): boolean => {
  const v = data[key];
  return typeof v === "boolean" ? v : fallback;
};

export const list = <T,>(data: BlockData, key: string): T[] => {
  const v = data[key];
  return Array.isArray(v) ? (v as unknown as T[]) : [];
};

export const isBlockArray = (value: unknown): value is Block[] =>
  Array.isArray(value) && value.every((b) => !!b && typeof b === "object" && typeof (b as Block).type === "string");
