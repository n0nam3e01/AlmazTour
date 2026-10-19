"use client";

import { useId } from "react";
import { useLocale } from "@/components/LocaleProvider";
import { getDestinations } from "@/data/destinations";
import { formCopy, type FormField } from "@/data/form-copy";
import { FORM_LIMITS, STAR_OPTIONS, validateLead } from "@/lib/leads";
import { Field, SubmissionNotice, useFormDraft, useFormSubmission } from "./FormSupport";

type LeadFormProps = { defaultCountry?: string; mode?: "quick" | "detailed"; context?: string };

/** Contact-only requests and optional trip details share validation and delivery. */
export function LeadForm({ defaultCountry = "", mode = "detailed", context = "" }: LeadFormProps) {
  const locale = useLocale();
  const copy = formCopy[locale];
  const id = useId();
  const { form, update, clear } = useFormDraft(`lead:${context || "general"}:${mode}`, {
    name: "", phone: "", email: "", country: defaultCountry, departureCity: "",
    dates: "", budget: "", adults: "2", comment: "", stars: [] as string[], children: [] as string[],
  });
  const { errors, status, submit, edited } = useFormSubmission("lead");
  const error = (key: FormField) => errors[key] ? copy.errors[key] : undefined;
  const fieldId = (key: string) => `${id}-${key}`;
  function set<K extends keyof typeof form>(key: K, value: typeof form[K]) {
    update({ [key]: value });
    edited(key);
  }

  function input(key: Exclude<keyof typeof form, "children" | "stars" | "comment">, options: { type?: string; placeholder?: string; required?: boolean; autoComplete?: string } = {}) {
    return <Field id={fieldId(key)} label={`${copy[key]}${options.required ? " *" : ""}`} error={error(key)}>
      <input id={fieldId(key)} name={key} className="field w-full min-w-0" type={options.type ?? "text"}
        value={form[key]} onChange={event => set(key, event.target.value)} required={options.required}
        maxLength={key === "adults" ? undefined : FORM_LIMITS[key]}
        min={key === "adults" ? 1 : undefined} max={key === "adults" ? 20 : undefined} step={key === "adults" ? 1 : undefined}
        placeholder={options.placeholder} autoComplete={options.autoComplete}
        list={key === "country" ? fieldId("countries") : undefined}
        aria-invalid={!!errors[key]} aria-describedby={errors[key] ? `${fieldId(key)}-error` : undefined} />
    </Field>;
  }

  if (status === "done") return <div className="form-success surface rounded-2xl p-6" role="status" aria-live="polite"><p>{copy.leadSuccess}</p></div>;

  const payload = mode === "quick"
    ? { name: form.name, phone: form.phone, comment: form.comment, country: defaultCountry, locale, mode, context }
    : { ...form, locale, mode, context };

  return <form onSubmit={event => void submit(event, payload, validateLead, clear)} noValidate aria-busy={status === "sending"} className="grid gap-4 sm:grid-cols-2">
    <fieldset disabled={status === "sending"} className="contents">
      {input("name", { required: true, placeholder: copy.namePlaceholder, autoComplete: "name" })}
      {input("phone", { required: true, type: "tel", placeholder: "+7 777 123 45 67", autoComplete: "tel" })}

      {mode === "detailed" && <>
        <p className="muted text-sm sm:col-span-2">{copy.optional}</p>
        {input("departureCity", { placeholder: copy.cityPlaceholder })}
        {input("country", { placeholder: copy.countryPlaceholder })}
        <datalist id={fieldId("countries")}>{getDestinations(locale).map(destination => <option key={destination.slug} value={destination.name} />)}</datalist>
        {input("dates", { placeholder: copy.datesPlaceholder })}
        {input("budget", { placeholder: copy.budgetPlaceholder })}
        {input("adults", { type: "number" })}
        {input("email", { type: "email", autoComplete: "email", placeholder: "name@example.com" })}

        <fieldset name="stars" className="min-w-0 sm:col-span-2" aria-describedby={errors.stars ? `${fieldId("stars")}-error` : fieldId("stars-help")}>
          <legend className="ink text-sm font-semibold">{copy.stars}</legend>
          <p id={fieldId("stars-help")} className="muted mb-2 text-sm">{copy.multiStars}</p>
          <div className="flex flex-wrap gap-2">
            {STAR_OPTIONS.map(star => <button key={star} type="button" aria-pressed={form.stars.includes(star)}
              onClick={() => set("stars", form.stars.includes(star) ? form.stars.filter(value => value !== star) : [...form.stars, star])}
              className="field ink min-h-11 rounded-xl px-5 py-2 font-semibold aria-pressed:!border-current aria-pressed:underline">{star}</button>)}
            <button type="button" aria-pressed={form.stars.length === 0} onClick={() => set("stars", [])}
              className="field ink min-h-11 rounded-xl px-5 py-2 font-semibold aria-pressed:!border-current aria-pressed:underline">{copy.anyStars}</button>
          </div>
          {errors.stars && <p id={`${fieldId("stars")}-error`} className="form-error mt-1 text-sm">{error("stars")}</p>}
        </fieldset>

        <fieldset className="min-w-0 sm:col-span-2" aria-describedby={errors.children ? `${fieldId("children")}-error` : fieldId("children-help")}>
          <legend className="ink text-sm font-semibold">{copy.children}</legend>
          <p id={fieldId("children-help")} className="muted mb-2 text-sm">{copy.age}</p>
          {form.children.length > 0 && <ul className="mb-3 grid gap-3 sm:grid-cols-2">
            {form.children.map((age, index) => <li key={index} className="flex min-w-0 items-end gap-2">
              <div className="min-w-0 flex-1">
                <label htmlFor={fieldId(`child-${index}`)} className="ink mb-1 block text-sm">{copy.child} {index + 1}</label>
                <select id={fieldId(`child-${index}`)} name="children" value={age}
                  onChange={event => set("children", form.children.map((value, i) => i === index ? event.target.value : value))}
                  className="field w-full min-w-0" aria-invalid={!!errors.children} aria-describedby={errors.children ? `${fieldId("children")}-error` : undefined}>
                  <option value="">{copy.age}</option>
                  {Array.from({ length: 18 }, (_, years) => <option key={years} value={String(years)}>{years === 0 ? copy.underOne : `${years} ${copy.years}`}</option>)}
                </select>
              </div>
              <button type="button" className="field ink min-h-11 min-w-11 px-3" aria-label={`${copy.removeChild} ${index + 1}`}
                onClick={() => set("children", form.children.filter((_, i) => i !== index))}>×</button>
            </li>)}
          </ul>}
          <button type="button" disabled={form.children.length >= 10} onClick={() => set("children", [...form.children, ""])}
            className="field ink min-h-11 px-4 py-2 disabled:opacity-50">+ {copy.addChild}</button>
          {errors.children && <p id={`${fieldId("children")}-error`} className="form-error mt-1 text-sm">{error("children")}</p>}
        </fieldset>
      </>}

      <div className="sm:col-span-2">
        <Field id={fieldId("comment")} label={copy.comment} error={error("comment")}>
          <textarea id={fieldId("comment")} name="comment" rows={3} value={form.comment} maxLength={FORM_LIMITS.comment}
            onChange={event => set("comment", event.target.value)} placeholder={copy.commentPlaceholder} className="field w-full"
            aria-invalid={!!errors.comment} aria-describedby={errors.comment ? `${fieldId("comment")}-error` : undefined} />
        </Field>
      </div>
      <div className="sm:col-span-2">
        <button type="submit" disabled={status === "sending"} className="button-primary min-h-12 w-full px-6 py-3 disabled:opacity-60 sm:w-auto">
          {status === "sending" ? copy.sending : copy.send}
        </button>
        <span role="status" aria-live="polite" className="sr-only">{status === "sending" ? copy.sending : ""}</span>
        {Object.values(errors).some(Boolean) && <p role="alert" className="form-error mt-2 text-sm">{copy.invalid}</p>}
        <SubmissionNotice status={status} />
        <p className="muted mt-3 text-xs">{copy.privacy}</p>
      </div>
    </fieldset>
  </form>;
}
