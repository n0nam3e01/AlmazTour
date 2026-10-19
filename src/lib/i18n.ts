export const locales = ["ru", "kk"] as const;
export type Locale = (typeof locales)[number];
export const hasLocale = (value: unknown): value is Locale => value === "ru" || value === "kk";
export function localeFromPath(path: string): Locale {
  const candidate = path.split(/[/?#]/)[1];
  return hasLocale(candidate) ? candidate : "ru";
}
export function stripLocale(path: string): string {
  const stripped = path.replace(/^\/(ru|kk)(?=\/|[?#]|$)/, "");
  return stripped.startsWith("/") ? stripped : `/${stripped}`;
}
/** Внешние ссылки не перенаправляем через собственный языковой маршрут. */
export function localizePath(path: string, locale: Locale): string {
  if (!path.startsWith("/") || path.startsWith("//")) return path;
  const clean = stripLocale(path);
  const boundary = clean.search(/[?#]/);
  const tail = boundary < 0 ? "" : clean.slice(boundary);
  const base = boundary < 0 ? clean : clean.slice(0, boundary);
  return `/${locale}${base === "/" ? "" : base}${tail}`;
}
export const switchLocale = localizePath;
export function pageAlternates(path: string, locale: Locale) {
  return {
    canonical: localizePath(path, locale),
    languages: { ru: localizePath(path, "ru"), kk: localizePath(path, "kk"), "x-default": localizePath(path, "ru") },
  };
}
