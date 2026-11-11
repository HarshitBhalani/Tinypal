import { face, fx } from "@tinypal/core";
import type { CharacterDefinition } from "@tinypal/core";

const GREEN = "#8be28a";
const DEEP = "#2d6b3b";
const SUIT = "#6b5bd6";

/** Big-eyed green alien with antennae and a purple space suit. */
export const alien: CharacterDefinition = {
  id: "alien",
  name: "Alien",
  description: "A tiny explorer from far away with enormous eyes.",
  accent: "#ffd23f",
  body: `
<ellipse cx="100" cy="186" rx="38" ry="5" fill="rgba(0,0,0,.12)"/>
<ellipse cx="88" cy="178" rx="11" ry="7" fill="#3a2f8f"/>
<ellipse cx="112" cy="178" rx="11" ry="7" fill="#3a2f8f"/>
<path d="M 76 122 Q 100 112 124 122 L 130 170 Q 100 178 70 170 Z" fill="${SUIT}"/>
<rect x="72" y="148" width="56" height="8" rx="4" fill="#3a2f8f"/>
<circle cx="100" cy="136" r="6" fill="#ffd23f"/>
<rect x="58" y="126" width="12" height="36" rx="6" fill="${GREEN}"/>
<g class="tp-wave-arm" style="transform-origin:136px 130px">
  <rect x="130" y="126" width="12" height="36" rx="6" fill="${GREEN}"/>
</g>
<g class="tp-head">
  <path d="M 80 42 Q 70 22 62 15" fill="none" stroke="${DEEP}" stroke-width="4" stroke-linecap="round"/>
  <path d="M 120 42 Q 130 22 138 15" fill="none" stroke="${DEEP}" stroke-width="4" stroke-linecap="round"/>
  <circle cx="62" cy="13" r="6.5" fill="#ffd23f"/>
  <circle cx="138" cy="13" r="6.5" fill="#ffd23f"/>
  <path d="M 100 30 Q 158 30 158 80 Q 158 114 126 125 Q 100 131 74 125 Q 42 114 42 80 Q 42 30 100 30 Z" fill="${GREEN}"/>
  <circle cx="62" cy="52" r="4" fill="${DEEP}" opacity=".3"/>
  <circle cx="138" cy="56" r="3" fill="${DEEP}" opacity=".3"/>
  <circle cx="68" cy="102" r="3.5" fill="${DEEP}" opacity=".3"/>
  ${face({
    eyeY: 76,
    eyeDX: 25,
    eyeR: 15,
    mouthY: 105,
    mouthW: 9,
    sclera: "#14141f",
    pupil: "#6a5acd",
    line: DEEP,
    eyeLine: "#14141f",
    mouthFill: "#2d6b3b",
    browY: 52,
  })}
  <circle cx="96" cy="93" r="1.6" fill="${DEEP}"/>
  <circle cx="104" cy="93" r="1.6" fill="${DEEP}"/>
</g>
${fx({ x: 152, y: 40 })}
`,
};
