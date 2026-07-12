import { NextResponse } from "next/server";
import { escapeHtml, isTelegramConfigured, sendTelegramMessage } from "@/lib/telegram";

/**
 * Подписка на рассылку. Адрес пишется в лог сервера (дубль-резерв) и уходит
 * в Telegram; без TELEGRAM_BOT_TOKEN — только лог (см. README, «Формы»).
 */
export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Некорректный запрос" }, { status: 400 });
  }

  const email = String(body.email ?? "").trim();
  if (!/^\S+@\S+\.\S+$/.test(email)) {
    return NextResponse.json({ error: "Некорректный e-mail" }, { status: 422 });
  }

  /* Дубль-резерв: адрес в любом случае остаётся в серверном логе */
  console.log("[Almaz Tour] Новый подписчик рассылки:", email);

  if (isTelegramConfigured()) {
    const message = [
      "<b>📮 Новый подписчик рассылки</b>",
      "",
      `📧 ${escapeHtml(email)}`,
    ].join("\n");

    const sent = await sendTelegramMessage(message);
    if (!sent) {
      return NextResponse.json(
        { error: "Не удалось сохранить подписку" },
        { status: 502 }
      );
    }
  }

  return NextResponse.json({ ok: true });
}
