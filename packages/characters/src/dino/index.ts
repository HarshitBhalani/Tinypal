import { face, fx } from "@tinypal/core";
import type { CharacterDefinition } from "@tinypal/core";

const GREEN = "#6fcf6b";
const DARK = "#46a447";
const BELLY = "#f6e7a1";
const SPIKE = "#ff9f45";

/** Little green T-rex with orange back spikes and tiny arms. */
export const dino: CharacterDefinition = {
  id: "dino",
  name: "Dino",
  description: "A tiny T-rex with big dreams and tinier arms.",
  accent: "#ff9f45",
  body: `
<ellipse cx="100" cy="186" rx="48" ry="5" fill="rgba(0,0,0,.12)"/>
<path d="M 72 158 Q 30 168 18 140 Q 40 150 70 140 Z" fill="${GREEN}"/>
<ellipse cx="84" cy="178" rx="13" ry="9" fill="${DARK}"/>
<ellipse cx="116" cy="178" rx="13" ry="9" fill="${DARK}"/>
<ellipse cx="100" cy="146" rx="36" ry="34" fill="${GREEN}"/>
<ellipse cx="100" cy="152" rx="22" ry="25" fill="${BELLY}"/>
<path d="M 86 140 L 114 140 M 84 152 L 116 152 M 86 164 L 114 164" stroke="#e8d37a" stroke-width="2.5" stroke-linecap="round"/>
<ellipse cx="70" cy="132" rx="6" ry="9" fill="${GREEN}" transform="rotate(30 70 132)"/>
<g class="tp-wave-arm" style="transform-origin:128px 126px">
  <ellipse cx="130" cy="132" rx="6" ry="9" fill="${GREEN}" transform="rotate(-30 130 132)"/>
</g>
<g class="tp-head">
  <path d="M 62 44 L 70 26 L 78 42 L 88 22 L 98 40 L 108 22 L 118 40 L 128 26 L 136 44 Z" fill="${SPIKE}" stroke="${SPIKE}" stroke-width="3" stroke-linejoin="round"/>
  <ellipse cx="100" cy="76" rx="52" ry="42" fill="${GREEN}"/>
  <circle cx="64" cy="94" r="7" fill="#ff9fb5" opacity=".45"/>
  <circle cx="136" cy="94" r="7" fill="#ff9fb5" opacity=".45"/>
  ${face({
    eyeY: 68,
    eyeDX: 24,
    eyeR: 10,
    mouthY: 96,
    mouthW: 15,
    pupil: "#16301a",
    line: "#1f4d24",
    mouthFill: "#b8394d",
  })}
  <circle cx="94" cy="84" r="2" fill="${DARK}"/>
  <circle cx="106" cy="84" r="2" fill="${DARK}"/>
</g>
${fx({ x: 156, y: 36 })}
`,
};
