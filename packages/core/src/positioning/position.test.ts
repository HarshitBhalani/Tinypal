import { describe, expect, it, vi } from "vitest";
import { attachedCoordinates, resolvePosition, responsiveSize } from "./position";
import { makeDraggable } from "./draggable";

describe("resolvePosition", () => {
  it.each([
    ["bottom-right", { bottom: "24px", right: "24px" }],
    ["bottom-left", { bottom: "24px", left: "24px" }],
    ["top-right", { top: "24px", right: "24px" }],
    ["top-left", { top: "24px", left: "24px" }],
  ] as const)("%s", (preset, expected) => {
    expect(resolvePosition(preset)).toMatchObject({ position: "fixed", zIndex: 9999, ...expected });
  });

  it("centers vertically for center-* presets", () => {
    expect(resolvePosition("center-left", { offset: { y: 10 } })).toMatchObject({
      top: "50%",
      left: "24px",
      transform: "translateY(calc(-50% + 10px))",
    });
  });

  it("applies offset and z-index to presets", () => {
    expect(resolvePosition("bottom-right", { offset: { x: 6, y: -4 }, zIndex: 5 })).toMatchObject({
      right: "30px",
      bottom: "20px",
      zIndex: 5,
    });
  });

  it("accepts custom coordinates (numbers or CSS strings)", () => {
    expect(resolvePosition({ bottom: 24, right: "2rem" })).toMatchObject({
      bottom: "24px",
      right: "2rem",
      top: undefined,
      left: undefined,
    });
  });
});

describe("attachedCoordinates", () => {
  const anchor = { top: 100, left: 200, width: 100, height: 40 };
  const vp = { width: 1000, height: 800 };

  it("places to the right by default, vertically centred", () => {
    expect(attachedCoordinates(anchor, 60, "right", vp)).toEqual({ top: 90, left: 308 });
  });

  it("places above and below", () => {
    expect(attachedCoordinates(anchor, 60, "top", vp)).toEqual({ top: 32, left: 220 });
    expect(attachedCoordinates(anchor, 60, "bottom", vp)).toEqual({ top: 148, left: 220 });
  });

  it("keeps the mascot inside the viewport", () => {
    expect(
      attachedCoordinates({ top: 10, left: 10, width: 20, height: 20 }, 60, "left", vp),
    ).toEqual({
      top: 0,
      left: 0,
    });
  });
});

describe("responsiveSize", () => {
  it("shrinks on narrow screens only", () => {
    expect(responsiveSize(150, 1200)).toBe(150);
    expect(responsiveSize(150, 400)).toBe(105);
  });
});

describe("makeDraggable", () => {
  const pointer = (type: string, x: number, y: number) =>
    new MouseEvent(type, { clientX: x, clientY: y, bubbles: true, button: 0 }) as PointerEvent;

  it("moves the element, clamps to the viewport, and reports the drop", () => {
    Object.assign(window, { innerWidth: 1000, innerHeight: 800 });
    const el = document.createElement("div");
    el.getBoundingClientRect = () => ({ top: 100, left: 100, width: 50, height: 50 }) as DOMRect;
    const onDragEnd = vi.fn();
    const cleanup = makeDraggable(el, { onDragEnd });

    el.dispatchEvent(pointer("pointerdown", 110, 110));
    window.dispatchEvent(pointer("pointermove", 210, 160));
    expect(el.style.left).toBe("200px");
    expect(el.style.top).toBe("150px");
    window.dispatchEvent(pointer("pointermove", 5000, 5000));
    expect(el.style.left).toBe("950px");
    window.dispatchEvent(pointer("pointerup", 0, 0));
    expect(onDragEnd).toHaveBeenCalledWith({ top: 750, left: 950 });
    cleanup();
  });

  it("ignores tiny movements (clicks) and cleans up", () => {
    const el = document.createElement("div");
    el.getBoundingClientRect = () => ({ top: 0, left: 0, width: 50, height: 50 }) as DOMRect;
    const onDragEnd = vi.fn();
    const cleanup = makeDraggable(el, { onDragEnd });
    el.dispatchEvent(pointer("pointerdown", 10, 10));
    window.dispatchEvent(pointer("pointermove", 12, 11));
    window.dispatchEvent(pointer("pointerup", 12, 11));
    expect(onDragEnd).not.toHaveBeenCalled();
    cleanup();
    el.dispatchEvent(pointer("pointerdown", 10, 10));
    window.dispatchEvent(pointer("pointermove", 100, 100));
    expect(el.style.left).toBe("");
  });
});
