import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowRight, Check } from "lucide-react";
import { useState } from "react";
import { CtaBand } from "@/components/CtaBand";
import { FaqList } from "@/components/FaqList";
import { PageHero, PageShell } from "@/components/PageShell";
import { Reveal } from "@/components/Reveal";
import { ServiceIcon } from "@/components/ServiceIcon";
import { categories, services, type ServiceCategory } from "@/data/services";
import { faqs, process } from "@/data/site";
import { cn } from "@/lib/utils";
import { getSeo } from "@/lib/cms.functions";
import { seoLinks, seoMeta } from "@/lib/cms";

export const Route = createFileRoute("/services/")({
  loader: () => getSeo({ data: { path: "/services" } }).then((seo) => ({ seo })),
  head: ({ loaderData }) => ({
    meta: seoMeta(
      {
        title: "Digital Marketing Services | Jugal K. Shukla",
        description:
          "SEO, Google and Meta ads, CRO, analytics, marketing automation and AI workflows — 21 services built around one metric: qualified pipeline.",
        ogDescription: "Services built around one metric — qualified pipeline. Audit, retainer or project sprint.",
      },
      loaderData?.seo,
    ),
    links: seoLinks(loaderData?.seo),
  }),
  component: ServicesHub,
});

const tiers = [
  {
    name: "Audit & Roadmap",
    kind: "One-time",
    items: [
      "Full technical, funnel and tracking audit",
      "Prioritised fix list with effort estimates",
      "12-month growth roadmap",
      "Walkthrough call and Q&A",
    ],
  },
  {
    name: "Monthly Retainer",
    kind: "Ongoing",
    items: [
      "I own the channels end to end",
      "Weekly optimisation and testing",
      "Live dashboard + monthly written review",
      "Direct access — no account managers",
    ],
  },
  {
    name: "Project / Sprint",
    kind: "Fixed scope",
    items: [
      "One outcome, one timeline",
      "GA4 build, paid launch, site migration",
      "Documented handover to your team",
      "Optional 30-day support window",
    ],
  },
];

function ServicesHub() {
  const [filter, setFilter] = useState<ServiceCategory | "All">("All");
  const list = filter === "All" ? services : services.filter((s) => s.category === filter);

  return (
    <PageShell>
      <PageHero
        eyebrow="Services"
        title={
          <>
            Services built around one metric — <span className="grad-text">qualified pipeline</span>.
          </>
        }
        subtitle="Twenty-one ways to grow, but never all at once. We pick the two or three that fit your funnel, budget and timeline."
        crumb={[{ label: "Home", to: "/" }, { label: "Services" }]}
      />

      <section className="section-y">
        <div className="container-page">
          <div className="flex flex-wrap gap-3">
            {(["All", ...categories] as const).map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setFilter(c)}
                aria-pressed={filter === c}
                className={cn(
                  "rounded-full border px-5 py-2.5 text-sm font-semibold transition-colors",
                  filter === c
                    ? "grad-cta border-transparent"
                    : "border-line bg-card text-ink hover:border-blue-500 hover:text-blue-700",
                )}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((s, i) => (
              <Reveal key={s.slug} delay={(i % 3) * 80}>
                <Link
                  to="/services/$slug"
                  params={{ slug: s.slug }}
                  className="surface-card group flex h-full flex-col p-7"
                >
                  <span className="icon-tile">
                    <ServiceIcon name={s.icon} className="h-7 w-7" />
                  </span>
                  <h2 className="mt-6 text-lg font-semibold">{s.name}</h2>
                  <p className="mt-3 text-sm text-muted-foreground">{s.short}</p>
                  <ul className="mt-5 flex-1 space-y-2 text-sm text-muted-foreground">
                    {s.bullets.map((b) => (
                      <li key={b} className="flex gap-2">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-blue-500" />
                        {b}
                      </li>
                    ))}
                  </ul>
                  <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-blue-700">
                    Explore
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section-y bg-mist">
        <div className="container-page">
          <Reveal className="max-w-2xl">
            <p className="eyebrow">How engagements work</p>
            <h2 className="h2-display mt-4">Three ways to work together.</h2>
          </Reveal>
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {tiers.map((t, i) => (
              <Reveal key={t.name} delay={i * 90}>
                <div className="surface-card flex h-full flex-col p-8">
                  <span className="text-xs font-semibold tracking-[0.14em] text-blue-700 uppercase">{t.kind}</span>
                  <h3 className="mt-3 text-xl font-semibold">{t.name}</h3>
                  <ul className="mt-6 flex-1 space-y-3 text-sm text-muted-foreground">
                    {t.items.map((item) => (
                      <li key={item} className="flex gap-2">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-blue-500" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <Link
                    to="/contact"
                    className="mt-8 inline-flex justify-center rounded-full border-[1.5px] border-blue-500 px-6 py-3 text-sm font-semibold text-blue-700 transition-colors hover:bg-mist"
                  >
                    Request a quote
                  </Link>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section-y">
        <div className="container-page">
          <Reveal className="max-w-2xl">
            <p className="eyebrow">Process</p>
            <h2 className="h2-display mt-4">Audit → Strategy → Build → Optimise → Scale.</h2>
          </Reveal>
          <ol className="mt-12 grid gap-8 lg:grid-cols-5">
            {process.map((p, i) => (
              <Reveal as="li" key={p.step} delay={i * 80}>
                <span className="grad-cta flex h-12 w-12 items-center justify-center rounded-2xl font-bold">
                  {i + 1}
                </span>
                <h3 className="mt-4 text-lg font-semibold">{p.step}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{p.text}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <section className="section-y bg-paper">
        <div className="container-page grid gap-14 lg:grid-cols-[0.8fr_1.2fr]">
          <Reveal>
            <p className="eyebrow">FAQ</p>
            <h2 className="h2-display mt-4">Before you enquire.</h2>
          </Reveal>
          <Reveal delay={120}>
            <FaqList items={faqs} />
          </Reveal>
        </div>
      </section>

      <CtaBand title="Not sure which service you need?" text="Describe the problem. I'll tell you which lever I'd pull first — even if it isn't one you were considering." />
    </PageShell>
  );
}
