import Image from "next/image";
import Link from "next/link";

/**
 * Мозаика из фотографий курортов.
 *
 * Задача блока — показать то, за чем едут: море, солнце и пляж. Плитки
 * разной высоты, чтобы сетка не выглядела таблицей, а на каждой снимок с
 * подписью-ссылкой на своё направление.
 */
const tiles = [
  {
    slug: "maldives",
    name: "Мальдивы",
    caption: "Океан и виллы над водой",
    /* Крупная плитка на две строки — она задаёт тон всему блоку */
    className: "sm:col-span-2 sm:row-span-2",
    sizes: "(max-width: 640px) 100vw, 50vw",
  },
  {
    slug: "thailand",
    name: "Таиланд",
    caption: "Пляжи Пхукета и Краби",
    className: "",
    sizes: "(max-width: 640px) 100vw, 25vw",
  },
  {
    slug: "turkey",
    name: "Турция",
    caption: "Всё включено у моря",
    className: "",
    sizes: "(max-width: 640px) 100vw, 25vw",
  },
  {
    slug: "egypt",
    name: "Египет",
    caption: "Красное море круглый год",
    className: "",
    sizes: "(max-width: 640px) 100vw, 25vw",
  },
  {
    slug: "dominicana",
    name: "Доминикана",
    caption: "Карибы и белый песок",
    className: "",
    sizes: "(max-width: 640px) 100vw, 25vw",
  },
];

export function PhotoMosaic() {
  return (
    <div className="grid auto-rows-[180px] grid-cols-1 gap-3 sm:grid-cols-4 sm:auto-rows-[190px]">
      {tiles.map((tile) => (
        <Link
          key={tile.slug}
          href={`/destinations/${tile.slug}`}
          className={`group relative overflow-hidden rounded-2xl shadow-[var(--shadow-card)] ${tile.className}`}
        >
          <Image
            src={`/images/destinations/${tile.slug}.jpg`}
            alt={`${tile.name} — ${tile.caption}`}
            fill
            sizes={tile.sizes}
            className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-105"
          />
          {/* Затемнение снизу: под ним читается подпись */}
          <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 via-navy-950/15 to-transparent" />

          <div className="absolute inset-x-0 bottom-0 p-4">
            <p className="text-lg font-extrabold tracking-tight text-white drop-shadow">
              {tile.name}
            </p>
            <p className="text-sm text-white/80">{tile.caption}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}
