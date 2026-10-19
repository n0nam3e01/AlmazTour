type DraftStorage = Pick<Storage, "getItem" | "setItem" | "removeItem">;
const TTL = 30 * 60 * 1000;
const prefix = "almaz:form:";

function session(): DraftStorage | undefined {
  try { return typeof window === "undefined" ? undefined : window.sessionStorage; } catch { return undefined; }
}

export function readDraft(key: string, storage: DraftStorage | undefined = session(), now = Date.now()): Record<string, unknown> | null {
  try {
    const raw = storage?.getItem(prefix + key);
    if (!raw) return null;
    const draft: unknown = JSON.parse(raw);
    if (typeof draft !== "object" || draft === null || !("expires" in draft) || !("fields" in draft)) return null;
    if (typeof draft.expires !== "number" || draft.expires <= now || draft.expires > now + TTL) {
      storage?.removeItem(prefix + key);
      return null;
    }
    return typeof draft.fields === "object" && draft.fields !== null && !Array.isArray(draft.fields) ? draft.fields as Record<string, unknown> : null;
  } catch { return null; }
}

export function writeDraft(key: string, fields: object, storage: DraftStorage | undefined = session(), now = Date.now()): void {
  try { storage?.setItem(prefix + key, JSON.stringify({ expires: now + TTL, fields })); } catch { /* Storage is optional. */ }
}

export function clearDraft(key: string, storage: DraftStorage | undefined = session()): void {
  try { storage?.removeItem(prefix + key); } catch { /* Storage is optional. */ }
}
