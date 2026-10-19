"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { Destination } from "@/data/destinations";
import { useLocale } from "@/components/LocaleProvider";
import { localizePath } from "@/lib/i18n";
import { uiCopy } from "@/data/ui-copy";

/** AccordionGallery для направлений: раскрывает одну страну, не создавая визуального шума. */
export function AccordionGallery({ items, defaultIndex = 2 }: { items: Destination[]; defaultIndex?: number }) {
  const locale = useLocale();
  const [active, setActive] = useState(Math.min(defaultIndex, Math.max(items.length - 1, 0)));
  return (
    <div className="accordion-gallery" aria-label={uiCopy[locale].destinations}>
      {items.map((destination, index) => (
        <Link
          key={destination.slug}
          href={localizePath(`/destinations/${destination.slug}`, locale)}
          className={`accordion-gallery-item ${active === index ? "is-active" : ""}`}
          onMouseEnter={() => setActive(index)}
          onFocus={() => setActive(index)}
          aria-label={`${locale === "kk" ? "Бағыт туралы" : "Подробнее о направлении"}: ${destination.name}`}
        >
          <Image src={destination.image} alt={`${destination.name} — ${destination.tagline}`} fill sizes="(max-width: 767px) 100vw, 20vw" className="object-cover" />
          <span className="accordion-gallery-shade" aria-hidden="true" />
          <span className="accordion-gallery-copy">
            <span className="accordion-gallery-number">0{index + 1}</span>
            <span className="accordion-gallery-name">{destination.name}</span>
            <span className="accordion-gallery-tagline">{destination.tagline}</span>
          </span>
        </Link>
      ))}
    </div>
  );
}
