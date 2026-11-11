# Cursor tracking

The eyes follow the cursor by default.

```tsx
<ContextMascot
  trackCursor // default true
  trackingSpeed="normal" // "slow" | "normal" | "fast" | "instant" | 0..1
  trackingIntensity={1} // 0..1, how far the eyes travel
  headTracking // the head tilts toward the cursor too (default false)
/>
```

## Speed

| `trackingSpeed` | Feel                                                  |
| --------------- | ----------------------------------------------------- |
| `"slow"`        | Lazy and dreamy; eyes drift over                      |
| `"normal"`      | Default; quick but soft                               |
| `"fast"`        | Snappy                                                |
| `"instant"`     | No smoothing at all                                   |
| `0.01`–`1`      | Fraction of the remaining distance covered each frame |

## How it stays cheap

- One `requestAnimationFrame` loop per mascot, and it **stops** once the eyes
  have settled. A still cursor costs nothing.
- It writes two CSS variables on the SVG. React never re-renders on mouse
  movement.
- It pauses while the browser tab is hidden and while the mascot is scrolled
  off screen.
- It re-aims when the page scrolls under a still cursor.

## Reduced motion

With `prefers-reduced-motion: reduce`, the eyes stay centred.

## Without React

```ts
import { createCursorTracker, applyLook } from "tinypal";

const tracker = createCursorTracker({
  target: svgElement,
  onLook: (x, y) => applyLook(svgElement, x, y),
  speed: 0.5,
});
// later
tracker.destroy();
```
