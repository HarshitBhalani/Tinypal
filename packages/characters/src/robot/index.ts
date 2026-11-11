import { face, fx } from "@tinypal/core";
import type { CharacterDefinition } from "@tinypal/core";

const METAL = "#cfdcf0";
const SHADE = "#9db0d0";
const DARK = "#2b3a55";
const SCREEN = "#0f1a2e";
const CYAN = "#7dfcff";

/** Boxy robot with a glowing LED-screen face and an antenna. */
export const robot: CharacterDefinition = {
  id: "robot",
  name: "Robot",
  description: "A friendly helper bot with a glowing LED face.",
  accent: "#ff8a3d",
  body: `
<ellipse cx="100" cy="186" rx="46" ry="5" fill="rgba(0,0,0,.12)"/>
<rect x="76" y="168" width="17" height="15" rx="6" fill="${DARK}"/>
<rect x="107" y="168" width="17" height="15" rx="6" fill="${DARK}"/>
<rect x="62" y="116" width="76" height="58" rx="20" fill="${METAL}" stroke="${SHADE}" stroke-width="3"/>
<rect x="78" y="130" width="44" height="28" rx="10" fill="${SCREEN}"/>
<circle cx="90" cy="144" r="4" fill="${CYAN}"/>
<circle cx="100" cy="144" r="4" fill="#ff8a3d"/>
<circle cx="110" cy="144" r="4" fill="${CYAN}"/>
<rect x="44" y="126" width="14" height="38" rx="7" fill="${SHADE}"/>
<g class="tp-wave-arm" style="transform-origin:149px 134px">
  <rect x="142" y="126" width="14" height="38" rx="7" fill="${SHADE}"/>
</g>
<g class="tp-head">
  <line x1="100" y1="36" x2="100" y2="20" stroke="${SHADE}" stroke-width="4" stroke-linecap="round"/>
  <circle cx="100" cy="15" r="7" fill="#ff8a3d"/>
  <circle cx="98" cy="13" r="2" fill="#ffd2b3"/>
  <rect x="28" y="66" width="14" height="30" rx="6" fill="${SHADE}"/>
  <rect x="158" y="66" width="14" height="30" rx="6" fill="${SHADE}"/>
  <rect x="40" y="36" width="120" height="84" rx="28" fill="${METAL}" stroke="${SHADE}" stroke-width="3"/>
  <rect x="54" y="48" width="92" height="62" rx="18" fill="${SCREEN}"/>
  ${face({
    eyeY: 74,
    eyeDX: 22,
    eyeR: 11,
    mouthY: 92,
    mouthW: 12,
    sclera: CYAN,
    pupil: SCREEN,
    glint: "#ffffff",
    line: CYAN,
    mouthFill: "#2fb7c9",
    tear: "#7dd3fc",
  })}
</g>
${fx({ x: 150, y: 26 })}
`,
};
