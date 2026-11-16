/**
 * Защита форм от автоматических отправок: поле-ловушка и ограничение частоты.
 * Счётчик хранится в памяти процесса: на бессерверной площадке он действует
 * в пределах одного экземпляра, то есть сдерживает всплески, а не заменяет WAF.
 */

/** Скрытое поле, которое человек не видит и не заполняет. */
export const TRAP_FIELD = "website";

const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const MAX_TRACKED = 5000;
const attempts = new Map<string, number[]>();

export function isTrapped(body: Record<string, unknown>): boolean {
  const value = body[TRAP_FIELD];
  return value !== undefined && value !== "";
}

function clientIp(request: Request): string | null {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || request.headers.get("x-real-ip")?.trim() || null;
}

/** Возвращает true, если отправителю пора подождать. Без известного IP не ограничивает. */
export function isRateLimited(request: Request, now = Date.now()): boolean {
  const ip = clientIp(request);
  if (!ip) return false;
  const recent = (attempts.get(ip) ?? []).filter((at) => now - at < WINDOW_MS);
  if (recent.length >= MAX_PER_WINDOW) {
    attempts.set(ip, recent);
    return true;
  }
  recent.push(now);
  attempts.set(ip, recent);
  if (attempts.size > MAX_TRACKED) {
    for (const [key, times] of attempts) if (times.every((at) => now - at >= WINDOW_MS)) attempts.delete(key);
  }
  return false;
}

export function resetRateLimit(): void {
  attempts.clear();
}
