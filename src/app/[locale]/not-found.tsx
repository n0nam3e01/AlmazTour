"use client";
import Link from "next/link";
import { useLocale } from "@/components/LocaleProvider";
import { uiCopy } from "@/data/ui-copy";
import { localizePath } from "@/lib/i18n";
export default function NotFound(){const locale=useLocale();const copy=uiCopy[locale];return <section className="section container"><p className="muted">404</p><h1 className="mt-3 text-4xl font-bold ink">{copy.notFound}</h1><p className="mt-5 mb-8 muted">{copy.notFoundText}</p><Link className="button-primary" href={localizePath("/",locale)}>{copy.backHome}</Link></section>;}
