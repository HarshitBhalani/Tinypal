import { face, fx } from "@tinypal/core";
import type { CharacterDefinition } from "@tinypal/core";

const JELLY = "#5ee0c2";
const EDGE = "#36b597";
const INK = "#1d4d43";

/** Squishy mint jelly blob with little nub arms. */
export const blob: CharacterDefinition = {
  id: "blob",
  name: "Blob",
  description: "A squishy jelly friend who wobbles at everything.",
  accent: "#ff7a9c",
  body: `
<ellipse cx="100" cy="182" rx="56" ry="6" fill="rgba(0,0,0,.12)"/>
<ellipse cx="34" cy="130" rx="10" ry="15" fill="${JELLY}" stroke="${EDGE}" stroke-width="3" transform="rotate(25 34 130)"/>
<g class="tp-wave-arm" style="transform-origin:160px 122px">
  <ellipse cx="166" cy="130" rx="10" ry="15" fill="${JELLY}" stroke="${EDGE}" stroke-width="3" transform="rotate(-25 166 130)"/>
</g>
<g class="tp-head">
  <path d="M 40 172 Q 28 122 52 82 Q 72 40 100 40 Q 128 40 148 82 Q 172 122 160 172 Q 130 182 100 177 Q 70 182 40 172 Z" fill="${JELLY}" stroke="${EDGE}" stroke-width="3" stroke-linejoin="round"/>
  <ellipse cx="72" cy="70" rx="10" ry="16" fill="#ffffff" opacity=".45" transform="rotate(30 72 70)"/>
  <circle cx="64" cy="122" r="8" fill="#ff9fb5" opacity=".5"/>
  <circle cx="136" cy="122" r="8" fill="#ff9fb5" opacity=".5"/>
  ${face({
    eyeY: 100,
    eyeDX: 22,
    eyeR: 12,
    mouthY: 126,
    mouthW: 12,
    line: INK,
    pupil: "#173a33",
    mouthFill: "#c2416b",
  })}
</g>
${fx({ x: 156, y: 40 })}
`,
};
