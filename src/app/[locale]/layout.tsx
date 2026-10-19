import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import "../globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";
import { LocaleProvider } from "@/components/LocaleProvider";
import { ThemeProvider } from "@/components/ThemeControl";
import { SmoothScroll } from "@/components/SmoothScroll";
import { hasLocale, locales } from "@/lib/i18n";
import { themeBootScript } from "@/lib/theme";
import { uiCopy } from "@/data/ui-copy";
import { site } from "@/data/site";

type Props = {children:React.ReactNode;params:Promise<{locale:string}>};
export function generateStaticParams() { return locales.map(locale=>({locale})); }
export async function generateMetadata({params}:Omit<Props,"children">):Promise<Metadata> {
  const {locale} = await params; if (!hasLocale(locale)) return {};
  const copy=uiCopy[locale];
  return {metadataBase:new URL(site.url),title:{default:`Almaz Tour | ${copy.slogan}`,template:"%s | Almaz Tour"},description:copy.about,
    openGraph:{type:"website",siteName:"Almaz Tour",locale:locale==="ru"?"ru_RU":"kk_KZ",alternateLocale:locale==="ru"?"kk_KZ":"ru_RU",images:[{url:"/images/destinations/maldives.jpg",width:1500,height:1001,alt:"Almaz Tour"}]},
    twitter:{card:"summary_large_image"},icons:{icon:"/icon.png"}};
}
export const viewport:Viewport = {themeColor:[{media:"(prefers-color-scheme: light)",color:"#ffffff"},{media:"(prefers-color-scheme: dark)",color:"#070d25"}]};
export default async function LocaleLayout({children,params}:Props) {
  const {locale} = await params; if(!hasLocale(locale)) notFound();
  const copy=uiCopy[locale];
  const jsonLd={"@context":"https://schema.org","@type":"TravelAgency",name:site.name,alternateName:site.nameRu,foundingDate:"2018",url:site.url,logo:site.url+"/images/logo.png",telephone:site.phones[0].href.slice(4),email:site.email,
    address:{"@type":"PostalAddress",addressLocality:"Астана",addressCountry:"KZ",streetAddress:site.address.line},hasMap:site.address.map2gis,
    openingHoursSpecification:[{"@type":"OpeningHoursSpecification",dayOfWeek:["Monday","Tuesday","Wednesday","Thursday","Friday"],opens:"10:00",closes:"20:00"},{"@type":"OpeningHoursSpecification",dayOfWeek:["Saturday","Sunday"],opens:"12:00",closes:"16:00"}],sameAs:[site.social.facebook,site.social.instagram]};
  return <html lang={locale} suppressHydrationWarning className="h-full antialiased"><head>
    <script id="almaz-theme-boot" dangerouslySetInnerHTML={{__html:themeBootScript}}/>
  </head><body className="min-h-full flex flex-col">
    <LocaleProvider locale={locale}><ThemeProvider><SmoothScroll>
      <a href="#content" className="skip-link">{copy.skip}</a><Header/>
      <main id="content" tabIndex={-1} className="flex-1">{children}</main><Footer locale={locale}/><WhatsAppFloat/>
    </SmoothScroll></ThemeProvider></LocaleProvider>
    <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(jsonLd).replace(/</g,"\\u003c")}}/>
  </body></html>;
}
