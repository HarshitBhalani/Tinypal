# Inactivity and sleep

|                               | Default | Mascot                                                              |
| ----------------------------- | ------- | ------------------------------------------------------------------- |
| Visitor active                |         | idle / whatever is happening                                        |
| No activity for `sleepyAfter` | 30 s    | sleepy, "Is anyone there?"                                          |
| No activity for `sleepAfter`  | 60 s    | asleep (eyes closed, zzz)                                           |
| Activity after dozing         |         | surprised for `wakeDuration` (1.5 s), "Oh! You're back!", then idle |

Activity means pointer movement, clicks, key presses, scrolling, the mouse
wheel or touch.

```tsx
<ContextMascot
  enableIdleAnimation // default true
  idle={{ sleepyAfter: 20_000, sleepAfter: 45_000, wakeDuration: 1000 }}
/>
```

## It won't fall asleep mid-task

If the mascot is busy (loading, celebrating, sad...) when the timer fires, it
waits until it is idle again. And if something else changes the mascot while it
is sleepy, it won't play the "waking up" surprise afterwards.

## Messages

Change the sleepy and wake-up lines with the `sleepy` and `wake`
[message keys](messages.md).

## Without React

```ts
import { createMascot, watchIdle } from "tinypal";

const mascot = createMascot();
const stop = watchIdle(mascot, { sleepyAfter: 30_000, sleepAfter: 60_000 });
// later
stop();
```
