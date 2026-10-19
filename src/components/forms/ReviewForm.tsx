"use client";

import { useId } from "react";
import { useLocale } from "@/components/LocaleProvider";
import { formCopy } from "@/data/form-copy";
import { FORM_LIMITS, validateReview } from "@/lib/leads";
import { Field, SubmissionNotice, useFormDraft, useFormSubmission } from "./FormSupport";

export function ReviewForm() {
  const locale = useLocale();
  const copy = formCopy[locale];
  const id = useId();
  const { form, update, clear } = useFormDraft("review", { name: "", text: "" });
  const { status, errors, submit, edited } = useFormSubmission("review");

  if (status === "done") return <p className="form-success surface rounded-2xl p-6" role="status" aria-live="polite">{copy.reviewSuccess}</p>;

  return <form onSubmit={event => void submit(event, { ...form, locale }, validateReview, clear)} noValidate aria-busy={status === "sending"} className="grid gap-4">
    <fieldset disabled={status === "sending"} className="grid min-w-0 gap-4">
      <Field id={`${id}-name`} label={`${copy.name} *`} error={errors.name ? copy.errors.name : undefined}>
        <input id={`${id}-name`} name="name" autoComplete="name" required maxLength={FORM_LIMITS.name} value={form.name}
          onChange={event => { update({ name: event.target.value }); edited("name"); }} placeholder={copy.namePlaceholder}
          className="field w-full" aria-invalid={!!errors.name} aria-describedby={errors.name ? `${id}-name-error` : undefined} />
      </Field>
      <Field id={`${id}-text`} label={`${copy.text} *`} error={errors.text ? copy.errors.text : undefined}>
        <textarea id={`${id}-text`} name="text" rows={5} required maxLength={FORM_LIMITS.text} value={form.text}
          onChange={event => { update({ text: event.target.value }); edited("text"); }} placeholder={copy.reviewPlaceholder}
          className="field w-full" aria-invalid={!!errors.text} aria-describedby={errors.text ? `${id}-text-error` : undefined} />
      </Field>
      <div>
        <button type="submit" disabled={status === "sending"} className="button-primary min-h-12 px-6 py-3 disabled:opacity-60">{status === "sending" ? copy.sending : copy.sendReview}</button>
        <span role="status" aria-live="polite" className="sr-only">{status === "sending" ? copy.sending : ""}</span>
        {Object.values(errors).some(Boolean) && <p role="alert" className="form-error mt-2 text-sm">{copy.invalid}</p>}
        <SubmissionNotice status={status} />
        <p className="muted mt-3 text-xs">{copy.privacy}</p>
      </div>
    </fieldset>
  </form>;
}
