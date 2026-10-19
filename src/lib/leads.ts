import type { Locale } from "@/lib/i18n";
import { formCopy, type FormField } from "@/data/form-copy";

export const STAR_OPTIONS = ["3★", "4★", "5★"] as const;
export const FORM_LIMITS = { name: 100, phone: 40, email: 254, country: 100, departureCity: 100, dates: 120, budget: 100, comment: 1500, text: 2500, context: 120 } as const;
export type FormErrors = Partial<Record<FormField, string>>;
export type Lead = {
  name: string; phone: string; email: string; country: string; departureCity: string;
  dates: string; budget: string; comment: string; adults: number | "";
  children: number[]; stars: string[]; mode: "quick" | "detailed"; locale: Locale; context: string;
};
type Result<T> = { ok: true; data: T } | { ok: false; errors: FormErrors };

export function isFormObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function formLocale(value: unknown): Locale {
  return isFormObject(value) && value.locale === "kk" ? "kk" : "ru";
}

function fields(body: Record<string, unknown>, keys: (keyof typeof FORM_LIMITS)[], required: Partial<Record<FormField, number>>) {
  const errors: FormErrors = {};
  const data: Record<string, string> = {};
  for (const key of keys) {
    const raw = body[key];
    data[key] = typeof raw === "string" ? raw.trim() : "";
    if ((raw !== undefined && typeof raw !== "string") || data[key].length > FORM_LIMITS[key] || data[key].length < (required[key] ?? 0) || /[\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(data[key])) errors[key] = key;
  }
  if (keys.includes("email") && data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errors.email = "email";
  if (body.locale !== undefined && body.locale !== "ru" && body.locale !== "kk") errors.locale = "locale";
  return { errors, data };
}

function integer(value: unknown, min: number, max: number): number | null {
  if (typeof value !== "number" && (typeof value !== "string" || !/^\d+$/.test(value))) return null;
  const number = Number(value);
  return Number.isInteger(number) && number >= min && number <= max ? number : null;
}

export function validateLead(body: Record<string, unknown>): Result<Lead> {
  const { data, errors } = fields(body, ["name", "phone", "email", "country", "departureCity", "dates", "budget", "comment", "context"], { name: 2, phone: 1 });
  const digits = data.phone.replace(/\D/g, "");
  if (!/^\+?[\d\s()-]+$/.test(data.phone) || digits.length < 10 || digits.length > 15) errors.phone = "phone";
  if (body.mode !== undefined && body.mode !== "quick" && body.mode !== "detailed") errors.mode = "mode";
  const adults = body.adults === undefined || body.adults === "" ? "" : integer(body.adults, 1, 20);
  if (adults === null) errors.adults = "adults";
  const children: number[] = [];
  if (body.children !== undefined) {
    if (!Array.isArray(body.children) || body.children.length > 10) errors.children = "children";
    else for (const value of body.children) {
      const age = integer(value, 0, 17);
      if (age === null) errors.children = "children"; else children.push(age);
    }
  }
  let stars: string[] = [];
  if (body.stars !== undefined) {
    if (!Array.isArray(body.stars) || body.stars.length > 3 || body.stars.some(value => typeof value !== "string" || !STAR_OPTIONS.includes(value as typeof STAR_OPTIONS[number]))) errors.stars = "stars";
    else stars = [...new Set(body.stars as string[])];
  }
  if (Object.keys(errors).length) return { ok: false, errors };
  return { ok: true, data: { ...data, adults: adults ?? "", children, stars, mode: body.mode === "quick" ? "quick" : "detailed", locale: formLocale(body) } as Lead };
}

export function validateReview(body: Record<string, unknown>): Result<{ name: string; text: string; locale: Locale }> {
  const { data, errors } = fields(body, ["name", "text"], { name: 2, text: 10 });
  return Object.keys(errors).length ? { ok: false, errors } : { ok: true, data: { name: data.name, text: data.text, locale: formLocale(body) } };
}

export function validateSubscribe(body: Record<string, unknown>): Result<{ email: string; locale: Locale }> {
  const { data, errors } = fields(body, ["email"], { email: 1 });
  return Object.keys(errors).length ? { ok: false, errors } : { ok: true, data: { email: data.email, locale: formLocale(body) } };
}

export function translatedErrors(errors: FormErrors, locale: Locale): FormErrors {
  return Object.fromEntries(Object.keys(errors).map(key => [key, formCopy[locale].errors[key as FormField]]));
}
