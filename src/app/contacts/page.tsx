import type { Metadata } from "next";
import { LeadForm } from "@/components/forms/LeadForm";
import { Reveal } from "@/components/Reveal";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "Контакты — офис в Астане, телефоны и график работы",
  description:
    "Офис Almaz Tour: г. Астана, ул. Достык 4, ТЦ «Festival Avenue». Телефоны +7 775 908 90 48, +7 775 888 97 32. Пн–Пт 10:00–20:00, Сб–Вс 12:00–16:00.",
  alternates: { canonical: "/contacts" },
};

export default function ContactsPage() {
  return (
    <>
      <section className="bg-azure-50 py-14 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold tracking-tight text-navy-950 sm:text-5xl">
            Наши контакты
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-navy-800/70">
            Приходите в офис, звоните или пишите в WhatsApp — как вам удобнее.
            Отвечаем быстро.
          </p>
        </div>
      </section>

      <section className="py-12 lg:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 md:grid-cols-3">
            <Reveal>
              <div className="h-full rounded-2xl border border-navy-100 p-7">
                <h2 className="text-sm font-bold uppercase tracking-wider text-navy-400">
                  Офис
                </h2>
                <p className="mt-3 text-lg font-bold text-navy-950">{site.address.full}</p>
                <ul className="mt-4 space-y-1 text-navy-800/75">
                  {site.hours.map((h) => (
                    <li key={h.days}>
                      <span className="font-semibold text-navy-950">{h.days}:</span> {h.time}
                    </li>
                  ))}
                </ul>
                <a
                  href={site.address.map2gis}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-block text-sm font-bold text-azure-600 hover:text-navy-950"
                >
                  Открыть в 2ГИС →
                </a>
              </div>
            </Reveal>

            <Reveal delay={80}>
              <div className="h-full rounded-2xl border border-navy-100 p-7">
                <h2 className="text-sm font-bold uppercase tracking-wider text-navy-400">
                  Телефоны и почта
                </h2>
                <ul className="mt-3 space-y-2">
                  {site.phones.map((p) => (
                    <li key={p.href}>
                      <a
                        href={p.href}
                        className="text-lg font-bold text-navy-950 transition-colors hover:text-azure-600"
                      >
                        {p.label}
                      </a>
                    </li>
                  ))}
                  <li>
                    <a
                      href={`mailto:${site.email}`}
                      className="text-navy-800/75 transition-colors hover:text-azure-600"
                    >
                      {site.email}
                    </a>
                  </li>
                </ul>
              </div>
            </Reveal>

            <Reveal delay={160}>
              <div className="h-full rounded-2xl border border-navy-100 p-7">
                <h2 className="text-sm font-bold uppercase tracking-wider text-navy-400">
                  Мы в соцсетях
                </h2>
                <ul className="mt-3 space-y-2">
                  <li>
                    <a
                      href={site.social.whatsapp}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-bold text-navy-950 transition-colors hover:text-azure-600"
                    >
                      WhatsApp — быстрее всего
                    </a>
                  </li>
                  <li>
                    <a
                      href={site.social.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-navy-800/75 transition-colors hover:text-azure-600"
                    >
                      Instagram @almaztour.kz
                    </a>
                  </li>
                  <li>
                    <a
                      href={site.social.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-navy-800/75 transition-colors hover:text-azure-600"
                    >
                      Facebook /almaztour.kz
                    </a>
                  </li>
                </ul>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Форма подбора тура */}
      <section className="bg-azure-50 py-14 lg:py-20" id="lead">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <h2 className="text-3xl font-extrabold tracking-tight text-navy-950">
              Подобрать тур
            </h2>
            <p className="mb-8 mt-3 max-w-2xl text-navy-800/70">
              Заполните форму, и наши менеджеры подберут вам лучший тур. Обычно
              присылаем первые варианты в течение рабочего дня.
            </p>
          </Reveal>
          <Reveal delay={100}>
            <div className="rounded-2xl bg-white p-6 shadow-[var(--shadow-card)] sm:p-8">
              <LeadForm />
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
