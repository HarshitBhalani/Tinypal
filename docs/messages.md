# Messages and speech bubbles

## Saying something

```ts
mascot.say("Welcome back!"); // hides after messageDuration (default 3.5 s)
mascot.say("Uploading...", { duration: 0 }); // stays until the next message
mascot.say(null); // hide now
```

## Automatic messages

With `autoMessages` (on by default), events speak for themselves:
`api:success` says "You did it!", `api:error` says "Oops! Something went
wrong.", inactivity says "Is anyone there?", and so on.

Turn it off with `autoMessages={false}`. `say()` still works.

## Custom messages

```tsx
<ContextMascot
  messages={{
    success: "Awesome! Everything worked!",
    error: "Oops! Something went wrong.",
    loading: "Give me a moment...",
    sleepy: "Is anyone there?",
  }}
/>
```

Keys, from most to least specific:

| Key                                                                    | Used for                            |
| ---------------------------------------------------------------------- | ----------------------------------- |
| an event name, e.g. `"api:success"`, `"form:invalid"`                  | only that event                     |
| `success`, `error`, `loading`, `invalid`, `network-error`, `cancelled` | every event of that kind            |
| `sleepy`, `wake`                                                       | inactivity                          |
| an expression, e.g. `"happy"`, `"sad"`                                 | fallback for success / error events |

## Avoiding repetition

Give an array and the mascot rotates through it, never saying the same line
twice in a row:

```tsx
messages={{
  success: ["Nice!", "Done and dusted.", "Look at you go!"],
}}
```

## Languages

English (`en`) and Hindi (`hi`) are built in. Choose with `locale`; missing
keys fall back to English.

```tsx
<ContextMascot locale="hi" />
```

Add or replace a language with `locales`:

```tsx
<ContextMascot
  locale="es"
  locales={{
    es: {
      success: "¡Lo lograste!",
      error: "¡Uy! Algo salió mal.",
      loading: "Un momento...",
    },
  }}
/>
```

`messages` always wins over `locales`, whatever the locale.

## Bubble options

| Prop               | Default |                                                                                                               |
| ------------------ | ------- | ------------------------------------------------------------------------------------------------------------- |
| `showSpeechBubble` | `true`  | Hide all bubbles                                                                                              |
| `messageDuration`  | `3500`  | ms before a bubble hides                                                                                      |
| `announceMessages` | `false` | Read bubbles aloud to screen-reader users (`role="status"`). Off by default because the mascot is decorative. |

## Reading the current message

```ts
const text = useMascotMessage(); // string | null
```
