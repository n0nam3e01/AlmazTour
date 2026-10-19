"use client";

import Link from "next/link";
import { useLayoutEffect, useRef } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform, type MotionValue } from "motion/react";
import { stripLocale } from "@/lib/i18n";
import { uiCopy } from "@/data/ui-copy";
import { useLocale } from "@/components/LocaleProvider";

type Item = { href: string; label: string };

function DockLink({ item, pathname, mouseX, index }: { item: Item; pathname: string; mouseX: MotionValue<number>; index: number }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const reduce = useReducedMotion();
  const distance = useTransform(mouseX, (cursorX) => {
    const rect = ref.current?.getBoundingClientRect();
    return rect ? cursorX - (rect.left + rect.width / 2) : 9999;
  });
  const scale = useSpring(useTransform(distance, [-130, 0, 130], [1, 1.1, 1]), { stiffness: 360, damping: 26, mass: 0.25 });
  const active = stripLocale(item.href) === "/" ? pathname === item.href : pathname.startsWith(item.href);

  return (
    <motion.div style={{ scale: reduce ? 1 : scale, transformOrigin: "center bottom" }} className="nav-dock-item">
      <Link
        ref={ref}
        href={item.href}
        data-nav-index={index}
        aria-current={active ? "page" : undefined}
        className="relative block whitespace-nowrap rounded-xl px-2.5 py-2 text-sm font-semibold"
      >
        <span className="relative z-[1]">{item.label}</span>
      </Link>
    </motion.div>
  );
}

export function AnimatedNavDock({ items, pathname }: { items: Item[]; pathname: string }) {
  const copy = uiCopy[useLocale()];
  const reduce = useReducedMotion();
  const mouseX = useMotionValue(-10000);
  const navRef = useRef<HTMLElement>(null);
  const pillRef = useRef<HTMLSpanElement>(null);
  const readyRef = useRef(false);
  const activeIndex = items.findIndex((item) => stripLocale(item.href) === "/" ? pathname === item.href : pathname.startsWith(item.href));
  const labels = items.map((item) => item.label).join("|");

  useLayoutEffect(() => {
    const nav = navRef.current;
    const pill = pillRef.current;
    const link = nav?.querySelector<HTMLElement>(`[data-nav-index="${activeIndex}"]`);
    if (!nav || !pill || !link) return;
    const update = (animate: boolean) => {
      if (!nav.offsetWidth) { readyRef.current = false; return; }
      // Используем координаты раскладки, не масштабируемые Dock и не зависящие от скролла.
      const left = (link.parentElement?.offsetLeft ?? 0) + link.offsetLeft;
      pill.style.transition = animate && !reduce ? "transform 420ms cubic-bezier(0.23, 1, 0.32, 1), width 420ms cubic-bezier(0.23, 1, 0.32, 1)" : "none";
      pill.style.width = `${link.offsetWidth}px`;
      pill.style.transform = `translateX(${left}px)`;
      pill.style.visibility = "visible";
      readyRef.current = true;
    };
    update(readyRef.current);
    const onResize = () => update(false);
    window.addEventListener("resize", onResize);
    let cancelled = false;
    document.fonts.ready.then(() => {
      if (cancelled) return;
      const left = (link.parentElement?.offsetLeft ?? 0) + link.offsetLeft;
      if (pill.style.width !== `${link.offsetWidth}px` || pill.style.transform !== `translateX(${left}px)`) update(false);
    });
    return () => {cancelled = true;window.removeEventListener("resize", onResize);};
  }, [activeIndex, labels, reduce]);

  return (
    <motion.nav
      ref={navRef}
      className="nav-dock items-center gap-1"
      aria-label={copy.mainMenu}
      onMouseMove={(event) => mouseX.set(event.clientX)}
      onMouseLeave={() => mouseX.set(-10000)}
    >
      <span ref={pillRef} className="nav-active-pill" aria-hidden="true" />
      {items.map((item, index) => <DockLink key={item.href} item={item} pathname={pathname} mouseX={mouseX} index={index} />)}
    </motion.nav>
  );
}
