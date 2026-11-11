import { face, fx } from "@tinypal/core";
import type { CharacterDefinition } from "@tinypal/core";

const GREEN = "#7ccf5a";
const DARK = "#5aa83c";
const BELLY = "#e8f5c8";

/** Wide-mouthed frog with bulging eyes on top of its head. */
export const frog: CharacterDefinition = {
  id: "frog",
  name: "Frog",
  description: "A happy pond frog with eyes on top of its head.",
  accent: "#ff6f91",
  body: `
<ellipse cx="100" cy="186" rx="54" ry="5" fill="rgba(0,0,0,.12)"/>
<ellipse cx="66" cy="176" rx="20" ry="9" fill="${DARK}"/>
<ellipse cx="134" cy="176" rx="20" ry="9" fill="${DARK}"/>
<ellipse cx="100" cy="148" rx="42" ry="32" fill="${GREEN}"/>
<ellipse cx="100" cy="154" rx="28" ry="22" fill="${BELLY}"/>
<ellipse cx="62" cy="156" rx="8" ry="16" fill="${GREEN}"/>
<g class="tp-wave-arm" style="transform-origin:138px 142px">
  <ellipse cx="138" cy="156" rx="8" ry="16" fill="${GREEN}"/>
</g>
<g class="tp-head">
  <circle cx="70" cy="62" r="22" fill="${GREEN}"/>
  <circle cx="130" cy="62" r="22" fill="${GREEN}"/>
  <ellipse cx="100" cy="98" rx="60" ry="38" fill="${GREEN}"/>
  <circle cx="58" cy="106" r="8" fill="#ff9fb5" opacity=".5"/>
  <circle cx="142" cy="106" r="8" fill="#ff9fb5" opacity=".5"/>
  <circle cx="94" cy="88" r="1.8" fill="${DARK}"/>
  <circle cx="106" cy="88" r="1.8" fill="${DARK}"/>
  ${face({
    eyeY: 62,
    eyeDX: 30,
    eyeR: 13,
    mouthY: 104,
    mouthW: 22,
    pupil: "#1d2b14",
    line: "#2f5a1f",
    mouthFill: "#c2416b",
    browY: 36,
  })}
</g>
${fx({ x: 160, y: 30 })}
`,
};
