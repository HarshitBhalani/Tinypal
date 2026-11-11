import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import type { CSSProperties, MouseEvent as ReactMouseEvent } from "react";
import {
  applyLook,
  applyState,
  attachedCoordinates,
  createCursorTracker,
  ensureStyles,
  isAttached,
  makeDraggable,
  renderCharacter,
  resolvePosition,
  responsiveSize,
  watchIdle,
} from "@tinypal/core";
import type {
  CharacterDefinition,
  IdleOptions,
  Mascot,
  MascotPosition,
  Offset,
  Theme,
} from "@tinypal/core";
import { characters } from "@tinypal/characters";
import type { CharacterId } from "@tinypal/characters";
import { observeForms } from "@tinypal/adapters";
import type { ObserveFormsOptions } from "@tinypal/adapters";
import { useIsomorphicLayoutEffect } from "./context";
import { useMascotMessage } from "./hooks";

export interface MascotViewProps {
  /** Built-in character id or a custom definition. Default "robot". */
  character?: CharacterId | CharacterDefinition;
  /** Size in px. Default 150. */
  size?: number;
  /**
   * Preset ("bottom-right"...), fixed coordinates ({ bottom: 24, right: 24 }),
   * an element to sit next to ({ element: "#signup", placement: "right" }),
   * or "inline" to render in normal document flow.
   */
  position?: MascotPosition | "inline";
  offset?: Offset;
  zIndex?: number;
  /** "auto" follows the visitor's OS colour scheme. Default "light". */
  theme?: Theme | "auto";
  /** Eyes follow the cursor. Default true. */
  trackCursor?: boolean;
  /** 0..1 how far the eyes move. Default 1. */
  trackingIntensity?: number;
  /** 0..1 how quickly they follow. Default 0.18. */
  trackingSpeed?: number;
  /** Head tilts toward the cursor too. Default false. */
  headTracking?: boolean;
  /** React to native HTML forms on the page. Default false. */
  enableFormAwareness?: boolean | ObserveFormsOptions;
  /** Get sleepy / fall asleep when the visitor is inactive. Default true. */
  enableIdleAnimation?: boolean;
  idle?: Pick<IdleOptions, "sleepyAfter" | "sleepAfter" | "wakeDuration">;
  /** Show speech bubbles. Default true. */
  showSpeechBubble?: boolean;
  /** Announce speech bubbles to screen readers. Default false (decorative). */
  announceMessages?: boolean;
  /** Let visitors drag the mascot around. Default false. */
  draggable?: boolean;
  /** Hide the mascot entirely (listeners and timers stop too). */
  hidden?: boolean;
  /** Shrink on small screens. Default true. */
  responsive?: boolean;
  /** Turn off all animation. Reduced-motion users get this automatically. */
  reducedMotion?: boolean;
  /** Click handler. Default: the mascot waves happily. */
  onClick?: (mascot: Mascot, event: ReactMouseEvent) => void;
  className?: string;
  style?: CSSProperties;
}

const noopSubscribe = () => () => {};

const defaultClick = (m: Mascot) => {
  m.play("happy");
  m.play("waving", { duration: 1400 });
};

