import { createFileRoute } from "@tanstack/react-router";
import { CalendarClock, Clock, Instagram, Linkedin, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { ContactForm } from "@/components/ContactForm";
import { FaqList } from "@/components/FaqList";
import { PageHero, PageShell } from "@/components/PageShell";
import { Reveal } from "@/components/Reveal";
import { site } from "@/data/site";

import { BlockRenderer } from "@/components/blocks/BlockRenderer";
import { getPageWithSeo, listPublicPosts } from "@/lib/cms.functions";
import { seoLinks, seoMeta, seoScripts } from "@/lib/cms";
export const Route = createFileRoute("/contact")({
  loader: async () => {
    const [{ page, seo }, dbPosts] = await Promise.all([
      getPageWithSeo({ data: { path: "/contact" } }),
      listPublicPosts(),
    ]);
    return { page, seo, dbPosts };
  },
  head: ({ loaderData }) => ({
    meta: seoMeta(
      {
        title: 'Contact Jugal K. Shukla — Book a Free Strategy Call',
        description: 'Email, WhatsApp or send a brief. I reply within 24 hours and will tell you honestly what I’d fix first in your marketing.',
        ogTitle: 'Contact Jugal K. Shukla',
        ogDescription: 'Book a free 30-minute strategy call. Response within 24 hours.',
        ogType: "website",
      },
      loaderData?.seo,
    ),
    links: seoLinks(loaderData?.seo),
    scripts: seoScripts(loaderData?.seo),
  }),
  component: Contact,
});

const contactFaqs = [
  {
    q: "What happens after I submit the form?",
    a: "I read it myself and reply within 24 hours, usually with two or three specific questions and a suggested time to talk.",
  },
  {
    q: "Is the first call really free?",
    a: "Yes — 30 minutes, no deck, no pitch. If I'm not the right fit I'll say so and point you elsewhere.",
  },
  {
    q: "Do you sign NDAs?",
    a: "Happily, before any account or data access is shared.",
  },
  {
    q: "Which time zones do you work across?",
    a: "I'm on IST but keep regular slots for European and US Eastern hours.",
  },
];

function Contact() {
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
      <PageHero
        eyebrow="Contact"
        title={
          <>
            Tell me what you're trying to <span className="grad-text">grow</span>.
          </>
        }
        subtitle="One honest conversation beats three agency proposals. Reach out however suits you — I reply within 24 hours."
        crumb={[{ label: "Home", to: "/" }, { label: "Contact" }]}
      />

      <section className="section-y">
        <div className="container-page grid gap-14 lg:grid-cols-[0.85fr_1.15fr]">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-line bg-mist px-4 py-2 text-xs font-semibold text-blue-700">
              <span className="h-2 w-2 rounded-full bg-blue-500" /> Currently taking on 2 new clients
            </span>
            <div className="mt-8 grid gap-4">
              {[
                { icon: Mail, label: "Email", value: site.email, href: `mailto:${site.email}` },
                { icon: Phone, label: "Phone", value: site.phone, href: site.phoneHref },
                { icon: MessageCircle, label: "WhatsApp", value: "Message me directly", href: site.whatsapp },
                { icon: MapPin, label: "Location", value: site.location },
                { icon: Clock, label: "Response time", value: "Within 24 hours, Mon–Sat" },
              ].map((c) => (
                <div key={c.label} className="surface-card flex items-start gap-4 p-5">
                  <span className="icon-tile h-11 w-11 rounded-xl">
                    <c.icon className="h-5 w-5" strokeWidth={1.7} />
                  </span>
                  <div className="text-sm">
                    <p className="font-semibold text-ink">{c.label}</p>
                    {c.href ? (
                      <a
                        href={c.href}
                        target={c.href.startsWith("http") ? "_blank" : undefined}
                        rel="noreferrer noopener"
                        className="text-muted-foreground hover:text-blue-700"
                      >
                        {c.value}
                      </a>
                    ) : (
                      <p className="text-muted-foreground">{c.value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 flex gap-3">
              <a
                href={site.linkedin}
                target="_blank"
                rel="noreferrer noopener"
                aria-label="LinkedIn profile"
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-line text-blue-700 hover:border-blue-500"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a
                href={site.instagram}
                target="_blank"
                rel="noreferrer noopener"
                aria-label="Instagram profile"
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-line text-blue-700 hover:border-blue-500"
              >
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div className="surface-card p-7 md:p-9">
              <h2 className="text-2xl font-bold">Send me a brief</h2>
              <p className="mt-2 mb-8 text-sm text-muted-foreground">
                The more context you give, the more useful my first reply will be.
              </p>
              <ContactForm />
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section-y bg-mist">
        <div className="container-page grid gap-12 lg:grid-cols-2">
          <Reveal>
            <p className="eyebrow">Prefer to talk?</p>
            <h2 className="h2-display mt-4">Book a 30-minute free strategy call.</h2>
            <p className="mt-5 text-muted-foreground">
              Pick a slot that works for you. Bring your analytics access if you have it — we'll look at real numbers
              rather than hypotheticals.
            </p>
            <div className="surface-card mt-8 flex items-center gap-4 p-6">
              <span className="icon-tile">
                <CalendarClock className="h-7 w-7" strokeWidth={1.6} />
              </span>
              <div className="text-sm">
                <p className="font-semibold text-ink">Calendar booking</p>
                <p className="text-muted-foreground">
                  Connect your Calendly or Google Calendar link here to embed live availability.
                </p>
              </div>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <p className="eyebrow">Good to know</p>
            <h2 className="h2-display mt-4">Quick answers.</h2>
            <div className="mt-6">
              <FaqList items={contactFaqs} />
            </div>
          </Reveal>
        </div>
      </section>
    </PageShell>
  );
}
