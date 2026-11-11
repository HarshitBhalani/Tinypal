import type { Mascot } from "./mascot";

export interface IdleOptions {
  /** ms without activity before the mascot gets sleepy. Default 30 000. */
  sleepyAfter?: number;
  /** ms without activity before it falls asleep. Default 60 000. */
  sleepAfter?: number;
  /** How long the wake-up surprise lasts. Default 1 500. */
  wakeDuration?: number;
  /** DOM events counted as activity. */
  activityEvents?: string[];
  win?: Window;
}

const DEFAULT_ACTIVITY = ["pointermove", "pointerdown", "keydown", "wheel", "touchstart", "scroll"];
/** Ignore activity bursts closer together than this (pointermove fires a lot). */
const THROTTLE_MS = 250;

/**
 * Inactivity behaviour: sleepy after `sleepyAfter`, asleep after `sleepAfter`,
 * and a surprised wake-up on the next activity. It never interrupts a busy
 * mascot (loading, celebrating, sad...): it waits until it is idle again.
 * Returns a cleanup function.
 */
export function watchIdle(mascot: Mascot, options: IdleOptions = {}): () => void {
  const win = options.win ?? globalThis.window;
  const sleepyAfter = options.sleepyAfter ?? 30_000;
  const sleepAfter = Math.max(options.sleepAfter ?? 60_000, sleepyAfter);
  const wakeDuration = options.wakeDuration ?? 1_500;
  const events = options.activityEvents ?? DEFAULT_ACTIVITY;

  let timers: ReturnType<typeof setTimeout>[] = [];
  let dozing = false; // true while *we* made it sleepy/asleep
  let applying = false;
  let lastActivity = 0;

  const restful = () => {
    const s = mascot.state;
    return s.action === null && (s.expression === "idle" || s.expression === "curious");
  };

  const set = (fn: () => void) => {
    applying = true;
    fn();
    applying = false;
  };

  const clear = () => {
    timers.forEach(clearTimeout);
    timers = [];
  };

  const schedule = () => {
    clear();
    timers.push(
      setTimeout(() => {
        if (dozing || restful()) {
          dozing = true;
          set(() => mascot.play("sleepy"));
          mascot.notify("sleepy");
        }
      }, sleepyAfter),
      setTimeout(() => {
        if (dozing || restful()) {
          dozing = true;
          set(() => mascot.play("sleeping"));
        }
      }, sleepAfter),
    );
  };

  const onActivity = () => {
    const now = Date.now();
    if (!dozing && now - lastActivity < THROTTLE_MS) return;
    lastActivity = now;
    if (dozing) {
      dozing = false;
      set(() => mascot.play("surprised", { duration: wakeDuration }));
      mascot.notify("wake");
    }
    schedule();
  };

  // Something else changed the mascot (an API event, a play() call): we are
  // no longer the reason it is sleepy, so do not "wake" it later.
  const offChange = mascot.on("change", () => {
    if (!applying) dozing = false;
  });

  for (const e of events) win.addEventListener(e, onActivity, { passive: true });
  schedule();

  return () => {
    clear();
    offChange();
    for (const e of events) win.removeEventListener(e, onActivity);
  };
}
