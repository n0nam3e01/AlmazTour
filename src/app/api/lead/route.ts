import { NextResponse } from "next/server";
import { escapeHtml, isTelegramConfigured, sendTelegramMessage } from "@/lib/telegram";

/**
 * Приём заявок «Подобрать тур».
 *
 * Заявка валидируется, пишется в лог сервера (дубль-резерв) и уходит
 * сообщением в Telegram менеджеру. Если переменные TELEGRAM_BOT_TOKEN /
 * TELEGRAM_CHAT_ID не заданы — остаётся только лог (см. README, «Формы»).
 */
export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Некорректный запрос" }, { status: 400 });
  }

  const name = String(body.name ?? "").trim();
  const phone = String(body.phone ?? "").trim();
  const country = String(body.country ?? "").trim();

  if (name.length < 2 || phone.length < 10 || !country) {
    return NextResponse.json(
      { error: "Заполните имя, телефон и страну" },
      { status: 422 }
    );
  }

  const lead = {
    type: "lead",
    receivedAt: new Date().toISOString(),
    name,
    phone,
    email: String(body.email ?? ""),
    country,
    stars: String(body.stars ?? ""),
    dates: String(body.dates ?? ""),
    people: String(body.people ?? ""),
    comment: String(body.comment ?? ""),
  };

  /* Дубль-резерв: заявка в любом случае остаётся в серверном логе */
  console.log("[Almaz Tour] Новая заявка на подбор тура:", JSON.stringify(lead, null, 2));

  if (isTelegramConfigured()) {
    /* Телефон оставляем обычным текстом — Telegram сам делает его кликабельным.
       Необязательные поля в сообщение не включаем, чтобы не засорять его. */
    const lines = [
      "<b>🌴 Новая заявка на подбор тура</b>",
      "",
      `👤 Имя: ${escapeHtml(lead.name)}`,
      `📞 Телефон: ${escapeHtml(lead.phone)}`,
      `🌍 Страна: ${escapeHtml(lead.country)}`,
    ];
    if (lead.stars) lines.push(`🏨 Класс отеля: ${escapeHtml(lead.stars)}`);
    if (lead.dates) lines.push(`📅 Даты: ${escapeHtml(lead.dates)}`);
    if (lead.people) lines.push(`👥 Человек: ${escapeHtml(lead.people)}`);
    if (lead.comment) lines.push(`💬 Пожелания: ${escapeHtml(lead.comment)}`);
    if (lead.email) lines.push(`📧 E-mail: ${escapeHtml(lead.email)}`);

    const sent = await sendTelegramMessage(lines.join("\n"));
    if (!sent) {
      return NextResponse.json(
        { error: "Не удалось передать заявку менеджеру" },
        { status: 502 }
      );
    }
  }

  return NextResponse.json({ ok: true });
}
