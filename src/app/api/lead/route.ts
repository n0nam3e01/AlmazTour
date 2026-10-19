import { NextResponse } from "next/server";
import { formCopy } from "@/data/form-copy";
import { formLocale, isFormObject, translatedErrors, validateLead } from "@/lib/leads";
import { escapeHtml, isTelegramConfigured, sendTelegramMessage } from "@/lib/telegram";

export async function POST(request: Request) {
  let body: unknown;
  try { body = await request.json(); } catch {
    return NextResponse.json({ error: formCopy.ru.malformed }, { status: 400 });
  }
  const locale = formLocale(body);
  const copy = formCopy[locale];
  if (!isFormObject(body)) return NextResponse.json({ error: copy.malformed }, { status: 400 });
  const result = validateLead(body);
  if (!result.ok) return NextResponse.json({ error: copy.invalid, errors: translatedErrors(result.errors, locale) }, { status: 422 });
  if (!isTelegramConfigured()) return NextResponse.json({ error: copy.unavailable }, { status: 503 });

  const lead = result.data;
  const lines = ["<b>🌴 Новая заявка на подбор тура</b>", `Язык: ${lead.locale}`, `Форма: ${lead.mode}`];
  const details = [
    ["Имя", lead.name], ["Телефон", lead.phone], ["Город вылета", lead.departureCity],
    ["Страна", lead.country], ["Даты", lead.dates], ["Бюджет на всех", lead.budget],
    ["Взрослых", String(lead.adults)], ["E-mail", lead.email], ["Пожелания", lead.comment], ["Контекст", lead.context],
  ];
  for (const [label, value] of details) if (value) lines.push(`${label}: ${escapeHtml(value)}`);
  lines.push(`Класс отеля: ${escapeHtml(lead.stars.join(", ") || "любой")}`);
  lines.push(`Детей: ${lead.children.length}${lead.children.length ? ` (${lead.children.map(age => age === 0 ? "до 1 года" : `${age} лет`).join(", ")})` : ""}`);
  try {
    if (await sendTelegramMessage(lines.join("\n"))) return NextResponse.json({ ok: true });
  } catch { /* Do not log submitted data or transport secrets. */ }
  return NextResponse.json({ error: copy.failure }, { status: 502 });
}
