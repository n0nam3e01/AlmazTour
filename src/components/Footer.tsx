import Link from "next/link";
import { site } from "@/data/site";
import { getDestinations } from "@/data/destinations";
import { uiCopy } from "@/data/ui-copy";
import { localizePath, type Locale } from "@/lib/i18n";
import { SubscribeForm } from "@/components/forms/SubscribeForm";
export function Footer({locale = "ru"}:{locale?:Locale}) {
 const c = uiCopy[locale];
 return <footer className="site-footer"><div className="container">
  <div className="footer-grid">
   <div><Link className="footer-wordmark" href={localizePath("/",locale)}>ALMAZ <span>TOUR</span></Link><p className="mt-3 font-semibold">{c.slogan}</p><p className="mt-4 max-w-sm text-sm leading-6 text-white/75">{c.about}</p>
    <div className="footer-socials"><a href={site.social.instagram} target="_blank" rel="noopener noreferrer">Instagram</a><a href={site.social.facebook} target="_blank" rel="noopener noreferrer">Facebook</a><a href={site.social.whatsapp} target="_blank" rel="noopener noreferrer">WhatsApp</a></div>
   </div>
   <div><h2>{c.destinations}</h2><ul className="footer-links">{getDestinations(locale).slice(0,6).map(d=><li key={d.slug}><Link href={localizePath("/destinations/"+d.slug,locale)}>{d.name}</Link></li>)}<li><Link href={localizePath("/destinations",locale)}>{c.allDestinations} →</Link></li></ul></div>
   <div><h2>{c.contacts}</h2><ul className="footer-links">{site.phones.map(p=><li key={p.href}><a href={p.href} className="whitespace-nowrap font-semibold">{p.label}</a></li>)}<li><a href={"mailto:"+site.email}>{site.email}</a></li><li>{c.address}</li>{site.hours.map((h,i)=><li key={h.days}>{c.hours[i]} {h.time}</li>)}<li><a href={site.address.map2gis} target="_blank" rel="noopener noreferrer">{c.map} ↗</a></li></ul></div>
   <div><h2>{c.newsletter}</h2><p className="mt-4 mb-5 text-sm leading-6 text-white/75">{c.newsletterText}</p><SubscribeForm/></div>
  </div>
  <div className="footer-bottom"><p>© {new Date().getFullYear()} Almaz Tour. {c.rights}</p><a href={site.phones[0].href}>{site.phones[0].label}</a></div>
 </div></footer>;
}
