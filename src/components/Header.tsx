"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { site } from "@/data/site";
import { uiCopy } from "@/data/ui-copy";
import { localizePath } from "@/lib/i18n";
import { useLocale } from "@/components/LocaleProvider";
import { AnimatedNavDock } from "@/components/AnimatedNavDock";
import { LanguageSwitch } from "@/components/LanguageSwitch";
import { ThemeControl } from "@/components/ThemeControl";

const routes = ["/", "/hot-tours", "/destinations", "/health-tours", "/reviews", "/contacts"];
export function Header() {
  const locale = useLocale(); const copy = uiCopy[locale];
  const pathname = usePathname();
  const [openAt, setOpenAt] = useState<string | null>(null);
  const open = openAt === pathname;
  const [scrolled, setScrolled] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  const menu = useRef<HTMLElement>(null);
  const previousPath = useRef(pathname);
  const nav = routes.map((href,index) => ({href:localizePath(href,locale),label:copy.nav[index]}));
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll(); window.addEventListener("scroll",onScroll,{passive:true});
    return () => window.removeEventListener("scroll",onScroll);
  }, []);
  useEffect(() => {
    if (previousPath.current !== pathname) {
      previousPath.current = pathname;
      document.querySelector<HTMLElement>("#content")?.focus({preventScroll:true});
    }
  }, [pathname]);
  useEffect(() => {
    if (!open) return;
    menu.current?.querySelector("a")?.focus({preventScroll:true});
    const key = (event: KeyboardEvent) => { if(event.key === "Escape") {setOpenAt(null); trigger.current?.focus();} };
    const media = window.matchMedia("(min-width: 900px)");
    const resize = () => { if (media.matches) setOpenAt(null); };
    document.addEventListener("keydown",key); media.addEventListener("change",resize);
    return () => {document.removeEventListener("keydown",key);media.removeEventListener("change",resize);};
  }, [open]);
  const lead = localizePath("/contacts#lead", locale);
  return <header className={`site-header ${scrolled ? "is-scrolled" : ""}`}>
    <div className="header-inner">
      <Link href={localizePath("/", locale)} className="brand-logo" aria-label={copy.home}>
        <svg width="0" height="0" aria-hidden="true" focusable="false" className="brand-logo-filter">
          <defs>
            <filter id="brand-logo-dark" colorInterpolationFilters="sRGB" x="0" y="0" width="100%" height="100%">
              {/* Isolate dark ink while preserving the original coloured artwork and transparency. */}
              <feColorMatrix in="SourceGraphic" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  -0.2126 -0.7152 -0.0722 0 1" />
              <feComponentTransfer><feFuncA type="discrete" tableValues="0 0 0 0 0 0 0 0 0 1" /></feComponentTransfer>
              <feComposite in2="SourceAlpha" operator="in" result="dark-ink" />
              <feFlood floodColor="#f1f4ff" />
              <feComposite in2="dark-ink" operator="in" result="light-ink" />
              <feMerge><feMergeNode in="SourceGraphic" /><feMergeNode in="light-ink" /></feMerge>
            </filter>
          </defs>
        </svg>
        <Image src="/images/logo.png" alt="Almaz Tour" width={158} height={60} priority className="h-10 w-auto"/>
      </Link>
      <AnimatedNavDock items={nav} pathname={pathname}/>
      <div className="header-actions"><a className="header-phone" href={site.phones[0].href}>{site.phones[0].label}</a>
        <LanguageSwitch/><ThemeControl/>
        <Link href={lead} className="button-primary header-cta">{copy.lead}</Link>
        <button ref={trigger} type="button" className="menu-toggle" aria-controls="mobile-navigation" aria-expanded={open}
          aria-label={open ? copy.closeMenu : copy.openMenu} onClick={() => {setOpenAt(open ? null : pathname); if(open) trigger.current?.focus();}}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d={open ? "M6 6l12 12M18 6L6 18" : "M4 7h16M4 12h16M4 17h16"} stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
        </button>
      </div>
    </div>
    {open && <nav ref={menu} id="mobile-navigation" className="mobile-navigation" aria-label={copy.mobileMenu} data-lenis-prevent>
      {nav.map((item,index) => <Link key={item.href} href={item.href} aria-current={(index === 0 ? pathname === item.href : pathname.startsWith(item.href)) ? "page" : undefined} onClick={() => setOpenAt(null)}>{item.label}</Link>)}
      <div className="mobile-menu-actions"><a href={site.phones[0].href}>{site.phones[0].label}</a><Link href={lead} className="button-primary" onClick={() => setOpenAt(null)}>{copy.lead}</Link><LanguageSwitch/></div>
    </nav>}
  </header>;
}
