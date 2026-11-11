# tinypal

**Give your website a little personality.**

tinypal is a mascot SDK for React. A small animated companion sits on your page
and reacts to what is happening: it gets curious when a form is focused,
thinks while requests load, celebrates when they succeed, looks sad when they
fail, follows the cursor with its eyes, and dozes off when the visitor goes
quiet.

[![npm version](https://img.shields.io/npm/v/tinypal.svg)](https://www.npmjs.com/package/tinypal)
[![license: MIT](https://img.shields.io/npm/l/tinypal.svg)](LICENSE)
[![bundle size](https://img.shields.io/bundlephobia/minzip/tinypal)](https://bundlephobia.com/package/tinypal)

**[Live demo and playground](https://tinypal-rose.vercel.app)** · [npm](https://www.npmjs.com/package/tinypal) · [Docs](docs/getting-started.md)

## Features

- **19 original characters**: robot, cat, dog, fox, panda, alien, ghost, bunny, blob, owl, penguin, dino, mouse, monster, chick, frog, bear, cactus and pip. Plus an API for your own.
- **8 expressions and 7 animations**: idle, happy, curious, thinking, surprised, confused, sad, sleepy; loading, celebrating, blinking, looking left/right, waving, sleeping.
- **Cursor tracking** with adjustable speed (`"slow"` to `"instant"`), on one `requestAnimationFrame` loop with zero React re-renders.
- **Form awareness** for native forms, React Hook Form and Formik. Never reads field values; password fields are ignored.
- **API awareness** with `fetch` and Axios adapters. You decide which status codes count as errors.
- **Speech bubbles** with custom messages, rotating lines and multiple languages.
- **Positioning** in corners, at coordinates, next to an element, inline, or draggable.
- **Inactivity**: sleepy, then asleep, then a surprised wake-up.
- **TypeScript-first**, SSR-safe (Next.js), no runtime dependencies, no analytics, respects `prefers-reduced-motion`.

## Install

```bash
npm install tinypal
```

## Usage

```tsx
import { MascotProvider, useMascot } from "tinypal";

function SaveButton() {
  const mascot = useMascot();

  const save = async () => {
    mascot.play("loading");
    try {
      await saveData();
      mascot.play("happy", { duration: 3000 });
      mascot.say("Saved!");
    } catch {
      mascot.play("sad", { duration: 3000 });
      mascot.say("Something went wrong.");
    }
  };

  return <button onClick={save}>Save</button>;
}

export default function App() {
  return (
    <MascotProvider character="cat" position="bottom-right" enableFormAwareness>
      <SaveButton />
    </MascotProvider>
  );
}
```

Or report events and let the mascot pick the reaction:

```ts
mascot.emit("api:loading");
mascot.emit("api:success");
mascot.emit("form:invalid");
```

## Documentation

Full guides and API reference are in [docs/](docs/README.md):
[getting started](docs/getting-started.md) ·
[characters](docs/characters.md) ·
[expressions](docs/expressions.md) ·
[cursor tracking](docs/cursor-tracking.md) ·
[forms](docs/forms.md) ·
[API](docs/api.md) ·
[messages](docs/messages.md) ·
[positioning](docs/positioning.md) ·
[inactivity](docs/idle.md) ·
[React](docs/react.md) ·
[Next.js](docs/nextjs.md) ·
[custom characters](docs/custom-characters.md) ·
[API reference](docs/api-reference.md) ·
[troubleshooting](docs/troubleshooting.md)

Runnable examples are in [examples/](examples/README.md).

> **Security note:** custom character artwork (`defineCharacter({ body })`) is
> inserted as raw SVG. Only use SVG you trust, never SVG built from user input.
> See [custom characters](docs/custom-characters.md).

## Works with

React 18 and 19, Next.js (App Router and Pages Router), Vite, and any React
setup. TypeScript types are included.

Try every character and option live in the
[playground](https://tinypal-rose.vercel.app/#playground).

## License

[MIT](LICENSE)
