# tinypal

**Give your website a little personality.**

tinypal is a mascot SDK for React. A small animated companion sits on your page
and reacts to what is happening: it gets curious when a form is focused,
thinks while requests load, celebrates when they succeed, looks sad when they
fail, follows the cursor with its eyes, and dozes off when the visitor goes
quiet.

> **Status:** in development. Not yet published to npm.

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

## Repository layout

```
packages/
  core/         framework-independent engine, rendering, tracking, positioning, messages
  characters/   the 19 SVG characters
  adapters/     native forms, React Hook Form, Formik, fetch, Axios
  react/        React components and hooks (published as `tinypal`)
apps/
  website/      landing page with live gallery, demos and playground
examples/       basic-react, form-validation, api-interactions, nextjs-example
docs/           documentation
```

## Development

```bash
npm install
npm run dev          # website at http://localhost:5173
npm test             # unit tests (Vitest)
npm run typecheck
npm run lint
```

## License

[MIT](LICENSE)
