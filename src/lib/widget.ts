export type WidgetState = "loading" | "ready" | "failed";

/** Bound loading from mount, independently of the external script's network events. */
export function watchWidget(host: HTMLElement, update: (state: WidgetState) => void): () => void {
  let active = true;
  let ready = false;
  const check = () => {
    if (!active || ready || host.childElementCount === 0) return;
    ready = true;
    clearTimeout(timer);
    observer.disconnect();
    update("ready");
  };
  const observer = new MutationObserver(check);
  observer.observe(host, { childList: true, subtree: true });
  const timer = setTimeout(() => { if (active && !ready) update("failed"); }, 15_000);
  check();
  return () => { active = false; clearTimeout(timer); observer.disconnect(); };
}
