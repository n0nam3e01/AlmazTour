type ScrollDecision = { kind: "native" } | { kind: "position"; y: number } | { kind: "anchor"; id: string };

// Survives client-side locale remounts even when browser storage is blocked.
let pendingLanguageScroll: string | null = null;
export function saveLanguageScroll(href: string, y: number): void {
  pendingLanguageScroll = JSON.stringify({ href, y, at: Date.now() });
  try { sessionStorage.setItem("almaz-language-scroll", pendingLanguageScroll); } catch { /* In-memory transfer remains available. */ }
}
export function consumeLanguageScroll(): string | null {
  let saved = pendingLanguageScroll;
  pendingLanguageScroll = null;
  try {
    saved ??= sessionStorage.getItem("almaz-language-scroll");
    sessionStorage.removeItem("almaz-language-scroll");
  } catch { /* Browser storage is optional. */ }
  return saved;
}

export function anchorId(href: string): string | null {
  const hash = href.indexOf("#");
  if (hash < 0 || hash === href.length - 1) return null;
  try { return decodeURIComponent(href.slice(hash + 1)); } catch { return null; }
}

/** Next/browser own ordinary navigation and history; only language transfers override it. */
export function navigationScroll(href: string, history: boolean, saved: string | null, now = Date.now()): ScrollDecision {
  if (history) return { kind: "native" };
  try {
    const value: unknown = JSON.parse(saved ?? "null");
    if (typeof value === "object" && value !== null && "href" in value && value.href === href &&
        "y" in value && typeof value.y === "number" && Number.isFinite(value.y) && value.y >= 0 &&
        "at" in value && typeof value.at === "number" && now >= value.at && now - value.at < 30_000) {
      return { kind: "position", y: value.y };
    }
  } catch { /* Storage is optional. */ }
  const id = anchorId(href);
  if (id) return { kind: "anchor", id };
  return { kind: "native" };
}
