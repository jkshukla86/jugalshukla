import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import { ArrowRight, Check } from "lucide-react";
import { CtaBand } from "@/components/CtaBand";
import { FaqList, faqSchema } from "@/components/FaqList";
import { PageHero, PageShell } from "@/components/PageShell";
import { Reveal } from "@/components/Reveal";
import { ServiceIcon } from "@/components/ServiceIcon";
import { serviceBySlug, services } from "@/data/services";

export const Route = createFileRoute("/services/$slug")({
  loader: ({ params }) => {
    const service = serviceBySlug(params.slug);
    if (!service) throw notFound();
    return { service };
  },
  head: ({ loaderData }) => {
    const s = loaderData?.service;
    return {
      meta: s
        ? [
            { title: s.seoTitle },
            { name: "description", content: s.seoDescription },
            { property: "og:title", content: s.seoTitle },
            { property: "og:description", content: s.seoDescription },
            { property: "og:type", content: "website" },
            { name: "twitter:card", content: "summary_large_image" },
          ]
        : [],
    };
  },
  component: ServicePage,
});

function ServicePage() {
  const { service: s } = Route.useLoaderData();
  const related = services.filter((x) => x.slug !== s.slug && x.category === s.category).slice(0, 3);
  const fallback = services.filter((x) => x.slug !== s.slug).slice(0, 3);
  const cross = related.length ? related : fallback;

  return (
    <PageShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            {
              "@context": "https://schema.org",
              "@type": "Service",
              name: s.name,
              description: s.seoDescription,
              serviceType: s.category,
              provider: { "@type": "Person", name: "Jugal K. Shukla" },
              areaServed: "Worldwide",
            },
            faqSchema(s.faqs),
          ]),
        }}
      />

      <PageHero
        eyebrow={s.category}
        title={s.name}
        subtitle={s.outcome}
        crumb={[{ label: "Home", to: "/" }, { label: "Services", to: "/services" }, { label: s.name }]}
      >
        <div className="mt-9 flex flex-wrap gap-4">
          <Link to="/contact" className="grad-cta rounded-full px-8 py-4 text-sm font-semibold">
            Book a Free Call
          </Link>
          <Link
            to="/services/$slug"
            params={{ slug: "website-audit" }}
            className="rounded-full border-[1.5px] border-blue-300/70 px-8 py-4 text-sm font-semibold text-white transition-colors hover:bg-blue-300/15"
          >
            Get a Free Audit
          </Link>
        </div>
        <span className="icon-tile mt-10 bg-white/10 text-blue-300">
          <ServiceIcon name={s.icon} className="h-7 w-7" />
        </span>
      </PageHero>

      <section className="section-y bg-mist">
        <div className="container-page">
          <Reveal className="max-w-2xl">
            <p className="eyebrow">Is this you?</p>
            <h2 className="h2-display mt-4">If any of these sound familiar, we should talk.</h2>
          </Reveal>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {s.pains.map((p, i) => (
              <Reveal key={p} delay={i * 90}>
                <div className="surface-card h-full p-7 text-lg font-medium text-ink">{p}</div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section-y">
        <div className="container-page">
          <Reveal className="max-w-2xl">
            <p className="eyebrow">What I do</p>
            <h2 className="h2-display mt-4">The actual work, not a wish list.</h2>
          </Reveal>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {s.deliverables.map((d, i) => (
              <Reveal key={d.title} delay={(i % 3) * 80}>
                <div className="surface-card h-full p-7">
                  <h3 className="text-lg font-semibold">{d.title}</h3>
                  <p className="mt-3 text-sm text-muted-foreground">{d.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section-y bg-paper">
        <div className="container-page grid gap-14 lg:grid-cols-[0.85fr_1.15fr]">
          <Reveal>
            <p className="eyebrow">My process</p>
            <h2 className="h2-display mt-4">How this engagement runs.</h2>
            <div className="mt-8">
              <p className="eyebrow">Tools I use</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {s.tools.map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-line bg-card px-4 py-2 text-xs font-semibold text-ink"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>
          <ol className="grid gap-6">
            {s.steps.map((step, i) => (
              <Reveal as="li" key={step.title} delay={i * 80}>
                <div className="surface-card flex gap-5 p-6">
                  <span className="grad-cta flex h-11 w-11 shrink-0 items-center justify-center rounded-xl font-bold">
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="text-lg font-semibold">{step.title}</h3>
                    <p className="mt-1.5 text-sm text-muted-foreground">{step.text}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <section className="section-y">
        <div className="container-page grid gap-14 lg:grid-cols-2">
          <Reveal>
            <p className="eyebrow">What you get</p>
            <h2 className="h2-display mt-4">Deliverables and reporting.</h2>
            <ul className="mt-8 space-y-4">
              {s.checklist.map((c) => (
                <li key={c} className="flex gap-3 text-[0.95rem]">
                  <span className="grad-cta mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                    <Check className="h-3.5 w-3.5" />
                  </span>
                  {c}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={120}>
            <p className="eyebrow">Proof</p>
            <h2 className="h2-display mt-4">Results this work has produced.</h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {s.proof.map((p) => (
                <div key={p.label} className="surface-card p-6">
                  <span className="grad-text text-3xl font-extrabold">{p.metric}</span>
                  <p className="mt-2 text-xs text-muted-foreground">{p.label}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section-y bg-mist">
        <div className="container-page grid gap-14 lg:grid-cols-[0.8fr_1.2fr]">
          <Reveal>
            <p className="eyebrow">FAQ</p>
            <h2 className="h2-display mt-4">{s.name} questions.</h2>
          </Reveal>
          <Reveal delay={120}>
            <FaqList items={s.faqs} />
          </Reveal>
        </div>
      </section>

      <section className="section-y">
        <div className="container-page">
          <Reveal className="max-w-2xl">
            <p className="eyebrow">Related services</p>
            <h2 className="h2-display mt-4">Often paired with this.</h2>
          </Reveal>
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {cross.map((r, i) => (
              <Reveal key={r.slug} delay={i * 90}>
                <Link
                  to="/services/$slug"
                  params={{ slug: r.slug }}
                  className="surface-card group flex h-full flex-col p-7"
                >
                  <span className="icon-tile">
                    <ServiceIcon name={r.icon} className="h-7 w-7" />
                  </span>
                  <h3 className="mt-6 text-lg font-semibold">{r.name}</h3>
                  <p className="mt-3 flex-1 text-sm text-muted-foreground">{r.short}</p>
                  <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-blue-700">
                    Explore <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CtaBand title={`Ready to fix ${s.name.toLowerCase()}?`} />
    </PageShell>
  );
}
