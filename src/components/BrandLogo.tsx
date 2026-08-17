import logo from "@/assets/shukla-logo.png.asset.json";
import { cn } from "@/lib/utils";

/**
 * The Shukla signature mark. The PNG is an alpha shape, so the visible colour comes
 * from a CSS gradient behind the mask:
 *  - tone="light" (dark backgrounds): the logo's own silver-to-white sheen
 *  - tone="dark"  (light backgrounds): black-to-dark-blue gradient
 */
export function BrandLogo({
  tone = "dark",
  className,
  label = "Jugal Kishore Shukla",
}: {
  tone?: "light" | "dark";
  className?: string;
  label?: string;
}) {
  const gradient =
    tone === "light"
      ? "linear-gradient(115deg, oklch(0.72 0.02 250) 0%, oklch(0.9 0.01 250) 38%, oklch(1 0 0) 70%, oklch(0.86 0.02 250) 100%)"
      : "linear-gradient(115deg, oklch(0.18 0.02 264) 0%, oklch(0.28 0.11 262) 45%, oklch(0.42 0.17 264) 78%, oklch(0.2 0.04 264) 100%)";

  return (
    <span
      role="img"
      aria-label={label}
      className={cn("block h-11 w-[132px] shrink-0 transition-all duration-300", className)}
      style={{
        backgroundImage: gradient,
        WebkitMaskImage: `url(${logo.url})`,
        maskImage: `url(${logo.url})`,
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        WebkitMaskPosition: "center",
        maskPosition: "center",
        WebkitMaskSize: "contain",
        maskSize: "contain",
      }}
    />
  );
}
