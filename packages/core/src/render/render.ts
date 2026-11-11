import type { Action, CharacterDefinition, Expression } from "../types";

export type Theme = "light" | "dark";

export interface RenderOptions {
  /** Pixel width (height follows the 1:1 viewBox). Default 150. */
  size?: number;
  expression?: Expression;
  action?: Action | null;
  theme?: Theme;
  /** Let the head follow the cursor as well as the eyes. */
  headTracking?: boolean;
  /** Disable all animation (also automatic under prefers-reduced-motion). */
  reducedMotion?: boolean;
}

/** Escape a value for use inside a double-quoted XML attribute. */
const attr = (v: unknown): string =>
  String(v).replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

/** Render a character to an SVG string. Pure and SSR-safe. */
export function renderCharacter(character: CharacterDefinition, o: RenderOptions = {}): string {
  const size = Number(o.size ?? 150) || 150;
  const attrs = [
    `class="tp-root"`,
    `xmlns="http://www.w3.org/2000/svg"`,
    `viewBox="0 0 200 200"`,
    `width="${size}"`,
    `height="${size}"`,
    `aria-hidden="true"`,
    `focusable="false"`,
    `data-character="${attr(character.id)}"`,
    `data-expression="${attr(o.expression ?? "idle")}"`,
    `data-theme="${attr(o.theme ?? "light")}"`,
    // ";" is stripped too, so an accent value cannot add extra CSS declarations.
    `style="--tp-accent:${attr(String(character.accent).replace(/;/g, ""))}"`,
  ];
  if (o.action) attrs.push(`data-action="${attr(o.action)}"`);
  if (o.headTracking) attrs.push(`data-head="on"`);
  if (o.reducedMotion) attrs.push(`data-motion="off"`);
  return `<svg ${attrs.join(" ")}><g class="tp-float">${character.body}</g></svg>`;
}
