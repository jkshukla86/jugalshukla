import { Link } from "@tanstack/react-router";
import { ArrowRight, Quote, Star } from "lucide-react";
import { Counter } from "@/components/Counter";
import { CtaBand } from "@/components/CtaBand";
import { ContactForm } from "@/components/ContactForm";
import { FaqList } from "@/components/FaqList";
import { HeroSlider } from "@/components/HeroSlider";
import { Reveal } from "@/components/Reveal";
import { ServiceIcon } from "@/components/ServiceIcon";
import { services } from "@/data/services";
import { site } from "@/data/site";
import { bool, list, num, str, type Block, type BlockData } from "@/lib/blocks";
import type { PostRecord } from "@/lib/cms";
import { formatDate } from "@/lib/cms";
import { cn } from "@/lib/utils";

const bgClass = (data: BlockData) => {
  switch (str(data, "bg", "white")) {
    case "mist":
      return "bg-mist";
    case "paper":
      return "bg-paper";
    case "dark":
      return "grad-dark text-white";
    default:
      return "";
  }
};

function SectionHead({ data, light = false }: { data: BlockData; light?: boolean }) {
  const eyebrow = str(data, "eyebrow");
  const heading = str(data, "heading");
  if (!eyebrow && !heading) return null;
  return (
    <Reveal className="max-w-2xl">
      {eyebrow && <p className={cn("eyebrow", light && "text-blue-300")}>{eyebrow}</p>}
      {heading && <h2 className={cn("h2-display mt-4", light && "text-white")}>{heading}</h2>}
    </Reveal>
  );
}

function Hero({ data }: { data: BlockData }) {
  const image = str(data, "image");
  return (
    <section className="grad-dark relative isolate flex min-h-[70vh] items-center overflow-hidden pt-32 pb-24 md:min-h-[84vh] md:pt-40">
      {bool(data, "slider", true) ? (
        <HeroSlider />
      ) : (
        <div className="dot-grid absolute inset-0 z-0 opacity-[0.12]" aria-hidden="true" />
      )}
      <div className="container-page relative z-10 grid items-center gap-14 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          {str(data, "eyebrow") && (
            <p className="text-xs font-semibold tracking-[0.16em] text-blue-300 uppercase">{str(data, "eyebrow")}</p>
          )}
          <h1 className="h1-display mt-5 text-white">
            {str(data, "heading")}{" "}
            {str(data, "highlight") && <span className="grad-text">{str(data, "highlight")}</span>}
          </h1>
          {str(data, "body") && <p className="mt-6 max-w-xl text-lg text-white/75">{str(data, "body")}</p>}
          <div className="mt-9 flex flex-wrap gap-4">
            {str(data, "primaryLabel") && (
              <a
                href={str(data, "primaryTo", "/contact")}
                className="grad-cta rounded-full px-8 py-4 text-sm font-semibold transition-transform duration-300 hover:-translate-y-0.5"
              >
                {str(data, "primaryLabel")}
              </a>
            )}
            {str(data, "secondaryLabel") && (
              <a
                href={str(data, "secondaryTo", "/services")}
                className="rounded-full border-[1.5px] border-blue-300/70 px-8 py-4 text-sm font-semibold text-white transition-colors hover:bg-blue-300/15"
              >
                {str(data, "secondaryLabel")}
              </a>
            )}
          </div>
          {str(data, "note") && (
            <p className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-white/65">
              <Star className="h-4 w-4 fill-cyan-400 text-cyan-400" />
              {str(data, "note")}
            </p>
          )}
        </div>
        {image && (
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
              src={image}
              alt={str(data, "heading")}
              className="relative rounded-[32px] border border-white/15 object-cover shadow-[0_30px_80px_oklch(0.16_0.03_264/0.55)]"
            />
          </div>
        )}
      </div>
    </section>
  );
}

function PageHeroBlock({ data }: { data: BlockData }) {
  return (
    <section className="grad-dark relative overflow-hidden pt-[136px] pb-16 md:pt-[168px] md:pb-24">
      <div className="dot-grid absolute inset-0 opacity-[0.12]" aria-hidden="true" />
      <div className="container-page relative">
        {str(data, "eyebrow") && <p className="eyebrow text-blue-300">{str(data, "eyebrow")}</p>}
        <h1 className="h1-display mt-4 max-w-4xl text-white">{str(data, "heading")}</h1>
        {str(data, "body") && <p className="mt-6 max-w-2xl text-lg text-white/70">{str(data, "body")}</p>}
      </div>
    </section>
  );
}

