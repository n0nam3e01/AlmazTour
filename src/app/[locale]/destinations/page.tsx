import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DestinationCard } from "@/components/DestinationCard";
import { PageHeading } from "@/components/PageHeading";
import { Reveal } from "@/components/Reveal";
import { getDestinations } from "@/data/destinations";
import { getPageMetadata, pageCopy, type LocalizedPageProps } from "@/data/page-copy";
import { hasLocale, localizePath } from "@/lib/i18n";

export async function generateMetadata({ params }: LocalizedPageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(locale)) notFound();
  return getPageMetadata(locale, "/destinations", pageCopy[locale].catalog.meta);
}

export default async function DestinationsPage({ params }: LocalizedPageProps) {
  const { locale } = await params;
  if (!hasLocale(locale)) notFound();
  const { catalog: copy, common } = pageCopy[locale];
  return (
    <>
      <PageHeading locale={locale} title={copy.title} description={copy.intro}>
        <Link href={localizePath("/contacts#lead", locale)} className="button-primary">{common.manager}</Link>
      </PageHeading>
      <section className="section">
        <div className="container grid auto-rows-fr gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {getDestinations(locale).map((destination, index) => (
            <Reveal key={destination.slug} delay={(index % 3) * 70}>
              <DestinationCard destination={destination} locale={locale} priority={index < 3} />
            </Reveal>
          ))}
        </div>
      </section>
      <section className="section surface-soft">
        <div className="container">
          <Reveal className="flex flex-wrap items-center justify-between gap-6">
            <div><h2 className="ink text-2xl font-extrabold sm:text-3xl">{copy.helpTitle}</h2><p className="muted mt-3 max-w-2xl leading-7">{copy.helpText}</p></div>
            <Link href={localizePath("/contacts#lead", locale)} className="button-primary">{common.request}<span aria-hidden="true">→</span></Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
