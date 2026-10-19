"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import type { Review } from "@/data/reviews";
import { ReviewCard } from "@/components/ReviewCard";
import { useLocale } from "@/components/LocaleProvider";
import { uiCopy } from "@/data/ui-copy";

/** Спокойная карусель отзывов с фиксированной высотой и понятной навигацией. */
export function ReviewsShowcase({ reviews }: { reviews: Review[] }) {
  const locale=useLocale(); const copy=uiCopy[locale];
  const [active, setActive] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const count = reviews.length;
  const goTo = useCallback((index: number) => setActive((index + count) % count), [count]);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ctx = gsap.context(() => {
      gsap.fromTo(card, { autoAlpha: reduce ? 1 : 0, x: reduce ? 0 : 18 }, { autoAlpha: 1, x: 0, duration: reduce ? 0 : 0.3, ease: "power2.out", overwrite: true });
    }, rootRef);
    return () => ctx.revert();
  }, [active]);

  if (!count) return null;
  return (
    <div ref={rootRef} className="reviews-showcase" tabIndex={0} role="region" aria-label={copy.reviews} onKeyDown={(event) => { if (event.key === "ArrowLeft") {event.preventDefault();goTo(active - 1);} if (event.key === "ArrowRight") {event.preventDefault();goTo(active + 1);} }}>
      <div className="reviews-simple-carousel">
        <button type="button" className="reviews-side-arrow reviews-side-arrow--left" onClick={() => goTo(active - 1)} aria-label={copy.prevReview}>←</button>
        <div ref={cardRef} className="reviews-simple-card" aria-live="polite" aria-atomic="true"><ReviewCard review={reviews[active]} locale={locale}/></div>
        <button type="button" className="reviews-side-arrow reviews-side-arrow--right" onClick={() => goTo(active + 1)} aria-label={copy.nextReview}>→</button>
      </div>
      <div className="reviews-controls"><span>{String(active + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}</span><div className="reviews-dots" aria-label={copy.reviews}>{reviews.map((review, index) => <button key={`${review.name}-dot-${index}`} type="button" aria-current={active === index ? "true" : undefined} aria-label={`${copy.reviewNumber} ${index + 1}`} className={`reviews-dot ${active === index ? "is-active" : ""}`} onClick={() => goTo(index)} />)}</div></div>
    </div>
  );
}
