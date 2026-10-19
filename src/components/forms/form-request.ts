import { formCopy, type FormField } from "@/data/form-copy";
import { isFormObject, type FormErrors } from "@/lib/leads";

type Submission = { ok: true } | { ok: false; status: number; errors: FormErrors };

export async function submitForm(kind: "lead" | "review" | "subscribe", fields: object): Promise<Submission> {
  try {
    const response = await fetch(`/api/${kind}`, {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(fields),
      signal: AbortSignal.timeout(30_000),
    });
    const body: unknown = await response.json();
    if (response.ok && isFormObject(body) && body.ok === true) return { ok: true };
    const errors: FormErrors = {};
    if (isFormObject(body) && isFormObject(body.errors)) {
      for (const key of Object.keys(body.errors)) if (Object.hasOwn(formCopy.ru.errors, key)) errors[key as FormField] = key;
    }
    return { ok: false, status: response.status, errors };
  } catch {
    return { ok: false, status: 0, errors: {} };
  }
}
