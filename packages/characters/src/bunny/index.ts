import { face, fx } from "@tinypal/core";
import type { CharacterDefinition } from "@tinypal/core";

const FUR = "#fdf6f8";
const EDGE = "#e6d3da";
const PINK = "#f7b8c8";
const INK = "#6b4a55";

/** Soft white bunny with tall uneven ears and a fluffy tail. */
export const bunny: CharacterDefinition = {
  id: "bunny",
  name: "Bunny",
  description: "A gentle bunny with long ears and a fluffy tail.",
  accent: "#f06292",
  body: `
<ellipse cx="100" cy="186" rx="42" ry="5" fill="rgba(0,0,0,.12)"/>
<circle cx="140" cy="166" r="11" fill="${FUR}" stroke="${EDGE}" stroke-width="2"/>
<ellipse cx="82" cy="178" rx="15" ry="8" fill="${FUR}" stroke="${EDGE}" stroke-width="2"/>
<ellipse cx="118" cy="178" rx="15" ry="8" fill="${FUR}" stroke="${EDGE}" stroke-width="2"/>
<ellipse cx="100" cy="150" rx="33" ry="32" fill="${FUR}" stroke="${EDGE}" stroke-width="2"/>
<ellipse cx="100" cy="156" rx="18" ry="20" fill="#ffe6ee"/>
<ellipse cx="66" cy="152" rx="9" ry="17" fill="${FUR}" stroke="${EDGE}" stroke-width="2"/>
<g class="tp-wave-arm" style="transform-origin:134px 136px">
  <ellipse cx="134" cy="152" rx="9" ry="17" fill="${FUR}" stroke="${EDGE}" stroke-width="2"/>
</g>
<g class="tp-head">
  <g transform="rotate(-6 82 74)">
    <ellipse cx="82" cy="42" rx="14" ry="33" fill="${FUR}" stroke="${EDGE}" stroke-width="2"/>
    <ellipse cx="82" cy="46" rx="7" ry="24" fill="${PINK}"/>
  </g>
  <g transform="rotate(22 118 74)">
    <ellipse cx="118" cy="42" rx="14" ry="33" fill="${FUR}" stroke="${EDGE}" stroke-width="2"/>
    <ellipse cx="118" cy="46" rx="7" ry="24" fill="${PINK}"/>
  </g>
  <ellipse cx="100" cy="92" rx="46" ry="40" fill="${FUR}" stroke="${EDGE}" stroke-width="2"/>
  <circle cx="68" cy="106" r="7" fill="${PINK}" opacity=".5"/>
  <circle cx="132" cy="106" r="7" fill="${PINK}" opacity=".5"/>
  ${face({
    eyeY: 88,
    eyeDX: 19,
    eyeR: 9.5,
    mouthY: 108,
    mouthW: 9,
    pupil: "#4a2f3a",
    line: INK,
    mouthFill: "#c2576f",
  })}
  <path d="M 95 98 L 105 98 L 100 104 Z" fill="#f48fb1" stroke="#f48fb1" stroke-width="2" stroke-linejoin="round"/>
  <path d="M 62 102 L 40 98 M 62 108 L 40 112 M 138 102 L 160 98 M 138 108 L 160 112" stroke="${INK}" stroke-width="2" stroke-linecap="round" opacity=".45"/>
</g>
${fx({ x: 154, y: 44 })}
`,
};
