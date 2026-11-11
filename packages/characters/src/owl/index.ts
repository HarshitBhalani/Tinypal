import { face, fx } from "@tinypal/core";
import type { CharacterDefinition } from "@tinypal/core";

const FEATHER = "#8b5e3c";
const DARK = "#6a4529";
const DISC = "#f6e3c4";
const ORANGE = "#f29a2e";

/** Wide-eyed brown owl with ear tufts and a feathered belly. */
export const owl: CharacterDefinition = {
  id: "owl",
  name: "Owl",
  description: "A wise night owl with giant round eyes.",
  accent: "#ffcf3f",
  body: `
<ellipse cx="100" cy="186" rx="44" ry="5" fill="rgba(0,0,0,.12)"/>
<path d="M 84 176 l -6 8 M 84 176 l 0 9 M 84 176 l 6 8 M 116 176 l -6 8 M 116 176 l 0 9 M 116 176 l 6 8" stroke="${ORANGE}" stroke-width="4" stroke-linecap="round"/>
<path d="M 46 110 Q 30 140 52 166 Q 58 140 60 118 Z" fill="${DARK}"/>
<g class="tp-wave-arm" style="transform-origin:146px 112px">
  <path d="M 154 110 Q 170 140 148 166 Q 142 140 140 118 Z" fill="${DARK}"/>
</g>
<g class="tp-head">
  <path d="M 52 62 L 46 26 L 78 50 Z" fill="${FEATHER}" stroke="${FEATHER}" stroke-width="4" stroke-linejoin="round"/>
  <path d="M 148 62 L 154 26 L 122 50 Z" fill="${FEATHER}" stroke="${FEATHER}" stroke-width="4" stroke-linejoin="round"/>
  <ellipse cx="100" cy="114" rx="56" ry="66" fill="${FEATHER}"/>
  <ellipse cx="100" cy="146" rx="34" ry="30" fill="${DISC}"/>
  <path d="M 86 136 q 4 5 8 0 M 106 136 q 4 5 8 0 M 76 150 q 4 5 8 0 M 96 150 q 4 5 8 0 M 116 150 q 4 5 8 0 M 86 164 q 4 5 8 0 M 106 164 q 4 5 8 0" fill="none" stroke="${FEATHER}" stroke-width="2.5" stroke-linecap="round"/>
  <circle cx="76" cy="90" r="25" fill="${DISC}"/>
  <circle cx="124" cy="90" r="25" fill="${DISC}"/>
  ${face({
    eyeY: 90,
    eyeDX: 24,
    eyeR: 14,
    mouthY: 122,
    mouthW: 8,
    sclera: "#ffd34d",
    pupil: "#2b1a0e",
    line: "#3d2614",
    mouthFill: "#7a2e2e",
    browY: 62,
  })}
  <path d="M 93 104 L 107 104 L 100 117 Z" fill="${ORANGE}" stroke="${ORANGE}" stroke-width="3" stroke-linejoin="round"/>
</g>
${fx({ x: 158, y: 30 })}
`,
};
