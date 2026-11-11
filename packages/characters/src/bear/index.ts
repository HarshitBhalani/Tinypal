import { face, fx } from "@tinypal/core";
import type { CharacterDefinition } from "@tinypal/core";

const FUR = "#b07a4f";
const DARK = "#8a5a35";
const MUZZLE = "#f0d5b4";
const BOW = "#3f8cff";

/** Cuddly teddy bear with round ears and a blue bow tie. */
export const bear: CharacterDefinition = {
  id: "bear",
  name: "Bear",
  description: "A cuddly teddy who gives the best hugs.",
  accent: "#3f8cff",
  body: `
<ellipse cx="100" cy="186" rx="46" ry="5" fill="rgba(0,0,0,.12)"/>
<ellipse cx="80" cy="176" rx="16" ry="11" fill="${FUR}"/>
<ellipse cx="120" cy="176" rx="16" ry="11" fill="${FUR}"/>
<circle cx="80" cy="178" r="6" fill="${MUZZLE}"/>
<circle cx="120" cy="178" r="6" fill="${MUZZLE}"/>
<ellipse cx="100" cy="146" rx="38" ry="34" fill="${FUR}"/>
<ellipse cx="100" cy="152" rx="22" ry="22" fill="${MUZZLE}"/>
<ellipse cx="62" cy="146" rx="11" ry="20" fill="${FUR}" transform="rotate(15 62 146)"/>
<g class="tp-wave-arm" style="transform-origin:138px 130px">
  <ellipse cx="138" cy="146" rx="11" ry="20" fill="${FUR}" transform="rotate(-15 138 146)"/>
</g>
<g class="tp-head">
  <circle cx="58" cy="42" r="18" fill="${FUR}"/>
  <circle cx="142" cy="42" r="18" fill="${FUR}"/>
  <circle cx="58" cy="42" r="10" fill="${DARK}"/>
  <circle cx="142" cy="42" r="10" fill="${DARK}"/>
  <circle cx="100" cy="80" r="48" fill="${FUR}"/>
  <ellipse cx="100" cy="100" rx="23" ry="17" fill="${MUZZLE}"/>
  <circle cx="64" cy="98" r="7" fill="#ff9f9f" opacity=".4"/>
  <circle cx="136" cy="98" r="7" fill="#ff9f9f" opacity=".4"/>
  ${face({
    eyeY: 76,
    eyeDX: 22,
    eyeR: 8.5,
    mouthY: 106,
    mouthW: 9,
    pupil: "#24160b",
    line: "#3a2414",
    mouthFill: "#a33b4a",
  })}
  <ellipse cx="100" cy="94" rx="8" ry="5.5" fill="#3a2414"/>
  <path d="M 86 128 L 100 134 L 86 140 Z M 114 128 L 100 134 L 114 140 Z" fill="${BOW}" stroke="${BOW}" stroke-width="3" stroke-linejoin="round"/>
  <circle cx="100" cy="134" r="4" fill="#2a6fd6"/>
</g>
${fx({ x: 156, y: 32 })}
`,
};
