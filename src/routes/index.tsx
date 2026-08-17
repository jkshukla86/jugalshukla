import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowRight, BrainCircuit, CheckCircle2, Eye, LineChart, Quote, Star } from "lucide-react";
import portrait from "@/assets/jugal-portrait.jpeg.asset.json";
import { Counter } from "@/components/Counter";
import { CtaBand } from "@/components/CtaBand";
import { FaqList, faqSchema } from "@/components/FaqList";
import { HeroSlider } from "@/components/HeroSlider";
import { PageShell } from "@/components/PageShell";
import { Reveal } from "@/components/Reveal";
import { ServiceIcon } from "@/components/ServiceIcon";
import { TrustMarquee } from "@/components/TrustMarquee";
import { posts } from "@/data/posts";
import { services } from "@/data/services";
import { credentials, faqs, miniCases, process, site, stats, testimonials } from "@/data/site";

import { BlockRenderer } from "@/components/blocks/BlockRenderer";
import { getPageWithSeo, listPublicPosts } from "@/lib/cms.functions";
import { seoLinks, seoMeta, seoScripts } from "@/lib/cms";
export const Route = createFileRoute("/")({
  loader: async () => {
    const [{ page, seo }, dbPosts] = await Promise.all([
      getPageWithSeo({ data: { path: "/" } }),
      listPublicPosts(),
    ]);
    return { page, seo, dbPosts };
  },
  head: ({ loaderData }) => ({
    meta: seoMeta(
      {
        title: 'Jugal K. Shukla — Digital Marketing, Automation & Growth',
        description: 'I build growth engines, not just campaigns. 10+ years of SEO, paid media and AI-powered automation turned into qualified pipeline. Kanpur, India — working globally.',
        ogTitle: 'Jugal K. Shukla — Digital Marketing, Automation & Growth',
        ogDescription: 'SEO, paid media and AI-powered automation engineered around one number: qualified pipeline.',
        ogType: "website",
      },
      loaderData?.seo,
    ),
    links: seoLinks(loaderData?.seo),
    scripts: seoScripts(loaderData?.seo),
  }),
  component: Home,
});

const pillars = [
  {
    icon: LineChart,
    title: "Data-Driven Decisions",
    text: "Tracking gets fixed before budgets grow. Every decision points back to a number in GA4 or your CRM.",
  },
  {
    icon: BrainCircuit,
    title: "AI + Automation First",
    text: "Research, briefs, competitor tracking and reporting run through AI workflows — roughly half the production time.",
  },
  {
    icon: CheckCircle2,
    title: "Full-Funnel Ownership",
    text: "From first impression to closed deal. No throwing leads over the wall and calling it done.",
  },
  {
    icon: Eye,
    title: "Transparent Reporting",
    text: "A live dashboard and a monthly note in plain English. What worked, what didn't, what's next.",
  },
];

