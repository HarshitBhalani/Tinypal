import { TRACKING_SPEEDS } from "@tinypal/react";
import type { CharacterId, MascotPosition, PositionPreset } from "@tinypal/react";

export type PositionChoice = PositionPreset | "custom" | "attach";

export interface PlaygroundConfig {
  character: CharacterId;
  size: number;
  position: PositionChoice;
  custom: { bottom: number; right: number };
  trackCursor: boolean;
  trackingIntensity: number;
  trackingSpeed: number;
  headTracking: boolean;
  showSpeechBubble: boolean;
  draggable: boolean;
  quickSleep: boolean;
  messages: { success: string; error: string; loading: string; sleepy: string };
}

export const DEFAULT_CONFIG: PlaygroundConfig = {
  character: "robot",
  size: 110,
  position: "bottom-right",
  custom: { bottom: 120, right: 60 },
  trackCursor: true,
  trackingIntensity: 1,
  trackingSpeed: 0.5,
  headTracking: false,
  showSpeechBubble: true,
  draggable: true,
  quickSleep: false,
  messages: {
    success: "Awesome! Everything worked!",
    error: "Oops! Something went wrong.",
    loading: "Give me a moment...",
    sleepy: "Is anyone there?",
  },
};

export const PRESETS: PositionPreset[] = [
  "bottom-right",
  "bottom-left",
  "top-right",
  "top-left",
  "center-right",
  "center-left",
];

export const ANCHOR_ID = "pg-anchor";

/** The real `position` prop for a config. */
export function toPosition(c: PlaygroundConfig): MascotPosition {
  if (c.position === "custom") return { bottom: c.custom.bottom, right: c.custom.right };
  if (c.position === "attach") return { element: `#${ANCHOR_ID}`, placement: "right" };
  return c.position;
}

/** Equivalent JSX for the current settings (only non-default props). */
export function toCode(c: PlaygroundConfig): string {
  const props: string[] = [`character="${c.character}"`];
  if (c.position === "custom") {
    props.push(`position={{ bottom: ${c.custom.bottom}, right: ${c.custom.right} }}`);
  } else if (c.position === "attach") {
    props.push(`position={{ element: "#signup", placement: "right" }}`);
  } else {
    props.push(`position="${c.position}"`);
  }
  props.push(`size={${c.size}}`);
  if (!c.trackCursor) props.push("trackCursor={false}");
  else {
    if (c.trackingIntensity !== 1) props.push(`trackingIntensity={${c.trackingIntensity}}`);
    if (c.trackingSpeed !== 0.5) {
      const named = Object.entries(TRACKING_SPEEDS).find(([, v]) => v === c.trackingSpeed)?.[0];
      props.push(named ? `trackingSpeed="${named}"` : `trackingSpeed={${c.trackingSpeed}}`);
    }
  }
  if (c.headTracking) props.push("headTracking");
  if (!c.showSpeechBubble) props.push("showSpeechBubble={false}");
  if (c.draggable) props.push("draggable");
  if (c.quickSleep) props.push("idle={{ sleepyAfter: 3000, sleepAfter: 6000 }}");
  const m = c.messages;
  const msg = Object.entries(m)
    .filter(([, v]) => v.trim())
    .map(([k, v]) => `    ${k}: ${JSON.stringify(v)},`)
    .join("\n");
  if (msg) props.push(`messages={{\n${msg}\n  }}`);
  return `<ContextMascot\n  ${props.join("\n  ")}\n/>`;
}
