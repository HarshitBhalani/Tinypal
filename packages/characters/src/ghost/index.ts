import { face, fx } from "@tinypal/core";
import type { CharacterDefinition } from "@tinypal/core";

const SHEET = "#f6f3ff";
const EDGE = "#cfc6f5";
const INK = "#2a2438";

/** Floating pale-lavender ghost with a wavy hem and rosy cheeks. */
export const ghost: CharacterDefinition = {
  id: "ghost",
  name: "Ghost",
  description: "A shy, floaty ghost who just wants to say hi.",
  accent: "#8b6cf0",
  body: `
<ellipse cx="100" cy="182" rx="32" ry="5" fill="rgba(0,0,0,.1)"/>
<ellipse cx="46" cy="116" rx="11" ry="16" fill="${SHEET}" stroke="${EDGE}" stroke-width="3" transform="rotate(20 46 116)"/>
<g class="tp-wave-arm" style="transform-origin:150px 108px">
  <ellipse cx="154" cy="116" rx="11" ry="16" fill="${SHEET}" stroke="${EDGE}" stroke-width="3" transform="rotate(-20 154 116)"/>
</g>
<g class="tp-head">
  <path d="M 48 152 L 48 82 Q 48 28 100 28 Q 152 28 152 82 L 152 152 Q 139 136 126 152 Q 113 168 100 152 Q 87 136 74 152 Q 61 168 48 152 Z" fill="${SHEET}" stroke="${EDGE}" stroke-width="3" stroke-linejoin="round"/>
  <path d="M 98 30 Q 96 18 106 16" fill="none" stroke="${EDGE}" stroke-width="4" stroke-linecap="round"/>
  <circle cx="66" cy="100" r="8" fill="#ffb3d1" opacity=".55"/>
  <circle cx="134" cy="100" r="8" fill="#ffb3d1" opacity=".55"/>
  ${face({
    eyeY: 80,
    eyeDX: 22,
    eyeR: 11,
    mouthY: 103,
    mouthW: 11,
    sclera: INK,
    pupil: "#4a4263",
    line: INK,
    mouthFill: "#6b3a5a",
    browY: 58,
  })}
</g>
${fx({ x: 154, y: 34 })}
`,
};
