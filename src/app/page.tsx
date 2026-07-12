import Image from "next/image";
import Link from "next/link";
import { TourvisorModule } from "@/components/TourvisorModule";
import { DestinationCard } from "@/components/DestinationCard";
import { ReviewCard } from "@/components/ReviewCard";
import { Reveal } from "@/components/Reveal";
import { CountUp } from "@/components/CountUp";
import { destinations } from "@/data/destinations";
import { reviews } from "@/data/reviews";
import { site } from "@/data/site";

/* Преимущества — с текущего сайта, тексты причёсаны */
const benefits = [
  {
    title: "15 направлений",
    text: "От Турции и Египта до Мальдив и Сингапура. Подберём страну под сезон, бюджет и настроение.",
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
        <path d="M3.5 12h17M12 3a14.5 14.5 0 0 1 0 18M12 3a14.5 14.5 0 0 0 0 18" stroke="currentColor" strokeWidth="1.8" />
      </svg>
    ),
  },
  {
    title: "Всё включено",
    text: "Авиабилеты, отель, трансфер, страховка. Берём на себя все детали поездки — вам остаётся собрать чемодан.",
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M4 19h16M10.5 5.5 8 8l-4.5-.9L2 8.7l5 3-1.7 3.6 1.5 1 3-2.9 4.6 2.8c.5.3 1.1.1 1.4-.4l.4-.8c.2-.5.1-1-.3-1.4L12 10l2.6-2.7a1.7 1.7 0 0 0-2.4-2.4l-1.7.6Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: "Честные цены",
    text: "Работаем с турами любых ценовых категорий и следим за горящими предложениями каждый день.",
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect x="3" y="6" width="18" height="13" rx="2.5" stroke="currentColor" strokeWidth="1.8" />
        <path d="M3 10h18M7 15h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: "Оздоровительные туры",
    text: "Организуем лечение и обследования в клиниках Германии, Швейцарии, Израиля и Южной Кореи.",
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M12 21s-7.5-4.6-9.3-9.6C1.4 7.7 3.5 4.5 6.9 4.5c2 0 3.7 1.1 5.1 3 1.4-1.9 3.1-3 5.1-3 3.4 0 5.5 3.2 4.2 6.9C19.5 16.4 12 21 12 21Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
        <path d="M8 12h2.5l1-2 1.5 4 1-2H17" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

export default function HomePage() {
  const featured = destinations.slice(0, 6);

  return (
    <>
      {/* ===== Хиро: фото, заголовок и поиск туров ===== */}
      <section className="relative bg-navy-950">
        <div className="absolute inset-0">
          <Image
            src="/images/destinations/thailand.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-45"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-navy-950/95 via-navy-950/70 to-navy-950/30" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 pb-10 pt-16 sm:px-6 lg:px-8 lg:pb-14 lg:pt-24">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl">
              Влюбляем
              <br />в путешествия
            </h1>
            <p className="mt-5 max-w-lg text-lg leading-relaxed text-white/85">
              Туры из Астаны по 15 направлениям: подберём отель, оформим
              документы и будем на связи всю поездку.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-4">
              <Link
                href="/contacts#lead"
                className="rounded-full bg-gold-400 px-7 py-3.5 text-base font-bold text-navy-950 shadow-lg shadow-gold-400/25 transition-all hover:bg-gold-300 active:translate-y-px"
              >
                Подобрать тур
              </Link>
              <a
                href={site.phones[0].href}
                className="text-lg font-bold text-white transition-colors hover:text-gold-300"
              >
                {site.phones[0].label}
              </a>
            </div>
          </div>

          {/* Поиск туров Tourvisor в белой карточке.
              На узких экранах виджет шире карточки — даём ему прокрутку */}
          <div className="mt-12 rounded-2xl bg-white p-3 shadow-2xl sm:p-6">
            <h2 className="px-1 pb-3 text-lg font-extrabold text-navy-950">
              Поиск туров по всем туроператорам
            </h2>
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

      {/* ===== Горящие туры ===== */}
      <section className="bg-azure-50 py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.14em] text-azure-600">
                  Успейте забронировать
                </p>
                <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-navy-950 sm:text-4xl">
                  Горящие туры из Астаны
                </h2>
              </div>
              <Link
                href="/hot-tours"
                className="rounded-full border-2 border-navy-950 px-6 py-3 text-sm font-bold text-navy-950 transition-colors hover:bg-navy-950 hover:text-white"
              >
                Все горящие туры
              </Link>
            </div>
          </Reveal>
          <Reveal delay={120} className="mt-8">
            <TourvisorModule
              type="tv-hot-tours"
              moduleId={process.env.NEXT_PUBLIC_TV_HOT_HOME_ID}
              minHeight={420}
            />
          </Reveal>
        </div>
      </section>

      {/* ===== Популярные направления ===== */}
      <section className="py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <h2 className="text-3xl font-extrabold tracking-tight text-navy-950 sm:text-4xl">
              Куда поедем?
            </h2>
            <p className="mt-3 max-w-xl text-navy-800/70">
              Шесть направлений, которые чаще всего выбирают наши туристы.
              В каталоге — все пятнадцать.
            </p>
          </Reveal>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((d, i) => (
              <Reveal key={d.slug} delay={i * 70}>
                <DestinationCard destination={d} />
              </Reveal>
            ))}
          </div>
          <Reveal className="mt-10 text-center">
            <Link
              href="/destinations"
              className="inline-block rounded-full bg-navy-950 px-8 py-3.5 text-base font-bold text-white transition-all hover:bg-navy-800 active:translate-y-px"
            >
              Смотреть все 15 направлений
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ===== Почему Almaz Tour ===== */}
      <section className="border-y border-navy-50 bg-white py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
            <Reveal>
              <h2 className="text-3xl font-extrabold tracking-tight text-navy-950 sm:text-4xl">
                Почему с нами спокойно
              </h2>
              <p className="mt-4 leading-relaxed text-navy-800/70">
                Almaz Tour — небольшое агентство, где каждым туром занимается
                живой человек, а не колл-центр. Менеджер остаётся на связи от
                первого звонка до вашего возвращения домой.
              </p>
              <Link
                href="/reviews"
                className="mt-6 inline-flex items-center gap-1.5 font-bold text-azure-600 transition-colors hover:text-navy-950"
              >
                Что говорят клиенты
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M3 8h10m0 0L9 4m4 4l-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </Reveal>
            <div className="grid gap-6 sm:grid-cols-2">
              {benefits.map((b, i) => (
                <Reveal key={b.title} delay={i * 80}>
                  <div className="flex h-full flex-col rounded-2xl bg-azure-50 p-6 transition-colors hover:bg-azure-100">
                    <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-navy-950 text-gold-400">
                      {b.icon}
                    </span>
                    <h3 className="mt-4 text-lg font-extrabold text-navy-950">{b.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-navy-800/70">{b.text}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== Счётчики ===== */}
      <section className="bg-navy-950 py-14 lg:py-16">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-x-6 gap-y-10 px-4 sm:px-6 lg:grid-cols-4 lg:px-8">
          {site.counters.map((c) => (
            <div key={c.label} className="text-center">
              <p className="text-4xl font-extrabold tracking-tight text-gold-400 lg:text-5xl">
                <CountUp value={c.value} suffix={"suffix" in c ? (c as { suffix: string }).suffix : ""} />
              </p>
              <p className="mt-2 text-sm text-white/70">{c.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== Оздоровительные туры ===== */}
      <section className="py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-azure-100 via-azure-50 to-white p-8 sm:p-12 lg:p-16">
              <div className="max-w-2xl">
                <h2 className="text-3xl font-extrabold tracking-tight text-navy-950 sm:text-4xl">
                  Оздоровительные туры
                </h2>
                <p className="mt-4 text-lg leading-relaxed text-navy-800/75">
                  Помогаем попасть на лечение и обследование к специалистам
                  ведущих клиник Германии, Швейцарии, Израиля и Южной Кореи.
                  Организуем всё: от перевода документов до сопровождения.
                </p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {["Германия", "Швейцария", "Израиль", "Южная Корея"].map((c) => (
                    <span
                      key={c}
                      className="rounded-full bg-white px-4 py-1.5 text-sm font-semibold text-navy-950 shadow-sm"
                    >
                      {c}
                    </span>
                  ))}
                </div>
                <Link
                  href="/health-tours"
                  className="mt-8 inline-block rounded-full bg-navy-950 px-7 py-3.5 text-base font-bold text-white transition-all hover:bg-navy-800 active:translate-y-px"
                >
                  Узнать подробнее
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ===== Отзывы ===== */}
      <section className="bg-azure-50 py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <h2 className="text-3xl font-extrabold tracking-tight text-navy-950 sm:text-4xl">
                Что говорят клиенты
              </h2>
              <Link
                href="/reviews"
                className="font-bold text-azure-600 transition-colors hover:text-navy-950"
              >
                Все отзывы →
              </Link>
            </div>
          </Reveal>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {reviews.slice(0, 3).map((r, i) => (
              <Reveal key={r.name} delay={i * 90}>
                <ReviewCard review={r} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="rounded-3xl bg-navy-950 px-8 py-12 text-center sm:px-12 lg:py-16">
              <h2 className="mx-auto max-w-2xl text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                Расскажите, какой отдых вам нужен
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-white/75">
                Заполните короткую форму — менеджер перезвонит и предложит
                несколько вариантов под ваш бюджет.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                <Link
                  href="/contacts#lead"
                  className="rounded-full bg-gold-400 px-8 py-4 text-base font-bold text-navy-950 shadow-lg shadow-gold-400/20 transition-all hover:bg-gold-300 active:translate-y-px"
                >
                  Подобрать тур
                </Link>
                <a
                  href={site.phones[0].href}
                  className="text-lg font-bold text-white transition-colors hover:text-gold-300"
                >
                  {site.phones[0].label}
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
