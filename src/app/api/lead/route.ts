import { NextResponse } from "next/server";
import { escapeHtml, isTelegramConfigured, sendTelegramMessage } from "@/lib/telegram";

/** Возраст ребёнка в читаемом виде: 0 лет звучит странно */
function childAge(age: string): string {
  const n = Number(age);
  if (!Number.isFinite(n)) return age;
  if (n === 0) return "до 1 года";
  /* 1 год, 2 года, 5 лет — по правилам русского счёта */
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return `${n} год`;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return `${n} года`;
  return `${n} лет`;
}

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

  /* Класс отеля приходит списком: 4★ и 5★ нередко стоят одинаково */
  const stars = Array.isArray(body.stars) ? body.stars.map(String) : [];
  /* Дети — массив возрастов, его длина и есть их количество */
  const children = Array.isArray(body.children) ? body.children.map(String) : [];

  const lead = {
    type: "lead",
    receivedAt: new Date().toISOString(),
    name,
    phone,
    email: String(body.email ?? ""),
    country,
    stars,
    dates: String(body.dates ?? ""),
    adults: String(body.adults ?? ""),
    children,
    comment: String(body.comment ?? ""),
  };

  /* Дубль-резерв: заявка в любом случае остаётся в серверном логе */
  console.log("[Almaz Tour] Новая заявка на подбор тура:", JSON.stringify(lead, null, 2));

  if (isTelegramConfigured()) {
    /* Телефон оставляем обычным текстом — Telegram сам делает его кликабельным.
       Пустые поля в сообщение не включаем, чтобы не засорять его. */
    const lines = [
      "<b>🌴 Новая заявка на подбор тура</b>",
      "",
      `👤 Имя: ${escapeHtml(lead.name)}`,
      `📞 Телефон: ${escapeHtml(lead.phone)}`,
      `🌍 Страна: ${escapeHtml(lead.country)}`,
    ];

    if (stars.length > 0) {
      lines.push(`🏨 Класс отеля: ${escapeHtml(stars.join(", "))}`);
    } else {
      lines.push("🏨 Класс отеля: любой");
    }

    if (lead.dates) lines.push(`📅 Даты: ${escapeHtml(lead.dates)}`);
    if (lead.adults) lines.push(`👥 Взрослых: ${escapeHtml(lead.adults)}`);

    if (children.length > 0) {
      const ages = children.map((age) => childAge(age)).join(", ");
      lines.push(`🧒 Детей: ${children.length} (${escapeHtml(ages)})`);
    }

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
