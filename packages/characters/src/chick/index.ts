import { face, fx } from "@tinypal/core";
import type { CharacterDefinition } from "@tinypal/core";

const YELLOW = "#ffd84a";
const DEEP = "#f2b92a";
const ORANGE = "#f58a2b";
const SHELL = "#fffaf0";

/** Round baby chick sitting in its cracked eggshell. */
export const chick: CharacterDefinition = {
  id: "chick",
  name: "Chick",
  description: "A fresh-out-of-the-egg chick, curious about everything.",
  accent: "#ff7a59",
  body: `
<ellipse cx="100" cy="186" rx="50" ry="5" fill="rgba(0,0,0,.12)"/>
<ellipse cx="46" cy="118" rx="10" ry="18" fill="${DEEP}" transform="rotate(30 46 118)"/>
<g class="tp-wave-arm" style="transform-origin:150px 108px">
  <ellipse cx="154" cy="118" rx="10" ry="18" fill="${DEEP}" transform="rotate(-30 154 118)"/>
</g>
<g class="tp-head">
  <path d="M 100 46 Q 94 30 102 22 M 100 46 Q 108 32 116 30 M 100 46 Q 90 36 84 36" fill="none" stroke="${DEEP}" stroke-width="5" stroke-linecap="round"/>
  <circle cx="100" cy="106" r="58" fill="${YELLOW}"/>
  <ellipse cx="78" cy="78" rx="12" ry="8" fill="#ffffff" opacity=".4" transform="rotate(-30 78 78)"/>
  <circle cx="66" cy="114" r="8" fill="#ff9f7a" opacity=".5"/>
  <circle cx="134" cy="114" r="8" fill="#ff9f7a" opacity=".5"/>
  ${face({
    eyeY: 96,
    eyeDX: 22,
    eyeR: 9,
    mouthY: 124,
    mouthW: 8,
    pupil: "#2a2014",
    line: "#5a3d10",
    mouthFill: "#a33b4a",
  })}
  <path d="M 92 108 L 100 102 L 108 108 L 100 115 Z" fill="${ORANGE}" stroke="${ORANGE}" stroke-width="2" stroke-linejoin="round"/>
</g>
<path d="M 40 138 L 52 128 L 62 142 L 76 130 L 88 144 L 100 130 L 112 144 L 124 130 L 138 142 L 148 128 L 160 138 Q 162 182 100 184 Q 38 182 40 138 Z" fill="${SHELL}" stroke="#e8dcc0" stroke-width="2.5" stroke-linejoin="round"/>
${fx({ x: 156, y: 40 })}
`,
};
