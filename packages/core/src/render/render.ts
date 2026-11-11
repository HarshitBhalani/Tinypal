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

/** Render a character to an SVG string. Pure and SSR-safe. */
export function renderCharacter(character: CharacterDefinition, o: RenderOptions = {}): string {
  const size = o.size ?? 150;
  const attrs = [
    `class="tp-root"`,
    `xmlns="http://www.w3.org/2000/svg"`,
    `viewBox="0 0 200 200"`,
    `width="${size}"`,
    `height="${size}"`,
    `aria-hidden="true"`,
    `focusable="false"`,
    `data-character="${character.id}"`,
    `data-expression="${o.expression ?? "idle"}"`,
    `data-theme="${o.theme ?? "light"}"`,
    `style="--tp-accent:${character.accent}"`,
  ];
  if (o.action) attrs.push(`data-action="${o.action}"`);
  if (o.headTracking) attrs.push(`data-head="on"`);
  if (o.reducedMotion) attrs.push(`data-motion="off"`);
  return `<svg ${attrs.join(" ")}><g class="tp-float">${character.body}</g></svg>`;
}
