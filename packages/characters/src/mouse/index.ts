import { face, fx } from "@tinypal/core";
import type { CharacterDefinition } from "@tinypal/core";

const GREY = "#b9bfcc";
const SHADE = "#9aa1b1";
const PINK = "#f6a6bb";
const INK = "#3a3f4d";

/** Tiny grey mouse with huge round ears, holding a wedge of cheese. */
export const mouse: CharacterDefinition = {
  id: "mouse",
  name: "Mouse",
  description: "A quick little mouse who never shares the cheese.",
  accent: "#f5b82e",
  body: `
<ellipse cx="100" cy="186" rx="40" ry="5" fill="rgba(0,0,0,.12)"/>
<path d="M 128 170 Q 168 176 166 148 Q 164 130 178 128" fill="none" stroke="${PINK}" stroke-width="4" stroke-linecap="round"/>
<ellipse cx="86" cy="180" rx="12" ry="6" fill="${PINK}"/>
<ellipse cx="114" cy="180" rx="12" ry="6" fill="${PINK}"/>
<ellipse cx="100" cy="152" rx="29" ry="29" fill="${GREY}"/>
<ellipse cx="100" cy="158" rx="16" ry="18" fill="#e3e6ec"/>
<path d="M 48 150 L 74 136 L 74 158 Z" fill="#f9cf4a" stroke="#e5b52a" stroke-width="2" stroke-linejoin="round"/>
<circle cx="60" cy="150" r="2.5" fill="#e5b52a"/>
<circle cx="68" cy="146" r="2" fill="#e5b52a"/>
<ellipse cx="74" cy="148" rx="7" ry="10" fill="${GREY}"/>
<g class="tp-wave-arm" style="transform-origin:126px 138px">
  <ellipse cx="128" cy="148" rx="7" ry="13" fill="${GREY}"/>
</g>
<g class="tp-head">
  <circle cx="54" cy="56" r="30" fill="${GREY}"/>
  <circle cx="146" cy="56" r="30" fill="${GREY}"/>
  <circle cx="54" cy="56" r="19" fill="${PINK}"/>
  <circle cx="146" cy="56" r="19" fill="${PINK}"/>
  <ellipse cx="100" cy="92" rx="44" ry="40" fill="${GREY}"/>
  <ellipse cx="100" cy="110" rx="20" ry="13" fill="#d7dbe3"/>
  <circle cx="70" cy="106" r="6" fill="${PINK}" opacity=".55"/>
  <circle cx="130" cy="106" r="6" fill="${PINK}" opacity=".55"/>
  ${face({
    eyeY: 86,
    eyeDX: 18,
    eyeR: 9,
    mouthY: 116,
    mouthW: 8,
    pupil: "#1e2129",
    line: INK,
    mouthFill: "#a33b4a",
  })}
  <circle cx="100" cy="106" r="5" fill="#e86d8f"/>
  <path d="M 80 108 L 56 102 M 80 113 L 56 116 M 120 108 L 144 102 M 120 113 L 144 116" stroke="${SHADE}" stroke-width="2" stroke-linecap="round"/>
</g>
${fx({ x: 160, y: 36 })}
`,
};
