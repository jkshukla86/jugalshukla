import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { listNavPages } from "@/lib/cms.functions";
import { useEffect, useState } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import { services } from "@/data/services";
import { cn } from "@/lib/utils";

const nav = [
  { label: "Home", to: "/" },
  { label: "About Me", to: "/about" },
  { label: "Blog", to: "/blog" },
  { label: "Contact Us", to: "/contact" },
];

export function SiteHeader() {
  const { data: extraPages = [] } = useQuery({
    queryKey: ["nav-pages"],
    queryFn: () => listNavPages(),
    staleTime: 60_000,
  });
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [mega, setMega] = useState(false);
  const [mobileServices, setMobileServices] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled ? "bg-background/95 shadow-[0_6px_24px_oklch(0.28_0.13_262/0.10)] backdrop-blur" : "bg-transparent",
      )}
    >
      <div className="container-page flex h-[74px] items-center justify-between gap-6">
        <Link to="/" className="group flex items-center gap-3" onClick={() => setOpen(false)}>
          <span className="grad-cta flex h-10 w-10 items-center justify-center rounded-xl text-sm font-extrabold">
            JS
          </span>
          <span
            className={cn(
              "text-[0.95rem] font-extrabold tracking-tight uppercase transition-colors",
              scrolled ? "text-ink" : "text-white",
            )}
          >
            Jugal K. Shukla
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
          {nav.slice(0, 2).map((item) => (
            <NavItem key={item.to} {...item} scrolled={scrolled} />
          ))}

          <div className="relative" onMouseEnter={() => setMega(true)} onMouseLeave={() => setMega(false)}>
            <button
              type="button"
              aria-expanded={mega}
              onClick={() => setMega((v) => !v)}
              className={cn(
                "flex items-center gap-1 rounded-full px-4 py-2 text-sm font-medium transition-colors",
                scrolled ? "text-ink hover:text-blue-700" : "text-white/90 hover:text-white",
              )}
            >
              Services <ChevronDown className="h-4 w-4" />
            </button>
            {mega && (
              <div className="absolute top-full left-1/2 w-[min(880px,88vw)] -translate-x-1/2 pt-3">
                <div className="rounded-3xl border border-line bg-card p-6 shadow-[0_28px_70px_oklch(0.28_0.13_262/0.18)]">
                  <div className="grid gap-x-6 gap-y-1 sm:grid-cols-2 lg:grid-cols-3">
                    {services.slice(0, 12).map((s) => (
                      <Link
                        key={s.slug}
                        to="/services/$slug"
                        params={{ slug: s.slug }}
                        onClick={() => setMega(false)}
                        className="rounded-xl p-3 transition-colors hover:bg-mist"
                      >
                        <span className="block text-sm font-semibold text-ink">{s.name}</span>
                        <span className="mt-0.5 block text-xs leading-snug text-muted-foreground">{s.short}</span>
                      </Link>
                    ))}
                  </div>
                  <div className="mt-4 border-t border-line pt-4">
                    <Link
                      to="/services"
                      onClick={() => setMega(false)}
                      className="text-sm font-semibold text-blue-700 hover:underline"
                    >
                      View all {services.length} services →
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>

          {nav.slice(2).map((item) => (
            <NavItem key={item.to} {...item} scrolled={scrolled} />
          ))}
          {extraPages.map((page) => (
            <a
              key={page.path}
              href={page.path}
              className={cn(
                "rounded-full px-4 py-2.5 text-sm font-semibold transition-colors",
                scrolled ? "text-ink hover:text-blue-700" : "text-white/80 hover:text-white",
              )}
            >
              {page.nav_label || page.title}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            to="/contact"
            className="grad-cta hidden rounded-full px-6 py-3 text-sm font-semibold transition-transform duration-300 hover:-translate-y-0.5 md:inline-flex"
          >
            Book a Free Strategy Call
          </Link>
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
            className={cn(
              "inline-flex h-11 w-11 items-center justify-center rounded-xl border lg:hidden",
              scrolled ? "border-line text-ink" : "border-white/30 text-white",
            )}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 top-[74px] z-40 flex flex-col bg-background lg:hidden">
          <nav className="flex-1 overflow-y-auto px-5 py-6" aria-label="Mobile">
            {nav.slice(0, 2).map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className="block border-b border-line py-4 text-lg font-semibold text-ink"
              >
                {item.label}
              </Link>
            ))}
            <button
              type="button"
              onClick={() => setMobileServices((v) => !v)}
              aria-expanded={mobileServices}
              className="flex w-full items-center justify-between border-b border-line py-4 text-lg font-semibold text-ink"
            >
              Services
              <ChevronDown className={cn("h-5 w-5 transition-transform", mobileServices && "rotate-180")} />
            </button>
            {mobileServices && (
              <div className="border-b border-line py-2">
                {services.map((s) => (
                  <Link
                    key={s.slug}
                    to="/services/$slug"
                    params={{ slug: s.slug }}
                    onClick={() => setOpen(false)}
                    className="block py-2.5 text-sm text-muted-foreground"
                  >
                    {s.name}
                  </Link>
                ))}
                <Link
                  to="/services"
                  onClick={() => setOpen(false)}
                  className="block py-2.5 text-sm font-semibold text-blue-700"
                >
                  View all services →
                </Link>
              </div>
            )}
            {nav.slice(2).map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className="block border-b border-line py-4 text-lg font-semibold text-ink"
              >
                {item.label}
              </Link>
            ))}
            {extraPages.map((page) => (
              <a
                key={page.path}
                href={page.path}
                onClick={() => setOpen(false)}
                className="block border-b border-line py-4 text-lg font-semibold text-ink"
              >
                {page.nav_label || page.title}
              </a>
            ))}
          </nav>
          <div className="border-t border-line p-5">
            <Link
              to="/contact"
              onClick={() => setOpen(false)}
              className="grad-cta block rounded-full px-6 py-4 text-center font-semibold"
            >
              Book a Free Strategy Call
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

function NavItem({ label, to, scrolled }: { label: string; to: string; scrolled: boolean }) {
  return (
    <Link
      to={to}
      className={cn(
        "rounded-full px-4 py-2 text-sm font-medium transition-colors",
        scrolled ? "text-ink hover:text-blue-700" : "text-white/90 hover:text-white",
      )}
      activeProps={{ className: scrolled ? "text-blue-700" : "text-white" }}
    >
      {label}
    </Link>
  );
}
