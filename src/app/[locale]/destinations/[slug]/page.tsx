import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DestinationCard } from "@/components/DestinationCard";
import { LeadForm } from "@/components/forms/LeadForm";
import { Reveal } from "@/components/Reveal";
import { destinations, getDestination, getDestinations } from "@/data/destinations";
import { getPageMetadata, pageCopy } from "@/data/page-copy";
import { hasLocale, localizePath } from "@/lib/i18n";

type Props = { params: Promise<{ locale: string; slug: string }> };

export function generateStaticParams() {
  return destinations.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!hasLocale(locale)) notFound();
  const destination = getDestination(slug, locale);
  if (!destination) notFound();
  return getPageMetadata(locale, `/destinations/${slug}`, { title: destination.title, description: destination.excerpt }, destination.image);
}

export default async function DestinationPage({ params }: Props) {
  const { locale, slug } = await params;
  if (!hasLocale(locale)) notFound();
  const destination = getDestination(slug, locale);
  if (!destination) notFound();
  const { country: copy, common } = pageCopy[locale];
  const catalog = getDestinations(locale);
  const index = catalog.findIndex((item) => item.slug === slug);
  const related = [1, 2, 3].map((offset) => catalog[(index + offset) % catalog.length]);

  return (
    <>
      <section className="relative isolate overflow-hidden bg-navy-950">
        <div className="absolute inset-0 -z-10" aria-hidden="true">
          <Image src={destination.image} alt="" fill loading="eager" fetchPriority="high" sizes="100vw" className="object-cover opacity-55" />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/40 to-navy-950/20" />
        </div>
        <div className="container py-12 sm:py-18">
          <div className="mb-6 flex flex-wrap gap-3">
            <Link href={localizePath("/destinations", locale)} className="button-primary"><span aria-hidden="true">←</span>{common.allDestinations}</Link>
            <Link href={localizePath("/", locale)} className="inline-flex min-h-12 items-center justify-center rounded-xl border border-white/60 bg-navy-950/60 px-5 py-3 font-semibold text-white">{common.home}</Link>
          </div>
          <nav aria-label={common.breadcrumbs} className="flex flex-wrap items-center gap-2 text-sm text-white/90">
            <Link href={localizePath("/destinations", locale)} className="inline-flex min-h-11 items-center underline-offset-4 hover:underline">{common.destinations}</Link>
            <span aria-hidden="true">/</span><span aria-current="page">{destination.name}</span>
          </nav>
          <h1 className="mt-3 max-w-4xl text-balance text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl">{destination.title}</h1>
          <p className="mt-4 text-lg font-semibold text-gold-300">{destination.tagline}</p>
        </div>
      </section>

      <section className="surface-soft py-6" aria-label={copy.factsTitle}>
        <dl className="container grid grid-cols-2 gap-6 md:grid-cols-4">
          {destination.facts.map((fact) => <div key={fact.label}><dt className="muted text-sm font-semibold">{fact.label}</dt><dd className="ink mt-2 font-bold">{fact.value}</dd></div>)}
        </dl>
      </section>

      <section className="section">
        <div className="container grid gap-10 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:gap-14">
          <div className="min-w-0">
            <Reveal className="prose-copy space-y-4 text-lg">{destination.intro.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</Reveal>
            <Reveal className="mt-10"><h2 className="ink text-balance text-2xl font-extrabold tracking-tight sm:text-3xl">{copy.reasonsTitle}</h2></Reveal>
            <div className="mt-6 space-y-5">
              {destination.reasons.map((reason, reasonIndex) => (
                <Reveal key={reason.title} delay={reasonIndex * 60} className="surface-soft rounded-2xl p-6">
                  <h3 className="ink text-lg font-extrabold">{reason.title}</h3><p className="muted mt-3 leading-7">{reason.text}</p>
                </Reveal>
              ))}
            </div>
            {destination.note && <Reveal className="surface mt-8 rounded-2xl border-l-4 border-gold-400 p-6"><h2 className="ink text-xl font-bold">{copy.seasonTitle}</h2><p className="ink mt-3 leading-7">{destination.note}</p><p className="muted mt-3 text-sm leading-6">{copy.seasonNote}</p></Reveal>}
          </div>
          <aside id="lead" className="min-w-0" aria-labelledby="country-lead-title">
            <div className="surface rounded-3xl p-6 sm:p-8">
              <h2 id="country-lead-title" className="ink text-2xl font-extrabold">{copy.leadTitle}</h2>
              <p className="ink mt-2 font-semibold">{destination.name}</p>
              <p className="muted mb-6 mt-3 text-sm leading-6">{copy.leadText}</p>
              <LeadForm mode="detailed" defaultCountry={destination.name} context={destination.slug} />
            </div>
          </aside>
        </div>
      </section>

      <section className="section surface-soft">
        <div className="container">
          <Reveal><h2 className="ink text-2xl font-extrabold tracking-tight sm:text-3xl">{copy.relatedTitle}</h2></Reveal>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((item, relatedIndex) => <Reveal key={item.slug} delay={relatedIndex * 80}><DestinationCard destination={item} locale={locale} /></Reveal>)}
          </div>
        </div>
      </section>
    </>
  );
}
