import { face, fx } from "@tinypal/core";
import type { CharacterDefinition } from "@tinypal/core";

const FUR = "#9b6bff";
const DEEP = "#7a49e6";
const BELLY = "#c7aaff";
const HORN = "#fff2c7";

/** Fluffy purple one-eyed monster with stubby horns. */
export const monster: CharacterDefinition = {
  id: "monster",
  name: "Monster",
  description: "A fluffy one-eyed monster. Not scary, just enthusiastic.",
  accent: "#3ddc97",
  body: `
<ellipse cx="100" cy="186" rx="48" ry="5" fill="rgba(0,0,0,.12)"/>
<ellipse cx="80" cy="178" rx="15" ry="9" fill="${DEEP}"/>
<ellipse cx="120" cy="178" rx="15" ry="9" fill="${DEEP}"/>
<path d="M 46 140 Q 30 150 34 168 Q 46 160 56 152 Z" fill="${FUR}"/>
<g class="tp-wave-arm" style="transform-origin:146px 136px">
  <path d="M 154 140 Q 170 150 166 168 Q 154 160 144 152 Z" fill="${FUR}"/>
</g>
<g class="tp-head">
  <path d="M 66 46 Q 58 28 70 18 Q 72 34 80 42 Z" fill="${HORN}" stroke="#e6d39c" stroke-width="2" stroke-linejoin="round"/>
  <path d="M 134 46 Q 142 28 130 18 Q 128 34 120 42 Z" fill="${HORN}" stroke="#e6d39c" stroke-width="2" stroke-linejoin="round"/>
  <path d="M 50 80 Q 50 38 100 38 Q 150 38 150 80 L 152 168 L 142 160 L 132 172 L 122 162 L 112 174 L 100 164 L 88 174 L 78 162 L 68 172 L 58 160 L 48 168 Z" fill="${FUR}" stroke="${DEEP}" stroke-width="3" stroke-linejoin="round"/>
  <ellipse cx="100" cy="138" rx="28" ry="22" fill="${BELLY}" opacity=".7"/>
  <circle cx="66" cy="112" r="7" fill="#ff9fd1" opacity=".5"/>
  <circle cx="134" cy="112" r="7" fill="#ff9fd1" opacity=".5"/>
  ${face({
    eyeY: 82,
    eyeDX: 0,
    eyeR: 20,
    mouthY: 114,
    mouthW: 16,
    pupil: "#2d1660",
    line: "#3a1f78",
    mouthFill: "#4a1d5e",
    browY: 52,
  })}
</g>
${fx({ x: 156, y: 36 })}
`,
};
