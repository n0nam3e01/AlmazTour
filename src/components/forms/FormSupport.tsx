"use client";

import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { useLocale } from "@/components/LocaleProvider";
import { formCopy } from "@/data/form-copy";
import { site } from "@/data/site";
import { clearDraft, readDraft, writeDraft } from "@/lib/form-draft";
import type { FormErrors } from "@/lib/leads";
import { submitForm } from "./form-request";

type DraftFields = Record<string, string | string[]>;

export function useFormDraft<T extends DraftFields>(key: string, initial: T) {
  const [form, setForm] = useState(initial);
  const current = useRef(initial);
  const defaults = useRef(initial);
  useEffect(() => {
    const stored = readDraft(key);
    const restored = { ...defaults.current };
    if (stored) for (const field of Object.keys(restored) as (keyof T)[]) {
      const value = stored[String(field)];
      if (typeof restored[field] === "string" && typeof value === "string" && value.length <= 2500) restored[field] = value as T[keyof T];
      if (Array.isArray(restored[field]) && Array.isArray(value) && value.length <= 10 && value.every(item => typeof item === "string" && item.length <= 40)) restored[field] = value as T[keyof T];
    }
    current.current = restored;
    // Restore browser storage after hydration; server output uses the empty form.
    setForm(restored);
  }, [key]);

  function update(patch: Partial<T>) {
    current.current = { ...current.current, ...patch };
    setForm(current.current);
    writeDraft(key, current.current);
  }
  return { form, update, clear: () => clearDraft(key) };
}

type Validator = (body: Record<string, unknown>) => { ok: boolean; errors?: FormErrors };
export function useFormSubmission(kind: "lead" | "review" | "subscribe") {
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "fail" | "unavailable">("idle");
  const inFlight = useRef(false);

  async function submit(event: FormEvent<HTMLFormElement>, payload: Record<string, unknown>, validate: Validator, clear: () => void) {
    event.preventDefault();
    if (inFlight.current || status === "done") return;
    const result = validate(payload);
    setErrors(result.errors ?? {});
    if (!result.ok) {
      const first = Object.keys(result.errors ?? {})[0];
      event.currentTarget.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }
    inFlight.current = true;
    setStatus("sending");
    const response = await submitForm(kind, payload);
    if (response.ok) {
      clear();
      setStatus("done");
    } else {
      setErrors(response.errors);
      setStatus(response.status === 503 ? "unavailable" : "fail");
    }
    inFlight.current = false;
  }
  function edited(field: keyof FormErrors) {
    setErrors(previous => ({ ...previous, [field]: undefined }));
    if (status !== "sending" && status !== "done") setStatus("idle");
  }
  return { errors, status, submit, edited };
}

export function Field({ id, label, error, children }: { id: string; label: string; error?: string; children: ReactNode }) {
  return <div className="min-w-0">
    <label htmlFor={id} className="ink mb-1.5 block text-sm font-semibold">{label}</label>
    {children}
    {error && <p id={`${id}-error`} className="form-error mt-1 text-sm">{error}</p>}
  </div>;
}

export function SubmissionNotice({ status }: { status: string }) {
  const copy = formCopy[useLocale()];
  if (status !== "fail" && status !== "unavailable") return null;
  return <div className="form-error mt-3 text-sm" role="alert">
    <p>{status === "unavailable" ? copy.unavailable : copy.failure}</p>
    <div className="mt-2 flex flex-wrap gap-4">
      <a className="underline" href={site.phones[0].href}>{copy.call}: {site.phones[0].label}</a>
      <a className="underline" href={site.social.whatsapp}>{copy.whatsapp}</a>
    </div>
  </div>;
}
