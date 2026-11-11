import { createApiTracker } from "../api-tracker";
import type { ApiOutcome } from "../api-tracker";
import type { MascotEmitter } from "../shared";

export interface MascotFetchOptions {
  /** Underlying fetch. Defaults to the global fetch at call time. */
  fetch?: typeof fetch;
  /**
   * Decide whether a response counts as a failure. Default: `!response.ok`.
   * Example: treat 404 as fine with `(r) => r.status >= 500`.
   */
  isError?: (response: Response) => boolean;
  /** Return false to let a request through without any mascot reaction. */
  filter?: (input: RequestInfo | URL, init?: RequestInit) => boolean;
}

const isAbort = (e: unknown) =>
  typeof e === "object" && e !== null && (e as { name?: string }).name === "AbortError";

/**
 * A drop-in `fetch` that reports request progress to the mascot. Behaviour of
 * the returned promise is unchanged: it resolves/rejects exactly like fetch.
 */
export function createMascotFetch(
  mascot: MascotEmitter,
  options: MascotFetchOptions = {},
): typeof fetch {
  const tracker = createApiTracker(mascot);
  const isError = options.isError ?? ((r: Response) => !r.ok);

  return async (input, init) => {
    const run = options.fetch ?? globalThis.fetch;
    if (options.filter && !options.filter(input, init)) return run(input, init);
    const end = tracker.begin();
    try {
      const response = await run(input, init);
      end(isError(response) ? "error" : "success");
      return response;
    } catch (e) {
      const outcome: ApiOutcome = isAbort(e) ? "cancelled" : "network-error";
      end(outcome);
      throw e;
    }
  };
}
