export const EXPRESSIONS = [
  "idle",
  "happy",
  "curious",
  "thinking",
  "surprised",
  "confused",
  "sad",
  "sleepy",
] as const;
export type Expression = (typeof EXPRESSIONS)[number];

export const ACTIONS = [
  "loading",
  "celebrating",
  "blinking",
  "looking-left",
  "looking-right",
  "waving",
  "sleeping",
] as const;
export type Action = (typeof ACTIONS)[number];

export type PlayName = Expression | Action;

export const MASCOT_EVENTS = [
  "form:focus",
  "form:input",
  "form:invalid",
  "form:submit",
  "form:success",
  "form:error",
  "form:reset",
  "api:start",
  "api:loading",
  "api:success",
  "api:error",
  "api:network-error",
  "api:cancelled",
] as const;
export type MascotEventName = (typeof MASCOT_EVENTS)[number];

export interface MascotState {
  expression: Expression;
  /** Active animation state layered on top of the expression, or null. */
  action: Action | null;
}

/** What a website event does to the mascot. */
export interface Reaction {
  expression: Expression;
  action?: Action | null;
  /** Return to idle after this many ms. Omit to stay until the next event. */
  revertAfter?: number;
}

export type ReactionTable = Record<MascotEventName, Reaction>;

/**
 * A mascot character. `body` is SVG inner markup in a 200x200 viewBox, built
 * with the `face()` and `fx()` helpers so it supports every expression.
 */
export interface CharacterDefinition {
  id: string;
  name: string;
  description: string;
  /** Accent colour used by effects (zzz, sparkles, question mark). */
  accent: string;
  body: string;
}
