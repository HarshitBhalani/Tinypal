import { face, fx } from "@tinypal/core";
import type { CharacterDefinition } from "@tinypal/core";

const BLACK = "#1c1c24";
const WHITE = "#ffffff";
const EDGE = "#e3e6ec";

/** Round black-and-white panda with eye patches and a chubby belly. */
export const panda: CharacterDefinition = {
  id: "panda",
  name: "Panda",
  description: "A chubby, calm panda who loves a good snack.",
  accent: "#3fae6a",
  body: `
<ellipse cx="100" cy="186" rx="46" ry="5" fill="rgba(0,0,0,.12)"/>
<ellipse cx="80" cy="176" rx="15" ry="10" fill="${BLACK}"/>
<ellipse cx="120" cy="176" rx="15" ry="10" fill="${BLACK}"/>
<ellipse cx="100" cy="148" rx="40" ry="34" fill="${WHITE}" stroke="${EDGE}" stroke-width="2"/>
<ellipse cx="60" cy="146" rx="12" ry="22" fill="${BLACK}" transform="rotate(10 60 146)"/>
<g class="tp-wave-arm" style="transform-origin:142px 130px">
  <ellipse cx="140" cy="146" rx="12" ry="22" fill="${BLACK}" transform="rotate(-10 140 146)"/>
</g>
<g class="tp-head">
  <circle cx="58" cy="42" r="17" fill="${BLACK}"/>
  <circle cx="142" cy="42" r="17" fill="${BLACK}"/>
  <ellipse cx="100" cy="80" rx="52" ry="46" fill="${WHITE}" stroke="${EDGE}" stroke-width="2"/>
  <ellipse cx="78" cy="80" rx="14" ry="19" fill="${BLACK}" transform="rotate(25 78 80)"/>
  <ellipse cx="122" cy="80" rx="14" ry="19" fill="${BLACK}" transform="rotate(-25 122 80)"/>
  <circle cx="62" cy="100" r="7" fill="#ffb3c1" opacity=".5"/>
  <circle cx="138" cy="100" r="7" fill="#ffb3c1" opacity=".5"/>
  ${face({
    eyeY: 78,
    eyeDX: 22,
    eyeR: 8.5,
    mouthY: 101,
    mouthW: 10,
    pupil: "#111118",
    line: BLACK,
    eyeLine: "#ffffff",
    mouthFill: "#a33b4a",
    browY: 54,
  })}
  <ellipse cx="100" cy="92" rx="8" ry="5.5" fill="${BLACK}"/>
</g>
${fx({ x: 152, y: 26 })}
`,
};
