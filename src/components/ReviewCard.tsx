import type { Review } from "@/data/reviews";

/** Карточка отзыва клиента */
export function ReviewCard({ review, full = false }: { review: Review; full?: boolean }) {
  return (
    <figure className="flex h-full flex-col rounded-2xl bg-white p-6 shadow-[var(--shadow-card)]">
      <svg width="28" height="20" viewBox="0 0 28 20" fill="none" aria-hidden="true" className="text-gold-400">
        <path
          d="M0 20V12.6C0 5.9 3.9 1.5 10.5 0l1.4 3.1C7.6 4.6 5.6 7 5.4 10H11v10H0Zm17 0V12.6C17 5.9 20.9 1.5 27.5 0l.5 3.1C23.6 4.6 21.6 7 21.4 10H27v10H17Z"
          fill="currentColor"
        />
      </svg>
      <blockquote
        className={`mt-4 flex-1 text-[15px] leading-relaxed text-navy-800/85 ${full ? "" : "line-clamp-5"}`}
      >
        {review.text}
      </blockquote>
      <figcaption className="mt-5 border-t border-navy-50 pt-4">
        <p className="font-bold text-navy-950">{review.name}</p>
        {review.trip && <p className="text-sm text-navy-400">{review.trip}</p>}
      </figcaption>
    </figure>
  );
}
