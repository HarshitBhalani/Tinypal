# React components and hooks

## `<ContextMascot>`

The drop-in component.

- Inside a `<MascotProvider>` it shows the provider's mascot.
- Outside one (or with `standalone`) it creates and owns its own.
- With `mascot={...}` it shows an engine you created.

```tsx
<ContextMascot character="robot" position="bottom-right" size={150} />
```

## `<MascotProvider>`

Shares one mascot with every `useMascot()` below it, and renders it.

```tsx
<MascotProvider character="cat" position="bottom-right" enableFormAwareness>
  <App />
</MascotProvider>
```

`showMascot={false}` renders only the context, so you can place
`<ContextMascot />` (or several) yourself.

Both components accept every option in the [API reference](api-reference.md#props).

## Hooks

### `useMascot()`

The provider's mascot. Throws a clear error outside a `MascotProvider`.

```ts
const mascot = useMascot();
mascot.play("happy");
mascot.say("Hi!");
mascot.emit("api:success");
```

### `useMascotState(mascot?)`

`{ expression, action }`, re-rendering when it changes.

### `useMascotMessage(mascot?)`

The current speech bubble text, or `null`.

### `useCreateMascot(options?)`

Create an independent mascot owned by the component (destroyed on unmount).
Use it for several mascots on one page:

```tsx
function TwoPals() {
  const left = useCreateMascot();
  const right = useCreateMascot({ autoMessages: false });
  return (
    <>
      <ContextMascot mascot={left} character="cat" position="bottom-left" />
      <ContextMascot mascot={right} character="dog" position="bottom-right" />
      <button onClick={() => left.play("happy", { duration: 2000 })}>Cheer the cat</button>
    </>
  );
}
```

## Behaviour notes

- Expression changes and cursor movement do not re-render your components.
- Works under `<StrictMode>`.
- Unmounting removes every listener and timer.
- Clicking the mascot makes it wave; override with `onClick={(mascot, event) => ...}`.

## Without React

The engine works on its own:

```ts
import { createMascot, renderCharacter, applyState, ensureStyles, characters } from "tinypal";

ensureStyles();
const mascot = createMascot();
host.innerHTML = renderCharacter(characters.robot, { size: 150 });
const svg = host.querySelector("svg")!;
mascot.on("change", ({ state }) => applyState(svg, state));
mascot.play("happy");
```
