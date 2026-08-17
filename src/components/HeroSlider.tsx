import { useEffect, useState } from "react";
import hero1 from "@/assets/hero-1.jpg";
import hero2 from "@/assets/hero-2.jpg";
import hero3 from "@/assets/hero-3.jpg";
import { cn } from "@/lib/utils";

const slides = [
  { src: hero1, alt: "Campaign analytics dashboards showing traffic and conversion charts" },
  { src: hero2, alt: "Abstract blue automation network connecting marketing data points" },
  { src: hero3, alt: "Marketing strategy whiteboard session with funnel diagrams" },
];

export function HeroSlider() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => setActive((i) => (i + 1) % slides.length), 6000);
    return () => clearInterval(id);
  }, [paused]);

  return (
    <div
      className="absolute inset-0 -z-10 overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {slides.map((s, i) => (
        <img
          key={s.src}
          src={s.src}
          alt={s.alt}
          width={1920}
          height={1080}
          loading={i === 0 ? "eager" : "lazy"}
          className={cn(
            "absolute inset-0 h-full w-full object-cover transition-opacity duration-1000",
            i === active ? "opacity-100" : "opacity-0",
          )}
        />
      ))}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(100deg, oklch(0.16 0.03 264 / 0.94) 0%, oklch(0.32 0.14 263 / 0.82) 45%, oklch(0.49 0.21 265 / 0.4) 100%)",
        }}
      />
      <div className="absolute bottom-8 left-0 z-10 w-full">
        <div className="container-page flex gap-2">
          {slides.map((s, i) => (
            <button
              key={s.src}
              type="button"
              aria-label={`Show slide ${i + 1}`}
              onClick={() => setActive(i)}
              className={cn(
                "h-1 w-14 rounded-full transition-all",
                i === active ? "grad-cta shadow-none" : "bg-white/30",
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
