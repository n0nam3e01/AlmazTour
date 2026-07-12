import type { Metadata } from "next";
import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { LeadForm } from "@/components/forms/LeadForm";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "Оздоровительные туры — лечение в клиниках Германии, Швейцарии, Израиля и Южной Кореи",
  description:
    "Almaz Tour организует лечение и обследования за рубежом: подбор клиники, перевод документов, виза, перелёт и сопровождение. Германия, Швейцария, Израиль, Южная Корея.",
  alternates: { canonical: "/health-tours" },
};

/* Страны и сильные стороны их медицины */
const clinics = [
  {
    country: "Германия",
    text: "Кардиология, онкология, ортопедия и нейрохирургия. Университетские клиники с жёсткими стандартами качества и прозрачными ценами.",
  },
  {
    country: "Швейцария",
    text: "Диагностика check-up, реабилитация и восстановительная медицина. Клиники уровня люкс с санаторным размещением в Альпах.",
  },
  {
    country: "Израиль",
    text: "Онкология, ЭКО, сложная хирургия. Русскоязычные врачи и координаторы почти в каждой клинике — языкового барьера нет.",
  },
  {
    country: "Южная Корея",
    text: "Полное обследование организма за один-два дня, пластическая хирургия и стоматология. Современное оборудование и разумные цены.",
  },
];

const steps = [
  {
    title: "Расскажите о задаче",
    text: "Диагноз, пожелания по стране и бюджету. Все медицинские данные остаются строго между нами.",
  },
  {
    title: "Предложим клиники",
    text: "Запросим программы и цены в двух-трёх подходящих клиниках, переведём ответы врачей и поможем выбрать.",
  },
  {
    title: "Организуем поездку",
    text: "Виза, перелёт, трансфер, жильё для сопровождающих и связь с клиникой на месте. Вы занимаетесь здоровьем, остальное — наша работа.",
  },
];

export default function HealthToursPage() {
  return (
    <>
      <section className="bg-navy-950 py-14 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="max-w-3xl text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
            Оздоровительные туры
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-white/75">
            Лечение, обследования и реабилитация в клиниках Германии,
            Швейцарии, Израиля и Южной Кореи. Мы берём на себя организацию,
            чтобы вы могли думать только о здоровье.
          </p>
        </div>
      </section>

      {/* Страны */}
      <section className="py-14 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 md:grid-cols-2">
            {clinics.map((c, i) => (
              <Reveal key={c.country} delay={i * 80}>
                <div className="h-full rounded-2xl border border-navy-100 p-7 transition-shadow hover:shadow-[var(--shadow-card)]">
                  <h2 className="text-xl font-extrabold text-navy-950">{c.country}</h2>
                  <p className="mt-3 leading-relaxed text-navy-800/75">{c.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Как это устроено */}
      <section className="bg-azure-50 py-14 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <h2 className="text-3xl font-extrabold tracking-tight text-navy-950">
              Как это устроено
            </h2>
          </Reveal>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {steps.map((s, i) => (
              <Reveal key={s.title} delay={i * 90}>
                <div className="h-full rounded-2xl bg-white p-6 shadow-[var(--shadow-card)]">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gold-400 text-lg font-extrabold text-navy-950">
                    {i + 1}
                  </span>
                  <h3 className="mt-4 text-lg font-extrabold text-navy-950">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-navy-800/70">{s.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Заявка */}
      <section className="py-14 lg:py-20" id="lead">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
            <Reveal>
              <h2 className="text-3xl font-extrabold tracking-tight text-navy-950">
                Оставьте заявку
              </h2>
              <p className="mt-4 leading-relaxed text-navy-800/75">
                Напишите, какая помощь нужна, и укажите удобный способ связи.
                Если вопрос срочный, быстрее всего ответим в WhatsApp.
              </p>
              <a
                href={site.social.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-block rounded-full bg-[#25D366] px-6 py-3 font-bold text-white transition-transform hover:scale-[1.02]"
              >
                Написать в WhatsApp
              </a>
              <p className="mt-6 text-sm text-navy-400">
                Или позвоните:{" "}
                <a href={site.phones[0].href} className="font-bold text-navy-950">
                  {site.phones[0].label}
                </a>
              </p>
            </Reveal>
            <Reveal delay={100}>
              <div className="rounded-2xl border border-navy-100 bg-white p-6 shadow-[var(--shadow-card)] sm:p-8">
                <LeadForm defaultCountry="Другая страна" />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Ссылка на обычные туры */}
      <section className="pb-16">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <p className="text-navy-800/70">
            Ищете обычный отдых?{" "}
            <Link href="/destinations" className="font-bold text-azure-600 hover:text-navy-950">
              Посмотрите наши направления
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}
