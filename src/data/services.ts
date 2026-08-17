export type ServiceCategory = "Organic" | "Paid" | "Automation & AI" | "Brand & Content";

export interface Service {
  slug: string;
  name: string;
  short: string;
  category: ServiceCategory;
  icon: string;
  outcome: string;
  bullets: string[];
  pains: string[];
  deliverables: { title: string; text: string }[];
  steps: { title: string; text: string }[];
  tools: string[];
  checklist: string[];
  proof: { metric: string; label: string }[];
  faqs: { q: string; a: string }[];
  seoTitle: string;
  seoDescription: string;
}

const f = (
  s: Omit<Service, "checklist" | "proof"> & Partial<Pick<Service, "checklist" | "proof">>,
): Service => ({
  checklist: [
    "A written plan you can read in five minutes",
    "Everything implemented, not just recommended",
    "A live dashboard with the numbers that matter",
    "A monthly note in plain English",
  ],
  proof: [
    { metric: "60%", label: "traffic lift in 4 months" },
    { metric: "40%", label: "uplift in qualified leads" },
    { metric: "10+", label: "years of hands-on delivery" },
  ],
  ...s,
});

export const services: Service[] = [
  f({
    slug: "digital-marketing",
    name: "Digital Marketing Strategy",
    short: "One plan that decides where every rupee and hour goes.",
    category: "Brand & Content",
    icon: "Compass",
    outcome:
      "Stop guessing which channel to feed. I map your funnel, pick the two or three levers that actually move pipeline, and sequence them.",
    bullets: ["Funnel and channel audit", "12-month growth roadmap", "Budget and KPI model"],
    pains: [
      "You're running five channels and none of them are owned.",
      "Every agency pitch sounds the same and none start with your numbers.",
      "You can't say which activity produced last quarter's revenue.",
    ],
    deliverables: [
      { title: "Funnel mapping", text: "Awareness to revenue, with the leak points marked." },
      { title: "Audience & ICP", text: "Who actually buys, what they search, what stops them." },
      { title: "Channel scoring", text: "Each channel rated on cost, speed and compounding value." },
      { title: "Budget model", text: "Spend split by channel with expected CPL and payback." },
      { title: "Roadmap", text: "Quarter-by-quarter sequence, owner and success metric per item." },
      { title: "Measurement plan", text: "The four numbers we report on, and how they're tracked." },
    ],
    steps: [
      { title: "Discovery", text: "Interviews, data pulls, access to analytics and ad accounts." },
      { title: "Diagnosis", text: "Where growth is blocked, ranked by cost of inaction." },
      { title: "Strategy", text: "A single-page plan plus the detail behind it." },
      { title: "Handover", text: "Walkthrough session, then optional delivery by me." },
    ],
    tools: ["GA4", "Search Console", "SEMrush", "Looker Studio", "HubSpot"],
    faqs: [
      { q: "Is this a deck or an implementation?", a: "The strategy is a deliverable on its own. If you want me to build it too, that becomes a retainer or sprint." },
      { q: "How long does it take?", a: "Typically two to three weeks from access to final walkthrough." },
      { q: "Do I need existing data?", a: "Helpful, not required. If tracking is broken, fixing it becomes step one." },
      { q: "Will you work with my in-house team?", a: "Yes — most strategies are built to be run by an internal team with me reviewing." },
    ],
    seoTitle: "Digital Marketing Strategy Consultant | Jugal K. Shukla",
    seoDescription:
      "A funnel-first digital marketing strategy with channel priorities, budget model and a 12-month roadmap built around qualified pipeline.",
  }),
  f({
    slug: "seo",
    name: "Search Engine Optimisation (SEO)",
    short: "Rank for the keywords that actually convert.",
    category: "Organic",
    icon: "Search",
    outcome:
      "Technical fixes, content built around buying intent, and authority earned honestly — traffic that keeps paying after the invoice stops.",
    bullets: ["Technical SEO rebuild", "Intent-led content clusters", "Digital PR and links"],
    pains: [
      "Traffic is flat while competitors climb.",
      "You rank for words nobody buys with.",
      "A developer 'fixed SEO' once and nothing changed.",
    ],
    deliverables: [
      { title: "Technical audit", text: "Crawl, index, speed, schema and Core Web Vitals, with fixes shipped." },
      { title: "Keyword map", text: "Every commercial term mapped to one page — no cannibalisation." },
      { title: "On-page work", text: "Titles, headings, internal links and content depth rewritten." },
      { title: "Content clusters", text: "Pillar and support pages that own a topic, not a keyword." },
      { title: "Authority building", text: "Digital PR, expert quotes and clean, editorial links." },
      { title: "Rank & traffic reporting", text: "Position, clicks and assisted conversions in one view." },
    ],
    steps: [
      { title: "Crawl & audit", text: "Screaming Frog, Search Console and log-level review." },
      { title: "Fix the base", text: "Indexation, speed and structure before any content." },
      { title: "Build content", text: "Briefs, drafting with AI assistance, human editing." },
      { title: "Earn authority", text: "Outreach and PR to the pages that carry money terms." },
      { title: "Compound", text: "Refresh, expand and prune quarterly." },
    ],
    tools: ["Screaming Frog", "Ahrefs", "SEMrush", "Search Console", "GA4"],
    faqs: [
      { q: "When will I see rankings?", a: "Technical wins land in weeks; competitive terms usually take three to six months." },
      { q: "Do you guarantee position one?", a: "No, and be careful with anyone who does. I commit to process, reporting and compounding traffic." },
      { q: "Who writes the content?", a: "I brief and draft with AI assistance, then edit by hand. Your team can also write to my briefs." },
      { q: "Do you buy links?", a: "No. Editorial, PR-led links only." },
      { q: "Can you work with my developer?", a: "Yes — I hand over prioritised, specific tickets." },
    ],
    seoTitle: "SEO Consultant — Technical SEO & Content | Jugal K. Shukla",
    seoDescription:
      "Technical SEO, intent-led content clusters and honest link building that grew a B2B brand's organic traffic 2× in six months.",
  }),
  f({
    slug: "sem",
    name: "Search Engine Marketing (SEM)",
    short: "Buy the clicks that turn into pipeline.",
    category: "Paid",
    icon: "Target",
    outcome:
      "Search campaigns built on real query data, negative-keyword discipline and landing pages that match intent.",
    bullets: ["Account restructure", "Query mining", "Landing page alignment"],
    pains: [
      "Spend climbs, conversions don't.",
      "Broad match is eating your budget.",
      "Nobody can tell you which keyword produced the last deal.",
    ],
    deliverables: [
      { title: "Account audit", text: "Structure, match types, wasted spend and quality score review." },
      { title: "Campaign rebuild", text: "Tight themes, clean naming, sane budget caps." },
      { title: "Ad copy testing", text: "Message variants tested against intent, not opinion." },
      { title: "Negative lists", text: "Weekly query mining to cut junk traffic." },
      { title: "Landing page briefs", text: "Message match from ad to headline to form." },
      { title: "Bid strategy", text: "Value-based bidding once conversion data supports it." },
    ],
    steps: [
      { title: "Audit", text: "Find waste and quick wins in the current account." },
      { title: "Restructure", text: "Rebuild around commercial intent themes." },
      { title: "Launch & mine", text: "Ship, then prune queries weekly." },
      { title: "Scale", text: "Expand winners, raise budgets where CPA holds." },
    ],
    tools: ["Google Ads", "Search Console", "GA4", "Google Tag Manager", "Looker Studio"],
    faqs: [
      { q: "What's the minimum spend?", a: "Enough to get statistically useful data — usually ₹1L/month or equivalent." },
      { q: "Do you manage Microsoft Ads too?", a: "Yes, where the audience justifies it." },
      { q: "Who owns the account?", a: "You do, always. I work inside your account." },
      { q: "Do you build the landing pages?", a: "I brief and can build them, or work with your team." },
    ],
    seoTitle: "SEM & Paid Search Consultant | Jugal K. Shukla",
    seoDescription:
      "Search engine marketing built on query mining, tight account structure and message-matched landing pages that lower cost per lead.",
  }),
  f({
    slug: "social-media-marketing",
    name: "Social Media Marketing (SMM)",
    short: "Social that builds demand, not just followers.",
    category: "Brand & Content",
    icon: "Share2",
    outcome:
      "A content engine tied to your funnel — formats that earn attention and posts that quietly move people towards a call.",
    bullets: ["Channel-fit content system", "Editorial calendar", "Community and engagement"],
    pains: [
      "Posting daily with nothing to show for it.",
      "Content that looks fine but sounds like everyone else.",
      "No link between social effort and revenue.",
    ],
    deliverables: [
      { title: "Channel strategy", text: "Which platforms deserve your time, and why the rest don't." },
      { title: "Content pillars", text: "Four themes that make you worth following." },
      { title: "Calendar", text: "Monthly plan with hooks, formats and CTAs." },
      { title: "Creative direction", text: "Templates, tone and visual system." },
      { title: "Engagement playbook", text: "Comment, DM and community routine." },
      { title: "Performance review", text: "Reach, saves, profile visits and enquiries tracked monthly." },
    ],
    steps: [
      { title: "Positioning", text: "Decide what you want to be known for." },
      { title: "System", text: "Pillars, formats and a repeatable calendar." },
      { title: "Publish", text: "Ship consistently with AI-assisted production." },
      { title: "Refine", text: "Double down on the formats that get saved and shared." },
    ],
    tools: ["Meta Business Manager", "LinkedIn Campaign Manager", "Hootsuite", "Canva", "ChatGPT"],
    faqs: [
      { q: "Do you post for me?", a: "Yes, or I build the system and your team runs it." },
      { q: "Which platforms?", a: "Usually LinkedIn and Instagram for B2B and D2C respectively — chosen after the audit." },
      { q: "Do you handle video?", a: "Scripting and direction yes; heavy production is outsourced to a partner." },
    ],
    seoTitle: "Social Media Marketing Consultant | Jugal K. Shukla",
    seoDescription:
      "A social media system built on content pillars, a real calendar and engagement routines that turn attention into enquiries.",
  }),
  f({
    slug: "website-audit",
    name: "Website Audit",
    short: "Find out exactly why your site doesn't convert.",
    category: "Organic",
    icon: "ClipboardCheck",
    outcome:
      "A prioritised, developer-ready list of what's broken across speed, SEO, tracking and conversion — with the fixes ranked by impact.",
    bullets: ["Technical + UX + tracking review", "Prioritised fix list", "Loom walkthrough"],
    pains: [
      "Visitors arrive and leave without a trace.",
      "Your site scores badly and nobody knows which fix matters.",
      "Forms, events or purchases aren't tracking properly.",
    ],
    deliverables: [
      { title: "Technical crawl", text: "Broken links, redirects, indexation, duplicate content." },
      { title: "Speed & CWV", text: "LCP, CLS and INP diagnosis with concrete fixes." },
      { title: "On-page SEO", text: "Titles, headings, schema and internal linking." },
      { title: "Conversion review", text: "Hero clarity, form friction, trust signals, mobile flow." },
      { title: "Tracking check", text: "GA4 events, GTM tags and conversion accuracy." },
      { title: "Priority list", text: "Every issue scored on impact versus effort." },
    ],
    steps: [
      { title: "Access", text: "Analytics, Search Console and site access." },
      { title: "Audit", text: "Automated crawl plus manual page-by-page review." },
      { title: "Report", text: "Written findings and a recorded walkthrough." },
      { title: "Fix support", text: "Optional implementation with your developer." },
    ],
    tools: ["Screaming Frog", "GA4", "Search Console", "Google Tag Manager", "SEMrush"],
    faqs: [
      { q: "How long does the audit take?", a: "Five to seven working days for most sites." },
      { q: "Is there a free version?", a: "Yes — a short free audit covering the biggest three issues." },
      { q: "Can my developer implement it?", a: "That's the point. Every item is written as a specific ticket." },
    ],
    seoTitle: "Website Audit — SEO, Speed & Conversion | Jugal K. Shukla",
    seoDescription:
      "A prioritised website audit covering technical SEO, Core Web Vitals, tracking accuracy and conversion friction, with developer-ready fixes.",
  }),
  f({
    slug: "ppc-advertising",
    name: "PPC Advertising",
    short: "Paid clicks with a cost per lead you can defend.",
    category: "Paid",
    icon: "MousePointerClick",
    outcome:
      "Full-funnel paid campaigns across search, display and video, managed to CPA and pipeline rather than impressions.",
    bullets: ["Multi-network campaigns", "Creative testing", "CPA-first management"],
    pains: [
      "Cost per lead keeps drifting upward.",
      "Leads arrive but sales calls them unqualified.",
      "Reporting stops at clicks and CTR.",
    ],
    deliverables: [
      { title: "Campaign architecture", text: "Prospecting, retargeting and brand defence separated." },
      { title: "Creative pipeline", text: "A steady stream of ad variants, not one set left running." },
      { title: "Audience strategy", text: "First-party lists, lookalikes and intent signals." },
      { title: "Lead quality loop", text: "CRM feedback wired back into optimisation." },
      { title: "Budget pacing", text: "Weekly pacing so nothing over- or under-spends." },
      { title: "Dashboard", text: "Spend, CPL, qualified rate and CAC in one place." },
    ],
    steps: [
      { title: "Set the target", text: "Agree an allowable CPA before spending anything." },
      { title: "Build", text: "Campaigns, tracking and creative shipped together." },
      { title: "Test", text: "Structured creative and audience tests every fortnight." },
      { title: "Scale", text: "Push spend where the unit economics hold." },
    ],
    tools: ["Google Ads", "Meta Business Manager", "GA4", "Looker Studio", "Google Tag Manager"],
    faqs: [
      { q: "Which networks do you run?", a: "Google, Meta, LinkedIn and YouTube, chosen by where your buyers actually are." },
      { q: "How is your fee structured?", a: "Flat monthly retainer, not a percentage of spend — no incentive to inflate budgets." },
      { q: "Do you produce creative?", a: "Copy and static creative yes; video through a partner." },
    ],
    seoTitle: "PPC Advertising Management | Jugal K. Shukla",
    seoDescription:
      "PPC management across Google, Meta and LinkedIn run to an agreed cost per acquisition, with creative testing and lead-quality feedback loops.",
  }),
  f({
    slug: "performance-marketing",
    name: "Performance Marketing",
    short: "Every rupee tied to a number you care about.",
    category: "Paid",
    icon: "TrendingUp",
    outcome:
      "A cross-channel performance engine where budget follows contribution, not habit — measured on CAC and payback, not vanity metrics.",
    bullets: ["Cross-channel media mix", "Attribution you trust", "CAC and payback modelling"],
    pains: [
      "Channels are optimised in silos.",
      "Attribution reports contradict each other.",
      "Nobody knows the true blended CAC.",
    ],
    deliverables: [
      { title: "Blended reporting", text: "One view across all paid and organic sources." },
      { title: "Media mix model", text: "Where the next rupee earns the most." },
      { title: "Attribution setup", text: "Server-side and offline conversions where needed." },
      { title: "Incrementality tests", text: "Geo and holdout tests to prove real lift." },
      { title: "Unit economics", text: "CAC, LTV and payback period per channel." },
      { title: "Weekly cadence", text: "Standing review with clear decisions logged." },
    ],
    steps: [
      { title: "Measure", text: "Fix tracking so the numbers can be trusted." },
      { title: "Model", text: "Build the CAC and payback picture." },
      { title: "Reallocate", text: "Shift budget towards proven contribution." },
      { title: "Prove", text: "Run incrementality tests before scaling hard." },
    ],
    tools: ["GA4", "Looker Studio", "Google Ads", "Meta Business Manager", "HubSpot"],
    faqs: [
      { q: "Is this different from PPC?", a: "PPC manages channels. Performance marketing manages the portfolio across all of them." },
      { q: "Do you need a CRM?", a: "Strongly preferred — offline conversion data makes optimisation far sharper." },
      { q: "What size budgets suit this?", a: "It pays off from roughly ₹5L/month in combined media spend." },
    ],
    seoTitle: "Performance Marketing Consultant | Jugal K. Shukla",
    seoDescription:
      "Cross-channel performance marketing with trustworthy attribution, CAC and payback modelling, and incrementality testing before scale.",
  }),
  f({
    slug: "branding",
    name: "Branding & Brand Strategy",
    short: "Say one thing, clearly, everywhere.",
    category: "Brand & Content",
    icon: "Sparkles",
    outcome:
      "Positioning, message and voice defined so your ads, site and sales calls stop contradicting each other.",
    bullets: ["Positioning statement", "Messaging framework", "Voice and identity guide"],
    pains: [
      "Prospects can't repeat what you do.",
      "Every page describes the business differently.",
      "You compete on price because nothing else stands out.",
    ],
    deliverables: [
      { title: "Market position", text: "Where you sit against alternatives, in one sentence." },
      { title: "Message house", text: "Core promise, three pillars, proof under each." },
      { title: "Value proposition", text: "Written for each audience segment." },
      { title: "Tone of voice", text: "How you sound, with do/don't examples." },
      { title: "Identity direction", text: "Colour, type and imagery guidance for designers." },
      { title: "Rollout checklist", text: "Where the new message goes, in order." },
    ],
    steps: [
      { title: "Listen", text: "Customer interviews and sales-call review." },
      { title: "Define", text: "Position and message tested against real objections." },
      { title: "Document", text: "A short, usable guide — not a 90-page bible." },
      { title: "Roll out", text: "Site, ads and collateral updated to match." },
    ],
    tools: ["SEMrush", "ChatGPT", "Claude AI", "Canva", "Midjourney"],
    faqs: [
      { q: "Do you design logos?", a: "I direct identity work and partner with a designer for execution." },
      { q: "How long does it take?", a: "Three to four weeks including customer interviews." },
      { q: "Is this useful for a small business?", a: "Especially so — clarity is the cheapest growth lever you have." },
    ],
    seoTitle: "Brand Strategy & Positioning Consultant | Jugal K. Shukla",
    seoDescription:
      "Positioning, messaging framework and tone of voice so your website, ads and sales conversations finally say the same thing.",
  }),
  f({
    slug: "linkedin-optimization",
    name: "LinkedIn Profile & Page Optimisation",
    short: "Turn your profile into a lead source.",
    category: "Brand & Content",
    icon: "Linkedin",
    outcome:
      "A profile and company page rebuilt around what your buyer searches for, plus a posting rhythm that keeps you visible.",
    bullets: ["Keyword-optimised profile", "Company page rebuild", "Content rhythm"],
    pains: [
      "Your profile reads like a CV, not an offer.",
      "Nobody visits your company page.",
      "You post occasionally and nothing happens.",
    ],
    deliverables: [
      { title: "Headline & about", text: "Rewritten around outcomes and search terms." },
      { title: "Experience reframing", text: "Capability and proof instead of duties." },
      { title: "Featured section", text: "Case snippets, lead magnets and CTAs." },
      { title: "Company page", text: "Tagline, banner, products and follower CTA." },
      { title: "Content plan", text: "Twelve post angles and a weekly cadence." },
      { title: "SSI improvement", text: "Connection and engagement routine that compounds." },
    ],
    steps: [
      { title: "Research", text: "What your buyers search and who they follow." },
      { title: "Rewrite", text: "Profile and page rebuilt end to end." },
      { title: "Activate", text: "Posting and engagement routine set up." },
      { title: "Review", text: "Profile views, search appearances and enquiries after 30 days." },
    ],
    tools: ["LinkedIn Campaign Manager", "SEMrush", "ChatGPT", "Canva", "Hootsuite"],
    faqs: [
      { q: "Do you write posts for me?", a: "I can ghostwrite, or coach you to write faster with AI assistance." },
      { q: "Is this only for founders?", a: "No — sales teams and consultants get the same benefit." },
      { q: "How fast do results show?", a: "Profile views usually rise within two weeks; enquiries follow consistency." },
    ],
    seoTitle: "LinkedIn Profile & Page Optimisation | Jugal K. Shukla",
    seoDescription:
      "A LinkedIn profile and company page rebuilt around buyer search terms, with a posting rhythm that turns visibility into enquiries.",
  }),
  f({
    slug: "google-ads",
    name: "Google Ads Management",
    short: "Certified across Search, Display, Video and Remarketing.",
    category: "Paid",
    icon: "BadgeCheck",
    outcome:
      "Day-to-day Google Ads ownership: structure, bids, creative, negatives and conversion tracking, reported honestly.",
    bullets: ["Full account ownership", "Weekly optimisation", "Conversion-value bidding"],
    pains: [
      "Performance Max is a black box you can't steer.",
      "Smart bidding is optimising to the wrong conversion.",
      "Your account hasn't been restructured in years.",
    ],
    deliverables: [
      { title: "Account restructure", text: "Clean campaign themes, budgets and naming." },
      { title: "PMax control", text: "Asset groups, signals and exclusions that keep it honest." },
      { title: "Conversion hygiene", text: "One primary conversion, valued correctly." },
      { title: "Ad assets", text: "RSAs, extensions and creative refreshed monthly." },
      { title: "Negative discipline", text: "Weekly search term reviews." },
      { title: "Reporting", text: "Live dashboard plus a monthly written summary." },
    ],
    steps: [
      { title: "Audit", text: "Waste, structure and tracking accuracy." },
      { title: "Rebuild", text: "Restructure and relaunch with clean tracking." },
      { title: "Optimise", text: "Weekly bid, query and creative work." },
      { title: "Expand", text: "New campaign types once the core is profitable." },
    ],
    tools: ["Google Ads", "Google Tag Manager", "GA4", "Search Console", "Looker Studio"],
    faqs: [
      { q: "Do you charge a percentage of spend?", a: "No. Flat retainer, so my advice stays independent of your budget." },
      { q: "Will you run Performance Max?", a: "Yes, with tight signals and exclusions rather than blind trust." },
      { q: "Can you rescue a suspended account?", a: "I can help with policy remediation and appeals." },
    ],
    seoTitle: "Google Ads Management — Certified Specialist | Jugal K. Shukla",
    seoDescription:
      "Google Ads management by a certified specialist: account restructure, conversion-value bidding, weekly query mining and honest reporting.",
  }),
  f({
    slug: "meta-ads",
    name: "Meta Ads (Facebook & Instagram)",
    short: "Creative-led campaigns that survive iOS signal loss.",
    category: "Paid",
    icon: "Megaphone",
    outcome:
      "Meta campaigns built on a creative testing engine, clean Conversions API tracking and audiences that actually buy.",
    bullets: ["Creative testing engine", "Conversions API setup", "Full-funnel retargeting"],
    pains: [
      "Costs spiked after iOS tracking changes.",
      "One creative has been running for six months.",
      "Retargeting shows the same ad to everyone.",
    ],
    deliverables: [
      { title: "Account structure", text: "Consolidated learning, clear testing lanes." },
      { title: "CAPI + pixel", text: "Server-side events with deduplication done right." },
      { title: "Creative matrix", text: "Angles × formats × hooks, tested systematically." },
      { title: "Audience strategy", text: "Broad plus first-party lists and exclusions." },
      { title: "Funnel retargeting", text: "Different message by stage, not one catch-all." },
      { title: "Reporting", text: "Blended CAC, not just in-platform ROAS." },
    ],
    steps: [
      { title: "Track", text: "Pixel and Conversions API rebuilt first." },
      { title: "Test", text: "Launch a creative matrix, judge on cost per result." },
      { title: "Consolidate", text: "Kill losers fast, feed winners." },
      { title: "Scale", text: "Increase budget in controlled steps." },
    ],
    tools: ["Meta Business Manager", "GA4", "Google Tag Manager", "Canva", "Adobe Firefly"],
    faqs: [
      { q: "How many creatives do you need monthly?", a: "Six to twelve variants keeps a testing engine healthy." },
      { q: "Do you handle e-commerce catalogues?", a: "Yes, including feed setup and dynamic product ads." },
      { q: "Will you fix my pixel?", a: "That's step one of every engagement." },
    ],
    seoTitle: "Meta Ads Specialist — Facebook & Instagram | Jugal K. Shukla",
    seoDescription:
      "Meta ads management with Conversions API tracking, a systematic creative testing engine and full-funnel retargeting built on blended CAC.",
  }),
  f({
    slug: "marketing-automation",
    name: "Marketing Automation & CRM",
    short: "Let the system follow up while you sleep.",
    category: "Automation & AI",
    icon: "Workflow",
    outcome:
      "Lead capture, scoring, nurture and handover wired end to end so no enquiry goes cold because someone forgot.",
    bullets: ["CRM setup and hygiene", "Lifecycle automation", "Sales handover rules"],
    pains: [
      "Leads sit in an inbox for three days.",
      "Sales says marketing leads are junk; marketing disagrees.",
      "Your CRM is a spreadsheet with ambitions.",
    ],
    deliverables: [
      { title: "CRM configuration", text: "Pipelines, stages, properties and required fields." },
      { title: "Lead capture", text: "Forms, chat and ad lead objects piped in automatically." },
      { title: "Lead scoring", text: "Behaviour and fit scoring agreed with sales." },
      { title: "Nurture sequences", text: "Email and WhatsApp flows by segment and stage." },
      { title: "Internal alerts", text: "Instant notifications with full lead context." },
      { title: "Ops dashboard", text: "Speed to lead, stage conversion and pipeline value." },
    ],
    steps: [
      { title: "Map", text: "Current journey from first touch to closed deal." },
      { title: "Configure", text: "CRM, fields and integrations built out." },
      { title: "Automate", text: "Flows, scoring and alerts switched on." },
      { title: "Train", text: "Team walkthrough plus documentation." },
    ],
    tools: ["HubSpot", "Zapier / Make", "Google Tag Manager", "GA4", "Looker Studio"],
    faqs: [
      { q: "Which CRMs do you work with?", a: "HubSpot most often; Zoho, Pipedrive and custom stacks via Zapier or Make." },
      { q: "Can you migrate our existing data?", a: "Yes, including deduplication and property mapping." },
      { q: "Do you set up WhatsApp flows?", a: "Yes, through approved business API providers." },
    ],
    seoTitle: "Marketing Automation & CRM Consultant | Jugal K. Shukla",
    seoDescription:
      "CRM setup, lead scoring and lifecycle automation across email and WhatsApp so every enquiry gets followed up within minutes.",
  }),
  f({
    slug: "ai-marketing",
    name: "AI-Powered Marketing & Prompt Engineering",
    short: "AI that removes grunt work, not judgement.",
    category: "Automation & AI",
    icon: "Bot",
    outcome:
      "Custom AI workflows for research, briefs, drafts, competitor tracking and reporting — cutting production time by around half.",
    bullets: ["Custom prompt libraries", "AI content workflows", "Team enablement"],
    pains: [
      "Your team pastes into ChatGPT and gets generic output.",
      "Research and reporting eat days every month.",
      "AI experiments never became a repeatable process.",
    ],
    deliverables: [
      { title: "Workflow audit", text: "Which tasks are worth automating, and which aren't." },
      { title: "Prompt library", text: "Tested, versioned prompts for your voice and offer." },
      { title: "Content pipeline", text: "Research → brief → draft → human edit, documented." },
      { title: "Competitor monitoring", text: "Automated tracking of rival content and ads." },
      { title: "Reporting automation", text: "Data pulled and summarised without manual work." },
      { title: "Team training", text: "Live sessions plus a written playbook." },
    ],
    steps: [
      { title: "Map tasks", text: "Time-log where the hours actually go." },
      { title: "Design", text: "Build prompts and connect the tools." },
      { title: "Pilot", text: "Run one full cycle with quality checks." },
      { title: "Embed", text: "Train the team and hand over documentation." },
    ],
    tools: ["ChatGPT", "Claude AI", "Gemini", "Zapier / Make", "Midjourney"],
    faqs: [
      { q: "Will AI content hurt my SEO?", a: "Unedited output will. My workflows keep a human editor in every loop." },
      { q: "Is my data safe?", a: "We use business-tier tools with training opt-out and clear data rules." },
      { q: "Do you certify this?", a: "I hold Vanderbilt University's Prompt Engineering certification." },
      { q: "What's the realistic saving?", a: "Around 50% of content production time, based on my own workflows." },
    ],
    seoTitle: "AI Marketing & Prompt Engineering Consultant | Jugal K. Shukla",
    seoDescription:
      "Custom AI workflows for content, research, competitor tracking and reporting — cutting marketing production time by roughly half.",
  }),
  f({
    slug: "cro",
    name: "Conversion Rate Optimisation & A/B Testing",
    short: "Get more from the traffic you already pay for.",
    category: "Organic",
    icon: "SlidersHorizontal",
    outcome:
      "Research-led testing on the pages that carry revenue — small, compounding wins instead of redesign gambles.",
    bullets: ["Behaviour research", "Prioritised test roadmap", "Statistically sound testing"],
    pains: [
      "Traffic is fine but conversion is stuck.",
      "Redesigns are decided by whoever is loudest.",
      "Tests get called after four days.",
    ],
    deliverables: [
      { title: "Analytics deep dive", text: "Where users drop, by device and source." },
      { title: "Session research", text: "Heatmaps, recordings and form analytics." },
      { title: "Voice of customer", text: "On-site polls and buyer interviews." },
      { title: "Hypothesis backlog", text: "Prioritised by impact, confidence and effort." },
      { title: "Test execution", text: "Build, QA, run to significance, document." },
      { title: "Learning library", text: "Every result recorded so nothing is retested blindly." },
    ],
    steps: [
      { title: "Research", text: "Quant and qual before any opinion." },
      { title: "Prioritise", text: "Score hypotheses, pick the top three." },
      { title: "Test", text: "Run properly powered experiments." },
      { title: "Compound", text: "Roll out winners, feed learnings back in." },
    ],
    tools: ["GA4", "Google Tag Manager", "Looker Studio", "HubSpot", "Search Console"],
    faqs: [
      { q: "How much traffic do I need?", a: "Roughly 10,000 monthly sessions or 300 conversions for reliable A/B tests; below that we use sequential changes." },
      { q: "How long does a test run?", a: "Usually two to four weeks, never fewer than two business cycles." },
      { q: "Do you need developer time?", a: "Light tests I can ship; structural changes need your developer." },
    ],
    seoTitle: "CRO & A/B Testing Consultant | Jugal K. Shukla",
    seoDescription:
      "Research-led conversion rate optimisation: heatmaps, customer interviews and properly powered A/B tests on the pages that carry revenue.",
  }),
  f({
    slug: "content-marketing",
    name: "Content Marketing Strategy",
    short: "Content built to rank, convert and get reused.",
    category: "Brand & Content",
    icon: "PenLine",
    outcome:
      "A content engine mapped to buying intent, produced with AI assistance and human editing, and repurposed across channels.",
    bullets: ["Topic clusters", "Editorial system", "Repurposing engine"],
    pains: [
      "You publish blogs nobody reads.",
      "Content ideas come from whoever had one that morning.",
      "Every asset is used once and forgotten.",
    ],
    deliverables: [
      { title: "Content strategy", text: "Audience, intent stages and topic clusters." },
      { title: "Editorial calendar", text: "Three months of briefed, prioritised topics." },
      { title: "Brief templates", text: "Structure, keywords, angles and internal links." },
      { title: "Production workflow", text: "AI-assisted drafting with human editing gates." },
      { title: "Repurposing map", text: "One pillar into social, email and video scripts." },
      { title: "Performance review", text: "Traffic, rankings and assisted conversions per asset." },
    ],
    steps: [
      { title: "Research", text: "Search demand, competitor gaps and sales objections." },
      { title: "Plan", text: "Clusters and calendar agreed." },
      { title: "Produce", text: "Briefs, drafts, edits and publishing." },
      { title: "Repurpose", text: "Slice each pillar into channel-native pieces." },
    ],
    tools: ["SEMrush", "Ahrefs", "ChatGPT", "Claude AI", "Search Console"],
    faqs: [
      { q: "Do you write the content?", a: "Yes, or I brief your writers and edit their output." },
      { q: "How much should we publish?", a: "Fewer, deeper pieces beat weekly filler. Usually four to six strong assets a month." },
      { q: "Does this include design?", a: "Simple graphics yes; heavy design through a partner." },
    ],
    seoTitle: "Content Marketing Strategy Consultant | Jugal K. Shukla",
    seoDescription:
      "Content strategy built on topic clusters and buyer intent, produced with AI-assisted workflows and repurposed across every channel.",
  }),
  f({
    slug: "email-marketing",
    name: "Email Marketing & Lead Nurturing",
    short: "The channel you own, run properly.",
    category: "Automation & AI",
    icon: "Mail",
    outcome:
      "Lifecycle email that warms leads, revives dormant ones and sells without shouting — with deliverability handled.",
    bullets: ["Lifecycle flows", "Deliverability fixes", "List segmentation"],
    pains: [
      "Your emails land in Promotions or spam.",
      "One newsletter goes to everybody.",
      "Leads go quiet and nothing brings them back.",
    ],
    deliverables: [
      { title: "Deliverability setup", text: "SPF, DKIM, DMARC and domain warm-up." },
      { title: "Segmentation", text: "Lists split by behaviour, stage and interest." },
      { title: "Welcome flow", text: "First five emails that build trust and qualify." },
      { title: "Nurture tracks", text: "Sequences per service interest." },
      { title: "Re-engagement", text: "Win-back campaigns and list hygiene." },
      { title: "Reporting", text: "Open, click, reply and revenue per campaign." },
    ],
    steps: [
      { title: "Fix delivery", text: "Authentication and reputation first." },
      { title: "Segment", text: "Clean and split the list." },
      { title: "Build flows", text: "Copy, design and automation shipped." },
      { title: "Optimise", text: "Subject, send-time and offer testing." },
    ],
    tools: ["HubSpot", "Zapier / Make", "GA4", "ChatGPT", "Looker Studio"],
    faqs: [
      { q: "Which platform do you use?", a: "HubSpot, Mailchimp, Klaviyo or Brevo — whichever fits your stack." },
      { q: "Can you fix a bad sender reputation?", a: "Usually, with authentication, list pruning and a warm-up plan." },
      { q: "Do you write the emails?", a: "Yes, in your voice, with AI-assisted drafting and human editing." },
    ],
    seoTitle: "Email Marketing & Lead Nurturing | Jugal K. Shukla",
    seoDescription:
      "Lifecycle email marketing with deliverability fixes, behavioural segmentation and nurture flows that revive leads and drive revenue.",
  }),
  f({
    slug: "analytics-ga4",
    name: "Analytics, GA4 & Tracking Setup",
    short: "Numbers you can finally trust.",
    category: "Automation & AI",
    icon: "BarChart3",
    outcome:
      "GA4, Tag Manager and dashboards configured properly so every decision after this rests on accurate data.",
    bullets: ["GA4 + GTM rebuild", "Conversion tracking", "Looker Studio dashboards"],
    pains: [
      "GA4 was migrated and never configured.",
      "Conversion counts don't match the CRM.",
      "Reporting takes a day of copy-paste each month.",
    ],
    deliverables: [
      { title: "Measurement plan", text: "Every event, parameter and conversion documented." },
      { title: "GTM build", text: "Clean container with versioning and naming rules." },
      { title: "GA4 configuration", text: "Events, conversions, audiences and channel grouping." },
      { title: "Server-side option", text: "Where signal loss justifies it." },
      { title: "Platform linking", text: "Ads, Search Console and CRM connected." },
      { title: "Dashboard", text: "A Looker Studio report your team actually opens." },
    ],
    steps: [
      { title: "Plan", text: "Agree the metrics that matter before tagging." },
      { title: "Implement", text: "GTM and GA4 built to that plan." },
      { title: "Validate", text: "Debug, test and reconcile against the CRM." },
      { title: "Report", text: "Dashboards and a monthly reading routine." },
    ],
    tools: ["GA4", "Google Tag Manager", "Looker Studio", "Search Console", "HubSpot"],
    faqs: [
      { q: "How long does a GA4 setup take?", a: "One to two weeks for most sites, longer for e-commerce." },
      { q: "Can you recover historical data?", a: "No tool can backfill, but I can preserve and archive what exists." },
      { q: "Do you handle consent mode?", a: "Yes, including Consent Mode v2 for EU traffic." },
    ],
    seoTitle: "GA4 & Google Tag Manager Setup | Jugal K. Shukla",
    seoDescription:
      "GA4 and GTM configured to a documented measurement plan, validated against your CRM, with Looker Studio dashboards your team will use.",
  }),
  f({
    slug: "local-seo",
    name: "Local SEO & Google Business Profile",
    short: "Own the map pack in your city.",
    category: "Organic",
    icon: "MapPin",
    outcome:
      "Local visibility engineered through profile optimisation, citations, reviews and location pages that actually rank.",
    bullets: ["GBP optimisation", "Citations and NAP", "Review engine"],
    pains: [
      "Competitors outrank you on 'near me' searches.",
      "Your listing has old hours and no photos.",
      "Reviews arrive once a quarter, by accident.",
    ],
    deliverables: [
      { title: "Profile overhaul", text: "Categories, services, attributes, photos and posts." },
      { title: "Citation cleanup", text: "Consistent NAP across major directories." },
      { title: "Location pages", text: "Unique, genuinely useful pages per area served." },
      { title: "Review system", text: "Automated requests plus response templates." },
      { title: "Local content", text: "Area and service pages targeting local intent." },
      { title: "Rank tracking", text: "Grid-based local rank reporting." },
    ],
    steps: [
      { title: "Audit", text: "Profile, citations and local competitor gaps." },
      { title: "Optimise", text: "Profile and site fixed together." },
      { title: "Build signals", text: "Citations, reviews and local links." },
      { title: "Monitor", text: "Grid rankings, calls and direction requests." },
    ],
    tools: ["Search Console", "SE Ranking", "SEMrush", "GA4", "Screaming Frog"],
    faqs: [
      { q: "Do you handle multiple locations?", a: "Yes, including bulk profile management." },
      { q: "Can you remove bad reviews?", a: "Only policy-violating ones can be appealed; the rest we outweigh with volume." },
      { q: "How fast is local SEO?", a: "Map pack movement often shows within four to eight weeks." },
    ],
    seoTitle: "Local SEO & Google Business Profile | Jugal K. Shukla",
    seoDescription:
      "Local SEO that wins the map pack: Google Business Profile optimisation, citation cleanup, review systems and location pages that rank.",
  }),
  f({
    slug: "ecommerce-marketing",
    name: "E-commerce Marketing",
    short: "More revenue per session, not just more sessions.",
    category: "Paid",
    icon: "ShoppingCart",
    outcome:
      "Feed hygiene, shopping campaigns, retention flows and product-page SEO working together on blended ROAS.",
    bullets: ["Shopping & feed optimisation", "Retention flows", "Product page SEO"],
    pains: [
      "ROAS looks fine in-platform but the bank says otherwise.",
      "Your product feed is full of disapprovals.",
      "Repeat purchase rate is flat.",
    ],
    deliverables: [
      { title: "Feed optimisation", text: "Titles, attributes, images and disapproval fixes." },
      { title: "Shopping campaigns", text: "Structured by margin and intent, not one big bucket." },
      { title: "Category & PDP SEO", text: "Pages that rank and merchandise at once." },
      { title: "Cart recovery", text: "Email and WhatsApp abandonment flows." },
      { title: "Retention", text: "Post-purchase, replenishment and win-back sequences." },
      { title: "Profit reporting", text: "Contribution margin, not just ROAS." },
    ],
    steps: [
      { title: "Diagnose", text: "Feed, tracking and margin data reviewed." },
      { title: "Fix", text: "Feed and tracking corrected before spending more." },
      { title: "Acquire", text: "Shopping, Meta and SEO pushed together." },
      { title: "Retain", text: "Lifecycle flows to lift repeat rate." },
    ],
    tools: ["Google Ads", "Meta Business Manager", "GA4", "SEMrush", "Zapier / Make"],
    faqs: [
      { q: "Which platforms do you support?", a: "Shopify, WooCommerce, Magento and custom builds." },
      { q: "Do you handle marketplace ads?", a: "Amazon and Flipkart advertising, yes — at a strategy and structure level." },
      { q: "What's a healthy ROAS?", a: "It depends entirely on margin. I set the target from your unit economics." },
    ],
    seoTitle: "E-commerce Marketing Consultant | Jugal K. Shukla",
    seoDescription:
      "E-commerce growth through feed optimisation, shopping campaigns, product page SEO and retention flows measured on contribution margin.",
  }),
  f({
    slug: "lead-generation",
    name: "Lead Generation & Demand Generation",
    short: "A predictable flow of people worth calling.",
    category: "Paid",
    icon: "Magnet",
    outcome:
      "Offers, capture and follow-up engineered together so sales gets a steady stream of qualified conversations.",
    bullets: ["Offer design", "Landing pages", "Speed-to-lead automation"],
    pains: [
      "Lead volume swings wildly month to month.",
      "Sales complains about lead quality.",
      "Your only offer is 'contact us'.",
    ],
    deliverables: [
      { title: "Offer ladder", text: "Low-friction to high-intent offers by stage." },
      { title: "Landing pages", text: "Built and tested for one action each." },
      { title: "Qualification", text: "Form logic and scoring agreed with sales." },
      { title: "Speed to lead", text: "Instant routing, alerts and first-touch automation." },
      { title: "Channel mix", text: "Paid, organic and outbound feeding one pipeline." },
      { title: "Pipeline reporting", text: "MQL to SQL to closed-won visibility." },
    ],
    steps: [
      { title: "Define", text: "What a good lead is, in writing, with sales." },
      { title: "Build", text: "Offers, pages and routing shipped." },
      { title: "Drive", text: "Traffic switched on across chosen channels." },
      { title: "Tighten", text: "Raise quality bar as volume stabilises." },
    ],
    tools: ["Google Ads", "LinkedIn Campaign Manager", "HubSpot", "GA4", "Zapier / Make"],
    faqs: [
      { q: "Do you guarantee lead numbers?", a: "After one month of data I'll forecast ranges. Guarantees before that are sales talk." },
      { q: "Do you buy lead lists?", a: "Never. Owned demand only." },
      { q: "B2B or B2C?", a: "Both, though the offer design differs sharply." },
    ],
    seoTitle: "Lead Generation & Demand Generation | Jugal K. Shukla",
    seoDescription:
      "Predictable lead generation through offer design, tested landing pages, qualification logic and speed-to-lead automation.",
  }),
  f({
    slug: "personal-branding",
    name: "Personal Branding for Founders",
    short: "Your face is the cheapest distribution you have.",
    category: "Brand & Content",
    icon: "UserRound",
    outcome:
      "A founder brand with a clear point of view, a publishing rhythm you can sustain, and inbound that follows.",
    bullets: ["Narrative and POV", "Content system", "Inbound funnel"],
    pains: [
      "You know you should post but don't know what to say.",
      "Your company page gets less reach than your personal profile.",
      "Every founder in your niche sounds identical.",
    ],
    deliverables: [
      { title: "Positioning", text: "The one idea you want associated with your name." },
      { title: "Story bank", text: "Twenty experiences turned into reusable content angles." },
      { title: "Format system", text: "Which post types suit your time and strengths." },
      { title: "Ghostwriting", text: "Drafts in your voice, approved by you." },
      { title: "Profile assets", text: "Bio, banner, featured section and lead magnet." },
      { title: "Inbound path", text: "From post to profile to call, tracked." },
    ],
    steps: [
      { title: "Interview", text: "Mine your experience for real stories and opinions." },
      { title: "Position", text: "Pick the hill worth standing on." },
      { title: "Publish", text: "Weekly cadence with drafting support." },
      { title: "Convert", text: "Turn attention into booked calls." },
    ],
    tools: ["LinkedIn Campaign Manager", "ChatGPT", "Canva", "Hootsuite", "GA4"],
    faqs: [
      { q: "Will it sound like me?", a: "Yes — every draft comes from your own interviews and gets your final edit." },
      { q: "How much time do I need to give?", a: "About one hour a fortnight for interviews and approvals." },
      { q: "How long before inbound starts?", a: "Typically two to three months of consistent publishing." },
    ],
    seoTitle: "Personal Branding for Founders | Jugal K. Shukla",
    seoDescription:
      "Founder personal branding: a clear point of view, a story bank, ghostwritten drafts in your voice and an inbound path to booked calls.",
  }),
];

export const serviceBySlug = (slug: string) => services.find((s) => s.slug === slug);

export const categories: ServiceCategory[] = ["Organic", "Paid", "Automation & AI", "Brand & Content"];
