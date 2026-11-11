import { face, fx } from "@tinypal/core";
import type { CharacterDefinition } from "@tinypal/core";

const FUR = "#f2a65a";
const STRIPE = "#d9822b";
const BELLY = "#fff1dc";
const PINK = "#f4a3b5";
const INK = "#3b2a22";

/** Orange tabby with pointed ears, whiskers and a curled tail. */
export const cat: CharacterDefinition = {
  id: "cat",
  name: "Cat",
  description: "A curious tabby with sharp ears and a swishy tail.",
  accent: "#e0679a",
  body: `
<ellipse cx="100" cy="186" rx="44" ry="5" fill="rgba(0,0,0,.12)"/>
<path d="M 134 162 Q 180 160 172 112 Q 170 98 160 104" fill="none" stroke="${FUR}" stroke-width="13" stroke-linecap="round"/>
<path d="M 172 114 Q 170 98 160 104" fill="none" stroke="${STRIPE}" stroke-width="13" stroke-linecap="round"/>
<ellipse cx="84" cy="178" rx="14" ry="8" fill="${FUR}"/>
<ellipse cx="116" cy="178" rx="14" ry="8" fill="${FUR}"/>
<ellipse cx="100" cy="148" rx="34" ry="34" fill="${FUR}"/>
<ellipse cx="100" cy="154" rx="20" ry="24" fill="${BELLY}"/>
<path d="M 70 140 L 80 142 M 69 152 L 79 153 M 130 140 L 120 142 M 131 152 L 121 153" stroke="${STRIPE}" stroke-width="4" stroke-linecap="round"/>
<ellipse cx="64" cy="150" rx="9" ry="18" fill="${FUR}"/>
<g class="tp-wave-arm" style="transform-origin:138px 134px">
  <ellipse cx="138" cy="150" rx="9" ry="18" fill="${FUR}"/>
</g>
<g class="tp-head">
  <path d="M 56 62 L 54 22 L 92 46 Z" fill="${FUR}" stroke="${FUR}" stroke-width="4" stroke-linejoin="round"/>
  <path d="M 144 62 L 146 22 L 108 46 Z" fill="${FUR}" stroke="${FUR}" stroke-width="4" stroke-linejoin="round"/>
  <path d="M 62 56 L 61 36 L 79 47 Z" fill="${PINK}"/>
  <path d="M 138 56 L 139 36 L 121 47 Z" fill="${PINK}"/>
  <ellipse cx="100" cy="80" rx="52" ry="44" fill="${FUR}"/>
  <path d="M 100 38 L 100 52 M 88 40 L 91 52 M 112 40 L 109 52" stroke="${STRIPE}" stroke-width="4" stroke-linecap="round"/>
  <ellipse cx="100" cy="97" rx="19" ry="12" fill="${BELLY}"/>
  <circle cx="64" cy="94" r="7" fill="${PINK}" opacity=".5"/>
  <circle cx="136" cy="94" r="7" fill="${PINK}" opacity=".5"/>
  ${face({
    eyeY: 76,
    eyeDX: 21,
    eyeR: 10,
    mouthY: 99,
    mouthW: 10,
    pupil: "#2c5e3a",
    line: INK,
    mouthFill: "#8a3b3b",
  })}
  <path d="M 94 89 L 106 89 L 100 96 Z" fill="${PINK}" stroke="${PINK}" stroke-width="2" stroke-linejoin="round"/>
  <path d="M 60 92 L 32 86 M 60 98 L 32 101 M 140 92 L 168 86 M 140 98 L 168 101" stroke="${INK}" stroke-width="2" stroke-linecap="round" opacity=".55"/>
</g>
${fx({ x: 158, y: 30 })}
`,
};
