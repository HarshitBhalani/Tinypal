import { MASCOT_CSS } from "./styles";
import type { MascotState } from "../types";

const STYLE_ID = "tinypal-styles";

/** Inject the shared stylesheet once per document. No-op on the server. */
export function ensureStyles(doc: Document | undefined = globalThis.document): void {
  if (!doc || doc.getElementById(STYLE_ID)) return;
  const style = doc.createElement("style");
  style.id = STYLE_ID;
  style.textContent = MASCOT_CSS;
  doc.head.appendChild(style);
}

/** Reflect mascot state onto a rendered SVG without re-rendering it. */
export function applyState(svg: Element, state: MascotState): void {
  svg.setAttribute("data-expression", state.expression);
  if (state.action) svg.setAttribute("data-action", state.action);
  else svg.removeAttribute("data-action");
}

/** Point the eyes (and head, if enabled). `x` and `y` are in -1..1. */
export function applyLook(svg: SVGElement | HTMLElement, x: number, y: number): void {
  svg.style.setProperty("--tp-look-x", String(x));
  svg.style.setProperty("--tp-look-y", String(y));
}
