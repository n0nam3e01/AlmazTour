"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Обёртка для встраиваемых модулей Tourvisor.
 *
 * Как это работает: скрипт //tourvisor.ru/module/init.js ищет на странице
 * div-элементы с классами вида `tv-search-form tv-moduleid-XXXX` и
 * разворачивает в них виджеты. ID модулей настраиваются в кабинете
 * pro.tourvisor.ru и передаются через переменные окружения (.env.local).
 *
 * Скрипт грузим лениво — только когда модуль появился на странице,
 * а до загрузки показываем скелетон, чтобы не прыгала вёрстка.
 */

let scanScheduled = false;

/**
 * init.js сканирует DOM в момент выполнения, поэтому при клиентской
 * навигации (когда контейнер модуля появился уже после первой загрузки
 * скрипта) вставляем скрипт заново. Старые теги удаляем, несколько
 * модулей на одной странице собираются одним сканом через дебаунс.
 */
function requestTourvisorScan(): Promise<void> {
  return new Promise((resolve) => {
    if (scanScheduled) {
      /* Скан уже назначен — подождём его вместе с остальными модулями */
      setTimeout(resolve, 400);
      return;
    }
    scanScheduled = true;

    setTimeout(() => {
      scanScheduled = false;
      document
        .querySelectorAll('script[src*="tourvisor.ru/module/init.js"]')
        .forEach((tag) => tag.remove());

      const script = document.createElement("script");
      script.src = "https://tourvisor.ru/module/init.js";
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => resolve();
      document.body.appendChild(script);
    }, 200);
  });
}

export function TourvisorModule({
  type,
  moduleId,
  minHeight = 420,
  skeletonRows = 3,
}: {
  /** Класс модуля Tourvisor: tv-search-form, tv-hot-tours и т.д. */
  type: "tv-search-form" | "tv-hot-tours";
  /** ID модуля из кабинета Tourvisor */
  moduleId: string | undefined;
  /** Минимальная высота контейнера до загрузки виджета */
  minHeight?: number;
  skeletonRows?: number;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  /* Если ID модуля не задан в .env — сразу показываем запасной блок */
  const [state, setState] = useState<"loading" | "ready" | "failed">(() =>
    moduleId ? "loading" : "failed"
  );

  useEffect(() => {
    if (!moduleId) return;

    const host = hostRef.current;
    if (!host) return;

    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;

    /* Следим, когда Tourvisor вставит контент в наш div, — тогда убираем
       скелетон. Наблюдатель не отключаем даже после таймаута: если виджет
       догрузится позже, запасной блок сменится на живой модуль. */
    const watcher = new MutationObserver(() => {
      if (host.childElementCount > 0) {
        setState("ready");
        watcher.disconnect();
        if (timer) clearTimeout(timer);
      }
    });
    watcher.observe(host, { childList: true, subtree: true });

    requestTourvisorScan().then(() => {
      /* Если виджет долго не отрисовывается (медленная сеть, модуль привязан
         к другому домену) — показываем запасной блок с контактами */
      timer = setTimeout(() => {
        if (!cancelled && host.childElementCount === 0) {
          setState("failed");
        }
      }, 15000);
    });

    return () => {
      cancelled = true;
      watcher.disconnect();
      if (timer) clearTimeout(timer);
    };
  }, [moduleId]);

  return (
    <div className="tv-wrap relative" style={{ minHeight: state === "ready" ? undefined : minHeight }}>
      {/* Контейнер, который заполняет скрипт Tourvisor */}
      <div ref={hostRef} className={moduleId ? `${type} tv-moduleid-${moduleId}` : undefined} />

      {/* Скелетон загрузки */}
      {state === "loading" && (
        <div className="absolute inset-0 flex flex-col gap-3 overflow-hidden" aria-hidden="true">
          <div className="h-12 w-full animate-pulse rounded-xl bg-azure-100" />
          {Array.from({ length: skeletonRows }).map((_, i) => (
            <div
              key={i}
              className="flex-1 animate-pulse rounded-xl bg-azure-50"
              style={{ animationDelay: `${i * 150}ms` }}
            />
          ))}
        </div>
      )}

      {/* Запасной вариант, если виджет не загрузился */}
      {state === "failed" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-azure-300 bg-azure-50 p-6 text-center">
          <p className="font-semibold text-navy-950">
            Онлайн-подборка туров сейчас недоступна
          </p>
          <p className="max-w-md text-sm text-navy-800/70">
            Напишите нам в WhatsApp или позвоните — менеджер подберёт тур вручную
            и пришлёт актуальные цены.
          </p>
          <a
            href="https://api.whatsapp.com/send?phone=77758889732"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 rounded-full bg-gold-400 px-5 py-2.5 text-sm font-bold text-navy-950 transition-colors hover:bg-gold-300"
          >
            Написать в WhatsApp
          </a>
        </div>
      )}
    </div>
  );
}
