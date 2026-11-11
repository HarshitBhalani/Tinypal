import { face, fx } from "@tinypal/core";
import type { CharacterDefinition } from "@tinypal/core";

const TAN = "#e8b97a";
const EAR = "#8a5a35";
const SNOUT = "#f7e0bb";
const INK = "#2a170d";

/** Golden pup with floppy ears, an eye patch and a red collar. */
export const dog: CharacterDefinition = {
  id: "dog",
  name: "Dog",
  description: "A loyal pup with floppy ears and a wagging tail.",
  accent: "#e5484d",
  body: `
<ellipse cx="100" cy="186" rx="44" ry="5" fill="rgba(0,0,0,.12)"/>
<path d="M 134 166 Q 166 160 162 132" fill="none" stroke="${TAN}" stroke-width="13" stroke-linecap="round"/>
<ellipse cx="84" cy="178" rx="14" ry="8" fill="${TAN}"/>
<ellipse cx="116" cy="178" rx="14" ry="8" fill="${TAN}"/>
<ellipse cx="100" cy="150" rx="34" ry="32" fill="${TAN}"/>
<ellipse cx="100" cy="156" rx="19" ry="22" fill="${SNOUT}"/>
<ellipse cx="64" cy="152" rx="9" ry="18" fill="${TAN}"/>
<g class="tp-wave-arm" style="transform-origin:138px 136px">
  <ellipse cx="138" cy="152" rx="9" ry="18" fill="${TAN}"/>
</g>
<g class="tp-head">
  <ellipse cx="52" cy="84" rx="16" ry="32" fill="${EAR}" transform="rotate(12 52 84)"/>
  <ellipse cx="148" cy="84" rx="16" ry="32" fill="${EAR}" transform="rotate(-12 148 84)"/>
  <ellipse cx="100" cy="78" rx="50" ry="46" fill="${TAN}"/>
  <ellipse cx="79" cy="74" rx="16" ry="17" fill="${EAR}"/>
  <ellipse cx="100" cy="101" rx="27" ry="20" fill="${SNOUT}"/>
  ${face({
    eyeY: 74,
    eyeDX: 22,
    eyeR: 9.5,
    mouthY: 108,
    mouthW: 11,
    line: INK,
    eyeLine: "#1c0f08",
    mouthFill: "#a33b4a",
  })}
  <ellipse cx="100" cy="92" rx="9" ry="6.5" fill="${INK}"/>
  <ellipse cx="97" cy="90" rx="2.5" ry="1.5" fill="#ffffff" opacity=".6"/>
  <path d="M 76 128 Q 100 144 124 128" fill="none" stroke="#e5484d" stroke-width="7" stroke-linecap="round"/>
  <circle cx="100" cy="137" r="5" fill="#f5c542"/>
</g>
${fx({ x: 152, y: 28 })}
`,
};
