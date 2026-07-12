import type { Metadata } from "next";
import { DestinationCard } from "@/components/DestinationCard";
import { Reveal } from "@/components/Reveal";
import { destinations } from "@/data/destinations";

export const metadata: Metadata = {
  title: "Направления — 15 стран для отдыха",
  description:
    "Каталог направлений Almaz Tour: Турция, Египет, ОАЭ, Таиланд, Мальдивы, Вьетнам, Греция и другие страны. Описания, сезоны и советы по каждому направлению.",
  alternates: { canonical: "/destinations" },
};

export default function DestinationsPage() {
  return (
    <>
      <section className="bg-azure-50 py-14 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold tracking-tight text-navy-950 sm:text-5xl">
            Наши направления
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-navy-800/70">
            Пятнадцать стран, которые мы знаем вдоль и поперёк. У каждой — своя
            страница с сезонами, курортами и причинами поехать именно туда.
          </p>
        </div>
      </section>

      <section className="py-12 lg:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {destinations.map((d, i) => (
              <Reveal key={d.slug} delay={(i % 3) * 70}>
                <DestinationCard destination={d} priority={i < 3} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
