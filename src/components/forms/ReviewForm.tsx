"use client";

import { useState } from "react";

/** Форма «Оставить отзыв» */
export function ReviewForm() {
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [errors, setErrors] = useState<{ name?: string; text?: string }>({});
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "fail">("idle");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const next: typeof errors = {};
    if (name.trim().length < 2) next.name = "Представьтесь, пожалуйста";
    if (text.trim().length < 10) next.text = "Расскажите чуть подробнее — хотя бы пару предложений";
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setStatus("sending");
    try {
      const res = await fetch("/api/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, text }),
      });
      setStatus(res.ok ? "done" : "fail");
    } catch {
      setStatus("fail");
    }
  }

  if (status === "done") {
    return (
      <div className="rounded-2xl bg-azure-50 p-8 text-center">
        <p className="text-xl font-extrabold text-navy-950">Спасибо за отзыв!</p>
        <p className="mt-2 text-navy-800/75">
          Мы прочитаем его и опубликуем на сайте после проверки.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-4">
      <div>
        <label htmlFor="review-name" className="mb-1.5 block text-sm font-semibold text-navy-950">
          Ваше имя *
        </label>
        <input
          id="review-name"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setErrors((er) => ({ ...er, name: undefined }));
          }}
          placeholder="Как вас зовут"
          className={`w-full rounded-xl border bg-white px-4 py-3 text-[15px] text-navy-950 placeholder:text-navy-400/60 focus:outline-none focus:ring-2 focus:ring-azure-400 ${
            errors.name ? "border-red-400" : "border-navy-100"
          }`}
        />
        {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
      </div>

      <div>
        <label htmlFor="review-text" className="mb-1.5 block text-sm font-semibold text-navy-950">
          Ваш отзыв *
        </label>
        <textarea
          id="review-text"
          rows={5}
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            setErrors((er) => ({ ...er, text: undefined }));
          }}
          placeholder="Куда ездили, что понравилось, что запомнилось"
          className={`w-full rounded-xl border bg-white px-4 py-3 text-[15px] text-navy-950 placeholder:text-navy-400/60 focus:outline-none focus:ring-2 focus:ring-azure-400 ${
            errors.text ? "border-red-400" : "border-navy-100"
          }`}
        />
        {errors.text && <p className="mt-1 text-xs text-red-500">{errors.text}</p>}
      </div>

      <div>
        <button
          type="submit"
          disabled={status === "sending"}
          className="rounded-full bg-navy-950 px-8 py-3.5 text-base font-bold text-white transition-all hover:bg-navy-800 active:translate-y-px disabled:opacity-60"
        >
          {status === "sending" ? "Отправляем…" : "Отправить отзыв"}
        </button>
        {status === "fail" && (
          <p className="mt-2 text-sm text-red-500">
            Не получилось отправить. Попробуйте позже или напишите нам в WhatsApp.
          </p>
        )}
      </div>
    </form>
  );
}
