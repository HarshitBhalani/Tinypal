import { trackSubmit } from "../shared";
import type { MascotEmitter } from "../shared";

/**
 * Wrap React Hook Form submit handlers. Spread the result into `handleSubmit`:
 *
 *   const { handleSubmit } = useForm();
 *   <form onSubmit={handleSubmit(...rhfHandlers(mascot, save))}>
 *
 * Valid submit: loading, then success or error. Validation failure: confused.
 * Has no dependency on react-hook-form; it only wraps your callbacks.
 */
export function rhfHandlers<TValues, TErrors = unknown, TEvent = unknown>(
  mascot: MascotEmitter,
  onValid: (values: TValues, event?: TEvent) => unknown,
  onInvalid?: (errors: TErrors, event?: TEvent) => unknown,
): [
  (values: TValues, event?: TEvent) => Promise<unknown>,
  (errors: TErrors, event?: TEvent) => unknown,
] {
  return [
    (values, event) => trackSubmit(mascot, () => onValid(values, event)),
    (errors, event) => {
      mascot.emit("form:invalid");
      return onInvalid?.(errors, event);
    },
  ];
}
