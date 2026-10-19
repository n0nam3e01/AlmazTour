export type ThemeMode = "system" | "light" | "dark";
export function parseThemeMode(value: unknown): ThemeMode {
  return value === "light" || value === "dark" ? value : "system";
}
export function resolveTheme(mode: ThemeMode, darkOS: boolean): "light" | "dark" {
  return mode === "system" ? (darkOS ? "dark" : "light") : mode;
}
export const THEME_KEY = "almaz-theme";
/** Выполняется до отрисовки страницы; блокировка storage не блокирует сайт. */
export const themeBootScript = `(function(){var m='system';try{var v=localStorage.getItem('almaz-theme');if(v==='light'||v==='dark')m=v}catch(e){}var t=m==='system'?(window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'):m;var r=document.documentElement;r.dataset.theme=t;r.dataset.themeMode=m;r.style.colorScheme=t})()`;
