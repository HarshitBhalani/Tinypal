import { useCallback, useContext, useSyncExternalStore } from "react";
import type { Mascot, MascotState } from "@tinypal/core";
import { MascotContext } from "./context";

/**
 * The mascot from the nearest <MascotProvider>. Use it to `play`, `say` and
 * `emit` from anywhere in your app.
 */
export function useMascot(): Mascot {
  const mascot = useContext(MascotContext);
  if (!mascot) {
    throw new Error(
      "useMascot() must be used inside <MascotProvider>. Wrap your app (or the part that uses the mascot) in <MascotProvider>.",
    );
  }
  return mascot;
}

const SERVER_STATE: MascotState = { expression: "idle", action: null };

/** Subscribe to the mascot's current expression/action. Re-renders on change. */
export function useMascotState(mascot?: Mascot): MascotState {
  const ctx = useContext(MascotContext);
  const m = mascot ?? ctx;
  const subscribe = useCallback((cb: () => void) => (m ? m.on("change", cb) : () => {}), [m]);
  return useSyncExternalStore(
    subscribe,
    () => m?.state ?? SERVER_STATE,
    () => SERVER_STATE,
  );
}

/** Subscribe to the current speech bubble text (null when hidden). */
export function useMascotMessage(mascot?: Mascot): string | null {
  const ctx = useContext(MascotContext);
  const m = mascot ?? ctx;
  const subscribe = useCallback((cb: () => void) => (m ? m.on("message", cb) : () => {}), [m]);
  return useSyncExternalStore(
    subscribe,
    () => m?.message ?? null,
    () => null,
  );
}
