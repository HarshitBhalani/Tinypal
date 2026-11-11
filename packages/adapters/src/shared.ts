import type { Mascot } from "@tinypal/core";

/** Adapters only need to emit events. */
export type MascotEmitter = Pick<Mascot, "emit">;

/**
 * Run an async submit and report it: `form:submit` (loading) then
 * `form:success` or `form:error`. Errors are re-thrown so callers still see them.
 */
export async function trackSubmit<T>(mascot: MascotEmitter, run: () => T | Promise<T>): Promise<T> {
  mascot.emit("form:submit");
  try {
    const result = await run();
    mascot.emit("form:success");
    return result;
  } catch (error) {
    mascot.emit("form:error");
    throw error;
  }
}
