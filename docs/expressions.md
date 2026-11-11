# Expressions and animations

## Expressions

`idle`, `happy`, `curious`, `thinking`, `surprised`, `confused`, `sad`, `sleepy`

## Animations (actions)

`loading`, `celebrating`, `blinking`, `looking-left`, `looking-right`, `waving`, `sleeping`

An animation is layered on top of the current expression. For example
`play("waving")` while happy gives a happy face that waves. `sleeping` also sets
the `sleepy` face.

## `play()`

```ts
mascot.play("happy"); // stays happy until something else happens
mascot.play("surprised", { duration: 1500 }); // back to idle after 1.5 s
mascot.play("loading"); // spinner until you play or emit something else
mascot.play("idle"); // reset
```

A newer `play()` or event always cancels a pending "back to idle" timer, so an
old timer can never overwrite a newer reaction.

## Events and the reaction table

`emit()` reports what happened; the mascot looks up its reaction:

| Event                            | Expression | Animation   | Back to idle after |
| -------------------------------- | ---------- | ----------- | ------------------ |
| `form:focus`                     | curious    |             |                    |
| `form:input`                     | thinking   |             |                    |
| `form:invalid`                   | confused   |             | 3 s                |
| `form:submit`                    | thinking   | loading     |                    |
| `form:success`                   | happy      | celebrating | 3 s                |
| `form:error`                     | sad        |             | 4 s                |
| `form:reset`                     | idle       |             |                    |
| `api:start`, `api:loading`       | thinking   | loading     |                    |
| `api:success`                    | happy      | celebrating | 3 s                |
| `api:error`, `api:network-error` | sad        |             | 4 s                |
| `api:cancelled`                  | idle       |             |                    |

Change any reaction with `reactions`:

```tsx
<ContextMascot
  reactions={{
    "api:error": { expression: "confused", revertAfter: 2000 },
    "form:success": { expression: "happy", action: "waving", revertAfter: 2500 },
  }}
/>
```

## Reading the current state

```tsx
import { useMascotState } from "tinypal";

const { expression, action } = useMascotState();
```

Outside React: `mascot.state` and `mascot.on("change", ({ state, previous }) => ...)`.

## Reduced motion

Visitors with `prefers-reduced-motion: reduce` see expressions change without
animation (no bobbing, blinking, spinning or confetti). Force this for everyone
with `reducedMotion`.
