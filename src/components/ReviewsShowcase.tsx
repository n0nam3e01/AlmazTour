"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { HomeReviewStory } from "@/data/reviews";
import { useLocale } from "@/components/LocaleProvider";
import { uiCopy } from "@/data/ui-copy";

/** Три истории путешественников с чтением полного отзыва на месте. */
export function ReviewsShowcase({ stories }: { stories: HomeReviewStory[] }) {
  const locale = useLocale();
  const copy = uiCopy[locale];
  const [selected, setSelected] = useState<HomeReviewStory | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    if (!selected) return;
    const dialog = dialogRef.current;
    if (!dialog) return;
    dialog.showModal();
    return () => dialog.close();
  }, [selected]);

  if (!stories.length) return null;

  return (
    <>
      <ul className="review-stories">
        {stories.map((story) => (
          <li key={story.review.name}>
            <figure className="review-story">
              <div className="review-story-topline">
                <span className="review-story-country">{story.country[locale]}</span>
                <span className="review-story-quote" aria-hidden="true">“</span>
              </div>
              <blockquote className="review-story-excerpt" lang="ru">
                {story.excerpt}{!/[.!?…]$/.test(story.excerpt) && "…"}
              </blockquote>
              <figcaption className="review-story-author">
                <span className="review-story-avatar" aria-hidden="true">{story.review.name.slice(0, 1)}</span>
                <div>
                  <p className="review-story-name">{story.review.name}</p>
                  {story.review.trip && <p className="review-story-trip" lang="ru">{story.review.trip}</p>}
                </div>
              </figcaption>
              <button type="button" className="review-story-read" aria-haspopup="dialog" onClick={() => setSelected(story)}>
                {copy.moreReview}<span aria-hidden="true">↗</span>
              </button>
            </figure>
          </li>
        ))}
      </ul>

      <dialog ref={dialogRef} className="review-dialog" aria-labelledby={titleId} data-lenis-prevent onClose={() => setSelected(null)} onClick={(event) => { if (event.target === event.currentTarget) setSelected(null); }}>
        {selected && (
          <div className="review-dialog-content">
            <div className="review-dialog-topline">
              <span className="review-story-country">{selected.country[locale]}</span>
              <button type="button" className="review-dialog-close" aria-label={copy.close} onClick={() => setSelected(null)}><span aria-hidden="true">×</span></button>
            </div>
            <p className="eyebrow muted mt-6">{copy.reviews}</p>
            <h2 id={titleId} className="review-dialog-name">{selected.review.name}</h2>
            {selected.review.trip && <p className="muted mt-2 text-sm" lang="ru">{selected.review.trip}</p>}
            <blockquote className="review-dialog-text" lang="ru">{selected.review.text}</blockquote>
          </div>
        )}
      </dialog>
    </>
  );
}
