import logoDarkBg from "@/assets/shukla-logo-light.png.asset.json";
import logoLightBg from "@/assets/shukla-logo.png.asset.json";
import { cn } from "@/lib/utils";

/**
 * The Jugal Kishore Shukla signature logo.
 *  - tone="dark"  → for light backgrounds: original artwork (black name, orange signature)
 *  - tone="light" → for dark backgrounds: same artwork with the name in white
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
  return (
    <img
      src={tone === "light" ? logoDarkBg.url : logoLightBg.url}
      alt={label}
      height={46}
      className={cn("block h-12 w-auto shrink-0 object-contain transition-all duration-300", className)}
    />
  );
}
