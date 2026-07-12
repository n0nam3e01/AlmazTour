/**
 * Отправка уведомлений в Telegram через Bot API.
 *
 * Используется API-роутами форм (lead, review, subscribe).
 * Токен бота и ID чата задаются в переменных окружения
 * TELEGRAM_BOT_TOKEN и TELEGRAM_CHAT_ID — это серверные секреты,
 * в клиентский бандл они не попадают (см. .env.example и README).
 */

/** Сколько ждём ответа Telegram, прежде чем счесть запрос неудавшимся. */
const TIMEOUT_MS = 10_000;

/**
 * Экранирует HTML-спецсимволы, чтобы пользовательский ввод
 * не ломал разметку сообщения (parse_mode: HTML).
 */
export function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

/**
 * Telegram считается настроенным, когда заданы обе переменные окружения.
 * Если их нет (проект развернули без настройки) — роуты работают
 * как раньше: заявка пишется только в серверный лог.
 */
export function isTelegramConfigured(): boolean {
  return Boolean(process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID);
}

/**
 * Отправляет сообщение в чат менеджера. Возвращает true при успехе.
 * При любой ошибке (сеть, таймаут, отказ Bot API) пишет причину в лог
 * и возвращает false — роут в этом случае отвечает 502, а форма
 * на клиенте показывает запасное сообщение «позвоните нам».
 */
export async function sendTelegramMessage(text: string): Promise<boolean> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return false;

  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text, parse_mode: "HTML" }),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });

    if (!res.ok) {
      const details = await res.text().catch(() => "");
      console.error(`[Almaz Tour] Telegram ответил ошибкой ${res.status}: ${details}`);
      return false;
    }
    return true;
  } catch (error) {
    console.error("[Almaz Tour] Не удалось отправить сообщение в Telegram:", error);
    return false;
  }
}
