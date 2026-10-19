import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LeadForm } from "@/components/forms/LeadForm";
import { PageHeading } from "@/components/PageHeading";
import { Reveal } from "@/components/Reveal";
import { getPageMetadata, pageCopy, type LocalizedPageProps } from "@/data/page-copy";
import { site } from "@/data/site";
import { hasLocale, localizePath } from "@/lib/i18n";

export async function generateMetadata({ params }: LocalizedPageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(locale)) notFound();
  return getPageMetadata(locale, "/health-tours", pageCopy[locale].health.meta);
}

export default async function HealthToursPage({ params }: LocalizedPageProps) {
  const { locale } = await params;
  if (!hasLocale(locale)) notFound();
  const { health: copy, common } = pageCopy[locale];
  return (
    <>
      <PageHeading locale={locale} title={copy.title} description={copy.intro}>
        <a href="#lead" className="button-primary">{common.manager}</a>
      </PageHeading>
      <section className="section" aria-labelledby="health-help-title">
        <div className="container">
          <Reveal><h2 id="health-help-title" className="ink text-3xl font-extrabold tracking-tight">{copy.helpTitle}</h2></Reveal>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {copy.services.map((service, index) => (
              <Reveal key={service.title} delay={index * 80} className="surface h-full rounded-2xl p-7"><h3 className="ink text-xl font-extrabold">{service.title}</h3><p className="muted mt-3 leading-7">{service.text}</p></Reveal>
            ))}
          </div>
          <Reveal className="surface-soft mt-8 rounded-2xl border-l-4 border-gold-400 p-6"><p className="prose-copy max-w-4xl">{copy.note}</p></Reveal>
        </div>
      </section>
      <section id="lead" className="section surface-soft" aria-labelledby="health-lead-title">
        <div className="container grid gap-8 lg:grid-cols-2 lg:gap-14">
          <Reveal>
            <h2 id="health-lead-title" className="ink text-balance text-3xl font-extrabold tracking-tight">{copy.leadTitle}</h2>
            <p className="muted mt-4 max-w-xl leading-7">{copy.leadText}</p>
            <div className="mt-6 flex flex-wrap gap-3"><a href={site.social.whatsapp} target="_blank" rel="noopener noreferrer" className="button-primary">{common.whatsapp}</a><a href={site.phones[0].href} className="button-secondary">{site.phones[0].label}</a></div>
          </Reveal>
          <Reveal delay={100} className="surface rounded-3xl p-6 sm:p-8"><LeadForm mode="quick" /></Reveal>
        </div>
      </section>
      <section className="section">
        <div className="container"><p className="muted">{copy.leisure}</p><Link href={localizePath("/destinations", locale)} className="button-secondary mt-4">{copy.leisureLink}<span aria-hidden="true">→</span></Link></div>
      </section>
    </>
  );
}
