export interface CursorTrackerOptions {
  /** Element the eyes belong to; its centre is the origin of the look vector. */
  target: Element;
  /** Called with the smoothed look vector, each axis in -1..1. */
  onLook: (x: number, y: number) => void;
  /** 0..1, how far the eyes travel. Default 1. */
  intensity?: number;
  /** 0..1, fraction of the remaining distance covered per frame. Default 0.5. */
  speed?: number;
  /** Ignore the cursor when the user prefers reduced motion. Default true. */
  respectReducedMotion?: boolean;
  /** Injectable for tests; defaults to the browser globals. */
  win?: Window;
  raf?: (cb: FrameRequestCallback) => number;
  caf?: (id: number) => void;
}

export interface CursorTracker {
  setOptions(o: Partial<Pick<CursorTrackerOptions, "intensity" | "speed">>): void;
  destroy(): void;
}

const clamp = (v: number) => (v < -1 ? -1 : v > 1 ? 1 : v);
const EPSILON = 0.001;

/**
 * Smooth eye/head tracking. Runs requestAnimationFrame only while the look
 * vector is still settling, pauses while the tab is hidden or the target is
 * off screen, and never touches framework state.
 */
export function createCursorTracker(options: CursorTrackerOptions): CursorTracker {
  const win = options.win ?? globalThis.window;
  const raf = options.raf ?? ((cb) => win.requestAnimationFrame(cb));
  const caf = options.caf ?? ((id) => win.cancelAnimationFrame(id));
  let intensity = options.intensity ?? 1;
  let speed = options.speed ?? 0.5;

  let pointer: { x: number; y: number } | null = null;
  let cur = { x: 0, y: 0 };
  let frame: number | null = null;
  let visible = true;
  let onScreen = true;

  const reducedQuery =
    options.respectReducedMotion !== false && typeof win.matchMedia === "function"
      ? win.matchMedia("(prefers-reduced-motion: reduce)")
      : null;
  const active = () => visible && onScreen && !reducedQuery?.matches;

  const goal = () => {
    if (!pointer || !active()) return { x: 0, y: 0 };
    const r = options.target.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    const reachX = Math.max(win.innerWidth / 2, 1);
    const reachY = Math.max(win.innerHeight / 2, 1);
    return {
      x: clamp(((pointer.x - cx) / reachX) * intensity),
      y: clamp(((pointer.y - cy) / reachY) * intensity),
    };
  };

  const tick = () => {
    frame = null;
    const g = goal();
    const nx = cur.x + (g.x - cur.x) * speed;
    const ny = cur.y + (g.y - cur.y) * speed;
    const settled = Math.abs(g.x - nx) < EPSILON && Math.abs(g.y - ny) < EPSILON;
    cur = settled ? g : { x: nx, y: ny };
    options.onLook(round(cur.x), round(cur.y));
    if (!settled) frame = raf(tick);
  };

  const wake = () => {
    if (frame === null) frame = raf(tick);
  };

  const onMove = (e: PointerEvent | MouseEvent) => {
    pointer = { x: e.clientX, y: e.clientY };
    if (active()) wake();
  };
  const onLeave = () => {
    pointer = null;
    wake();
  };
  const onVisibility = () => {
    visible = win.document.visibilityState !== "hidden";
    if (!visible && frame !== null) {
      caf(frame);
      frame = null;
    } else wake();
  };
  const onReduced = () => wake();

  // Scrolling moves the mascot relative to a still cursor: re-aim.
  const onScroll = () => {
    if (pointer && active()) wake();
  };

  win.addEventListener("pointermove", onMove, { passive: true });
  win.addEventListener("scroll", onScroll, { passive: true, capture: true });
  win.document.addEventListener("pointerleave", onLeave);
  win.document.addEventListener("visibilitychange", onVisibility);
  reducedQuery?.addEventListener?.("change", onReduced);

  let observer: IntersectionObserver | null = null;
  const IO = (win as unknown as typeof globalThis).IntersectionObserver;
  if (typeof IO === "function") {
    observer = new IO((entries) => {
      onScreen = entries.some((e) => e.isIntersecting);
      if (onScreen) wake();
    });
    observer.observe(options.target);
  }

  return {
    setOptions(o) {
      if (o.intensity !== undefined) intensity = o.intensity;
      if (o.speed !== undefined) speed = Math.min(Math.max(o.speed, 0.01), 1);
      wake();
    },
    destroy() {
      if (frame !== null) caf(frame);
      frame = null;
      win.removeEventListener("pointermove", onMove);
      win.removeEventListener("scroll", onScroll, { capture: true });
      win.document.removeEventListener("pointerleave", onLeave);
      win.document.removeEventListener("visibilitychange", onVisibility);
      reducedQuery?.removeEventListener?.("change", onReduced);
      observer?.disconnect();
    },
  };
}

const round = (v: number) => Math.round(v * 1000) / 1000;
