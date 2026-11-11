export interface DraggableOptions {
  /** Called when a drag ends with the final viewport coordinates. */
  onDragEnd?: (pos: { top: number; left: number }) => void;
  /** Pixels the pointer must move before a press counts as a drag. Default 4. */
  threshold?: number;
  win?: Window;
}

/**
 * Make a fixed-position element draggable with pointer events (mouse, touch
 * and pen). Keeps it inside the viewport. Returns a cleanup function.
 */
export function makeDraggable(el: HTMLElement, options: DraggableOptions = {}): () => void {
  const win = options.win ?? globalThis.window;
  const threshold = options.threshold ?? 4;
  let start: { x: number; y: number; top: number; left: number } | null = null;
  let dragging = false;

  const onDown = (e: PointerEvent) => {
    if (e.button !== undefined && e.button !== 0) return;
    const r = el.getBoundingClientRect();
    start = { x: e.clientX, y: e.clientY, top: r.top, left: r.left };
    dragging = false;
    win.addEventListener("pointermove", onMove);
    win.addEventListener("pointerup", onUp);
  };

  const onMove = (e: PointerEvent) => {
    if (!start) return;
    const dx = e.clientX - start.x;
    const dy = e.clientY - start.y;
    if (!dragging && Math.hypot(dx, dy) < threshold) return;
    dragging = true;
    const r = el.getBoundingClientRect();
    const left = Math.min(Math.max(start.left + dx, 0), Math.max(0, win.innerWidth - r.width));
    const top = Math.min(Math.max(start.top + dy, 0), Math.max(0, win.innerHeight - r.height));
    Object.assign(el.style, {
      top: `${top}px`,
      left: `${left}px`,
      right: "auto",
      bottom: "auto",
      transform: "none",
    });
  };

  const onUp = () => {
    win.removeEventListener("pointermove", onMove);
    win.removeEventListener("pointerup", onUp);
    if (dragging) {
      options.onDragEnd?.({ top: parseFloat(el.style.top), left: parseFloat(el.style.left) });
    }
    start = null;
    dragging = false;
  };

  el.style.touchAction = "none";
  el.addEventListener("pointerdown", onDown);
  return () => {
    el.removeEventListener("pointerdown", onDown);
    win.removeEventListener("pointermove", onMove);
    win.removeEventListener("pointerup", onUp);
  };
}
