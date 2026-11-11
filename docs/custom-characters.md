# Custom characters

A character is a plain object: an id, a name, an accent colour, and SVG markup
for a **200 × 200** viewBox. The `face()` and `fx()` helpers give it every
expression and animation for free.

```tsx
import { ContextMascot, defineCharacter, face, fx } from "tinypal";

const tomato = defineCharacter({
  id: "tomato",
  name: "Tomato",
  description: "A juicy little tomato.",
  accent: "#3fae6a", // colour of the ?, !, zzz and spinner
  body: `
    <ellipse cx="100" cy="186" rx="44" ry="5" fill="rgba(0,0,0,.12)"/>

    <!-- optional: an arm that animates when "waving" -->
    <g class="tp-wave-arm" style="transform-origin:150px 110px">
      <ellipse cx="156" cy="124" rx="9" ry="16" fill="#e5484d"/>
    </g>

    <!-- everything in tp-head tilts with headTracking -->
    <g class="tp-head">
      <circle cx="100" cy="112" r="64" fill="#e5484d"/>
      <path d="M 84 52 L 100 40 L 116 52 L 100 58 Z" fill="#3fae6a"/>
      ${face({ eyeY: 100, eyeDX: 22, eyeR: 11, mouthY: 128, mouthW: 12 })}
    </g>

    ${fx({ x: 156, y: 36 })}
  `,
});

<ContextMascot character={tomato} />;
```

## Rules

- Draw inside `0 0 200 200`. The mascot is scaled to `size`.
- Wrap the head (and face) in `<g class="tp-head">` so `headTracking` can tilt it.
- `<g class="tp-wave-arm" style="transform-origin:Xpx Ypx">` is the part that
  waves. Set the origin to the shoulder.
- Include `fx()` once, near the top right of the head, for the `?`, `!`,
  `zzz`, thinking dots, loading spinner and confetti.
- Keep the artwork flat SVG: no `<script>`, no external images.

> **Security:** the `body` string is inserted into the page as-is, so treat it
> like code. Only use SVG you wrote or fully trust. Never build `body` from user
> input (uploads, form fields, URL parameters, database content written by
> users), because an attacker could inject scripts (XSS). The `id` and `accent`
> values are escaped, but `body` is not.

## `face()` options

| Option                     |                                                                       | Default                 |
| -------------------------- | --------------------------------------------------------------------- | ----------------------- |
| `eyeY`, `eyeDX`, `eyeR`    | eye centre height, half the distance between eyes, eye radius         | required                |
| `mouthY`, `mouthW`         | mouth centre height and width                                         | required                |
| `cx`                       | horizontal centre                                                     | `100`                   |
| `browY`                    | eyebrow height                                                        | `eyeY - eyeR * 1.7`     |
| `sclera`, `pupil`, `glint` | eye colours                                                           | white, dark navy, white |
| `line`                     | mouth and eyebrow stroke                                              | dark navy               |
| `eyeLine`                  | stroke for happy (^ ^) and closed eyes, when eyes sit on a dark patch | `line`                  |
| `mouthFill`                | inside of open mouths                                                 | dark red                |
| `tear`                     | sad tear colour                                                       | light blue              |

Tip: `eyeDX: 0` puts both eyes in the same spot, giving a one-eyed character.

## Checking your character

Render it in every state on one page:

```tsx
import { useEffect } from "react";
import { EXPRESSIONS, ACTIONS, ContextMascot, useCreateMascot } from "tinypal";

function Sheet() {
  return [...EXPRESSIONS, ...ACTIONS].map((name) => <Cell key={name} name={name} />);
}

function Cell({ name }) {
  const m = useCreateMascot();
  useEffect(() => m.play(name), [m, name]);
  return <ContextMascot mascot={m} character={tomato} position="inline" size={120} />;
}
```
