import Link from "next/link";
import { site } from "@/data/site";
import { SubscribeForm } from "@/components/forms/SubscribeForm";
import { destinations } from "@/data/destinations";

/* Иконки соцсетей — единый стиль, обводка 1.8 */
function SocialLinks({ className = "" }: { className?: string }) {
  const links = [
    {
      href: site.social.instagram,
      label: "Instagram",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.8" />
          <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.8" />
          <circle cx="17.2" cy="6.8" r="1.2" fill="currentColor" />
        </svg>
      ),
    },
    {
      href: site.social.facebook,
      label: "Facebook",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M14 8.5V7a1.5 1.5 0 0 1 1.5-1.5H17V2.8h-2.3A4.2 4.2 0 0 0 10.5 7v1.5H8v3h2.5V21h3.5v-9.5H16l.6-3H14Z"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
    {
      href: site.social.whatsapp,
      label: "WhatsApp",
      icon: (
        <svg width="20" height="20" viewBox="0 0 32 32" fill="currentColor" aria-hidden="true">
          <path d="M16.04 4C9.53 4 4.25 9.28 4.25 15.79c0 2.08.54 4.1 1.57 5.89L4.16 28l6.48-1.62a11.72 11.72 0 0 0 5.4 1.32h.01c6.5 0 11.79-5.28 11.79-11.79 0-3.15-1.23-6.11-3.45-8.34A11.72 11.72 0 0 0 16.04 4Zm0 21.71h-.01c-1.76 0-3.48-.47-4.98-1.36l-.36-.21-3.7.93.99-3.61-.24-.37a9.77 9.77 0 0 1-1.5-5.21c0-5.41 4.4-9.8 9.81-9.8 2.62 0 5.08 1.02 6.93 2.87a9.74 9.74 0 0 1 2.87 6.94c0 5.41-4.4 9.81-9.81 9.81Z" />
        </svg>
      ),
    },
  ];

  return (
    <div className={`flex gap-3 ${className}`}>
      {links.map((l) => (
        <a
          key={l.label}
          href={l.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={l.label}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white/80 transition-colors hover:border-gold-400 hover:text-gold-400"
        >
          {l.icon}
        </a>
      ))}
    </div>
  );
}

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-navy-950 text-white">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* О компании */}
          <div>
            <p className="text-xl font-extrabold tracking-tight">
              ALMAZ <span className="text-gold-400">TOUR</span>
            </p>
            <p className="mt-1 text-sm text-azure-300">{site.slogan}</p>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/70">
              Туристическое агентство в Астане. Подбираем зарубежные туры с 2019
              года: от горящих путёвок до оздоровительных программ.
            </p>
            <SocialLinks className="mt-5" />
          </div>

          {/* Направления */}
          <div>
            <p className="text-sm font-bold uppercase tracking-wider text-white/50">
              Направления
            </p>
            <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2">
              {destinations.slice(0, 10).map((d) => (
                <li key={d.slug}>
                  <Link
                    href={`/destinations/${d.slug}`}
                    className="text-sm text-white/75 transition-colors hover:text-gold-400"
                  >
                    {d.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/destinations"
                  className="text-sm font-semibold text-azure-300 transition-colors hover:text-gold-400"
                >
                  Все направления →
                </Link>
              </li>
            </ul>
          </div>

          {/* Контакты */}
          <div>
            <p className="text-sm font-bold uppercase tracking-wider text-white/50">
              Контакты
            </p>
            <ul className="mt-4 space-y-2 text-sm text-white/75">
              {site.phones.map((p) => (
                <li key={p.href}>
                  <a href={p.href} className="font-semibold text-white transition-colors hover:text-gold-400">
                    {p.label}
                  </a>
                </li>
              ))}
              <li>
                <a href={`mailto:${site.email}`} className="transition-colors hover:text-gold-400">
                  {site.email}
                </a>
              </li>
              <li className="pt-2">{site.address.full}</li>
              {site.hours.map((h) => (
                <li key={h.days}>
                  {h.days}: {h.time}
                </li>
              ))}
            </ul>
          </div>

          {/* Рассылка */}
          <div>
            <p className="text-sm font-bold uppercase tracking-wider text-white/50">
              Рассылка
            </p>
            <p className="mt-4 text-sm text-white/70">
              Получайте первыми новости о лучших турах и горящих предложениях.
            </p>
            <SubscribeForm />
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-white/10 pt-6 text-sm text-white/50 sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} Almaz Tour. Все права защищены.</p>
          <p>
            г. Астана · <a href={site.phones[1].href} className="hover:text-gold-400">{site.phones[1].label}</a>
          </p>
        </div>
      </div>
    </footer>
  );
}
