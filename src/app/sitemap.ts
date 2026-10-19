import type { MetadataRoute } from "next";
import { destinations } from "@/data/destinations";
import { site } from "@/data/site";
import { locales, localizePath } from "@/lib/i18n";
export default function sitemap(): MetadataRoute.Sitemap {
 const paths = ["/", "/hot-tours", "/destinations", "/health-tours", "/reviews", "/contacts", ...destinations.map(d=>"/destinations/"+d.slug)];
 return paths.flatMap(path=>locales.map(locale=>({
  url:site.url+localizePath(path,locale),
  changeFrequency: path==="/hot-tours" ? "daily" as const : "monthly" as const,
  priority:path==="/" ? 1 : 0.7,
  alternates:{languages:{ru:site.url+localizePath(path,"ru"),kk:site.url+localizePath(path,"kk"),"x-default":site.url+localizePath(path,"ru")}},
 })));
}
