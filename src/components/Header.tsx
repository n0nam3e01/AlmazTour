"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { site } from "@/data/site";

const nav = [
  { href: "/", label: "Главная" },
  { href: "/hot-tours", label: "Горящие туры" },
  { href: "/destinations", label: "Направления" },
  { href: "/health-tours", label: "Оздоровительные туры" },
  { href: "/reviews", label: "Отзывы" },
  { href: "/contacts", label: "Контакты" },
];

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  /* Тень у шапки появляется только после начала скролла */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 bg-white/95 backdrop-blur transition-shadow ${
        scrolled ? "shadow-[0_1px_0_rgb(0_9_66/0.08),0_8px_24px_-12px_rgb(0_9_66/0.18)]" : ""
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:h-[72px] lg:px-8">
        <Link href="/" className="flex shrink-0 items-center" aria-label="Almaz Tour — на главную">
          <Image
            src="/images/logo.png"
            alt="Almaz Tour — влюбляем в путешествия"
            width={158}
            height={60}
            priority
            className="h-10 w-auto lg:h-12"
          />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Основное меню">
          {nav.map((item) => {
            const active =
              item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-lg px-3 py-2 text-[15px] font-semibold transition-colors ${
                  active
                    ? "text-navy-950 bg-azure-100"
                    : "text-navy-800/80 hover:text-navy-950 hover:bg-azure-50"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-4 lg:flex">
          <a
            href={site.phones[0].href}
            className="text-[15px] font-bold text-navy-950 hover:text-azure-600 transition-colors"
          >
            {site.phones[0].label}
          </a>
          <Link
            href="/contacts#lead"
            className="rounded-full bg-gold-400 px-5 py-2.5 text-[15px] font-bold text-navy-950 shadow-sm transition-all hover:bg-gold-300 active:translate-y-px"
          >
            Подобрать тур
          </Link>
        </div>

        {/* Кнопка мобильного меню */}
        <button
          type="button"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-label={open ? "Закрыть меню" : "Открыть меню"}
          className="flex h-11 w-11 items-center justify-center rounded-lg text-navy-950 hover:bg-azure-50 lg:hidden"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            {open ? (
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </div>

      {/* Мобильное меню */}
      {open && (
        <nav
          className="border-t border-navy-100 bg-white px-4 pb-6 pt-2 lg:hidden"
          aria-label="Мобильное меню"
        >
          {nav.map((item) => {
            const active =
              item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`block rounded-lg px-3 py-3 text-base font-semibold ${
                  active ? "bg-azure-100 text-navy-950" : "text-navy-800"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
          <div className="mt-4 flex flex-col gap-3 border-t border-navy-100 pt-4">
            <a href={site.phones[0].href} className="px-3 text-base font-bold text-navy-950">
              {site.phones[0].label}
            </a>
            <Link
              href="/contacts#lead"
              onClick={() => setOpen(false)}
              className="rounded-full bg-gold-400 px-5 py-3 text-center text-base font-bold text-navy-950"
            >
              Подобрать тур
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
