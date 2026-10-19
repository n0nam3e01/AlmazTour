/**
 * Отправка уведомлений в Telegram через Bot API.
 *
 * Используется API-роутами форм (lead, review, subscribe).
 * Токен бота и ID чата задаются в переменных окружения
 * TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID и TELEGRAM_CHAT_IDS — серверные настройки,
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
 * Telegram настроен, когда заданы токен и хотя бы один получатель.
 * Без настройки API возвращают 503; содержимое заявки в лог не пишется.
 */
export function getTelegramChatIds(): string[] {
  // Старый получатель сохраняется; список дополняет его личными чатами или группами.
  return [...new Set([
    process.env.TELEGRAM_CHAT_ID ?? "",
    process.env.TELEGRAM_CHAT_IDS ?? "",
  ].flatMap((value) => value.split(/[,;\s]+/)).map((value) => value.trim()).filter(Boolean))];
}

export function isTelegramConfigured(): boolean {
  return Boolean(process.env.TELEGRAM_BOT_TOKEN?.trim() && getTelegramChatIds().length);
}

/**
 * Отправляет сообщение всем получателям. Возвращает true, если получил хотя бы один.
 * Ошибки отдельных чатов фиксируются в логе; при полном отказе возвращает false,
 * и API формы отвечает 502.
 */
export async function sendTelegramMessage(text: string): Promise<boolean> {
  const token = process.env.TELEGRAM_BOT_TOKEN?.trim();
  const chatIds = getTelegramChatIds();
  if (!token || !chatIds.length) return false;

  // Дожидаемся всех отправок: фоновые запросы могут оборваться после ответа на Vercel.
  const deliveries = await Promise.allSettled(chatIds.map(async (chatId) => {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text, parse_mode: "HTML" }),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });

    const result = await res.json() as { ok?: boolean; error_code?: number };
    if (!res.ok || !result.ok) {
      // Не выводим URL с токеном, тело заявки или сырые сетевые ошибки.
      console.error(`[Almaz Tour] Telegram: ошибка доставки в чат ${chatId}, код ${result.error_code ?? res.status}`);
      return false;
    }
    return true;
  }));

  const delivered = deliveries.filter((result) => result.status === "fulfilled" && result.value).length;
  if (delivered < chatIds.length) {
    console.error(`[Almaz Tour] Telegram: доставлено ${delivered} из ${chatIds.length} уведомлений. Проверьте получателей и доступ бота к чатам.`);
  }
  // Если заявка уже получена хотя бы одним сотрудником, не просим клиента отправить дубль.
  return delivered > 0;
}
