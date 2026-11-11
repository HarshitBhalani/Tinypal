import { face, fx } from "@tinypal/core";
import type { CharacterDefinition } from "@tinypal/core";

const BLUE = "#6ec3ff";
const SHADE = "#4aa3e6";
const SWEATER = "#e5484d";
const RIB = "#c93a3f";
const GOLD = "#d9a74a";
const TEDDY = "#e9c2a6";
const TEDDY_DARK = "#c99a7c";

/** Little sky-blue jelly-bean sidekick with a monocle, a red sweater and a teddy bunny. */
export const pip: CharacterDefinition = {
  id: "pip",
  name: "Pip",
  description: "A tiny sidekick in a cosy sweater who never lets go of its teddy.",
  accent: "#ffb020",
  body: `
<ellipse cx="100" cy="186" rx="44" ry="5" fill="rgba(0,0,0,.12)"/>
<ellipse cx="86" cy="179" rx="12" ry="7" fill="#2b3a55"/>
<ellipse cx="114" cy="179" rx="12" ry="7" fill="#2b3a55"/>
<g class="tp-wave-arm" style="transform-origin:146px 122px">
  <ellipse cx="150" cy="136" rx="8" ry="16" fill="${BLUE}" stroke="${SHADE}" stroke-width="2"/>
</g>
<g class="tp-head">
  <path d="M 92 34 Q 88 20 94 14 M 100 33 Q 100 18 106 12 M 108 34 Q 112 22 118 20" fill="none" stroke="${SHADE}" stroke-width="3" stroke-linecap="round"/>
  <rect x="56" y="32" width="88" height="142" rx="44" fill="${BLUE}" stroke="${SHADE}" stroke-width="3"/>
  <ellipse cx="78" cy="56" rx="8" ry="14" fill="#ffffff" opacity=".35" transform="rotate(25 78 56)"/>
  <path d="M 57.5 114 L 142.5 114 L 142.5 130 Q 142.5 172.5 100 172.5 Q 57.5 172.5 57.5 130 Z" fill="${SWEATER}"/>
  <rect x="57.5" y="112" width="85" height="8" fill="${RIB}"/>
  <path d="M 100 132 L 104 141 L 114 142 L 106 148 L 109 158 L 100 152 L 91 158 L 94 148 L 86 142 L 96 141 Z" fill="#ffd84a"/>
  <circle cx="72" cy="96" r="7" fill="#ff9fb5" opacity=".55"/>
  <circle cx="128" cy="96" r="7" fill="#ff9fb5" opacity=".55"/>
  ${face({
    eyeY: 74,
    eyeDX: 18,
    eyeR: 12,
    mouthY: 100,
    mouthW: 10,
    pupil: "#1a2a44",
    line: "#1f3550",
    mouthFill: "#a33b4a",
    browY: 52,
  })}
  <circle cx="118" cy="74" r="17" fill="none" stroke="${GOLD}" stroke-width="3.5"/>
  <path d="M 134 80 Q 140 98 132 114" fill="none" stroke="${GOLD}" stroke-width="1.8" stroke-dasharray="3 2"/>
</g>
<g>
  <ellipse cx="42" cy="114" rx="4.5" ry="11" fill="${TEDDY}" transform="rotate(-15 42 114)"/>
  <ellipse cx="54" cy="113" rx="4.5" ry="11" fill="${TEDDY}" transform="rotate(12 54 113)"/>
  <ellipse cx="42" cy="114" rx="2" ry="7" fill="#f4a8b8" transform="rotate(-15 42 114)"/>
  <ellipse cx="54" cy="113" rx="2" ry="7" fill="#f4a8b8" transform="rotate(12 54 113)"/>
  <ellipse cx="49" cy="152" rx="12" ry="14" fill="${TEDDY}"/>
  <circle cx="48" cy="130" r="12" fill="${TEDDY}"/>
  <circle cx="44" cy="128" r="1.8" fill="#3a2414"/>
  <circle cx="52" cy="128" r="1.8" fill="#3a2414"/>
  <circle cx="48" cy="133" r="1.6" fill="${TEDDY_DARK}"/>
  <path d="M 46 160 l 0 4 M 52 160 l 0 4" stroke="${TEDDY_DARK}" stroke-width="2" stroke-linecap="round"/>
  <ellipse cx="62" cy="146" rx="8" ry="15" fill="${BLUE}" stroke="${SHADE}" stroke-width="2" transform="rotate(35 62 146)"/>
</g>
${fx({ x: 156, y: 30 })}
`,
};
