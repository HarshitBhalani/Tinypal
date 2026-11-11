import { face, fx } from "@tinypal/core";
import type { CharacterDefinition } from "@tinypal/core";

const ORANGE = "#f08a3c";
const DARK = "#4a2c1e";
const CREAM = "#fff6ea";
const INK = "#3a2418";

/** Sly orange fox with a white mask, dark-tipped ears and a bushy tail. */
export const fox: CharacterDefinition = {
  id: "fox",
  name: "Fox",
  description: "A clever fox with a bushy tail and sharp ears.",
  accent: "#2f9e8f",
  body: `
<ellipse cx="100" cy="186" rx="44" ry="5" fill="rgba(0,0,0,.12)"/>
<path d="M 130 170 Q 192 172 188 112 Q 186 98 170 112 Q 168 142 134 146 Z" fill="${ORANGE}"/>
<path d="M 172 108 Q 186 94 190 118 Q 188 134 176 136 Q 168 124 172 108 Z" fill="#ffffff"/>
<ellipse cx="84" cy="178" rx="13" ry="8" fill="${DARK}"/>
<ellipse cx="116" cy="178" rx="13" ry="8" fill="${DARK}"/>
<ellipse cx="100" cy="148" rx="32" ry="32" fill="${ORANGE}"/>
<ellipse cx="100" cy="152" rx="17" ry="24" fill="${CREAM}"/>
<ellipse cx="66" cy="150" rx="9" ry="17" fill="${ORANGE}"/>
<ellipse cx="66" cy="164" rx="9" ry="7" fill="${DARK}"/>
<g class="tp-wave-arm" style="transform-origin:134px 136px">
  <ellipse cx="134" cy="150" rx="9" ry="17" fill="${ORANGE}"/>
  <ellipse cx="134" cy="164" rx="9" ry="7" fill="${DARK}"/>
</g>
<g class="tp-head">
  <path d="M 56 64 L 48 16 L 92 44 Z" fill="${ORANGE}" stroke="${ORANGE}" stroke-width="4" stroke-linejoin="round"/>
  <path d="M 144 64 L 152 16 L 108 44 Z" fill="${ORANGE}" stroke="${ORANGE}" stroke-width="4" stroke-linejoin="round"/>
  <path d="M 58 56 L 54 30 L 82 46 Z" fill="#f7c9a3"/>
  <path d="M 142 56 L 146 30 L 118 46 Z" fill="#f7c9a3"/>
  <path d="M 48 16 L 50.4 30.4 L 61.2 24.4 Z" fill="${DARK}" stroke="${DARK}" stroke-width="3" stroke-linejoin="round"/>
  <path d="M 152 16 L 149.6 30.4 L 138.8 24.4 Z" fill="${DARK}" stroke="${DARK}" stroke-width="3" stroke-linejoin="round"/>
  <path d="M 46 72 Q 48 40 100 40 Q 152 40 154 72 Q 154 104 100 122 Q 46 104 46 72 Z" fill="${ORANGE}"/>
  <path d="M 50 84 Q 78 100 100 98 Q 122 100 150 84 Q 142 114 100 122 Q 58 114 50 84 Z" fill="#ffffff"/>
  ${face({
    eyeY: 72,
    eyeDX: 22,
    eyeR: 9,
    mouthY: 109,
    mouthW: 10,
    pupil: "#2a1a10",
    line: INK,
    mouthFill: "#9c3a3a",
  })}
  <ellipse cx="100" cy="99" rx="7" ry="5" fill="${INK}"/>
</g>
${fx({ x: 160, y: 38 })}
`,
};
