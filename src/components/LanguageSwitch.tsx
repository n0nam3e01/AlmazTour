"use client";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useLayoutEffect, useRef, useSyncExternalStore } from "react";
import { useLocale } from "@/components/LocaleProvider";
import { switchLocale } from "@/lib/i18n";
import { uiCopy } from "@/data/ui-copy";
import { saveLanguageScroll } from "@/lib/scroll";
import type { Locale } from "@/lib/i18n";

type LanguageMotion = { from: number; to: Locale; at: number };
let lastMotion: LanguageMotion | null = null;
const position = (locale: Locale) => `translateX(${locale === "kk" ? 44 : 0}px)`;

function animatePill(pill: HTMLElement | null, motion: LanguageMotion) {
  if (!pill || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const elapsed = performance.now() - motion.at;
  if (elapsed >= 420) return;
  return pill.animate([{ transform: `translateX(${motion.from}px)` }, { transform: position(motion.to) }], {
    duration: 420, delay: -Math.max(0, elapsed), easing: "cubic-bezier(0.23, 1, 0.32, 1)", fill: "both",
  });
}
function subscribeHash(listener: () => void) {
  window.addEventListener("hashchange", listener);
  return () => window.removeEventListener("hashchange", listener);
}
function getHash() { return window.location.hash; }

function LanguageSwitchLinks({ locale, href }: { locale: Locale; href: string }) {
  const pill = useRef<HTMLSpanElement>(null);
  const animation = useRef<Animation | undefined>(undefined);
  useLayoutEffect(() => {
    if (lastMotion?.to === locale) animation.current = animatePill(pill.current, lastMotion);
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const stop = () => { if (media.matches) animation.current?.cancel(); };
    media.addEventListener("change", stop);
    return () => { animation.current?.cancel(); media.removeEventListener("change", stop); };
  }, [locale]);
  return <nav className="language-switch" aria-label={uiCopy[locale].language}>
    <span ref={pill} className="language-active-pill" aria-hidden="true" style={{ transform: position(locale) }} />
    {([['ru','Рус'],['kk','Қаз']] as const).map(([lang,label]) => <Link key={lang} href={switchLocale(href, lang)} hrefLang={lang} lang={lang}
      scroll={false} prefetch={false} aria-current={lang === locale ? "true" : undefined} data-language-link="true"
      onNavigate={event => {
        if (lang === locale) { event.preventDefault(); return; }
        saveLanguageScroll(switchLocale(href, lang), window.scrollY);
        const from = pill.current ? new DOMMatrix(getComputedStyle(pill.current).transform).m41 : (locale === "kk" ? 44 : 0);
        lastMotion = { from, to: lang, at: performance.now() };
        animation.current?.cancel();
        animation.current = animatePill(pill.current, lastMotion);
      }}>
      {label}
    </Link>)}
  </nav>;
}

function CurrentRouteLanguageSwitch({ locale, pathname }: { locale: Locale; pathname: string }) {
  const searchParams = useSearchParams();
  const hash = useSyncExternalStore(subscribeHash, getHash, () => "");
  const query = searchParams.toString();
  const href = `${pathname}${query ? `?${query}` : ""}${hash}`;
  return <LanguageSwitchLinks locale={locale} href={href} />;
}

export function LanguageSwitch() {
  const locale = useLocale();
  const pathname = usePathname() ?? `/${locale}`;
  return <Suspense fallback={<LanguageSwitchLinks locale={locale} href={pathname} />}>
    <CurrentRouteLanguageSwitch locale={locale} pathname={pathname} />
  </Suspense>;
}
