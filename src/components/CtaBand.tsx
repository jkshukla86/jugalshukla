import { Mail, MessageCircle } from "lucide-react";
import { ContactForm } from "@/components/ContactForm";
import { Reveal } from "@/components/Reveal";
import { site } from "@/data/site";

export function CtaBand({
  title = "Let's build your growth engine.",
  text = "Tell me what you're trying to grow. I'll tell you honestly whether I'm the right person, and what I'd do first.",
}: {
  title?: string;
  text?: string;
}) {
  return (
    <section className="grad-dark section-y relative overflow-hidden">
      <div className="dot-grid absolute inset-0 opacity-[0.12]" aria-hidden="true" />
      <div className="container-page relative grid items-start gap-14 lg:grid-cols-2">
        <Reveal>
          <p className="text-sm font-semibold tracking-[0.14em] text-blue-300 uppercase">Next step</p>
          <h2 className="h2-display mt-4 text-white">{title}</h2>
          <p className="mt-5 max-w-md text-white/70">{text}</p>
          <div className="mt-8 flex flex-col gap-3 text-sm">
            <a href={`mailto:${site.email}`} className="flex items-center gap-3 text-white hover:text-blue-300">
              <Mail className="h-5 w-5 text-blue-300" /> {site.email}
            </a>
            <a
              href={site.whatsapp}
              target="_blank"
              rel="noreferrer noopener"
              className="flex items-center gap-3 text-white hover:text-blue-300"
            >
              <MessageCircle className="h-5 w-5 text-blue-300" /> WhatsApp {site.phone}
            </a>
          </div>
        </Reveal>
        <Reveal delay={120}>
          <div className="rounded-3xl border border-line bg-card p-6 md:p-8">
            <h3 className="text-lg font-semibold">Send a quick brief</h3>
            <p className="mt-1 mb-6 text-sm text-muted-foreground">I reply within 24 hours.</p>
            <ContactForm compact />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
