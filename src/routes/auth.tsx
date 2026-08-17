import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { PageShell } from "@/components/PageShell";

export const Route = createFileRoute("/auth")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Admin sign in — Jugal K. Shukla" },
      { name: "description", content: "Private sign-in for the site owner to manage content, pages and SEO." },
      { property: "og:title", content: "Admin sign in" },
      { property: "og:description", content: "Private sign-in for the site owner." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AuthPage,
});

const schema = z.object({
  email: z.string().trim().email({ message: "Enter a valid email address" }).max(255),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }).max(72),
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setNotice(null);
    const form = new FormData(e.currentTarget);
    const parsed = schema.safeParse({ email: form.get("email"), password: form.get("password") });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Please check your details");
      return;
    }
    setBusy(true);
    try {
      if (mode === "signin") {
        const { error: err } = await supabase.auth.signInWithPassword(parsed.data);
        if (err) throw err;
        navigate({ to: "/admin" });
      } else {
        const { error: err } = await supabase.auth.signUp({
          ...parsed.data,
          options: { emailRedirectTo: `${window.location.origin}/admin` },
        });
        if (err) throw err;
        setNotice("Account created. If email confirmation is on, confirm via the link, then sign in.");
        setMode("signin");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  };

  const field =
    "w-full rounded-xl border border-line bg-background px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/25";

  return (
    <PageShell>
      <section className="section-y pt-[140px]">
        <div className="container-page max-w-md">
          <h1 className="h2-display">{mode === "signin" ? "Admin sign in" : "Create the admin account"}</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            {mode === "signin"
              ? "Sign in to manage blog posts, pages and SEO."
              : "The first account created becomes the site administrator."}
          </p>
          <form onSubmit={onSubmit} className="mt-8 grid gap-4">
            <label className="grid gap-2 text-sm font-medium text-ink">
              Email
              <input name="email" type="email" autoComplete="email" className={field} required />
            </label>
            <label className="grid gap-2 text-sm font-medium text-ink">
              Password
              <input
                name="password"
                type="password"
                autoComplete={mode === "signin" ? "current-password" : "new-password"}
                className={field}
                required
              />
            </label>
            {error && <p className="text-sm text-destructive">{error}</p>}
            {notice && <p className="text-sm text-blue-700">{notice}</p>}
            <button type="submit" disabled={busy} className="grad-cta rounded-full px-8 py-3.5 text-sm font-semibold disabled:opacity-60">
              {busy ? "Please wait…" : mode === "signin" ? "Sign in" : "Create account"}
            </button>
          </form>
          <button
            type="button"
            onClick={() => {
              setMode(mode === "signin" ? "signup" : "signin");
              setError(null);
            }}
            className="mt-6 text-sm font-semibold text-blue-700"
          >
            {mode === "signin" ? "First time? Create the admin account" : "Already have an account? Sign in"}
          </button>
        </div>
      </section>
    </PageShell>
  );
}
