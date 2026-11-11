import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createMascot } from "./mascot";
import type { Mascot } from "./mascot";
import { watchIdle } from "./idle";

let mascot: Mascot;
let stop: () => void;
beforeEach(() => {
  vi.useFakeTimers();
  mascot = createMascot();
});
afterEach(() => {
  stop?.();
  mascot.destroy();
  vi.useRealTimers();
});

const activity = () => window.dispatchEvent(new Event("pointerdown"));

describe("watchIdle", () => {
  it("gets sleepy, then falls asleep", () => {
    stop = watchIdle(mascot, { sleepyAfter: 1000, sleepAfter: 3000 });
    vi.advanceTimersByTime(999);
    expect(mascot.state.expression).toBe("idle");
    vi.advanceTimersByTime(1);
    expect(mascot.state).toEqual({ expression: "sleepy", action: null });
    vi.advanceTimersByTime(2000);
    expect(mascot.state).toEqual({ expression: "sleepy", action: "sleeping" });
  });

  it("activity resets the timer", () => {
    stop = watchIdle(mascot, { sleepyAfter: 1000, sleepAfter: 3000 });
    vi.advanceTimersByTime(800);
    activity();
    vi.advanceTimersByTime(800);
    expect(mascot.state.expression).toBe("idle");
    vi.advanceTimersByTime(200);
    expect(mascot.state.expression).toBe("sleepy");
  });

  it("wakes up surprised, then returns to idle", () => {
    stop = watchIdle(mascot, { sleepyAfter: 1000, sleepAfter: 2000, wakeDuration: 500 });
    vi.advanceTimersByTime(2000);
    expect(mascot.state.action).toBe("sleeping");
    activity();
    expect(mascot.state).toEqual({ expression: "surprised", action: null });
    vi.advanceTimersByTime(500);
    expect(mascot.state).toEqual({ expression: "idle", action: null });
  });

  it("does not doze off while the mascot is busy", () => {
    stop = watchIdle(mascot, { sleepyAfter: 1000, sleepAfter: 2000 });
    mascot.emit("api:loading");
    vi.advanceTimersByTime(5000);
    expect(mascot.state.action).toBe("loading");
  });

  it("does not fake a wake-up if something else already changed the state", () => {
    stop = watchIdle(mascot, { sleepyAfter: 1000, sleepAfter: 5000 });
    vi.advanceTimersByTime(1000);
    mascot.play("happy");
    activity();
    expect(mascot.state.expression).toBe("happy");
  });

  it("throttles rapid activity but never delays waking", () => {
    stop = watchIdle(mascot, { sleepyAfter: 1000, sleepAfter: 2000 });
    vi.advanceTimersByTime(1000);
    activity();
    activity();
    expect(mascot.state.expression).toBe("surprised");
  });

  it("cleans up timers and listeners", () => {
    watchIdle(mascot, { sleepyAfter: 1000 })();
    expect(vi.getTimerCount()).toBe(0);
    vi.advanceTimersByTime(10_000);
    expect(mascot.state.expression).toBe("idle");
  });
});
