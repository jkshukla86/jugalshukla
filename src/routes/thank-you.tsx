import { Link, createFileRoute } from "@tanstack/react-router";
import { CheckCircle2 } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { site } from "@/data/site";

export const Route = createFileRoute("/thank-you")({
  head: () => ({
    meta: [
      { title: "Thank You — Your Enquiry Is In | Jugal K. Shukla" },
      {
        name: "description",
        content: "Thanks for reaching out. I read every enquiry myself and reply within 24 hours.",
      },
      { property: "og:title", content: "Thank you for your enquiry" },
      { property: "og:description", content: "I read every enquiry myself and reply within 24 hours." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ThankYou,
});

function ThankYou() {
  return (
    <PageShell>
      <section className="grad-dark relative flex min-h-[80vh] items-center overflow-hidden pt-32 pb-24">
        <div className="dot-grid absolute inset-0 opacity-[0.12]" aria-hidden="true" />
        <div className="container-page relative max-w-2xl text-center">
          <span className="grad-cta mx-auto flex h-16 w-16 items-center justify-center rounded-2xl">
            <CheckCircle2 className="h-8 w-8" />
          </span>
          <h1 className="h1-display mt-8 text-white">Got it. Thank you.</h1>
          <p className="mt-6 text-lg text-white/70">
            I read every enquiry myself and reply within 24 hours — usually with two or three specific questions and a
            suggested time to talk.
          </p>
          <p className="mt-4 text-sm text-white/55">
            In a hurry? WhatsApp me on {site.phone} or email {site.email}.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link to="/blog" className="grad-cta rounded-full px-8 py-4 text-sm font-semibold">
              Read the blog meanwhile
            </Link>
            <Link
              to="/services"
              className="rounded-full border-[1.5px] border-blue-300/70 px-8 py-4 text-sm font-semibold text-white transition-colors hover:bg-blue-300/15"
            >
              Browse services
            </Link>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
