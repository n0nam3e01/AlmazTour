import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHeading } from "@/components/PageHeading";
import { Reveal } from "@/components/Reveal";
import { TourvisorModule } from "@/components/TourvisorModule";
import { LeadForm } from "@/components/forms/LeadForm";
import { getPageMetadata, pageCopy, type LocalizedPageProps } from "@/data/page-copy";
import { site } from "@/data/site";
import { hasLocale } from "@/lib/i18n";

export async function generateMetadata({ params }: LocalizedPageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(locale)) notFound();
  return getPageMetadata(locale, "/hot-tours", pageCopy[locale].hot.meta);
}

export default async function HotToursPage({ params }: LocalizedPageProps) {
  const { locale } = await params;
  if (!hasLocale(locale)) notFound();
  const { hot: copy, common } = pageCopy[locale];
  return (
    <>
      <PageHeading locale={locale} title={copy.title} description={copy.intro}>
        <a href="#offers" className="button-primary">{copy.offersTitle}<span aria-hidden="true">↓</span></a>
        <a href="#lead" className="button-secondary">{common.manager}</a>
      </PageHeading>
      <section id="offers" className="section" aria-labelledby="offers-title">
        <div className="container">
          <Reveal><h2 id="offers-title" className="ink text-2xl font-extrabold sm:text-3xl">{copy.offersTitle}</h2><p className="muted mt-3 max-w-2xl leading-7">{copy.offersText}</p></Reveal>
          {locale === "kk" && <p className="muted mt-3 text-sm">{common.widgetLanguage}</p>}
          <div className="surface mt-7 min-w-0 rounded-3xl p-4 sm:p-6" data-lenis-prevent>
            <TourvisorModule type="tv-hot-tours" moduleId={process.env.NEXT_PUBLIC_TV_HOT_PAGE_ID} minHeight={540} skeletonRows={4} />
          </div>
        </div>
      </section>
      <section className="section surface-soft" aria-labelledby="hot-workflow-title">
        <div className="container">
          <Reveal><h2 id="hot-workflow-title" className="ink text-balance text-3xl font-extrabold tracking-tight">{copy.workflowTitle}</h2></Reveal>
          <ol className="mt-8 grid gap-6 md:grid-cols-3">
            {copy.steps.map((step, index) => (
              <li key={step.title}><Reveal delay={index * 90} className="surface h-full rounded-2xl p-6">
                <span aria-hidden="true" className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-gold-400 text-lg font-extrabold text-navy-950">{index + 1}</span>
                <h3 className="ink mt-4 text-lg font-extrabold">{step.title}</h3><p className="muted mt-3 leading-7">{step.text}</p>
              </Reveal></li>
            ))}
          </ol>
        </div>
      </section>
      <section id="lead" className="section" aria-labelledby="hot-lead-title">
        <div className="container grid gap-8 lg:grid-cols-2 lg:gap-14">
          <Reveal><h2 id="hot-lead-title" className="ink text-balance text-3xl font-extrabold tracking-tight">{copy.leadTitle}</h2><p className="muted mt-4 max-w-xl leading-7">{copy.leadText}</p><a href={site.social.whatsapp} target="_blank" rel="noopener noreferrer" className="button-secondary mt-6">{common.whatsapp}</a></Reveal>
          <Reveal delay={100} className="surface rounded-3xl p-6 sm:p-8"><LeadForm mode="quick" /></Reveal>
        </div>
      </section>
    </>
  );
}
