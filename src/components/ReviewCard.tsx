import type { Review } from "@/data/reviews";
import Link from "next/link";
import { uiCopy } from "@/data/ui-copy";
import { localizePath, type Locale } from "@/lib/i18n";

/** Карточка отзыва клиента */
export function ReviewCard({ review, full = false, locale = "ru" }: { review: Review; full?: boolean; locale?:Locale }) {
  return (
    <figure className="review-card surface flex h-full flex-col rounded-2xl p-6">
      <svg width="28" height="20" viewBox="0 0 28 20" fill="none" aria-hidden="true" className="text-gold-400">
        <path
          d="M0 20V12.6C0 5.9 3.9 1.5 10.5 0l1.4 3.1C7.6 4.6 5.6 7 5.4 10H11v10H0Zm17 0V12.6C17 5.9 20.9 1.5 27.5 0l.5 3.1C23.6 4.6 21.6 7 21.4 10H27v10H17Z"
          fill="currentColor"
        />
      </svg>
      <blockquote
        className={`mt-4 flex-1 text-[15px] leading-relaxed ink ${full ? "" : "line-clamp-5"}`}
      >
        {review.text}
      </blockquote>
      {!full && <Link href={localizePath("/reviews",locale)} className="mt-3 text-sm font-semibold ink underline underline-offset-4">{uiCopy[locale].moreReview}</Link>}
      <figcaption className="mt-5 border-t border-[var(--border)] pt-4">
        <p className="font-bold ink">{review.name}</p>
        {review.trip && <p className="text-sm muted">{review.trip}</p>}
      </figcaption>
    </figure>
  );
}
