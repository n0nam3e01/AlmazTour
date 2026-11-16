import { NextResponse } from "next/server";
import { formCopy } from "@/data/form-copy";
import { formLocale, isFormObject, translatedErrors, validateReview } from "@/lib/leads";
import { isRateLimited, isTrapped } from "@/lib/form-guard";
import { escapeHtml, isTelegramConfigured, sendTelegramMessage } from "@/lib/telegram";

export async function POST(request: Request) {
  let body: unknown;
  try { body = await request.json(); } catch {
    return NextResponse.json({ error: formCopy.ru.malformed }, { status: 400 });
  }
  const locale = formLocale(body);
  const copy = formCopy[locale];
  if (!isFormObject(body)) return NextResponse.json({ error: copy.malformed }, { status: 400 });
  // Боту отвечаем как при успехе, но никому ничего не отправляем.
  if (isTrapped(body)) return NextResponse.json({ ok: true });
  const result = validateReview(body);
  if (!result.ok) return NextResponse.json({ error: copy.invalid, errors: translatedErrors(result.errors, locale) }, { status: 422 });
  if (!isTelegramConfigured()) return NextResponse.json({ error: copy.unavailable }, { status: 503 });
  if (isRateLimited(request)) return NextResponse.json({ error: copy.tooMany }, { status: 429 });
  const { name, text } = result.data;
  const message = ["<b>⭐ Новый отзыв на сайте</b>", `Язык: ${locale}`, `Имя: ${escapeHtml(name)}`, escapeHtml(text)].join("\n");
  try {
    if (await sendTelegramMessage(message)) return NextResponse.json({ ok: true });
  } catch { /* Do not log submitted data or transport secrets. */ }
  return NextResponse.json({ error: copy.failure }, { status: 502 });
}
