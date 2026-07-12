import { NextResponse } from "next/server";
import { escapeHtml, isTelegramConfigured, sendTelegramMessage } from "@/lib/telegram";

/**
 * Приём отзывов. Отзыв пишется в лог сервера (дубль-резерв) и уходит
 * в Telegram; без TELEGRAM_BOT_TOKEN — только лог (см. README, «Формы»).
 */
export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Некорректный запрос" }, { status: 400 });
  }

  const name = String(body.name ?? "").trim();
  const text = String(body.text ?? "").trim();

  if (name.length < 2 || text.length < 10) {
    return NextResponse.json(
      { error: "Укажите имя и текст отзыва" },
      { status: 422 }
    );
  }

  /* Дубль-резерв: отзыв в любом случае остаётся в серверном логе */
  console.log("[Almaz Tour] Новый отзыв:", JSON.stringify({ name, text }, null, 2));

  if (isTelegramConfigured()) {
    const message = [
      "<b>⭐ Новый отзыв на сайте</b>",
      "",
      `👤 Имя: ${escapeHtml(name)}`,
      `💬 ${escapeHtml(text)}`,
    ].join("\n");

    const sent = await sendTelegramMessage(message);
    if (!sent) {
      return NextResponse.json(
        { error: "Не удалось передать отзыв менеджеру" },
        { status: 502 }
      );
    }
  }

  return NextResponse.json({ ok: true });
}
