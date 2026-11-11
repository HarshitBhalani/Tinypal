import type { MascotEmitter } from "./shared";

export type ApiOutcome = "success" | "error" | "network-error" | "cancelled";

/** Higher wins when several concurrent requests finish. */
const SEVERITY: Record<ApiOutcome, number> = {
  cancelled: 0,
  success: 1,
  error: 2,
  "network-error": 3,
};

export interface ApiTracker {
  /** Mark a request as started; call the returned function exactly once when it settles. */
  begin(): (outcome: ApiOutcome) => void;
  readonly pending: number;
}

/**
 * Aggregates concurrent requests: `api:start` when the first one begins, and a
 * single result event (the most severe outcome) when the last one settles.
 */
export function createApiTracker(mascot: MascotEmitter): ApiTracker {
  let pending = 0;
  let worst: ApiOutcome | null = null;

  return {
    get pending() {
      return pending;
    },
    begin() {
      if (pending++ === 0) {
        worst = null;
        mascot.emit("api:start");
      }
      let done = false;
      return (outcome) => {
        if (done) return;
        done = true;
        if (!worst || SEVERITY[outcome] > SEVERITY[worst]) worst = outcome;
        if (--pending === 0) mascot.emit(`api:${worst}`);
      };
    },
  };
}
