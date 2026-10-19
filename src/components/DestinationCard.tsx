import Image from "next/image";
import Link from "next/link";
import type { Destination } from "@/data/destinations";
import { localizePath, type Locale } from "@/lib/i18n";

/** Карточка направления: фото, название, короткое описание */
export function DestinationCard({
  destination,
  priority = false,
  locale = "ru",
}: {
  destination: Destination;
  priority?: boolean;
  locale?: Locale;
}) {
  return (
    <Link
      href={localizePath(`/destinations/${destination.slug}`, locale)}
      className="surface group relative flex h-full flex-col overflow-hidden rounded-2xl shadow-[var(--shadow-card)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-card-hover)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-azure-500"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={destination.image}
          alt={`${destination.name} — ${destination.tagline}`}
          fill
          priority={priority}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950/60 via-transparent to-transparent" />
        <p className="absolute bottom-3 left-4 right-4 text-xl font-extrabold tracking-tight text-white drop-shadow">
          {destination.name}
        </p>
      </div>
      <div className="flex flex-1 flex-col p-4">
        <p className="ink text-sm font-semibold">{destination.tagline}</p>
        <p className="muted mt-1.5 line-clamp-3 text-sm leading-relaxed">
          {destination.excerpt}
        </p>
        <span className="ink mt-3 inline-flex items-center gap-1 text-sm font-bold">
          {locale === "kk" ? "Толығырақ" : "Подробнее"}
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">
            <path d="M3 8h10m0 0L9 4m4 4l-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </div>
    </Link>
  );
}
