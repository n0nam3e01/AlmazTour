"use client";

import { useState } from "react";
import { destinations } from "@/data/destinations";

type Errors = Partial<
  Record<"name" | "phone" | "email" | "country" | "dates" | "adults" | "children", string>
>;

/** Варианты класса отеля. «Любой» сбрасывает остальные — это отдельный случай */
const STAR_OPTIONS = ["3★", "4★", "5★"];

/**
 * Форма «Подобрать тур».
 *
 * Класс отеля выбирается галочками, а не одним вариантом: 4★ и 5★ часто
 * попадают в одну цену, и туристу важно видеть оба. Состав туристов
 * разделён на взрослых и детей — для детей нужен возраст, потому что от
 * него зависит и цена, и допуск в отель.
 */
export function LeadForm({ defaultCountry }: { defaultCountry?: string }) {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    country: defaultCountry ?? "",
    dates: "",
    adults: "2",
    comment: "",
  });
  /* Выбранные классы отеля. Пустой массив означает «любой» */
  const [stars, setStars] = useState<string[]>([]);
  /* Возраст каждого ребёнка. Длина массива и есть количество детей */
  const [children, setChildren] = useState<string[]>([]);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "fail">("idle");

  function set<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  }

  function toggleStar(value: string) {
    setStars((prev) =>
      prev.includes(value) ? prev.filter((s) => s !== value) : [...prev, value]
    );
  }

  function addChild() {
    setChildren((prev) => [...prev, ""]);
    setErrors((e) => ({ ...e, children: undefined }));
  }

  function setChildAge(index: number, age: string) {
    setChildren((prev) => prev.map((v, i) => (i === index ? age : v)));
    setErrors((e) => ({ ...e, children: undefined }));
  }

  function removeChild(index: number) {
    setChildren((prev) => prev.filter((_, i) => i !== index));
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
    if (!form.adults.trim() || Number(form.adults) < 1)
      next.adults = "Хотя бы один взрослый";
    if (children.some((age) => age === ""))
      next.children = "Укажите возраст каждого ребёнка";
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
        body: JSON.stringify({ ...form, stars, children }),
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
        <input
          id="lead-country"
          value={form.country}
          onChange={(e) => set("country", e.target.value)}
          list="lead-country-options"
          placeholder="Например, Турция или Япония"
          className={inputCls(errors.country)}
        />
        <datalist id="lead-country-options">
          {destinations.map((d) => (
            <option key={d.slug} value={d.name} />
          ))}
        </datalist>
        {errors.country && <p className="mt-1 text-xs text-red-500">{errors.country}</p>}
      </div>

      {/* Класс отеля: можно отметить сразу несколько */}
      <div className="sm:col-span-2">
        <span className="mb-1.5 block text-sm font-semibold text-navy-950">
          Класс отеля
          <span className="ml-2 font-normal text-navy-400">
            можно выбрать несколько
          </span>
        </span>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Класс отеля">
          {STAR_OPTIONS.map((v) => {
            const active = stars.includes(v);
            return (
              <button
                key={v}
                type="button"
                aria-pressed={active}
                onClick={() => toggleStar(v)}
                className={`rounded-full border px-5 py-2 text-sm font-semibold transition-colors ${
                  active
                    ? "border-navy-950 bg-navy-950 text-white"
                    : "border-navy-200 text-navy-800 hover:border-navy-400"
                }`}
              >
                {v}
              </button>
            );
          })}
          <button
            type="button"
            aria-pressed={stars.length === 0}
            onClick={() => setStars([])}
            className={`rounded-full border px-5 py-2 text-sm font-semibold transition-colors ${
              stars.length === 0
                ? "border-navy-950 bg-navy-950 text-white"
                : "border-navy-200 text-navy-800 hover:border-navy-400"
            }`}
          >
            любой
          </button>
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
        <label htmlFor="lead-adults" className="mb-1.5 block text-sm font-semibold text-navy-950">
          Взрослых *
        </label>
        <input
          id="lead-adults"
          type="number"
          min={1}
          max={20}
          value={form.adults}
          onChange={(e) => set("adults", e.target.value)}
          className={inputCls(errors.adults)}
        />
        {errors.adults && <p className="mt-1 text-xs text-red-500">{errors.adults}</p>}
      </div>

      {/* Дети: возраст важен для цены и правил отеля, поэтому спрашиваем его */}
      <div className="sm:col-span-2">
        <span className="mb-1.5 block text-sm font-semibold text-navy-950">
          Дети
          <span className="ml-2 font-normal text-navy-400">
            возраст на момент поездки
          </span>
        </span>

        {children.length > 0 && (
          <ul className="mb-3 flex flex-wrap gap-2">
            {children.map((age, i) => (
              <li key={i} className="flex items-center gap-1.5 rounded-xl border border-navy-100 bg-white py-1.5 pl-3 pr-1.5">
                <label htmlFor={`child-${i}`} className="text-sm text-navy-800">
                  Ребёнок {i + 1}
                </label>
                <select
                  id={`child-${i}`}
                  value={age}
                  onChange={(e) => setChildAge(i, e.target.value)}
                  className="rounded-lg border border-navy-100 bg-white px-2 py-1 text-sm font-semibold text-navy-950 focus:outline-none focus:ring-2 focus:ring-azure-400"
                >
                  <option value="">возраст</option>
                  {Array.from({ length: 18 }).map((_, age) => (
                    <option key={age} value={String(age)}>
                      {age === 0 ? "до 1 года" : `${age} лет`}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => removeChild(i)}
                  aria-label={`Убрать ребёнка ${i + 1}`}
                  className="flex h-7 w-7 items-center justify-center rounded-lg text-navy-400 transition-colors hover:bg-navy-50 hover:text-navy-950"
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                    <path d="M3 3l8 8M11 3l-8 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                  </svg>
                </button>
              </li>
            ))}
          </ul>
        )}

        <button
          type="button"
          onClick={addChild}
          className="inline-flex items-center gap-1.5 rounded-full border border-dashed border-navy-200 px-4 py-2 text-sm font-semibold text-navy-800 transition-colors hover:border-navy-400 hover:text-navy-950"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M7 2v10M2 7h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          Добавить ребёнка
        </button>
        {errors.children && <p className="mt-1 text-xs text-red-500">{errors.children}</p>}
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
          placeholder="Например: первая линия, всё включено, тихий отель без анимации"
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
