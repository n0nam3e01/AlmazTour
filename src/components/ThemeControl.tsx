"use client";
import { useEffect, useLayoutEffect, useRef, useSyncExternalStore } from "react";
import { parseThemeMode, resolveTheme, THEME_KEY, type ThemeMode } from "@/lib/theme";
import { useLocale } from "@/components/LocaleProvider";
import { uiCopy } from "@/data/ui-copy";
const EVENT = "almaz-theme-change";
let lastAppliedMode: ThemeMode | null = null;
const snapshot = () => parseThemeMode(document.documentElement.dataset.themeMode);
const serverSnapshot = (): ThemeMode => "system";
function subscribe(listener: () => void) {
  window.addEventListener(EVENT, listener);
  return () => window.removeEventListener(EVENT, listener);
}
function apply(mode: ThemeMode) {
  lastAppliedMode = mode;
  const root = document.documentElement;
  root.dataset.themeMode = mode;
  root.dataset.theme = resolveTheme(mode, window.matchMedia("(prefers-color-scheme: dark)").matches);
  root.style.colorScheme = root.dataset.theme;
  window.dispatchEvent(new Event(EVENT));
}
export function ThemeProvider({ children }: {children: React.ReactNode}) {
  const locale = useLocale();
  useLayoutEffect(() => {
    let mode = lastAppliedMode ?? snapshot();
    try {
      const stored = localStorage.getItem(THEME_KEY);
      mode = stored === null ? mode : parseThemeMode(stored);
    } catch { /* The current in-memory preference still survives SPA locale changes. */ }
    apply(mode);
  }, [locale]);
  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const osChange = () => apply(snapshot());
    const storageChange = (event: StorageEvent) => { if (event.key === THEME_KEY || event.key === null) apply(parseThemeMode(event.newValue)); };
    media.addEventListener("change", osChange);
    window.addEventListener("storage", storageChange);
    return () => { media.removeEventListener("change", osChange); window.removeEventListener("storage", storageChange); };
  }, []);
  return children;
}
export function ThemeControl() {
  const copy = uiCopy[useLocale()];
  const mode = useSyncExternalStore(subscribe, snapshot, serverSnapshot);
  const ref = useRef<HTMLDetailsElement>(null);
  useEffect(() => {
    const close = (event: PointerEvent) => { if (ref.current && !ref.current.contains(event.target as Node)) ref.current.open = false; };
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, []);
  return <details ref={ref} className="theme-control" onKeyDown={(event) => {
    if (event.key === "Escape" && ref.current) { ref.current.open = false; ref.current.querySelector("summary")?.focus(); }
  }}>
    <summary aria-label={copy.theme} title={copy.theme}><span aria-hidden="true">◐</span></summary>
    <fieldset className="theme-options"><legend>{copy.theme}</legend>
      <div className="theme-choice-list">
      <span className="theme-active-pill" aria-hidden="true" style={{ transform: `translateY(${mode === "system" ? 0 : mode === "light" ? 46 : 92}px)` }} />
      {([['system',copy.themeSystem],['light',copy.themeLight],['dark',copy.themeDark]] as const).map(([value,label]) => <label key={value}>
        <input type="radio" name="theme-mode" value={value} checked={mode === value} onChange={() => {
          try { localStorage.setItem(THEME_KEY, value); } catch { /* Настройка действует и без хранилища. */ }
          apply(value);
        }}/>{label}
      </label>)}
      </div>
    </fieldset>
  </details>;
}
