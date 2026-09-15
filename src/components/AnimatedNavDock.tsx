"use client";

import Link from "next/link";
import { useLayoutEffect, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform, type MotionValue } from "motion/react";

type Item = { href: string; label: string };

function DockLink({ item, pathname, mouseX, index }: { item: Item; pathname: string; mouseX: MotionValue<number>; index: number }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const distance = useTransform(mouseX, (cursorX) => {
    const rect = ref.current?.getBoundingClientRect();
    return rect ? cursorX - (rect.left + rect.width / 2) : 9999;
  });
  const scale = useSpring(useTransform(distance, [-130, 0, 130], [1, 1.1, 1]), { stiffness: 360, damping: 26, mass: 0.25 });
  const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

  return (
    <motion.div style={{ scale, transformOrigin: "center bottom" }} className="nav-dock-item">
      <Link
        ref={ref}
        href={item.href}
        data-nav-index={index}
        aria-current={active ? "page" : undefined}
        className={`relative block whitespace-nowrap rounded-xl px-3 py-2 text-[15px] font-semibold ${active ? "text-navy-950" : "text-navy-800/80 hover:text-navy-950"}`}
      >
        <span className="relative z-[1]">{item.label}</span>
      </Link>
    </motion.div>
  );
}

export function AnimatedNavDock({ items, pathname }: { items: Item[]; pathname: string }) {
  const mouseX = useMotionValue(-10000);
  const navRef = useRef<HTMLElement>(null);
  const pillRef = useRef<HTMLSpanElement>(null);
  const readyRef = useRef(false);
  const activeIndex = items.findIndex((item) => item.href === "/" ? pathname === "/" : pathname.startsWith(item.href));

  useLayoutEffect(() => {
    const nav = navRef.current;
    const pill = pillRef.current;
    const link = nav?.querySelector<HTMLElement>(`[data-nav-index="${activeIndex}"]`);
    if (!nav || !pill || !link) return;
    const update = (animate: boolean) => {
      const navRect = nav.getBoundingClientRect();
      const linkRect = link.getBoundingClientRect();
      pill.style.transition = animate ? "transform 420ms cubic-bezier(0.23, 1, 0.32, 1), width 420ms cubic-bezier(0.23, 1, 0.32, 1)" : "none";
      pill.style.width = `${linkRect.width}px`;
      pill.style.transform = `translateX(${linkRect.left - navRect.left}px)`;
    };
    update(readyRef.current);
    readyRef.current = true;
    const onResize = () => update(false);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [activeIndex]);

  return (
    <motion.nav
      ref={navRef}
      className="nav-dock hidden items-center gap-1 lg:flex"
      aria-label="Основное меню"
      onMouseMove={(event) => mouseX.set(event.clientX)}
      onMouseLeave={() => mouseX.set(-10000)}
    >
      <span ref={pillRef} className="nav-active-pill" aria-hidden="true" />
      {items.map((item, index) => <DockLink key={item.href} item={item} pathname={pathname} mouseX={mouseX} index={index} />)}
    </motion.nav>
  );
}
