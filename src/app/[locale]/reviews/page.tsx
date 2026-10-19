import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHeading } from "@/components/PageHeading";
import { ReviewCard } from "@/components/ReviewCard";
import { ReviewForm } from "@/components/forms/ReviewForm";
import { Reveal } from "@/components/Reveal";
import { getPageMetadata, pageCopy, type LocalizedPageProps } from "@/data/page-copy";
import { reviews } from "@/data/reviews";
import { hasLocale } from "@/lib/i18n";

export async function generateMetadata({ params }: LocalizedPageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(locale)) notFound();
  return getPageMetadata(locale, "/reviews", pageCopy[locale].reviews.meta);
}

export default async function ReviewsPage({ params }: LocalizedPageProps) {
  const { locale } = await params;
  if (!hasLocale(locale)) notFound();
  const copy = pageCopy[locale].reviews;
  return (
    <>
      <PageHeading locale={locale} title={copy.title} description={copy.intro}><a href="#leave-review" className="button-primary">{copy.leave}</a></PageHeading>
      <section className="section">
        <div className="container">
          <div className="columns-1 gap-6 md:columns-2 lg:columns-3 [&>*]:mb-6 [&>*]:break-inside-avoid">
            {reviews.map((review, index) => (
              <Reveal key={review.name + index} delay={(index % 3) * 70}><ReviewCard review={review} full /></Reveal>
            ))}
          </div>
        </div>
      </section>
      <section id="leave-review" className="section surface-soft" aria-labelledby="review-form-title">
        <div className="container">
          <div className="mx-auto max-w-3xl">
            <Reveal><h2 id="review-form-title" className="ink text-3xl font-extrabold tracking-tight">{copy.leave}</h2><p className="muted mb-8 mt-3 leading-7">{copy.formText}</p></Reveal>
            <Reveal delay={100} className="surface rounded-3xl p-6 sm:p-8"><ReviewForm /></Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
