"use client";

import { useState } from "react";

/** Подписка на рассылку в футере */
export function SubscribeForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setStatus("error");
      return;
    }
    setStatus("sending");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setStatus(res.ok ? "done" : "error");
    } catch {
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <p className="mt-4 rounded-xl bg-white/10 p-4 text-sm text-gold-300">
        Готово! Проверьте почту, чтобы подтвердить подписку.
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="mt-4">
      <div className="flex gap-2">
        <label htmlFor="footer-email" className="sr-only">
          Адрес электронной почты
        </label>
        <input
          id="footer-email"
          type="email"
          required
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (status === "error") setStatus("idle");
          }}
          placeholder="ваш e-mail"
          className="w-full min-w-0 rounded-full border border-white/20 bg-white/10 px-4 py-2.5 text-sm text-white placeholder:text-white/40 focus:border-gold-400 focus:outline-none"
        />
        <button
          type="submit"
          disabled={status === "sending"}
          className="shrink-0 rounded-full bg-gold-400 px-4 py-2.5 text-sm font-bold text-navy-950 transition-colors hover:bg-gold-300 disabled:opacity-60"
        >
          {status === "sending" ? "…" : "OK"}
        </button>
      </div>
      {status === "error" && (
        <p className="mt-2 text-xs text-gold-300">
          Проверьте адрес почты и попробуйте ещё раз.
        </p>
      )}
    </form>
  );
}
