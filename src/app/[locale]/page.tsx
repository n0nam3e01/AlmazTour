import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AccordionGallery } from "@/components/AccordionGallery";
import { ClickSpark } from "@/components/ClickSpark";
import { LeadForm } from "@/components/forms/LeadForm";
import { Reveal } from "@/components/Reveal";
import { ReviewsShowcase } from "@/components/ReviewsShowcase";
import { TourvisorModule } from "@/components/TourvisorModule";
import { getDestinations } from "@/data/destinations";
import { getPageMetadata, pageCopy, type LocalizedPageProps } from "@/data/page-copy";
import { reviews } from "@/data/reviews";
import { site } from "@/data/site";
import { hasLocale, localizePath } from "@/lib/i18n";
import { HeroParallax } from "@/components/HeroParallax";

export async function generateMetadata({ params }: LocalizedPageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(locale)) notFound();
  return getPageMetadata(locale, "/", pageCopy[locale].home.meta);
}

export default async function HomePage({ params }: LocalizedPageProps) {
  const { locale } = await params;
  if (!hasLocale(locale)) notFound();
  const { home: copy, common, contacts } = pageCopy[locale];
  const popularDestinations = getDestinations(locale).slice(0, 5);
  const featuredDestination = popularDestinations[2];

  return (
    <>
      <section className="travel-hero home-hero">
        <HeroParallax>
          <Image src="/images/destinations/maldives.jpg" alt="" fill loading="eager" fetchPriority="high" sizes="100vw" className="object-cover object-[62%_center]" />
          <div className="hero-shade absolute inset-0" />
        </HeroParallax>
        <div className="container home-hero-layout relative grid gap-10 py-14 sm:py-20 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-center lg:gap-14">
          <div className="home-hero-copy relative z-10 max-w-3xl">
            <p className="home-hero-eyebrow eyebrow text-gold-300">{copy.eyebrow}</p>
            <h1 className="home-hero-title mt-5 max-w-4xl text-balance font-bold text-white">{copy.slogan}</h1>
            <p className="home-hero-description mt-5 max-w-xl text-base leading-7 text-white/90 sm:text-lg">{copy.intro}</p>
            <div className="home-hero-actions mt-7 flex flex-wrap gap-3">
              <ClickSpark><a href="#search" className="button-primary">{common.search}<span aria-hidden="true">→</span></a></ClickSpark>
              <a href="#lead" className="inline-flex min-h-12 items-center justify-center rounded-xl border border-white/60 bg-navy-950/60 px-6 py-3 font-bold text-white transition-colors hover:bg-navy-950">{common.manager}</a>
            </div>
          </div>
          <Link href={localizePath(`/destinations/${featuredDestination.slug}`, locale)} className="hero-featured-card group relative z-10 hidden lg:block" aria-label={`${copy.featuredLabel}: ${featuredDestination.name}`}>
            <div className="hero-featured-image">
              <Image src={featuredDestination.image} alt={`${featuredDestination.name} — ${featuredDestination.tagline}`} fill sizes="340px" className="object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="hero-featured-topline">
                <span className="hero-featured-label">{copy.featuredLabel}</span>
                <span className="hero-featured-index" aria-hidden="true">03 <span>/ 05</span></span>
              </div>
              <div className="hero-featured-content">
                <div>
                  <p className="hero-featured-name">{featuredDestination.name}</p>
                  <p className="hero-featured-tagline">{featuredDestination.tagline}</p>
                </div>
                <span className="hero-featured-arrow" aria-hidden="true">↗</span>
              </div>
            </div>
          </Link>
        </div>
      </section>

      <section id="search" className="home-search-section" aria-labelledby="search-title">
        <div className="container">
          <Reveal className="surface home-search-shell">
            <div className="home-search-copy">
              <p className="home-search-eyebrow eyebrow muted">Almaz Tour · 01</p>
              <h2 id="search-title" className="ink mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">{copy.searchTitle}</h2>
              <p className="muted mt-3 max-w-2xl leading-7">{copy.searchText}</p>
              {locale === "kk" && <p className="muted mt-2 text-sm">{common.widgetLanguage}</p>}
            </div>
            <div className="home-search-widget min-w-0">
            <div className="overflow-x-auto" data-lenis-prevent>
              <TourvisorModule type="tv-search-form" moduleId={process.env.NEXT_PUBLIC_TV_SEARCH_ID} minHeight={220} skeletonRows={2} />
            </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section" aria-labelledby="destinations-title">
        <div className="container">
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-5">
              <div>
                <p className="eyebrow muted">{copy.destinationsEyebrow}</p>
                <h2 id="destinations-title" className="home-destinations-title ink mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">{copy.destinationsTitle}</h2>
                <p className="muted mt-4 max-w-2xl leading-7">{copy.destinationsText}</p>
              </div>
              <Link href={localizePath("/destinations", locale)} className="button-secondary">{common.allDestinations}<span aria-hidden="true">→</span></Link>
            </div>
          </Reveal>
          <Reveal className="mt-8"><AccordionGallery items={popularDestinations} defaultIndex={2} /></Reveal>
        </div>
      </section>

      <section className="section surface-soft" aria-labelledby="hot-title">
        <div className="container">
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-5">
              <div>
                <p className="eyebrow muted">{copy.hotEyebrow}</p>
                <h2 id="hot-title" className="ink mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">{copy.hotTitle}</h2>
                <p className="muted mt-4 max-w-2xl leading-7">{copy.hotText}</p>
              </div>
              <Link href={localizePath("/hot-tours", locale)} className="button-secondary">{copy.allTours}<span aria-hidden="true">→</span></Link>
            </div>
          </Reveal>
          <Reveal delay={90} className="surface mt-8 min-w-0 rounded-3xl p-4 sm:p-6">
            <TourvisorModule type="tv-hot-tours" moduleId={process.env.NEXT_PUBLIC_TV_HOT_HOME_ID} minHeight={420} />
          </Reveal>
        </div>
      </section>

      <section className="section surface-soft" aria-labelledby="workflow-title">
        <div className="container">
          <Reveal>
            <p className="eyebrow muted">{copy.workflowEyebrow}</p>
            <h2 id="workflow-title" className="ink mt-3 text-balance text-3xl font-extrabold tracking-tight sm:text-4xl">{copy.workflowTitle}</h2>
          </Reveal>
          <ol className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {copy.steps.map((step, index) => (
              <li key={step.title}>
                <Reveal delay={index * 60} className="surface h-full rounded-2xl p-6">
                  <span aria-hidden="true" className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-gold-400 font-extrabold text-navy-950">{index + 1}</span>
                  <h3 className="ink mt-5 text-lg font-extrabold">{step.title}</h3>
                  <p className="muted mt-3 text-sm leading-6">{step.text}</p>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section" aria-labelledby="agency-title">
        <div className="container grid gap-10 lg:grid-cols-2 lg:items-center">
          <Reveal>
            <p className="eyebrow muted">{copy.agencyEyebrow}</p>
            <h2 id="agency-title" className="ink mt-3 max-w-xl text-balance text-3xl font-extrabold tracking-tight sm:text-4xl">{copy.agencyTitle}</h2>
            <div className="prose-copy mt-6 max-w-xl space-y-4">
              <p>{copy.agencyText}</p><p>{copy.agencyMore}</p>
            </div>
            <Link href="#lead" className="button-secondary mt-7">{common.manager}<span aria-hidden="true">→</span></Link>
          </Reveal>
          <Reveal delay={100}>
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="relative min-h-80 overflow-hidden rounded-3xl sm:min-h-100">
                <Image src="/images/destinations/greece.jpg" alt={copy.agencyImageAlt} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw" className="object-cover" />
                <div className="absolute inset-x-0 bottom-0 bg-navy-950/85 p-5 text-white">
                  <p className="text-xs font-bold uppercase tracking-wider text-gold-300">{copy.teamExperience}</p>
                  <p className="mt-2 text-lg font-bold leading-snug">{copy.teamCaption}</p>
                </div>
              </div>
              <div className="surface-soft ink flex flex-col justify-between gap-6 rounded-3xl p-6">
                <div>
                  <p className="muted text-sm">{copy.founded}</p>
                  <p className="mt-2 text-5xl font-semibold tracking-tight">{site.foundedYear}</p>
                  <p className="muted mt-2 text-sm">{copy.foundedCaption}</p>
                </div>
                {copy.agencyFacts.map((fact) => <div key={fact.title}><h3 className="text-xl font-bold">{fact.title}</h3><p className="muted mt-2 text-sm leading-6">{fact.text}</p></div>)}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section surface-soft" aria-labelledby="reviews-title">
        <div className="container">
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-5">
              <div><p className="eyebrow muted">{copy.reviewsEyebrow}</p><h2 id="reviews-title" className="ink mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">{copy.reviewsTitle}</h2></div>
              <Link href={localizePath("/reviews", locale)} className="button-secondary">{copy.allReviews}<span aria-hidden="true">→</span></Link>
            </div>
          </Reveal>
          <Reveal delay={100} className="mt-8"><ReviewsShowcase reviews={reviews} /></Reveal>
        </div>
      </section>

      <section id="lead" className="section" aria-labelledby="lead-title">
        <div className="container grid gap-8 lg:grid-cols-2 lg:gap-14">
          <Reveal>
            <p className="eyebrow muted">{copy.leadEyebrow}</p>
            <h2 id="lead-title" className="ink mt-3 max-w-xl text-balance text-3xl font-extrabold tracking-tight sm:text-4xl">{copy.leadTitle}</h2>
            <p className="muted mt-5 max-w-xl leading-7">{copy.leadText}</p>
            <div className="mt-6 flex flex-wrap gap-3"><a href={site.social.whatsapp} target="_blank" rel="noopener noreferrer" className="button-primary">{common.whatsapp}</a><a href={site.phones[0].href} className="button-secondary">{site.phones[0].label}</a></div>
            <address className="ink mt-8 space-y-3 text-sm not-italic leading-6">
              <p className="font-bold">{contacts.address}</p>
              <ul aria-label={contacts.hours}>{site.hours.map((hours, index) => <li key={hours.days}><span className="font-semibold">{contacts.days[index]}:</span> {hours.time}</li>)}</ul>
              <a href={site.address.map2gis} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center font-bold underline underline-offset-4">{common.map}<span aria-hidden="true" className="ml-2">↗</span></a>
            </address>
          </Reveal>
          <Reveal delay={90}>
            <div className="surface rounded-3xl p-6 sm:p-8"><LeadForm mode="quick" /></div>
            <Link href={localizePath("/contacts#lead", locale)} className="ink mt-4 inline-flex min-h-11 items-center gap-2 font-semibold underline underline-offset-4">{common.detailed}<span aria-hidden="true">→</span></Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
