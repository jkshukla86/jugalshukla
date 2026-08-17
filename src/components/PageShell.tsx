import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

export function PageShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main>{children}</main>
      <SiteFooter />
    </div>
  );
}

export function PageHero({
  eyebrow,
  title,
  subtitle,
  crumb,
  children,
}: {
  eyebrow: string;
  title: ReactNode;
  subtitle?: string;
  crumb: { label: string; to?: string }[];
  children?: ReactNode;
}) {
  return (
    <section className="grad-dark relative overflow-hidden pt-[136px] pb-16 md:pt-[168px] md:pb-24">
      <div className="dot-grid absolute inset-0 opacity-[0.12]" aria-hidden="true" />
      <div className="container-page relative">
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-xs text-white/60">
          {crumb.map((c, i) => (
            <span key={c.label} className="flex items-center gap-2">
              {c.to ? (
                <Link to={c.to} className="hover:text-white">
                  {c.label}
                </Link>
              ) : (
                <span className="text-white/80">{c.label}</span>
              )}
              {i < crumb.length - 1 && <span aria-hidden="true">/</span>}
            </span>
          ))}
        </nav>
        <p className="eyebrow mt-8 text-blue-300">{eyebrow}</p>
        <h1 className="h1-display mt-4 max-w-4xl text-white">{title}</h1>
        {subtitle && <p className="mt-6 max-w-2xl text-lg text-white/70">{subtitle}</p>}
        {children}
      </div>
    </section>
  );
}
