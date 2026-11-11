export type PositionPreset =
  "bottom-right" | "bottom-left" | "top-right" | "top-left" | "center-right" | "center-left";

export interface FixedCoordinates {
  top?: number | string;
  right?: number | string;
  bottom?: number | string;
  left?: number | string;
}

export type Placement = "top" | "bottom" | "left" | "right";

export interface AttachedPosition {
  /** Element (or CSS selector) the mascot sits next to. */
  element: Element | string;
  placement?: Placement;
}

export type MascotPosition = PositionPreset | FixedCoordinates | AttachedPosition;

export interface Offset {
  x?: number;
  y?: number;
}

/** Inline style values for the fixed-position wrapper. */
export interface PositionStyle {
  position: "fixed";
  top?: string;
  right?: string;
  bottom?: string;
  left?: string;
  transform?: string;
  zIndex: number;
}

const px = (v: number | string | undefined): string | undefined =>
  v === undefined ? undefined : typeof v === "number" ? `${v}px` : v;

export const isAttached = (p: MascotPosition): p is AttachedPosition =>
  typeof p === "object" && p !== null && "element" in p;

/**
 * Resolve a preset or fixed coordinates to a fixed-position style. Attached
 * positions are measured at runtime with `attachedCoordinates` instead.
 */
export function resolvePosition(
  position: MascotPosition,
  {
    offset = {},
    zIndex = 9999,
    margin = 24,
  }: { offset?: Offset; zIndex?: number; margin?: number } = {},
): PositionStyle {
  const ox = offset.x ?? 0;
  const oy = offset.y ?? 0;
  const base: PositionStyle = { position: "fixed", zIndex };

  if (typeof position === "string") {
    const [v, h] = position.split("-") as ["top" | "bottom" | "center", "left" | "right"];
    const style: PositionStyle = { ...base, [h]: `${margin + ox}px` };
    if (v === "center") {
      style.top = "50%";
      style.transform = `translateY(calc(-50% + ${oy}px))`;
    } else {
      style[v] = `${margin + oy}px`;
    }
    return style;
  }

  if (isAttached(position)) return base;

  return {
    ...base,
    top: px(position.top),
    right: px(position.right),
    bottom: px(position.bottom),
    left: px(position.left),
    transform: ox || oy ? `translate(${ox}px, ${oy}px)` : undefined,
  };
}

export interface Rect {
  top: number;
  left: number;
  width: number;
  height: number;
}

/**
 * Viewport coordinates for a mascot of `size` placed next to `anchor`,
 * clamped so it never leaves the viewport.
 */
export function attachedCoordinates(
  anchor: Rect,
  size: number,
  placement: Placement,
  viewport: { width: number; height: number },
  { offset = {}, gap = 8 }: { offset?: Offset; gap?: number } = {},
): { top: number; left: number } {
  const midX = anchor.left + anchor.width / 2 - size / 2;
  const midY = anchor.top + anchor.height / 2 - size / 2;
  let top: number;
  let left: number;
  switch (placement) {
    case "top":
      top = anchor.top - size - gap;
      left = midX;
      break;
    case "bottom":
      top = anchor.top + anchor.height + gap;
      left = midX;
      break;
    case "left":
      top = midY;
      left = anchor.left - size - gap;
      break;
    case "right":
    default:
      top = midY;
      left = anchor.left + anchor.width + gap;
  }
  top += offset.y ?? 0;
  left += offset.x ?? 0;
  return {
    top: clampRange(top, 0, viewport.height - size),
    left: clampRange(left, 0, viewport.width - size),
  };
}

const clampRange = (v: number, min: number, max: number) =>
  Math.min(Math.max(v, min), Math.max(min, max));

/** Scale the mascot down on narrow screens. */
export function responsiveSize(
  size: number,
  viewportWidth: number,
  { breakpoint = 640, scale = 0.7 }: { breakpoint?: number; scale?: number } = {},
): number {
  return viewportWidth < breakpoint ? Math.round(size * scale) : size;
}
