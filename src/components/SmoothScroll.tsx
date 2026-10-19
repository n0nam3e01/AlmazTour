"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { consumeLanguageScroll, navigationScroll } from "@/lib/scroll";
import { useLocale } from "@/components/LocaleProvider";
import { localeFromPath } from "@/lib/i18n";

gsap.registerPlugin(ScrollTrigger);

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const locale = useLocale();
  const instance = useRef<Lenis | null>(null);
  const historyNavigation = useRef<string | null>(null);

  useEffect(() => {
    const lenis = new Lenis({
      autoRaf: false,
      lerp: 0.1,
      syncTouch: false,
      respectReducedMotion: true,
      stopInertiaOnNavigate: true,
      anchors: true,
      prevent: node => node.matches("input, textarea, select, [data-lenis-prevent]"),
    });
    instance.current = lenis;
    const tick = (seconds: number) => lenis.raf(seconds * 1000);
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    const history = () => { historyNavigation.current = location.pathname; };
    window.addEventListener("popstate", history);
    return () => {
      window.removeEventListener("popstate", history);
      gsap.ticker.remove(tick);
      lenis.off("scroll", ScrollTrigger.update);
      lenis.destroy();
      instance.current = null;
    };
  }, []);

  useLayoutEffect(() => {
    // usePathname can update the outgoing shell before its locale segment commits.
    // Only the destination shell may consume the saved language position.
    if (localeFromPath(pathname) !== locale) return;
    const lenis = instance.current;
    const href = location.pathname + location.search + location.hash;
    const decision = navigationScroll(href, historyNavigation.current === pathname, consumeLanguageScroll());
    historyNavigation.current = null;
    // Restore before paint; a deferred RAF produces a visible flash at the top.
    lenis?.resize();
    const restorePosition = () => {
      if (decision.kind !== "position") return;
      window.scrollTo({ top: decision.y, behavior: "instant" });
      lenis?.scrollTo(decision.y, { immediate: true });
    };
    restorePosition();
    if (decision.kind === "anchor") {
      const target = document.getElementById(decision.id);
      if (target) {
        const margin = parseFloat(getComputedStyle(target).scrollMarginTop) || 0;
        window.scrollTo({ top: target.getBoundingClientRect().top + scrollY - margin, behavior: "instant" });
        lenis?.scrollTo(target, { immediate: true });
      }
    }
    let frame = requestAnimationFrame(() => {
      restorePosition();
      frame = requestAnimationFrame(() => {
        instance.current?.resize();
        ScrollTrigger.refresh();
        restorePosition();
      });
    });
    return () => cancelAnimationFrame(frame);
  }, [pathname, locale]);

  return children;
}
