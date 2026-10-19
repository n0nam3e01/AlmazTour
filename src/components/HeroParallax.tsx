"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/** Only the photo moves. Text, search and native mobile scrolling keep their layout. */
export function HeroParallax({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const layer = ref.current;
    if (!layer) return;
    const media = gsap.matchMedia();
    media.add("(min-width: 768px) and (prefers-reduced-motion: no-preference) and (pointer: fine)", () => {
      gsap.fromTo(layer, { yPercent: -5 }, {
        yPercent: 10, ease: "none",
        scrollTrigger: { trigger: layer.parentElement, start: "top top", end: "bottom top", scrub: true },
      });
    });
    return () => media.revert();
  }, []);
  return <div ref={ref} className="hero-parallax absolute inset-x-0 -inset-y-[12%]" aria-hidden="true">{children}</div>;
}