/** Renders one mascot for a given engine instance. */
export function MascotView({
  mascot,
  character = "robot",
  size = 150,
  position = "bottom-right",
  offset,
  zIndex,
  theme = "light",
  trackCursor = true,
  trackingIntensity = 1,
  trackingSpeed = 0.18,
  headTracking = false,
  enableFormAwareness = false,
  enableIdleAnimation = true,
  idle,
  showSpeechBubble = true,
  announceMessages = false,
  draggable = false,
  hidden = false,
  responsive = true,
  reducedMotion = false,
  onClick,
  className,
  style,
}: MascotViewProps & { mascot: Mascot }) {
  const def = typeof character === "string" ? characters[character] : character;
  const hostRef = useRef<HTMLDivElement>(null);
  const artRef = useRef<HTMLSpanElement>(null);
  const draggedRef = useRef(false);
  // false during SSR and hydration, true on the client afterwards.
  const mounted = useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
  const [viewportWidth, setViewportWidth] = useState<number | null>(null);
  const [systemDark, setSystemDark] = useState(false);
  const [attachedAt, setAttachedAt] = useState<{ top: number; left: number } | null>(null);
  const message = useMascotMessage(mascot);

  const px = responsive && viewportWidth !== null ? responsiveSize(size, viewportWidth) : size;
  const resolvedTheme: Theme = theme === "auto" ? (systemDark ? "dark" : "light") : theme;

  // The SVG string only changes when the look changes; expression changes are
  // applied to the live element below, so they never re-render React.
  const html = useMemo(
    () =>
      renderCharacter(def, {
        size: px,
        theme: resolvedTheme,
        headTracking,
        reducedMotion,
        expression: mascot.state.expression,
        action: mascot.state.action,
      }),
    // mascot.state is read once per (re)build on purpose; later changes are
    // applied to the DOM directly.
    [def, px, resolvedTheme, headTracking, reducedMotion, mascot],
  );
  const svg = () => artRef.current?.firstElementChild as SVGSVGElement | null | undefined;

  // Inject the shared stylesheet (the host stays hidden until hydrated, so
  // there is no unstyled flash during SSR).
  useIsomorphicLayoutEffect(() => ensureStyles(), []);

  // Responsive size + OS colour scheme.
  useEffect(() => {
    const onResize = () => setViewportWidth(window.innerWidth);
    onResize();
    window.addEventListener("resize", onResize);
    const mq =
      typeof window.matchMedia === "function"
        ? window.matchMedia("(prefers-color-scheme: dark)")
        : null;
    const onScheme = () => setSystemDark(!!mq?.matches);
    onScheme();
    mq?.addEventListener?.("change", onScheme);
    return () => {
      window.removeEventListener("resize", onResize);
      mq?.removeEventListener?.("change", onScheme);
    };
  }, []);

  // Expression/action -> DOM attributes.
  useIsomorphicLayoutEffect(() => {
    const el = svg();
    if (!el || hidden) return;
    applyState(el, mascot.state);
    return mascot.on("change", ({ state }) => {
      const current = svg();
      if (current) applyState(current, state);
    });
  }, [mascot, html, hidden]);

  // Cursor tracking (rAF, writes CSS variables only).
  const trackerOptions = useRef({ intensity: trackingIntensity, speed: trackingSpeed });
  useEffect(() => {
    trackerOptions.current = { intensity: trackingIntensity, speed: trackingSpeed };
  });
  const tracker = useRef<ReturnType<typeof createCursorTracker> | null>(null);
  useEffect(() => {
    const el = svg();
    if (!el || hidden || !trackCursor) return;
    const t = createCursorTracker({
      target: el,
      onLook: (x, y) => applyLook(el, x, y),
      ...trackerOptions.current,
    });
    tracker.current = t;
    return () => {
      t.destroy();
      tracker.current = null;
      applyLook(el, 0, 0);
    };
  }, [html, hidden, trackCursor]);
  useEffect(() => {
    tracker.current?.setOptions({ intensity: trackingIntensity, speed: trackingSpeed });
  }, [trackingIntensity, trackingSpeed]);

  // Form awareness.
  const formOptions = typeof enableFormAwareness === "object" ? enableFormAwareness : undefined;
  const formIgnore = formOptions?.ignore;
  const formSubmit = formOptions?.reactToSubmit;
  useEffect(() => {
    if (!enableFormAwareness || hidden) return;
    return observeForms(document, mascot, { ignore: formIgnore, reactToSubmit: formSubmit });
  }, [enableFormAwareness, hidden, mascot, formIgnore, formSubmit]);

  // Inactivity.
  const sleepyAfter = idle?.sleepyAfter;
  const sleepAfter = idle?.sleepAfter;
  const wakeDuration = idle?.wakeDuration;
  useEffect(() => {
    if (!enableIdleAnimation || hidden) return;
    return watchIdle(mascot, { sleepyAfter, sleepAfter, wakeDuration });
  }, [enableIdleAnimation, hidden, mascot, sleepyAfter, sleepAfter, wakeDuration]);

  // Dragging.
  const inline = position === "inline";
  useEffect(() => {
    const host = hostRef.current;
    if (!draggable || inline || hidden || !host) return;
    return makeDraggable(host, {
      onDragEnd: () => {
        draggedRef.current = true;
        setTimeout(() => (draggedRef.current = false), 0);
      },
    });
  }, [draggable, inline, hidden]);

  // Attach to an element: follow it on scroll/resize.
  const attachTarget = !inline && isAttached(position) ? position.element : null;
  const placement = !inline && isAttached(position) ? (position.placement ?? "right") : "right";
  const ox = offset?.x ?? 0;
  const oy = offset?.y ?? 0;
  useEffect(() => {
    if (!attachTarget || hidden) return;
    let frame = 0;
    const measure = () => {
      frame = 0;
      const anchor =
        typeof attachTarget === "string" ? document.querySelector(attachTarget) : attachTarget;
      if (!anchor) return setAttachedAt(null);
      const r = anchor.getBoundingClientRect();
      setAttachedAt(
        attachedCoordinates(
          r,
          px,
          placement,
          {
            width: window.innerWidth,
            height: window.innerHeight,
          },
          { offset: { x: ox, y: oy } },
        ),
      );
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener("scroll", schedule, { passive: true, capture: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule, { capture: true });
      window.removeEventListener("resize", schedule);
    };
  }, [attachTarget, placement, px, ox, oy, hidden]);

  if (hidden) return null;

  let placementStyle: CSSProperties;
  if (inline) {
    placementStyle = { position: "relative", display: "inline-block" };
  } else if (attachTarget) {
    placementStyle = attachedAt
      ? { position: "fixed", top: attachedAt.top, left: attachedAt.left, zIndex: zIndex ?? 9999 }
      : { position: "fixed", display: "none" };
  } else {
    const p = resolvePosition(position as MascotPosition, { offset, zIndex });
    placementStyle = { ...p };
  }

  const alignLeft =
    typeof position === "string"
      ? position.endsWith("left") || position === "inline"
      : !isAttached(position) && position.left !== undefined;

  return (
    <div
      ref={hostRef}
      className={className ? `tp-host ${className}` : "tp-host"}
      data-tinypal=""
      style={{
        ...placementStyle,
        width: px,
        height: px,
        visibility: mounted ? undefined : "hidden",
        ...style,
      }}
      onClick={(e) => {
        if (draggedRef.current) return;
        if (!(e.target instanceof Element) || !e.target.closest(".tp-root")) return;
        (onClick ?? defaultClick)(mascot, e);
      }}
    >
      {showSpeechBubble && message && (
        <div
          className="tp-bubble"
          data-align={alignLeft ? "left" : "right"}
          data-theme={resolvedTheme}
          {...(announceMessages
            ? { role: "status", "aria-live": "polite" as const }
            : { "aria-hidden": true })}
        >
          {message}
        </div>
      )}
      <span ref={artRef} style={{ display: "block" }} dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}
