import type { Metadata } from "next";
import Link from "next/link";
import { TourvisorModule } from "@/components/TourvisorModule";
import { Reveal } from "@/components/Reveal";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "Горящие туры из Астаны — актуальные путёвки по минимальным ценам",
  description:
    "Горящие туры из Астаны с вылетом в ближайшие дни: Турция, Египет, ОАЭ, Таиланд и другие направления. Цены обновляются автоматически по всем туроператорам.",
  alternates: { canonical: "/hot-tours" },
};

export default function HotToursPage() {
  return (
    <>
      {/* Шапка страницы */}
      <section className="bg-navy-950 py-14 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="max-w-3xl text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
            Горящие туры из Астаны
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-white/75">
            Туры со сниженными ценами и вылетом в ближайшие дни. Подборка
            обновляется автоматически по всем туроператорам, а скидка в
            карточке — настоящая, от первоначальной цены тура.
          </p>
        </div>
      </section>

      {/* Полная выдача горящих туров Tourvisor */}
      <section className="bg-azure-50 py-12 lg:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <TourvisorModule
            type="tv-hot-tours"
            moduleId={process.env.NEXT_PUBLIC_TV_HOT_PAGE_ID}
            minHeight={720}
            skeletonRows={6}
          />
        </div>
      </section>

      {/* Как купить горящий тур */}
      <section className="py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <h2 className="text-3xl font-extrabold tracking-tight text-navy-950">
              Как не упустить горящий тур
            </h2>
          </Reveal>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {[
              {
                n: "1",
                title: "Выберите тур из подборки",
                text: "Или напишите нам, какой отдых ищете: страна, даты, бюджет. Горящие предложения разлетаются за часы, поэтому чем раньше, тем лучше.",
              },
              {
                n: "2",
                title: "Мы проверим цену и места",
                text: "Менеджер уточнит наличие мест на рейсе и в отеле и сразу скажет итоговую стоимость, без скрытых доплат.",
              },
              {
                n: "3",
                title: "Оформление за один день",
                text: "Договор, оплата, документы. При вылете в ближайшие дни успеваем оформить всё за несколько часов.",
              },
            ].map((s, i) => (
              <Reveal key={s.n} delay={i * 90}>
                <div className="h-full rounded-2xl border border-navy-100 p-6">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gold-400 text-lg font-extrabold text-navy-950">
                    {s.n}
                  </span>
                  <h3 className="mt-4 text-lg font-extrabold text-navy-950">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-navy-800/70">{s.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal className="mt-10">
            <div className="flex flex-wrap items-center justify-center gap-4 rounded-2xl bg-azure-50 p-6 text-center sm:justify-between sm:text-left">
              <p className="font-semibold text-navy-950">
                Не нашли подходящий тур? Напишите нам — найдём вручную.
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <a
                  href={site.social.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-gold-400 px-6 py-3 text-sm font-bold text-navy-950 transition-colors hover:bg-gold-300"
                >
                  Написать в WhatsApp
                </a>
                <Link
                  href="/contacts#lead"
                  className="text-sm font-bold text-azure-600 hover:text-navy-950"
                >
                  Оставить заявку →
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
