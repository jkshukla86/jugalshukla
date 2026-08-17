import { Link, createFileRoute } from "@tanstack/react-router";
import { Download } from "lucide-react";
import portrait from "@/assets/jugal-portrait.jpeg.asset.json";
import { CtaBand } from "@/components/CtaBand";
import { PageHero, PageShell } from "@/components/PageShell";
import { Reveal } from "@/components/Reveal";
import { credentials } from "@/data/site";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Jugal K. Shukla — Marketing & Automation Expert" },
      {
        name: "description",
        content:
          "How I work: full-funnel marketing built on data, AI-powered automation and jargon-free reporting. 10+ years, certified by IIT Roorkee and Purdue University.",
      },
      { property: "og:title", content: "About Jugal K. Shukla" },
      {
        property: "og:description",
        content: "An independent growth expert who builds AI and automation into every marketing workflow.",
      },
      { property: "og:type", content: "profile" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: About,
});

const skills = [
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
];

function About() {
  return (
    <PageShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "AboutPage",
            name: "About Jugal K. Shukla",
          }),
        }}
      />
      <PageHero
        eyebrow="About"
        title="About Jugal K. Shukla"
        subtitle="I build growth engines for founders and marketing heads who are tired of dashboards that look busy and pipelines that stay flat."
        crumb={[{ label: "Home", to: "/" }, { label: "About" }]}
      />

      <section className="section-y">
        <div className="container-page grid gap-14 lg:grid-cols-[0.8fr_1.2fr]">
          <Reveal>
            <img
              src={portrait.url}
              alt="Jugal K. Shukla, digital marketing and automation consultant"
              width={640}
              height={800}
              className="w-full rounded-[28px] object-cover shadow-[0_24px_60px_oklch(0.28_0.13_262/0.2)]"
            />
          </Reveal>
          <Reveal delay={120}>
            <p className="eyebrow">My story</p>
            <h2 className="h2-display mt-4">Marketing became interesting when it became measurable.</h2>
            <div className="mt-6 space-y-5 text-muted-foreground">
              <p>
                I got into digital marketing because it was the only kind of marketing where you could prove what
                worked. Ten years and 200+ campaigns later, that's still the part I care about: the line between effort
                and outcome.
              </p>
              <p>
                Somewhere along the way the work stopped being about channels and started being about systems. I began
                building AI and automation into SEO audits, competitor research, content production, campaign reporting
                and lead nurturing — not as a gimmick, but because it removed the grunt work and left more room for
                judgement.
              </p>
              <p>
                I'm not here to throw jargon at you. I'm here to make marketing work — strategically, honestly, and with
                the right mix of human creativity and AI speed. If something isn't working, you'll hear it from me
                first.
              </p>
              <p>
                I work best with founders and marketing heads who want a partner rather than a vendor: startups, SaaS,
                D2C and e-commerce brands, education businesses and local service companies — in India and remotely
                across the world.
              </p>
            </div>
            <div className="mt-10 rounded-3xl border border-line bg-paper p-7">
              <p className="text-2xl font-bold text-ink italic">Jugal K. Shukla</p>
              <p className="mt-1 text-sm font-semibold tracking-[0.12em] text-blue-700 uppercase">
                Digital Marketing, Automation & Growth Expert
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section-y bg-mist">
        <div className="container-page">
          <Reveal className="max-w-2xl">
            <p className="eyebrow">What I do best</p>
            <h2 className="h2-display mt-4">The full stack of demand.</h2>
          </Reveal>
          <div className="mt-10 flex flex-wrap gap-3">
            {skills.map((s, i) => (
              <Reveal key={s} delay={i * 40}>
                <span className="rounded-full border border-line bg-card px-5 py-2.5 text-sm font-semibold text-ink">
                  {s}
                </span>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section-y">
        <div className="container-page">
          <Reveal className="max-w-2xl">
            <p className="eyebrow">Credentials & education</p>
            <h2 className="h2-display mt-4">Trained where the standards are high.</h2>
          </Reveal>
          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {credentials.map((c, i) => (
              <Reveal key={c.title} delay={(i % 2) * 90}>
                <div className="surface-card h-full p-7">
                  <h3 className="text-lg font-semibold">{c.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{c.detail}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section-y bg-paper">
        <div className="container-page grid gap-12 lg:grid-cols-2">
          <Reveal>
            <p className="eyebrow">Beyond the work</p>
            <h2 className="h2-display mt-4">Kanpur-based, globally curious.</h2>
            <p className="mt-5 text-muted-foreground">
              Outside client work I test AI tools obsessively, mentor early-career marketers, and speak at webinars on
              SEO and AI-assisted content. I read more about behavioural economics than about marketing.
            </p>
            <ul className="mt-7 space-y-2 text-sm text-muted-foreground">
              <li>· Purdue University Alumni network</li>
              <li>· AICTSD member</li>
              <li>· Webinars and workshops on SEO, GA4 and AI workflows</li>
            </ul>
          </Reveal>
          <Reveal delay={120}>
            <div className="surface-card p-8">
              <h3 className="text-xl font-semibold">Want the short version?</h3>
              <p className="mt-3 text-sm text-muted-foreground">
                Download my one-page profile, or just book a call and ask me directly.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <a
                  href="#"
                  className="inline-flex items-center gap-2 rounded-full border-[1.5px] border-blue-500 px-6 py-3 text-sm font-semibold text-blue-700 transition-colors hover:bg-mist"
                >
                  <Download className="h-4 w-4" /> Download my profile (PDF)
                </a>
                <Link to="/contact" className="grad-cta rounded-full px-6 py-3 text-sm font-semibold">
                  Book a free call
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <CtaBand title="Let's talk about your pipeline." />
    </PageShell>
  );
}
