import { Link } from "@tanstack/react-router";
import { Instagram, Linkedin, Mail, MapPin, Phone } from "lucide-react";
import { BrandLogo } from "@/components/BrandLogo";
import { services } from "@/data/services";
import { site } from "@/data/site";

export function SiteFooter() {
  return (
    <footer className="bg-ink text-white/70">
      <div className="container-page grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <BrandLogo tone="light" className="h-11 w-[160px]" />
          <p className="mt-5 text-sm leading-relaxed">
            Independent digital marketing, automation and growth expert. 10+ years turning SEO, paid media and AI
            workflows into qualified pipeline.
          </p>
          <div className="mt-6 flex gap-3">
            <a
              href={site.linkedin}
              target="_blank"
              rel="noreferrer noopener"
              aria-label="LinkedIn profile"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 text-white transition-colors hover:border-blue-300"
            >
              <Linkedin className="h-4.5 w-4.5" />
            </a>
            <a
              href={site.instagram}
              target="_blank"
              rel="noreferrer noopener"
              aria-label="Instagram profile"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 text-white transition-colors hover:border-blue-300"
            >
              <Instagram className="h-4.5 w-4.5" />
            </a>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold tracking-[0.14em] text-white uppercase">Quick links</h3>
          <ul className="mt-5 space-y-3 text-sm">
            {[
              { to: "/", label: "Home" },
              { to: "/about", label: "About Me" },
              { to: "/services", label: "All Services" },
              { to: "/blog", label: "Blog" },
              { to: "/contact", label: "Contact Us" },
            ].map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="transition-colors hover:text-white">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold tracking-[0.14em] text-white uppercase">Services</h3>
          <ul className="mt-5 space-y-3 text-sm">
            {services.slice(0, 8).map((s) => (
              <li key={s.slug}>
                <Link
                  to="/services/$slug"
                  params={{ slug: s.slug }}
                  className="transition-colors hover:text-white"
                >
                  {s.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold tracking-[0.14em] text-white uppercase">Get in touch</h3>
          <ul className="mt-5 space-y-4 text-sm">
            <li className="flex gap-3">
              <Mail className="mt-0.5 h-4.5 w-4.5 shrink-0 text-blue-300" />
              <a href={`mailto:${site.email}`} className="hover:text-white">
                {site.email}
              </a>
            </li>
            <li className="flex gap-3">
              <Phone className="mt-0.5 h-4.5 w-4.5 shrink-0 text-blue-300" />
              <a href={site.phoneHref} className="hover:text-white">
                {site.phone}
              </a>
            </li>
            <li className="flex gap-3">
              <MapPin className="mt-0.5 h-4.5 w-4.5 shrink-0 text-blue-300" />
              <span>{site.location}</span>
            </li>
          </ul>
          <a
            href={site.whatsapp}
            target="_blank"
            rel="noreferrer noopener"
            className="mt-6 inline-flex rounded-full border border-white/20 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:border-blue-300"
          >
            Message on WhatsApp
          </a>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-page flex flex-col gap-2 py-6 text-xs sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Jugal K. Shukla. All rights reserved.</p>
          <p>Kanpur, India · Working with clients worldwide</p>
        </div>
      </div>
    </footer>
  );
}
