import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createCursorTracker } from "./cursor";

/** Manual frame queue so tests control exactly when frames run. */
function frames() {
  let queue = new Map<number, FrameRequestCallback>();
  let id = 0;
  return {
    raf: (cb: FrameRequestCallback) => (queue.set(++id, cb), id),
    caf: (i: number) => void queue.delete(i),
    pending: () => queue.size,
    run(n = 1) {
      for (let k = 0; k < n; k++) {
        const q = queue;
        queue = new Map();
        q.forEach((cb) => cb(0));
      }
    },
  };
}

let target: HTMLDivElement;
beforeEach(() => {
  target = document.createElement("div");
  document.body.appendChild(target);
  // 100x100 box centred at (500, 400) in a 1000x800 viewport.
  target.getBoundingClientRect = () =>
    ({ left: 450, top: 350, width: 100, height: 100 }) as DOMRect;
  Object.assign(window, { innerWidth: 1000, innerHeight: 800 });
});
afterEach(() => target.remove());

const move = (x: number, y: number) =>
  window.dispatchEvent(new MouseEvent("pointermove", { clientX: x, clientY: y }));

describe("cursor tracker", () => {
  it("eases the look vector toward the cursor and then stops requesting frames", () => {
    const f = frames();
    const onLook = vi.fn();
    const t = createCursorTracker({ target, onLook, raf: f.raf, caf: f.caf, speed: 0.5 });
    move(1000, 400); // far right, same height
    f.run();
    expect(onLook).toHaveBeenLastCalledWith(0.5, 0);
    f.run(30);
    expect(onLook).toHaveBeenLastCalledWith(1, 0);
    expect(f.pending()).toBe(0);
    t.destroy();
  });

  it("scales with intensity and clamps to -1..1", () => {
    const f = frames();
    const onLook = vi.fn();
    const t = createCursorTracker({
      target,
      onLook,
      raf: f.raf,
      caf: f.caf,
      speed: 1,
      intensity: 0.5,
    });
    move(0, 0);
    f.run();
    expect(onLook).toHaveBeenLastCalledWith(-0.5, -0.5);
    t.setOptions({ intensity: 3 });
    f.run();
    expect(onLook).toHaveBeenLastCalledWith(-1, -1);
    t.destroy();
  });

  it("returns to centre and pauses frames while the tab is hidden", () => {
    const f = frames();
    const onLook = vi.fn();
    const t = createCursorTracker({ target, onLook, raf: f.raf, caf: f.caf, speed: 1 });
    move(1000, 400);
    Object.defineProperty(document, "visibilityState", { value: "hidden", configurable: true });
    document.dispatchEvent(new Event("visibilitychange"));
    expect(f.pending()).toBe(0);
    Object.defineProperty(document, "visibilityState", { value: "visible", configurable: true });
    document.dispatchEvent(new Event("visibilitychange"));
    f.run();
    expect(onLook).toHaveBeenLastCalledWith(1, 0);
    t.destroy();
  });

  it("stays centred under prefers-reduced-motion", () => {
    const f = frames();
    const onLook = vi.fn();
    const mm = vi
      .fn()
      .mockReturnValue({ matches: true, addEventListener() {}, removeEventListener() {} });
    Object.assign(window, { matchMedia: mm });
    const t = createCursorTracker({ target, onLook, raf: f.raf, caf: f.caf, speed: 1 });
    move(1000, 400);
    f.run();
    expect(onLook).not.toHaveBeenCalled();
    t.destroy();
    Object.assign(window, { matchMedia: undefined });
  });

  it("removes every listener and pending frame on destroy", () => {
    const f = frames();
    const onLook = vi.fn();
    const add = vi.spyOn(window, "addEventListener");
    const remove = vi.spyOn(window, "removeEventListener");
    const t = createCursorTracker({ target, onLook, raf: f.raf, caf: f.caf });
    move(1000, 400);
    t.destroy();
    expect(f.pending()).toBe(0);
    expect(remove.mock.calls.length).toBeGreaterThanOrEqual(add.mock.calls.length);
    move(0, 0);
    f.run();
    expect(onLook).not.toHaveBeenCalled();
    add.mockRestore();
    remove.mockRestore();
  });
});

describe("cursor tracker: scroll, leave, off-screen", () => {
  it("re-aims on scroll and recentres when the pointer leaves the page", () => {
    const f = frames();
    const onLook = vi.fn();
    let left = 450;
    target.getBoundingClientRect = () => ({ left, top: 350, width: 100, height: 100 }) as DOMRect;
    const t = createCursorTracker({ target, onLook, raf: f.raf, caf: f.caf, speed: 1 });
    move(500, 400); // exactly on the centre
    f.run();
    expect(onLook).toHaveBeenLastCalledWith(0, 0);
    left = 50; // page scrolled: mascot moved left of the cursor
    window.dispatchEvent(new Event("scroll"));
    f.run();
    expect(onLook.mock.calls[onLook.mock.calls.length - 1]![0]).toBeGreaterThan(0);
    document.dispatchEvent(new Event("pointerleave"));
    f.run(5);
    expect(onLook).toHaveBeenLastCalledWith(0, 0);
    t.destroy();
  });

  it("pauses while the mascot is off screen", () => {
    const f = frames();
    const onLook = vi.fn();
    let callback: (entries: { isIntersecting: boolean }[]) => void = () => {};
    const observe = vi.fn();
    const disconnect = vi.fn();
    class FakeIO {
      constructor(cb: typeof callback) {
        callback = cb;
      }
      observe = observe;
      disconnect = disconnect;
    }
    const original = (window as unknown as { IntersectionObserver?: unknown }).IntersectionObserver;
    Object.assign(window, { IntersectionObserver: FakeIO });
    const t = createCursorTracker({ target, onLook, raf: f.raf, caf: f.caf, speed: 1 });
    expect(observe).toHaveBeenCalledWith(target);
    callback([{ isIntersecting: false }]);
    move(1000, 400);
    expect(f.pending()).toBe(0);
    callback([{ isIntersecting: true }]);
    f.run();
    expect(onLook).toHaveBeenLastCalledWith(1, 0);
    t.destroy();
    expect(disconnect).toHaveBeenCalled();
    Object.assign(window, { IntersectionObserver: original });
  });
});
