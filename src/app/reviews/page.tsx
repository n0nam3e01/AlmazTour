import type { Metadata } from "next";
import { ReviewCard } from "@/components/ReviewCard";
import { ReviewForm } from "@/components/forms/ReviewForm";
import { Reveal } from "@/components/Reveal";
import { reviews } from "@/data/reviews";

export const metadata: Metadata = {
  title: "Отзывы клиентов",
  description:
    "Настоящие отзывы туристов Almaz Tour: Таиланд, Турция, ОАЭ, Египет, Швейцария. Читайте впечатления и делитесь своими.",
  alternates: { canonical: "/reviews" },
};

export default function ReviewsPage() {
  return (
    <>
      <section className="bg-azure-50 py-14 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold tracking-tight text-navy-950 sm:text-5xl">
            Отзывы клиентов
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-navy-800/70">
            Все отзывы на этой странице написали настоящие туристы Almaz Tour.
            Вернулись из поездки? Расскажите, как всё прошло, — форма внизу.
          </p>
        </div>
      </section>

      <section className="py-12 lg:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="columns-1 gap-6 md:columns-2 lg:columns-3 [&>*]:mb-6 [&>*]:break-inside-avoid">
            {reviews.map((r, i) => (
              <Reveal key={r.name + i} delay={(i % 3) * 70}>
                <ReviewCard review={r} full />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-azure-50 py-14 lg:py-20" id="leave-review">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <h2 className="text-3xl font-extrabold tracking-tight text-navy-950">
              Оставить отзыв
            </h2>
            <p className="mb-8 mt-3 text-navy-800/70">
              Пара честных предложений помогает другим путешественникам больше,
              чем любая реклама.
            </p>
          </Reveal>
          <Reveal delay={100}>
            <div className="rounded-2xl bg-white p-6 shadow-[var(--shadow-card)] sm:p-8">
              <ReviewForm />
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
