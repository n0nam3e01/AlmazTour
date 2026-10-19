import type { ReactNode } from "react";
import Link from "next/link";
import { pageCopy } from "@/data/page-copy";
import { localizePath, type Locale } from "@/lib/i18n";

export function PageHeading({ locale, title, description, children }: {
  locale: Locale;
  title: string;
  description: string;
  children?: ReactNode;
}) {
  const copy = pageCopy[locale].common;
  return (
    <section className="page-heading surface-soft">
      <div className="container">
        <nav aria-label={copy.breadcrumbs} className="mb-6 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm">
          <Link href={localizePath("/", locale)} className="ink inline-flex min-h-11 items-center font-semibold underline-offset-4 hover:underline">
            <span aria-hidden="true" className="mr-2">←</span>{copy.home}
          </Link>
          <span aria-hidden="true" className="muted">/</span>
          <span aria-current="page" className="muted">{title}</span>
        </nav>
        <h1 className="ink max-w-4xl text-balance text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">{title}</h1>
        <p className="muted mt-4 max-w-3xl text-lg leading-relaxed">{description}</p>
        {children && <div className="mt-7 flex flex-wrap gap-3">{children}</div>}
      </div>
    </section>
  );
}
