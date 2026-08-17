import { useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { services } from "@/data/services";

export function ContactForm({ compact = false }: { compact?: boolean }) {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    if (data.get("company_hp")) return; // honeypot
    if (!data.get("name") || !data.get("email") || !data.get("message")) {
      setError("Please fill in your name, email and a short message.");
      return;
    }
    navigate({ to: "/thank-you" });
  };

  const field =
    "w-full rounded-xl border border-line bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-blue-500 focus:ring-2 focus:ring-blue-500/25";

  return (
    <form onSubmit={onSubmit} className="grid gap-4" noValidate>
      <input type="text" name="company_hp" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2 text-sm font-medium text-ink">
          Name*
          <input name="name" required className={field} placeholder="Your full name" />
        </label>
        <label className="grid gap-2 text-sm font-medium text-ink">
          Email*
          <input name="email" type="email" required className={field} placeholder="you@company.com" />
        </label>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2 text-sm font-medium text-ink">
          Phone / WhatsApp
          <input name="phone" className={field} placeholder="+91…" />
        </label>
        <label className="grid gap-2 text-sm font-medium text-ink">
          Company / Website
          <input name="company" className={field} placeholder="company.com" />
        </label>
      </div>
      {!compact && (
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="grid gap-2 text-sm font-medium text-ink">
            Service interested in
            <select name="service" className={field} defaultValue="">
              <option value="">Select a service</option>
              {services.map((s) => (
                <option key={s.slug} value={s.name}>
                  {s.name}
                </option>
              ))}
            </select>
          </label>
          <label className="grid gap-2 text-sm font-medium text-ink">
            Monthly budget range
            <select name="budget" className={field} defaultValue="">
              <option value="">Optional</option>
              <option>Under ₹50,000</option>
              <option>₹50,000 – ₹1,50,000</option>
              <option>₹1,50,000 – ₹5,00,000</option>
              <option>₹5,00,000+</option>
            </select>
          </label>
        </div>
      )}
      <label className="grid gap-2 text-sm font-medium text-ink">
        Message*
        <textarea
          name="message"
          required
          rows={compact ? 3 : 5}
          className={field}
          placeholder="What are you trying to grow, and what's in the way?"
        />
      </label>
      <label className="flex items-start gap-3 text-xs text-muted-foreground">
        <input type="checkbox" required className="mt-1 h-4 w-4 rounded border-line accent-blue-700" />
        I agree to be contacted about my enquiry. No spam, no lists.
      </label>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <button
        type="submit"
        className="grad-cta mt-1 rounded-full px-8 py-4 text-sm font-semibold transition-transform duration-300 hover:-translate-y-0.5"
      >
        Send my enquiry
      </button>
    </form>
  );
}
