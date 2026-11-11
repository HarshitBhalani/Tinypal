import { trackSubmit } from "../shared";
import type { MascotEmitter } from "../shared";

/**
 * Wrap a Formik `onSubmit`. Formik only calls it when validation passes:
 *
 *   <Formik onSubmit={formikSubmit(mascot, save)} ... />
 *
 * Has no dependency on formik; it only wraps your callback.
 */
export function formikSubmit<TValues, THelpers>(
  mascot: MascotEmitter,
  onSubmit: (values: TValues, helpers: THelpers) => unknown,
): (values: TValues, helpers: THelpers) => Promise<unknown> {
  return (values, helpers) => trackSubmit(mascot, () => onSubmit(values, helpers));
}

/**
 * Formik does not call `onSubmit` when validation fails. Call this after a
 * submit attempt (e.g. in an effect on `submitCount`) with Formik's `errors`:
 *
 *   useEffect(() => { if (submitCount) formikInvalid(mascot, errors) }, [submitCount]);
 *
 * Emits `form:invalid` only when there is at least one error.
 */
export function formikInvalid(mascot: MascotEmitter, errors: Record<string, unknown>): boolean {
  const invalid = Object.values(errors).some(Boolean);
  if (invalid) mascot.emit("form:invalid");
  return invalid;
}
