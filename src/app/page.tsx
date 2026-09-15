import Image from "next/image";
import Link from "next/link";
import { PhotoMosaic } from "@/components/PhotoMosaic";
import { Reveal } from "@/components/Reveal";
import { ReviewCard } from "@/components/ReviewCard";
import { TourvisorModule } from "@/components/TourvisorModule";
import { destinations } from "@/data/destinations";
import { reviews } from "@/data/reviews";
import { site } from "@/data/site";

const popularDestinations = destinations.slice(0, 5);

/** Главная — редакционный маршрут: поиск → актуальные туры → вдохновение → доверие. */
export default function HomePage() {
  return (
    <>
      <section className="travel-hero">
        <div className="absolute inset-0" aria-hidden="true">
          <Image
            src="/images/destinations/maldives.jpg"
            alt=""
            fill
            loading="eager"
            fetchPriority="high"
            sizes="100vw"
            className="object-cover object-[62%_center]"
          />
          <div className="hero-shade absolute inset-0" />
        </div>
        <div className="relative mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <div className="hero-copy">
            <p className="eyebrow hero-eyebrow">Almaz Tour · путешествуем с вами с {site.foundedYear} года</p>
            <h1 className="hero-title">
              {site.slogan}
            </h1>
            <p className="mt-6 max-w-lg text-base leading-7 text-white/90 sm:text-lg">
              Подберём тур из любой точки мира в любую точку мира.
              Посоветуем отель, поможем с документами и будем на связи всю поездку.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
              <Link href="/contacts#lead" className="button-primary">
                Подобрать тур <span aria-hidden="true">→</span>
              </Link>
              <a href={site.phones[0].href} className="link-underline text-base font-bold text-white">
                {site.phones[0].label}
              </a>
            </div>
          </div>
        </div>

        <div className="relative z-20 mx-auto max-w-7xl px-4 pb-8 sm:px-6 sm:pb-12 lg:px-8">
          <div className="search-panel rounded-3xl border border-white/60 bg-white p-4 sm:p-6">
            <div className="mb-3 flex items-center justify-between gap-4 px-1">
              <p className="text-sm font-extrabold text-navy-950">Найдите свой тур</p>
              <p className="hidden text-xs font-bold uppercase tracking-[0.14em] text-navy-500 sm:block">Все туроператоры в одном поиске</p>
            </div>
            <div className="overflow-x-auto">
              <TourvisorModule
                type="tv-search-form"
                moduleId={process.env.NEXT_PUBLIC_TV_SEARCH_ID}
                minHeight={220}
                skeletonRows={2}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-navy-950/10 bg-navy-950 py-16 text-white sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div>
                <p className="eyebrow text-gold-400">Поймать удачный момент</p>
                <h2 className="mt-3 text-4xl font-extrabold tracking-[-0.05em] text-white text-balance sm:text-5xl">
                  Горящие туры
                </h2>
                <p className="mt-4 max-w-xl leading-7 text-white/70">
                  Здесь можно посмотреть актуальные цены и даты вылета.
                  Если ничего не приглянулось, напишите нам: предложим другие варианты.
                </p>
              </div>
              <Link href="/hot-tours" className="link-underline font-extrabold text-gold-400">
                Смотреть все туры <span aria-hidden="true">→</span>
              </Link>
            </div>
          </Reveal>
          <Reveal delay={90} className="mt-10 rounded-3xl bg-white p-4 shadow-[var(--shadow-card)] sm:p-6">
            <TourvisorModule
              type="tv-hot-tours"
              moduleId={process.env.NEXT_PUBLIC_TV_HOT_HOME_ID}
              minHeight={420}
            />
          </Reveal>
        </div>
      </section>

      <section className="py-18 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="grid gap-6 border-b border-navy-950/15 pb-8 lg:grid-cols-[1fr_auto] lg:items-end">
              <div>
                <p className="eyebrow">Идеи для следующего отпуска</p>
                <h2 className="mt-3 max-w-2xl text-4xl font-extrabold tracking-[-0.05em] text-navy-950 text-balance sm:text-5xl">
                  Направления, в которые возвращаются
                </h2>
              </div>
              <Link href="/destinations" className="link-underline font-extrabold text-navy-950">
                Все направления <span aria-hidden="true">→</span>
              </Link>
            </div>
          </Reveal>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {popularDestinations.map((destination, index) => (
              <Reveal key={destination.slug} delay={index * 65}>
                <Link href={`/destinations/${destination.slug}`} className="destination-slice group">
                  <Image
                    src={destination.image}
                    alt={`${destination.name} — ${destination.tagline}`}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <span className="absolute inset-0 bg-gradient-to-t from-navy-950/80 via-navy-950/10 to-transparent" />
                  <span className="absolute inset-x-0 bottom-0 p-5 text-white">
                    <span className="block text-2xl font-extrabold tracking-[-0.04em]">{destination.name}</span>
                    <span className="mt-1 block text-sm text-white/75">{destination.tagline}</span>
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
          <Reveal className="mt-14">
            <PhotoMosaic />
          </Reveal>
        </div>
      </section>

      <section className="overflow-hidden bg-[#f7f5ef] py-18 sm:py-24">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.88fr_1.12fr] lg:items-center lg:gap-16 lg:px-8">
          <Reveal>
            <p className="eyebrow">Наша команда</p>
            <h2 className="mt-3 max-w-md text-4xl font-extrabold tracking-[-0.05em] text-navy-950 text-balance sm:text-5xl">
              Сами путешествуем. Делимся опытом.
            </h2>
            <p className="mt-6 max-w-md text-base leading-7 text-navy-800/75 sm:text-lg">
              С 2018 года наша команда помогает туристам выбирать отдых по всему миру.
              Мы сами бываем на курортах, осматриваем отели и проверяем, что ждёт
              гостей на месте: какой пляж рядом, как кормят и удобно ли с детьми.
            </p>
            <p className="mt-4 max-w-md text-base leading-7 text-navy-800/75 sm:text-lg">
              Расскажем о плюсах и особенностях каждого варианта, чтобы вы могли
              выбрать подходящий. И останемся на связи, когда вы уже будете в поездке.
            </p>
            <Link href="/contacts#lead" className="link-underline mt-8 inline-flex font-extrabold text-navy-950">
              Обсудить свой отдых <span aria-hidden="true">→</span>
            </Link>
          </Reveal>
          <Reveal delay={100}>
            <div className="grid gap-6 sm:grid-cols-[1.2fr_0.8fr]">
              <div className="relative min-h-[390px] overflow-hidden rounded-3xl shadow-[var(--shadow-card)] sm:min-h-[480px]">
                <Image
                  src="/images/destinations/greece.jpg"
                  alt="Средиземноморское побережье — один из маршрутов Almaz Tour"
                  fill
                  sizes="(max-width: 640px) 100vw, 45vw"
                  className="object-cover"
                />
                <div className="absolute inset-x-0 bottom-0 bg-navy-950/80 p-5 text-white">
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-gold-400">Опыт команды</p>
                  <p className="mt-2 text-lg font-extrabold">Сами бываем там, куда советуем поехать</p>
                </div>
              </div>
              <div className="flex flex-col divide-y divide-navy-950/15 border-y border-navy-950/15">
                <div className="flex-1 py-8">
                  <p className="text-sm font-semibold text-navy-600">Работаем с</p>
                  <p className="mt-2 text-5xl font-semibold tracking-tight text-navy-950">{site.foundedYear}</p>
                  <p className="mt-3 text-sm leading-6 text-navy-800/70">года в Астане</p>
                </div>
                <div className="flex-1 py-8">
                  <p className="text-2xl font-bold tracking-tight">Весь мир</p>
                  <p className="mt-3 text-sm leading-6 text-navy-800/70">Подбираем страну и отель под ваш бюджет и время отпуска.</p>
                </div>
                <div className="py-8">
                  <p className="text-2xl font-bold tracking-tight">На связи</p>
                  <p className="mt-3 text-sm leading-6 text-navy-800/70">Помогаем с вопросами до вылета и во время отдыха.</p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="py-18 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-5">
              <div>
                <p className="eyebrow">Настоящие впечатления</p>
                <h2 className="mt-3 text-4xl font-extrabold tracking-[-0.05em] text-navy-950 sm:text-5xl">Что говорят наши туристы</h2>
              </div>
              <Link href="/reviews" className="link-underline font-extrabold text-navy-950">Все отзывы <span aria-hidden="true">→</span></Link>
            </div>
          </Reveal>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {reviews.slice(0, 3).map((review, index) => (
              <Reveal key={review.name} delay={index * 75}>
                <ReviewCard review={review} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gold-400 py-16 sm:py-20">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-end lg:px-8">
          <Reveal>
            <p className="eyebrow text-navy-950/65">Консультация</p>
            <h2 className="mt-3 max-w-lg text-4xl font-extrabold leading-[0.98] tracking-[-0.06em] text-navy-950 text-balance sm:text-5xl">
              Обсудим ваше следующее путешествие?
            </h2>
          </Reveal>
          <Reveal delay={90}>
            <p className="max-w-xl text-lg leading-7 text-navy-950/80">
              Расскажите, куда хочется поехать и сколько планируете потратить.
              Пришлём несколько вариантов и объясним, что входит в стоимость.
            </p>
            <div className="mt-7 flex flex-wrap gap-x-8 gap-y-4 border-t border-navy-950/20 pt-6">
              <a href={site.phones[0].href} className="link-underline font-extrabold text-navy-950">{site.phones[0].label}</a>
              <a href={site.social.whatsapp} target="_blank" rel="noopener noreferrer" className="link-underline font-extrabold text-navy-950">Написать в WhatsApp <span aria-hidden="true">→</span></a>
              <Link href="/contacts#lead" className="button-dark">Оставить заявку <span aria-hidden="true">→</span></Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
