# Getting started

## Install

```bash
npm install tinypal
```

tinypal needs React 18 or newer. It has no other runtime dependencies.

## Your first mascot

```tsx
import { ContextMascot } from "tinypal";

export default function App() {
  return (
    <>
      <YourApp />
      <ContextMascot character="robot" position="bottom-right" />
    </>
  );
}
```

That's enough for a mascot that follows the cursor, waves when clicked, and
gets sleepy when the visitor is inactive.

## Controlling it from your components

Wrap your app in `MascotProvider`. Any component below it can get the mascot
with `useMascot()`:

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
      mascot.say("Something went wrong. Please try again.");
    }
  };

  return <button onClick={save}>Save</button>;
}

export default function App() {
  return (
    <MascotProvider character="cat" position="bottom-right">
      <SaveButton />
    </MascotProvider>
  );
}
```

`MascotProvider` renders the mascot for you. Pass `showMascot={false}` if you
want to place `<ContextMascot />` yourself; inside a provider it shows the
provider's mascot.

## Reacting to events instead of calling `play()`

Rather than picking expressions yourself, you can report what happened and let
the mascot choose a reaction:

```ts
mascot.emit("api:loading"); // thinking + loading spinner
mascot.emit("api:success"); // happy + celebrating + a success message
mascot.emit("api:error"); // sad + an error message
```

Adapters can emit these events for you:

- [Form awareness](forms.md): `enableFormAwareness`, `trackSubmit`, React Hook Form, Formik
- [API awareness](api.md): `createMascotFetch`, `attachAxios`

## Next steps

- Pick a [character](characters.md)
- Change where it sits with [positioning](positioning.md)
- Write your own [messages](messages.md)
