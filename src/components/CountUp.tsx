"use client";

import { useEffect, useRef, useState } from "react";

/** Анимированный счётчик: считает от нуля до value, когда блок появился на экране */
export function CountUp({
  value,
  suffix = "",
  duration = 1600,
}: {
  value: number | string;
  suffix?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    if (typeof value === "string") return;

    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting || started.current) return;
        started.current = true;

        /* Уважение к prefers-reduced-motion: показываем число сразу */
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
          setDisplay(value);
          return;
        }

        const start = performance.now();
        const tick = (now: number) => {
          const progress = Math.min((now - start) / duration, 1);
          /* ease-out: быстро в начале, мягко в конце */
          const eased = 1 - Math.pow(1 - progress, 3);
          setDisplay(Math.round(eased * value));
          if (progress < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.4 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [value, duration]);

  return (
    <span ref={ref}>
      {typeof value === "number" ? display.toLocaleString("ru-RU") : value}
      {suffix}
    </span>
  );
}
