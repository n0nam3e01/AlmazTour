"use client";

import { useState } from "react";
import { destinations } from "@/data/destinations";

type Errors = Partial<Record<"name" | "phone" | "email" | "country" | "dates" | "people", string>>;

/**
 * Форма «Подобрать тур» — та же, что была на старом сайте:
 * имя, телефон, e-mail, страна, класс отеля, даты, количество людей.
 */
export function LeadForm({ defaultCountry }: { defaultCountry?: string }) {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    country: defaultCountry ?? "",
    stars: "любой",
    dates: "",
    people: "2",
    comment: "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "fail">("idle");

  function set<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  }

  function validate(): boolean {
    const next: Errors = {};
    if (form.name.trim().length < 2) next.name = "Напишите, как к вам обращаться";
    if (!/^[+\d][\d\s\-()]{9,}$/.test(form.phone.trim()))
      next.phone = "Нужен номер телефона, например +7 777 123 45 67";
    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email))
      next.email = "Похоже, в адресе почты опечатка";
    if (!form.country) next.country = "Выберите страну";
    if (!form.dates.trim()) next.dates = "Укажите хотя бы примерные даты";
    if (!form.people.trim()) next.people = "Сколько человек едет?";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setStatus("sending");
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setStatus(res.ok ? "done" : "fail");
    } catch {
      setStatus("fail");
    }
  }

  if (status === "done") {
    return (
      <div className="rounded-2xl bg-azure-50 p-8 text-center">
        <p className="text-xl font-extrabold text-navy-950">Заявка отправлена!</p>
        <p className="mt-2 text-navy-800/75">
          Спасибо, {form.name}. Менеджер свяжется с вами в рабочее время и
          предложит несколько вариантов тура.
        </p>
      </div>
    );
  }

  const inputCls = (error?: string) =>
    `w-full rounded-xl border bg-white px-4 py-3 text-[15px] text-navy-950 placeholder:text-navy-400/60 focus:outline-none focus:ring-2 focus:ring-azure-400 ${
      error ? "border-red-400" : "border-navy-100"
    }`;

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-4 sm:grid-cols-2">
      <div>
        <label htmlFor="lead-name" className="mb-1.5 block text-sm font-semibold text-navy-950">
          Ваше имя *
        </label>
        <input
          id="lead-name"
          value={form.name}
          onChange={(e) => set("name", e.target.value)}
          placeholder="Айгерим"
          className={inputCls(errors.name)}
        />
        {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
      </div>

      <div>
        <label htmlFor="lead-phone" className="mb-1.5 block text-sm font-semibold text-navy-950">
          Номер телефона *
        </label>
        <input
          id="lead-phone"
          type="tel"
          value={form.phone}
          onChange={(e) => set("phone", e.target.value)}
          placeholder="+7 ___ ___ __ __"
          className={inputCls(errors.phone)}
        />
        {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
      </div>

      <div>
        <label htmlFor="lead-email" className="mb-1.5 block text-sm font-semibold text-navy-950">
          E-mail
        </label>
        <input
          id="lead-email"
          type="email"
          value={form.email}
          onChange={(e) => set("email", e.target.value)}
          placeholder="name@mail.kz"
          className={inputCls(errors.email)}
        />
        {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
      </div>

      <div>
        <label htmlFor="lead-country" className="mb-1.5 block text-sm font-semibold text-navy-950">
          Страна *
        </label>
        <select
          id="lead-country"
          value={form.country}
          onChange={(e) => set("country", e.target.value)}
          className={inputCls(errors.country)}
        >
          <option value="">Выберите страну</option>
          {destinations.map((d) => (
            <option key={d.slug} value={d.name}>
              {d.name}
            </option>
          ))}
          <option value="Другая страна">Другая страна</option>
        </select>
        {errors.country && <p className="mt-1 text-xs text-red-500">{errors.country}</p>}
      </div>

      <div>
        <span className="mb-1.5 block text-sm font-semibold text-navy-950">Класс отеля</span>
        <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Класс отеля">
          {["любой", "3★", "4★", "5★"].map((v) => (
            <button
              key={v}
              type="button"
              role="radio"
              aria-checked={form.stars === v}
              onClick={() => set("stars", v)}
              className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
                form.stars === v
                  ? "border-navy-950 bg-navy-950 text-white"
                  : "border-navy-200 text-navy-800 hover:border-navy-400"
              }`}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label htmlFor="lead-dates" className="mb-1.5 block text-sm font-semibold text-navy-950">
          Планируемые даты *
        </label>
        <input
          id="lead-dates"
          value={form.dates}
          onChange={(e) => set("dates", e.target.value)}
          placeholder="например, 10–20 августа"
          className={inputCls(errors.dates)}
        />
        {errors.dates && <p className="mt-1 text-xs text-red-500">{errors.dates}</p>}
      </div>

      <div>
        <label htmlFor="lead-people" className="mb-1.5 block text-sm font-semibold text-navy-950">
          Количество людей *
        </label>
        <input
          id="lead-people"
          type="number"
          min={1}
          max={20}
          value={form.people}
          onChange={(e) => set("people", e.target.value)}
          className={inputCls(errors.people)}
        />
        {errors.people && <p className="mt-1 text-xs text-red-500">{errors.people}</p>}
      </div>

      <div className="sm:col-span-2">
        <label htmlFor="lead-comment" className="mb-1.5 block text-sm font-semibold text-navy-950">
          Пожелания
        </label>
        <textarea
          id="lead-comment"
          rows={3}
          value={form.comment}
          onChange={(e) => set("comment", e.target.value)}
          placeholder="Например: первая линия, всё включено, едем с ребёнком 5 лет"
          className={inputCls()}
        />
      </div>

      <div className="sm:col-span-2">
        <button
          type="submit"
          disabled={status === "sending"}
          className="w-full rounded-full bg-gold-400 px-8 py-4 text-base font-bold text-navy-950 shadow-sm transition-all hover:bg-gold-300 active:translate-y-px disabled:opacity-60 sm:w-auto"
        >
          {status === "sending" ? "Отправляем…" : "Отправить заявку"}
        </button>
        {status === "fail" && (
          <p className="mt-2 text-sm text-red-500">
            Не получилось отправить. Позвоните нам или напишите в WhatsApp.
          </p>
        )}
        <p className="mt-3 text-xs text-navy-400">
          Нажимая кнопку, вы соглашаетесь на обработку персональных данных.
        </p>
      </div>
    </form>
  );
}
