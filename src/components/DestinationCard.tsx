import Image from "next/image";
import Link from "next/link";
import type { Destination } from "@/data/destinations";

/** Карточка направления: фото, название, короткое описание */
export function DestinationCard({
  destination,
  priority = false,
}: {
  destination: Destination;
  priority?: boolean;
}) {
  return (
    <Link
      href={`/destinations/${destination.slug}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl bg-white shadow-[var(--shadow-card)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-card-hover)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-azure-500"
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
        <p className="text-sm font-semibold text-azure-600">{destination.tagline}</p>
        <p className="mt-1.5 line-clamp-3 text-sm leading-relaxed text-navy-800/70">
          {destination.excerpt}
        </p>
        <span className="mt-3 inline-flex items-center gap-1 text-sm font-bold text-navy-950 transition-colors group-hover:text-azure-600">
          Подробнее
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">
            <path d="M3 8h10m0 0L9 4m4 4l-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </div>
    </Link>
  );
}
