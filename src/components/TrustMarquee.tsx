const items = [
  "IIT Roorkee",
  "Purdue University",
  "Google Ads Certified",
  "Meta Certified",
  "HubSpot Academy",
  "Darden · UVA",
  "Vanderbilt University",
  "Microsoft Certified",
  "BlueArray London",
  "GA4 · GTM",
  "SEMrush",
  "Ahrefs",
  "Looker Studio",
  "Zapier / Make",
];

export function TrustMarquee() {
  return (
    <section aria-label="Certifications and tools" className="border-y border-line bg-paper py-7">
      <div className="relative overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_8%,black_92%,transparent)]">
        <div className="marquee-track flex w-max gap-12 pr-12">
          {[...items, ...items].map((item, i) => (
            <span
              key={`${item}-${i}`}
              className="text-sm font-semibold whitespace-nowrap text-muted-foreground transition-colors hover:text-blue-700"
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
