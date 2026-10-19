"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useLocale } from "@/components/LocaleProvider";
import { uiCopy } from "@/data/ui-copy";
import { site } from "@/data/site";
import { localizePath } from "@/lib/i18n";
import { watchWidget, type WidgetState } from "@/lib/widget";

/** Official embed: one script per document. No undocumented SPA reinitialization. */
function loadTourvisor() {
  if (document.querySelector('script[data-almaz-tourvisor]')) return;
  const script = document.createElement("script");
  script.src = "https://tourvisor.ru/module/init.js";
  script.async = true;
  script.dataset.almazTourvisor = "true";
  document.body.appendChild(script);
}

export function TourvisorModule({ type, moduleId, minHeight = 420, skeletonRows = 3 }: {
  type: "tv-search-form" | "tv-hot-tours";
  moduleId: string | undefined;
  minHeight?: number;
  skeletonRows?: number;
}) {
  const locale = useLocale();
  const copy = uiCopy[locale];
  const hostRef = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<WidgetState>(moduleId ? "loading" : "failed");
  useEffect(() => {
    const host = hostRef.current;
    if (!moduleId || !host) return;
    const cleanup = watchWidget(host, setState);
    loadTourvisor();
    return cleanup;
  }, [moduleId]);

  return <div className="tv-wrap" data-lenis-prevent aria-busy={state === "loading"}>
    <div ref={hostRef} className={moduleId ? `${type} tv-moduleid-${moduleId}` : undefined} />
    {state === "loading" && <div role="status" aria-label={copy.widgetLoading} className="widget-skeleton" style={{ minHeight }}>
      {Array.from({ length: skeletonRows }, (_, index) => <div key={index} className="animate-pulse" aria-hidden="true" />)}
    </div>}
    {state === "failed" && <div className="widget-fallback" role="status">
      <p className="font-bold">{copy.widgetFail}</p>
      <p className="muted max-w-xl text-sm leading-6">{copy.widgetFailText}</p>
      <div className="flex flex-wrap gap-3">
        <Link href={localizePath("/contacts#lead", locale)} className="button-primary">{copy.widgetLead}</Link>
        <a href={site.social.whatsapp} target="_blank" rel="noopener noreferrer" className="button-secondary">WhatsApp</a>
      </div>
      {moduleId && <button type="button" className="widget-reload" onClick={() => window.location.reload()}>{locale === "kk" ? "Бетті қайта жүктеу" : "Перезагрузить страницу"}</button>}
    </div>}
  </div>;
}
