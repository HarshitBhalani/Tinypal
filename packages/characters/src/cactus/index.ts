import { face, fx } from "@tinypal/core";
import type { CharacterDefinition } from "@tinypal/core";

const GREEN = "#5cbf7a";
const DARK = "#3f9a5c";
const POT = "#d9734a";
const RIM = "#c25f38";

/** Potted cactus with a pink flower on top and a waving arm. */
export const cactus: CharacterDefinition = {
  id: "cactus",
  name: "Cactus",
  description: "A prickly little plant with a very soft heart.",
  accent: "#ff6fb1",
  body: `
<ellipse cx="100" cy="188" rx="40" ry="4" fill="rgba(0,0,0,.12)"/>
<path d="M 58 92 Q 40 92 40 74 L 40 62 Q 40 54 48 54 Q 56 54 56 62 L 56 74 Q 56 78 62 78 Z" fill="${GREEN}"/>
<g class="tp-wave-arm" style="transform-origin:140px 96px">
  <path d="M 142 100 Q 160 100 160 82 L 160 66 Q 160 58 152 58 Q 144 58 144 66 L 144 82 Q 144 86 138 86 Z" fill="${GREEN}"/>
</g>
<g class="tp-head">
  <rect x="62" y="44" width="76" height="110" rx="38" fill="${GREEN}"/>
  <path d="M 82 50 L 82 150 M 118 50 L 118 150" stroke="${DARK}" stroke-width="2" opacity=".5"/>
  <path d="M 70 70 l -5 -3 M 70 130 l -5 3 M 130 70 l 5 -3 M 130 130 l 5 3 M 100 140 l 0 5 M 76 100 l -5 0 M 124 100 l 5 0" stroke="#e8f5e0" stroke-width="2" stroke-linecap="round"/>
  <circle cx="86" cy="36" r="7" fill="#ff8cc6"/>
  <circle cx="100" cy="30" r="7" fill="#ff8cc6"/>
  <circle cx="114" cy="36" r="7" fill="#ff8cc6"/>
  <circle cx="93" cy="44" r="7" fill="#ff8cc6"/>
  <circle cx="107" cy="44" r="7" fill="#ff8cc6"/>
  <circle cx="100" cy="38" r="5" fill="#ffd84a"/>
  <circle cx="78" cy="104" r="6" fill="#ff9fb5" opacity=".55"/>
  <circle cx="122" cy="104" r="6" fill="#ff9fb5" opacity=".55"/>
  ${face({
    eyeY: 86,
    eyeDX: 16,
    eyeR: 8,
    mouthY: 106,
    mouthW: 9,
    pupil: "#173420",
    line: "#1f4a2c",
    mouthFill: "#b8394d",
    browY: 70,
  })}
</g>
<path d="M 60 146 L 140 146 L 132 186 L 68 186 Z" fill="${POT}"/>
<rect x="54" y="140" width="92" height="14" rx="4" fill="${RIM}"/>
${fx({ x: 154, y: 30 })}
`,
};
