import { createFileRoute, Link, Outlet, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Code2, FileText, Gauge, Globe, LayoutDashboard, LogOut, Newspaper, Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Content admin — Jugal K. Shukla" },
      { name: "description", content: "Private dashboard for managing blog posts, pages and SEO." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminLayout,
});

const nav = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/blog", label: "Blog posts", icon: Newspaper },
  { to: "/admin/pages", label: "Pages", icon: FileText },
  { to: "/admin/seo", label: "SEO & schema", icon: Search },
  { to: "/admin/speed", label: "Page speed", icon: Gauge },
  { to: "/admin/code", label: "Custom code", icon: Code2 },
] as const;


function AdminLayout() {
  const navigate = useNavigate();
  const { data, isLoading } = useQuery({
    queryKey: ["is-admin"],
    queryFn: async () => {
      const { data: user } = await supabase.auth.getUser();
      const { data: roles } = await supabase.from("user_roles").select("role");
      return {
        email: user.user?.email ?? "",
        isAdmin: (roles ?? []).some((r) => r.role === "admin"),
      };
    },
  });

  return (
    <div className="min-h-screen bg-mist">
      <header className="border-b border-line bg-card">
        <div className="container-page flex flex-wrap items-center justify-between gap-4 py-4">
          <div className="flex items-center gap-3">
            <Link to="/" className="text-sm font-extrabold tracking-tight text-ink">
              Jugal K. Shukla
            </Link>
            <span className="rounded-full bg-mist px-2.5 py-1 text-xs font-semibold text-blue-700">Admin</span>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <Link to="/" className="flex items-center gap-2 font-semibold text-muted-foreground hover:text-ink">
              <Globe className="h-4 w-4" /> View site
            </Link>
            <span className="hidden text-muted-foreground sm:inline">{data?.email}</span>
            <button
              type="button"
              onClick={async () => {
                await supabase.auth.signOut();
                navigate({ to: "/auth" });
              }}
              className="flex items-center gap-2 font-semibold text-muted-foreground hover:text-destructive"
            >
              <LogOut className="h-4 w-4" /> Sign out
            </button>
          </div>
        </div>
      </header>

      <div className="container-page grid gap-8 py-10 lg:grid-cols-[220px_1fr]">
        <nav className="flex flex-wrap gap-2 lg:flex-col">
          {nav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: Boolean((item as { exact?: boolean }).exact) }}
              activeProps={{ className: "bg-ink text-white" }}
              className="flex items-center gap-3 rounded-xl border border-line bg-card px-4 py-2.5 text-sm font-semibold text-ink"
            >
              <item.icon className="h-4 w-4" /> {item.label}
            </Link>
          ))}
        </nav>

        <main>
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Loading…</p>
          ) : data?.isAdmin ? (
            <Outlet />
          ) : (
            <div className="rounded-2xl border border-line bg-card p-8">
              <h1 className="text-xl font-semibold text-ink">No admin access</h1>
              <p className="mt-3 text-sm text-muted-foreground">
                This account is signed in but is not an administrator. The first account created on the site becomes the
                administrator.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