function RichText({ data }: { data: BlockData }) {
  return (
    <section className={cn("section-y", bgClass(data))}>
      <div className="container-page">
        <SectionHead data={data} light={str(data, "bg") === "dark"} />
        <div className="mt-6 max-w-3xl space-y-5 text-muted-foreground">
          {list<string>(data, "paragraphs").map((p, i) => (
            <Reveal key={i} delay={i * 60}>
              <p className={str(data, "bg") === "dark" ? "text-white/75" : undefined}>{p}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Cards({ data }: { data: BlockData }) {
  const cols = str(data, "columns", "3");
  const grid = cols === "2" ? "md:grid-cols-2" : cols === "4" ? "md:grid-cols-2 lg:grid-cols-4" : "md:grid-cols-3";
  return (
    <section className={cn("section-y", bgClass(data))}>
      <div className="container-page">
        <SectionHead data={data} />
        <div className={cn("mt-12 grid gap-6", grid)}>
          {list<{ title: string; text: string }>(data, "items").map((c, i) => (
            <Reveal key={`${c.title}-${i}`} delay={(i % 3) * 90}>
              <div className="surface-card h-full p-7">
                <h3 className="text-xl font-semibold">{c.title}</h3>
                <p className="mt-3 text-sm text-muted-foreground">{c.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
        {str(data, "footnote") && (
          <Reveal delay={200}>
            <p className="mt-12 max-w-3xl text-xl font-medium text-ink md:text-2xl">{str(data, "footnote")}</p>
          </Reveal>
        )}
      </div>
    </section>
  );
}

function ImageText({ data }: { data: BlockData }) {
  const image = str(data, "image");
  const right = str(data, "imageSide", "left") === "right";
  return (
    <section className={cn("section-y", bgClass(data))}>
      <div className="container-page grid items-start gap-14 lg:grid-cols-2">
        {image && (
          <Reveal className={right ? "lg:order-2" : ""}>
            <img
              src={image}
              alt={str(data, "heading")}
              className="w-full rounded-[28px] object-cover shadow-[0_24px_60px_oklch(0.28_0.13_262/0.2)]"
            />
          </Reveal>
        )}
        <Reveal delay={120}>
          {str(data, "eyebrow") && <p className="eyebrow">{str(data, "eyebrow")}</p>}
          <h2 className="h2-display mt-4">{str(data, "heading")}</h2>
          <div className="mt-6 space-y-5 text-muted-foreground">
            {list<string>(data, "paragraphs").map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
          {str(data, "ctaLabel") && (
            <a
              href={str(data, "ctaTo", "/contact")}
              className="grad-cta mt-8 inline-flex rounded-full px-7 py-3.5 text-sm font-semibold"
            >
              {str(data, "ctaLabel")}
            </a>
          )}
        </Reveal>
      </div>
    </section>
  );
}

function Pills({ data }: { data: BlockData }) {
  return (
    <section className={cn("section-y", bgClass(data))}>
      <div className="container-page">
        <SectionHead data={data} />
        <div className="mt-10 flex flex-wrap gap-3">
          {list<string>(data, "items").map((s, i) => (
            <Reveal key={`${s}-${i}`} delay={i * 40}>
              <span className="rounded-full border border-line bg-card px-5 py-2.5 text-sm font-semibold text-ink">
                {s}
              </span>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Stats({ data }: { data: BlockData }) {
  const cases = list<{ challenge: string; action: string; result: string }>(data, "cases");
  return (
    <section className="grad-dark section-y relative overflow-hidden">
      <div className="dot-grid absolute inset-0 opacity-[0.12]" aria-hidden="true" />
      <div className="container-page relative">
        <SectionHead data={data} light />
        <div className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {list<{ value: number; suffix: string; label: string }>(data, "items").map((s, i) => (
            <Reveal key={`${s.label}-${i}`} delay={i * 90}>
              <Counter value={Number(s.value) || 0} suffix={s.suffix ?? ""} />
              <p className="mt-3 text-sm text-white/70">{s.label}</p>
            </Reveal>
          ))}
        </div>
        {cases.length > 0 && (
          <div className="mt-16 grid gap-6 md:grid-cols-3">
            {cases.map((c, i) => (
              <Reveal key={i} delay={i * 100}>
                <div className="h-full rounded-3xl border border-white/12 bg-white/[0.06] p-7 backdrop-blur-sm">
                  <p className="text-sm text-white/60">Challenge</p>
                  <p className="mt-1 font-medium text-white">{c.challenge}</p>
                  <p className="mt-5 text-sm text-white/60">What I did</p>
                  <p className="mt-1 text-sm text-white/80">{c.action}</p>
                  <p className="grad-text mt-5 text-lg font-bold">{c.result}</p>
                </div>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function Steps({ data }: { data: BlockData }) {
  return (
    <section className={cn("section-y", bgClass(data))}>
      <div className="container-page">
        <SectionHead data={data} />
        <ol className="mt-12 grid gap-6 md:grid-cols-3 lg:grid-cols-5">
          {list<{ step: string; text: string }>(data, "items").map((s, i) => (
            <Reveal key={`${s.step}-${i}`} delay={i * 80} as="li">
              <div className="surface-card h-full p-6">
                <span className="grad-text text-3xl font-extrabold">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-4 text-lg font-semibold">{s.step}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.text}</p>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}

function ServicesGrid({ data }: { data: BlockData }) {
  const limit = num(data, "limit", 6) || 6;
  return (
    <section className={cn("section-y", bgClass(data))}>
      <div className="container-page">
        <SectionHead data={data} />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.slice(0, limit).map((s, i) => (
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
                  Learn more <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
        {str(data, "ctaLabel") && (
          <div className="mt-12">
            <Link
              to="/services"
              className="inline-flex rounded-full border-[1.5px] border-blue-500 px-8 py-4 text-sm font-semibold text-blue-700 transition-colors hover:bg-mist"
            >
              {str(data, "ctaLabel")}
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

function PostsGrid({ data, posts }: { data: BlockData; posts: PostRecord[] }) {
  const limit = num(data, "limit", 3) || 3;
  return (
    <section className={cn("section-y", bgClass(data))}>
      <div className="container-page">
        <SectionHead data={data} />
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {posts.slice(0, limit).map((p, i) => (
            <Reveal key={p.slug} delay={i * 90}>
              <Link to="/blog/$slug" params={{ slug: p.slug }} className="surface-card group flex h-full flex-col p-7">
                <p className="text-xs font-semibold tracking-[0.12em] text-blue-700 uppercase">{p.category}</p>
                <h3 className="mt-4 text-lg font-semibold">{p.title}</h3>
                <p className="mt-3 flex-1 text-sm text-muted-foreground">{p.excerpt}</p>
                <p className="mt-6 text-xs text-muted-foreground">
                  {formatDate(p.published_at)} · {p.read_time}
                </p>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Testimonials({ data }: { data: BlockData }) {
  return (
    <section className={cn("section-y", bgClass(data))}>
      <div className="container-page">
        <SectionHead data={data} />
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {list<{ quote: string; name: string; role: string; company: string }>(data, "items").map((t, i) => (
            <Reveal key={i} delay={i * 90}>
              <figure className="surface-card h-full p-7">
                <Quote className="h-8 w-8 text-blue-500/40" />
                <blockquote className="mt-4 text-sm leading-relaxed text-muted-foreground">{t.quote}</blockquote>
                <figcaption className="mt-6 text-sm font-semibold text-ink">
                  {t.name}
                  {t.role && <span className="block font-normal text-muted-foreground">{t.role}</span>}
                  {t.company && <span className="block font-normal text-muted-foreground">{t.company}</span>}
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Faq({ data }: { data: BlockData }) {
  const items = list<{ q: string; a: string }>(data, "items");
  return (
    <section className={cn("section-y", bgClass(data))}>
      <div className="container-page grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
        <SectionHead data={data} />
        <div>
          <FaqList items={items} />
        </div>
      </div>
    </section>
  );
}

function ImageBlock({ data }: { data: BlockData }) {
  const image = str(data, "image");
  if (!image) return null;
  return (
    <section className={cn("section-y", bgClass(data))}>
      <div className="container-page">
        <figure>
          <img src={image} alt={str(data, "alt")} className="w-full rounded-[28px] object-cover" />
          {str(data, "caption") && (
            <figcaption className="mt-3 text-sm text-muted-foreground">{str(data, "caption")}</figcaption>
          )}
        </figure>
      </div>
    </section>
  );
}

function ContactBlock({ data }: { data: BlockData }) {
  return (
    <section className={cn("section-y", bgClass(data))}>
      <div className="container-page grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
        <Reveal>
          <h2 className="h2-display">{str(data, "heading", "Send a brief")}</h2>
          {str(data, "body") && <p className="mt-5 text-muted-foreground">{str(data, "body")}</p>}
          <div className="mt-8 space-y-3 text-sm">
            <a href={`mailto:${site.email}`} className="block font-semibold text-blue-700">
              {site.email}
            </a>
            <a href={site.whatsapp} target="_blank" rel="noreferrer noopener" className="block text-muted-foreground">
              WhatsApp {site.phone}
            </a>
            <p className="text-muted-foreground">{site.location}</p>
          </div>
        </Reveal>
        <Reveal delay={120}>
          <div className="surface-card p-6 md:p-8">
            <ContactForm />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function BlockView({ block, posts }: { block: Block; posts: PostRecord[] }) {
  const data = block.data ?? {};
  switch (block.type) {
    case "hero":
      return <Hero data={data} />;
    case "pageHero":
      return <PageHeroBlock data={data} />;
    case "richText":
      return <RichText data={data} />;
    case "cards":
      return <Cards data={data} />;
    case "imageText":
      return <ImageText data={data} />;
    case "pills":
      return <Pills data={data} />;
    case "stats":
      return <Stats data={data} />;
    case "steps":
      return <Steps data={data} />;
    case "servicesGrid":
      return <ServicesGrid data={data} />;
    case "postsGrid":
      return <PostsGrid data={data} posts={posts} />;
    case "testimonials":
      return <Testimonials data={data} />;
    case "faq":
      return <Faq data={data} />;
    case "image":
      return <ImageBlock data={data} />;
    case "contact":
      return <ContactBlock data={data} />;
    case "cta":
      return <CtaBand title={str(data, "heading", "Let's build your growth engine.")} text={str(data, "body", "")} />;
    default:
      return null;
  }
}

export function BlockRenderer({ blocks, posts = [] }: { blocks: Block[]; posts?: PostRecord[] }) {
  return (
    <>
      {blocks.map((b) => (
        <BlockView key={b.id ?? `${b.type}`} block={b} posts={posts} />
      ))}
    </>
  );
}
