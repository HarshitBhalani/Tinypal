import { face, fx } from "@tinypal/core";
import type { CharacterDefinition } from "@tinypal/core";

const NAVY = "#24314d";
const WHITE = "#f7f9fc";
const ORANGE = "#f59e2b";
const SCARF = "#e5484d";

/** Round navy penguin with a white face and a red scarf. */
export const penguin: CharacterDefinition = {
  id: "penguin",
  name: "Penguin",
  description: "A cheerful penguin who never forgets its scarf.",
  accent: "#3fb6e8",
  body: `
<ellipse cx="100" cy="186" rx="44" ry="5" fill="rgba(0,0,0,.12)"/>
<ellipse cx="84" cy="180" rx="14" ry="6" fill="${ORANGE}"/>
<ellipse cx="116" cy="180" rx="14" ry="6" fill="${ORANGE}"/>
<ellipse cx="46" cy="132" rx="11" ry="30" fill="${NAVY}" transform="rotate(18 46 132)"/>
<g class="tp-wave-arm" style="transform-origin:150px 108px">
  <ellipse cx="154" cy="132" rx="11" ry="30" fill="${NAVY}" transform="rotate(-18 154 132)"/>
</g>
<g class="tp-head">
  <ellipse cx="100" cy="114" rx="54" ry="68" fill="${NAVY}"/>
  <ellipse cx="100" cy="140" rx="36" ry="38" fill="${WHITE}"/>
  <path d="M 64 88 Q 64 60 88 62 Q 100 70 112 62 Q 136 60 136 88 Q 136 112 100 114 Q 64 112 64 88 Z" fill="${WHITE}"/>
  <circle cx="72" cy="100" r="6" fill="#ffb3c1" opacity=".55"/>
  <circle cx="128" cy="100" r="6" fill="#ffb3c1" opacity=".55"/>
  ${face({
    eyeY: 84,
    eyeDX: 18,
    eyeR: 8.5,
    mouthY: 106,
    mouthW: 8,
    pupil: "#141b2d",
    line: NAVY,
    mouthFill: "#a33b4a",
    browY: 68,
  })}
  <path d="M 92 94 L 108 94 L 100 102 Z" fill="${ORANGE}" stroke="${ORANGE}" stroke-width="3" stroke-linejoin="round"/>
  <path d="M 62 118 Q 100 132 138 118 L 138 128 Q 100 142 62 128 Z" fill="${SCARF}"/>
  <path d="M 120 128 L 128 152 L 116 152 L 112 130 Z" fill="${SCARF}"/>
</g>
${fx({ x: 156, y: 36 })}
`,
};
