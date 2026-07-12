import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Script from "next/script";
import { Reveal } from "@/components/Reveal";
import { DestinationCard } from "@/components/DestinationCard";
import { LeadForm } from "@/components/forms/LeadForm";
import { destinations, getDestination } from "@/data/destinations";
import { site } from "@/data/site";

type Props = { params: Promise<{ slug: string }> };

/* Все 15 страниц направлений генерируются статически при сборке */
export function generateStaticParams() {
  return destinations.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const dest = getDestination(slug);
  if (!dest) return {};
  return {
    title: dest.title,
    description: dest.excerpt,
    alternates: { canonical: `/destinations/${dest.slug}` },
    openGraph: {
      title: `${dest.title} | Almaz Tour`,
      description: dest.excerpt,
      images: [{ url: dest.image }],
    },
  };
}

export default async function DestinationPage({ params }: Props) {
  const { slug } = await params;
  const dest = getDestination(slug);
  if (!dest) notFound();

  /* Три соседних направления для блока «Куда ещё» */
  const index = destinations.findIndex((d) => d.slug === dest.slug);
  const related = [1, 2, 3].map(
    (offset) => destinations[(index + offset) % destinations.length]
  );

  /* Разметка турпредложения для поисковиков */
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    name: dest.title,
    description: dest.excerpt,
    touristType: "leisure",
    itinerary: { "@type": "Place", name: dest.name },
    provider: { "@type": "TravelAgency", name: "Almaz Tour", url: site.url },
  };

  return (
    <>
      {/* Хиро с фотографией страны */}
      <section className="relative bg-navy-950">
        <div className="absolute inset-0">
          <Image
            src={dest.image}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/50 to-navy-950/30" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 pb-14 pt-20 sm:px-6 lg:px-8 lg:pb-20 lg:pt-28">
          <nav aria-label="Хлебные крошки" className="text-sm text-white/60">
            <Link href="/destinations" className="hover:text-gold-300">
              Направления
            </Link>
            <span className="mx-2">/</span>
            <span className="text-white/90">{dest.name}</span>
          </nav>
          <h1 className="mt-4 max-w-3xl text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
            {dest.title}
          </h1>
          <p className="mt-3 text-lg font-semibold text-gold-300">{dest.tagline}</p>
        </div>
      </section>

      {/* Факты о стране */}
      <section className="border-b border-navy-50 bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-px overflow-hidden px-4 py-6 sm:px-6 md:grid-cols-4 lg:px-8">
          {dest.facts.map((f) => (
            <div key={f.label} className="px-4 py-3">
              <p className="text-xs font-bold uppercase tracking-wider text-navy-400">
                {f.label}
              </p>
              <p className="mt-1 font-bold text-navy-950">{f.value}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Вступление и причины поехать */}
      <section className="py-14 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[1.6fr_1fr] lg:gap-16">
            <div>
              <Reveal>
                {dest.intro.map((p) => (
                  <p
                    key={p.slice(0, 24)}
                    className="mb-4 max-w-[65ch] text-lg leading-relaxed text-navy-800/85"
                  >
                    {p}
                  </p>
                ))}
              </Reveal>

              <Reveal className="mt-10">
                <h2 className="text-2xl font-extrabold tracking-tight text-navy-950 sm:text-3xl">
                  Зачем ехать {dest.nameTo}
                </h2>
              </Reveal>

              <div className="mt-6 space-y-6">
                {dest.reasons.map((r, i) => (
                  <Reveal key={r.title} delay={i * 60}>
                    <div className="rounded-2xl bg-azure-50 p-6">
                      <h3 className="text-lg font-extrabold text-navy-950">
                        {r.title}
                      </h3>
                      <p className="mt-2 max-w-[70ch] leading-relaxed text-navy-800/75">
                        {r.text}
                      </p>
                    </div>
                  </Reveal>
                ))}
              </div>

              {dest.note && (
                <Reveal className="mt-8">
                  <p className="rounded-2xl border-l-4 border-gold-400 bg-gold-100/50 p-5 font-semibold text-navy-950">
                    {dest.note}
                  </p>
                </Reveal>
              )}
            </div>

            {/* Форма заявки в сайдбаре */}
            <aside>
              <div className="sticky top-24 rounded-2xl border border-navy-100 bg-white p-6 shadow-[var(--shadow-card)]">
                <h2 className="text-xl font-extrabold text-navy-950">
                  Подобрать тур {dest.nameTo}
                </h2>
                <p className="mb-5 mt-2 text-sm text-navy-800/70">
                  Оставьте контакты — менеджер предложит несколько вариантов
                  под ваши даты и бюджет.
                </p>
                <LeadForm defaultCountry={dest.name} />
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* Куда ещё */}
      <section className="bg-azure-50 py-14 lg:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <h2 className="text-2xl font-extrabold tracking-tight text-navy-950 sm:text-3xl">
              Куда ещё стоит посмотреть
            </h2>
          </Reveal>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((d, i) => (
              <Reveal key={d.slug} delay={i * 80}>
                <DestinationCard destination={d} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <Script
        id={`schema-trip-${dest.slug}`}
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