function Home() {
  const { page, dbPosts } = Route.useLoaderData();
  if (page && page.blocks.length > 0) {
    return (
      <PageShell>
        <BlockRenderer blocks={page.blocks} posts={dbPosts} />
      </PageShell>
    );
  }

  return (
    <PageShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            {
              "@context": "https://schema.org",
              "@type": "Person",
              name: site.name,
              jobTitle: site.role,
              email: site.email,
              telephone: site.phone,
              address: { "@type": "PostalAddress", addressLocality: "Kanpur", addressRegion: "Uttar Pradesh", addressCountry: "IN" },
              sameAs: [site.linkedin, site.instagram],
            },
            {
              "@context": "https://schema.org",
              "@type": "ProfessionalService",
              name: "Jugal K. Shukla — Digital Marketing Consulting",
              areaServed: "Worldwide",
              sameAs: [site.linkedin, site.instagram],
            },
            faqSchema(faqs),
          ]),
        }}
      />

      {/* Hero */}
      <section className="relative isolate flex min-h-[78vh] items-center overflow-hidden pt-32 pb-24 md:min-h-[90vh] md:pt-40">
        <HeroSlider />
        <div className="container-page relative z-10 grid items-center gap-14 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="text-xs font-semibold tracking-[0.16em] text-blue-300 uppercase">
              Digital Marketing · Automation · Growth
            </p>
            <h1 className="h1-display mt-5 text-white">
              I Build <span className="grad-text">Growth Engines</span>, Not Just Campaigns.
            </h1>
            <p className="mt-6 max-w-xl text-lg text-white/75">
              10+ years turning SEO, paid media and AI-powered automation into qualified leads, lower CPA and revenue
              you can measure. Certified by IIT Roorkee & Purdue University.
            </p>
            <div className="mt-9 flex flex-wrap gap-4">
              <Link
                to="/contact"
                className="grad-cta rounded-full px-8 py-4 text-sm font-semibold transition-transform duration-300 hover:-translate-y-0.5"
              >
                Book a Free Strategy Call
              </Link>
              <Link
                to="/services/$slug"
                params={{ slug: "website-audit" }}
                className="rounded-full border-[1.5px] border-blue-300/70 px-8 py-4 text-sm font-semibold text-white transition-colors hover:bg-blue-300/15"
              >
                Get a Free Website Audit
              </Link>
            </div>
            <p className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-white/65">
              <Star className="h-4 w-4 fill-cyan-400 text-cyan-400" />
              10+ Years <span aria-hidden="true">·</span> 200+ Campaigns <span aria-hidden="true">·</span> 15+
              Certifications
            </p>
          </div>

          <div className="relative mx-auto hidden w-full max-w-sm lg:block">
            <div
              className="absolute inset-0 -m-10 rounded-full blur-3xl"
              style={{
                background:
                  "radial-gradient(circle at 50% 45%, oklch(0.58 0.2 264 / 0.75), oklch(0.78 0.13 220 / 0.25) 55%, transparent 72%)",
              }}
              aria-hidden="true"
            />
            <img
              src={portrait.url}
              alt="Jugal K. Shukla, digital marketing and growth expert"
              width={640}
              height={800}
              className="relative rounded-[32px] border border-white/15 object-cover shadow-[0_30px_80px_oklch(0.16_0.03_264/0.55)]"
            />
            {[
              { label: "+60% Traffic", cls: "-left-8 top-12" },
              { label: "−38% CPA", cls: "-right-6 top-1/2" },
              { label: "2× Organic Growth", cls: "-left-4 bottom-10" },
            ].map((chip, i) => (
              <span
                key={chip.label}
                style={{ animationDelay: `${i * 0.8}s` }}
                className={`float-chip absolute ${chip.cls} rounded-full border border-white/25 bg-white/12 px-4 py-2 text-xs font-semibold text-white backdrop-blur-md`}
              >
                {chip.label}
              </span>
            ))}
          </div>
        </div>
      </section>

      <TrustMarquee />

      {/* Problem */}
      <section className="section-y bg-mist">
        <div className="container-page">
          <Reveal className="max-w-2xl">
            <p className="eyebrow">Sound familiar?</p>
            <h2 className="h2-display mt-4">Most marketing fails for three boring reasons.</h2>
          </Reveal>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              { t: "Traffic that doesn't convert.", d: "Visitors arrive, wander, leave. Nobody knows which page loses them." },
              { t: "Ad spend with no clear ROI.", d: "Platform dashboards look healthy while the bank account disagrees." },
              { t: "Marketing that eats your time.", d: "You're the strategist, the copywriter and the reporting analyst." },
            ].map((p, i) => (
              <Reveal key={p.t} delay={i * 100}>
                <div className="surface-card h-full p-7">
                  <h3 className="text-xl font-semibold">{p.t}</h3>
                  <p className="mt-3 text-sm text-muted-foreground">{p.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={200}>
            <p className="mt-12 max-w-3xl text-xl font-medium text-ink md:text-2xl">
              My answer is one line:{" "}
              <span className="grad-text font-bold">marketing that compounds</span> — SEO, paid media and automation
              engineered around qualified pipeline.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Services */}
      <section className="section-y">
        <div className="container-page">
          <Reveal className="max-w-2xl">
            <p className="eyebrow">What I do</p>
            <h2 className="h2-display mt-4">Pick the lever. I'll own it end to end.</h2>
          </Reveal>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.slice(0, 6).map((s, i) => (
              <Reveal key={s.slug} delay={(i % 3) * 90}>
                <Link
                  to="/services/$slug"
                  params={{ slug: s.slug }}
                  className="surface-card group flex h-full flex-col p-7"
                >
                  <span className="icon-tile">
                    <ServiceIcon name={s.icon} className="h-7 w-7" />
                  </span>
                  <h3 className="mt-6 text-lg font-semibold">{s.name}</h3>
                  <p className="mt-3 flex-1 text-sm text-muted-foreground">{s.short}</p>
                  <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-blue-700">
                    Learn more
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
          <div className="mt-12">
            <Link
              to="/services"
              className="inline-flex rounded-full border-[1.5px] border-blue-500 px-8 py-4 text-sm font-semibold text-blue-700 transition-colors hover:bg-mist"
            >
              View all {services.length} services
            </Link>
          </div>
        </div>
      </section>

      {/* Why me */}
      <section className="section-y bg-paper">
        <div className="container-page grid gap-14 lg:grid-cols-[0.85fr_1.15fr]">
          <Reveal>
            <p className="eyebrow">Why work with me</p>
            <h2 className="h2-display mt-4">An expert, not an account manager.</h2>
            <p className="mt-5 text-muted-foreground">
              I'm not here to throw jargon at you. I'm here to make marketing work — strategically, honestly, and with
              the right mix of human creativity and AI speed.
            </p>
            <Link to="/about" className="mt-7 inline-flex text-sm font-semibold text-blue-700 hover:underline">
              More about how I work →
            </Link>
          </Reveal>
          <div className="grid gap-6 sm:grid-cols-2">
            {pillars.map((p, i) => (
              <Reveal key={p.title} delay={i * 90}>
                <div className="surface-card h-full p-7">
                  <span className="icon-tile">
                    <p.icon className="h-7 w-7" strokeWidth={1.6} />
                  </span>
                  <h3 className="mt-6 text-lg font-semibold">{p.title}</h3>
                  <p className="mt-3 text-sm text-muted-foreground">{p.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="grad-dark section-y relative overflow-hidden">
        <div className="dot-grid absolute inset-0 opacity-[0.1]" aria-hidden="true" />
        <div className="container-page relative">
          <Reveal className="max-w-2xl">
            <p className="text-sm font-semibold tracking-[0.14em] text-blue-300 uppercase">Proof, not promises</p>
            <h2 className="h2-display mt-4 text-white">Numbers from real engagements.</h2>
          </Reveal>
          <div className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((s, i) => (
              <Reveal key={s.label} delay={i * 90}>
                <Counter value={s.value} suffix={s.suffix} />
                <p className="mt-2 text-sm text-white/65">{s.label}</p>
              </Reveal>
            ))}
          </div>
          <div className="mt-16 grid gap-6 lg:grid-cols-3">
            {miniCases.map((c, i) => (
              <Reveal key={c.result} delay={i * 100}>
                <div className="h-full rounded-3xl border border-white/12 bg-white/[0.04] p-7">
                  <p className="text-xs font-semibold tracking-[0.14em] text-blue-300 uppercase">Challenge</p>
                  <p className="mt-2 text-sm text-white/75">{c.challenge}</p>
                  <p className="mt-5 text-xs font-semibold tracking-[0.14em] text-blue-300 uppercase">What I did</p>
                  <p className="mt-2 text-sm text-white/75">{c.action}</p>
                  <p className="mt-5 text-lg font-semibold text-white">{c.result}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="section-y">
        <div className="container-page">
          <Reveal className="max-w-2xl">
            <p className="eyebrow">My process</p>
            <h2 className="h2-display mt-4">Five steps, same every time.</h2>
          </Reveal>
          <div className="relative mt-14">
            <div
              className="absolute top-7 right-0 left-0 hidden h-[2px] lg:block"
              style={{ background: "var(--grad-cta)" }}
              aria-hidden="true"
            />
            <ol className="grid gap-8 lg:grid-cols-5">
              {process.map((p, i) => (
                <Reveal as="li" key={p.step} delay={i * 90}>
                  <span className="grad-cta relative flex h-14 w-14 items-center justify-center rounded-2xl text-lg font-bold">
                    {i + 1}
                  </span>
                  <h3 className="mt-5 text-lg font-semibold">{p.step}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{p.text}</p>
                </Reveal>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* About teaser */}
      <section className="section-y bg-mist">
        <div className="container-page grid items-center gap-14 lg:grid-cols-[0.8fr_1.2fr]">
          <Reveal>
            <img
              src={portrait.url}
              alt="Portrait of Jugal K. Shukla"
              width={640}
              height={800}
              loading="lazy"
              className="w-full rounded-[28px] object-cover shadow-[0_24px_60px_oklch(0.28_0.13_262/0.22)]"
            />
          </Reveal>
          <Reveal delay={120}>
            <p className="eyebrow">About me</p>
            <h2 className="h2-display mt-4">Hi, I'm Jugal.</h2>
            <p className="mt-5 text-muted-foreground">
              I've spent over a decade running full-funnel campaigns — technical SEO, Google and Meta ads, GA4, CRO and
              marketing automation. Today I build AI into every one of those workflows.
            </p>
            <p className="mt-4 text-muted-foreground">
              I work as an independent consultant, which means you get the person doing the work, not a junior behind a
              logo.
            </p>
            <div className="mt-7 flex flex-wrap gap-2">
              {credentials.slice(0, 6).map((c) => (
                <span
                  key={c.title}
                  className="rounded-full border border-line bg-card px-4 py-2 text-xs font-semibold text-ink"
                >
                  {c.title}
                </span>
              ))}
            </div>
            <Link to="/about" className="mt-8 inline-flex text-sm font-semibold text-blue-700 hover:underline">
              More about me →
            </Link>
          </Reveal>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section-y">
        <div className="container-page">
          <Reveal className="max-w-2xl">
            <p className="eyebrow">In their words</p>
            <h2 className="h2-display mt-4">What clients say.</h2>
          </Reveal>
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {testimonials.map((t, i) => (
              <Reveal key={i} delay={i * 100}>
                <figure className="surface-card h-full p-7">
                  <Quote className="h-8 w-8 text-blue-300" />
                  <blockquote className="mt-5 text-sm leading-relaxed text-muted-foreground">{t.quote}</blockquote>
                  <figcaption className="mt-6 border-t border-line pt-5 text-sm">
                    <span className="block font-semibold text-ink">{t.name}</span>
                    <span className="text-muted-foreground">
                      {t.role}
                      {t.company ? `, ${t.company}` : ""}
                    </span>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Blog */}
      <section className="section-y bg-paper">
        <div className="container-page">
          <Reveal className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="eyebrow">Notes & playbooks</p>
              <h2 className="h2-display mt-4">Latest from the blog.</h2>
            </div>
            <Link to="/blog" className="text-sm font-semibold text-blue-700 hover:underline">
              All articles →
            </Link>
          </Reveal>
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {posts.slice(0, 3).map((p, i) => (
              <Reveal key={p.slug} delay={i * 100}>
                <Link
                  to="/blog/$slug"
                  params={{ slug: p.slug }}
                  className="surface-card flex h-full flex-col p-7"
                >
                  <span className="w-fit rounded-full bg-mist px-3 py-1 text-xs font-semibold text-blue-700">
                    {p.category}
                  </span>
                  <h3 className="mt-5 text-lg font-semibold">{p.title}</h3>
                  <p className="mt-3 flex-1 text-sm text-muted-foreground">{p.excerpt}</p>
                  <span className="mt-6 text-xs text-muted-foreground">
                    {new Date(p.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })} ·{" "}
                    {p.readTime}
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-y">
        <div className="container-page grid gap-14 lg:grid-cols-[0.8fr_1.2fr]">
          <Reveal>
            <p className="eyebrow">FAQ</p>
            <h2 className="h2-display mt-4">Straight answers.</h2>
          </Reveal>
          <Reveal delay={120}>
            <FaqList items={faqs} />
          </Reveal>
        </div>
      </section>

      <CtaBand />
    </PageShell>
  );
}
