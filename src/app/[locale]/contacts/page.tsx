import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LeadForm } from "@/components/forms/LeadForm";
import { PageHeading } from "@/components/PageHeading";
import { Reveal } from "@/components/Reveal";
import { getPageMetadata, pageCopy, type LocalizedPageProps } from "@/data/page-copy";
import { site } from "@/data/site";
import { hasLocale } from "@/lib/i18n";

export async function generateMetadata({ params }: LocalizedPageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(locale)) notFound();
  return getPageMetadata(locale, "/contacts", pageCopy[locale].contacts.meta);
}

export default async function ContactsPage({ params }: LocalizedPageProps) {
  const { locale } = await params;
  if (!hasLocale(locale)) notFound();
  const { contacts: copy, common } = pageCopy[locale];
  return (
    <>
      <PageHeading locale={locale} title={copy.title} description={copy.intro}>
        <a href="#lead" className="button-primary">{common.request}</a>
        <a href={site.social.whatsapp} target="_blank" rel="noopener noreferrer" className="button-secondary">{common.whatsapp}</a>
      </PageHeading>
      <section className="section">
        <div className="container grid gap-6 md:grid-cols-3">
          <Reveal className="surface h-full rounded-2xl p-7">
            <h2 className="ink text-xl font-extrabold">{copy.office}</h2>
            <address className="ink mt-4 text-lg font-semibold not-italic leading-7">{copy.address}</address>
            <h3 className="ink mt-5 font-bold">{copy.hours}</h3>
            <ul className="muted mt-2 space-y-2 leading-6">
              {site.hours.map((hours, index) => <li key={hours.days}><span className="ink font-semibold">{copy.days[index]}:</span> {hours.time}</li>)}
            </ul>
            <a href={site.address.map2gis} target="_blank" rel="noopener noreferrer" className="button-secondary mt-5">{common.map}<span aria-hidden="true">↗</span></a>
          </Reveal>
          <Reveal delay={80} className="surface h-full min-w-0 rounded-2xl p-7">
            <h2 className="ink text-xl font-extrabold">{copy.phones}</h2>
            <ul className="mt-4 space-y-2">
              {site.phones.map((phone) => <li key={phone.href}><a href={phone.href} className="ink inline-flex min-h-11 items-center text-lg font-bold underline-offset-4 hover:underline">{phone.label}</a></li>)}
              <li><a href={`mailto:${site.email}`} className="ink inline-flex min-h-11 items-center break-all underline-offset-4 hover:underline">{site.email}</a></li>
            </ul>
          </Reveal>
          <Reveal delay={160} className="surface h-full rounded-2xl p-7">
            <h2 className="ink text-xl font-extrabold">{copy.social}</h2>
            <ul className="mt-4 space-y-2">
              {[
                { href: site.social.whatsapp, label: "WhatsApp" },
                { href: site.social.instagram, label: "Instagram @almaztour.kz" },
                { href: site.social.facebook, label: "Facebook /almaztour.kz" },
              ].map((social) => <li key={social.href}><a href={social.href} target="_blank" rel="noopener noreferrer" className="ink inline-flex min-h-11 items-center font-semibold underline-offset-4 hover:underline">{social.label}</a></li>)}
            </ul>
          </Reveal>
        </div>
      </section>
      <section id="lead" className="section surface-soft" aria-labelledby="contacts-lead-title">
        <div className="container">
          <div className="mx-auto max-w-4xl">
            <Reveal><h2 id="contacts-lead-title" className="ink text-3xl font-extrabold tracking-tight">{copy.leadTitle}</h2><p className="muted mb-8 mt-3 max-w-2xl leading-7">{copy.leadText}</p></Reveal>
            <Reveal delay={100} className="surface rounded-3xl p-6 sm:p-8"><LeadForm mode="detailed" /></Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
