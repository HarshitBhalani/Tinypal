import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createMascot } from "./mascot";
import { MASCOT_EVENTS } from "../types";

beforeEach(() => vi.useFakeTimers());
afterEach(() => vi.useRealTimers());

describe("expressions", () => {
  it("starts idle", () => {
    expect(createMascot().state).toEqual({ expression: "idle", action: null });
  });

  it("play() changes expression and notifies listeners", () => {
    const m = createMascot();
    const cb = vi.fn();
    m.on("change", cb);
    m.play("happy");
    expect(m.state.expression).toBe("happy");
    expect(cb).toHaveBeenCalledOnce();
    expect(cb.mock.calls[0]![0].previous.expression).toBe("idle");
  });

  it("does not notify when nothing changes", () => {
    const m = createMascot();
    const cb = vi.fn();
    m.on("change", cb);
    m.play("idle");
    expect(cb).not.toHaveBeenCalled();
  });

  it("play(action) keeps the face; sleeping sets sleepy", () => {
    const m = createMascot();
    m.play("happy");
    m.play("waving");
    expect(m.state).toEqual({ expression: "happy", action: "waving" });
    m.play("sleeping");
    expect(m.state).toEqual({ expression: "sleepy", action: "sleeping" });
  });

  it("duration reverts to idle", () => {
    const m = createMascot();
    m.play("surprised", { duration: 1000 });
    vi.advanceTimersByTime(999);
    expect(m.state.expression).toBe("surprised");
    vi.advanceTimersByTime(1);
    expect(m.state.expression).toBe("idle");
  });

  it("a newer state cancels a pending revert", () => {
    const m = createMascot();
    m.play("surprised", { duration: 1000 });
    m.play("sad");
    vi.advanceTimersByTime(5000);
    expect(m.state.expression).toBe("sad");
  });
});

describe("event dispatching", () => {
  it("maps every known event to a reaction", () => {
    for (const name of MASCOT_EVENTS) {
      const m = createMascot();
      const seen = vi.fn();
      m.on("event", seen);
      m.emit(name);
      expect(seen).toHaveBeenCalledWith({ name });
      m.destroy();
    }
  });

  it("form events follow the reaction table", () => {
    const m = createMascot();
    m.emit("form:focus");
    expect(m.state.expression).toBe("curious");
    m.emit("form:input");
    expect(m.state.expression).toBe("thinking");
    m.emit("form:invalid");
    expect(m.state.expression).toBe("confused");
    m.emit("form:submit");
    expect(m.state).toEqual({ expression: "thinking", action: "loading" });
    m.emit("form:success");
    expect(m.state).toEqual({ expression: "happy", action: "celebrating" });
    m.emit("form:error");
    expect(m.state.expression).toBe("sad");
    m.emit("form:reset");
    expect(m.state).toEqual({ expression: "idle", action: null });
  });

  it("api events follow the reaction table", () => {
    const m = createMascot();
    m.emit("api:loading");
    expect(m.state.action).toBe("loading");
    m.emit("api:success");
    expect(m.state.expression).toBe("happy");
    m.emit("api:network-error");
    expect(m.state.expression).toBe("sad");
    m.emit("api:cancelled");
    expect(m.state.expression).toBe("idle");
  });

  it("transient reactions revert to idle", () => {
    const m = createMascot();
    m.emit("api:success");
    vi.advanceTimersByTime(3000);
    expect(m.state).toEqual({ expression: "idle", action: null });
  });

  it("reactions can be overridden", () => {
    const m = createMascot({ reactions: { "api:error": { expression: "confused" } } });
    m.emit("api:error");
    expect(m.state.expression).toBe("confused");
  });
});

describe("cleanup", () => {
  it("destroy clears listeners and timers and ignores later calls", () => {
    const m = createMascot();
    const cb = vi.fn();
    m.on("change", cb);
    m.emit("api:success");
    cb.mockClear();
    m.destroy();
    expect(vi.getTimerCount()).toBe(0);
    m.play("sad");
    m.emit("api:error");
    expect(cb).not.toHaveBeenCalled();
    expect(m.state.expression).toBe("happy");
  });

  it("unsubscribe stops notifications", () => {
    const m = createMascot();
    const cb = vi.fn();
    const off = m.on("change", cb);
    off();
    m.play("sad");
    expect(cb).not.toHaveBeenCalled();
  });
});
