"use client";

import { useId } from "react";
import { useLocale } from "@/components/LocaleProvider";
import { formCopy } from "@/data/form-copy";
import { FORM_LIMITS, validateSubscribe } from "@/lib/leads";
import { Field, SubmissionNotice, useFormDraft, useFormSubmission } from "./FormSupport";

/** A request delivered to a manager, without promising automated email. */
export function SubscribeForm() {
  const locale = useLocale();
  const copy = formCopy[locale];
  const id = useId();
  const { form, update, clear } = useFormDraft("subscribe", { email: "" });
  const { status, errors, submit, edited } = useFormSubmission("subscribe");

  if (status === "done") return <p role="status" aria-live="polite" className="form-success mt-4 rounded-xl p-4 text-sm">{copy.subscribeSuccess}</p>;

  return <form onSubmit={event => void submit(event, { ...form, locale }, validateSubscribe, clear)} noValidate aria-busy={status === "sending"} className="mt-4">
    <fieldset disabled={status === "sending"} className="grid min-w-0 gap-3">
      <Field id={`${id}-email`} label={copy.email} error={errors.email ? copy.errors.email : undefined}>
        <input id={`${id}-email`} name="email" type="email" autoComplete="email" spellCheck={false} required maxLength={FORM_LIMITS.email}
          value={form.email} onChange={event => { update({ email: event.target.value }); edited("email"); }} placeholder="name@example.com"
          className="field w-full min-w-0" aria-invalid={!!errors.email} aria-describedby={errors.email ? `${id}-email-error` : undefined} />
      </Field>
      <button type="submit" disabled={status === "sending"} className="button-primary min-h-12 px-4 py-3 text-sm disabled:opacity-60">{status === "sending" ? copy.sending : copy.subscribe}</button>
      <span role="status" aria-live="polite" className="sr-only">{status === "sending" ? copy.sending : ""}</span>
      <SubmissionNotice status={status} />
      <p className="muted text-xs">{copy.privacy}</p>
    </fieldset>
  </form>;
}
