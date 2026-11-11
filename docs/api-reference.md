# API reference

Everything is exported from `tinypal`.

## Props

Accepted by `<ContextMascot>` and `<MascotProvider>`.

### Appearance

| Prop                 | Type                                      | Default   |
| -------------------- | ----------------------------------------- | --------- |
| `character`          | `CharacterId \| CharacterDefinition`      | `"robot"` |
| `size`               | `number` (px)                             | `150`     |
| `theme`              | `"light" \| "dark" \| "auto"`             | `"light"` |
| `responsive`         | `boolean`: shrink to 70% below 640px      | `true`    |
| `reducedMotion`      | `boolean`: disable all animation          | `false`   |
| `hidden`             | `boolean`: render nothing, stop listeners | `false`   |
| `className`, `style` | applied to the wrapper                    |           |

### Position

| Prop        | Type                                                                                        | Default          |
| ----------- | ------------------------------------------------------------------------------------------- | ---------------- |
| `position`  | `PositionPreset \| { top?, right?, bottom?, left? } \| { element, placement? } \| "inline"` | `"bottom-right"` |
| `offset`    | `{ x?: number; y?: number }`                                                                |                  |
| `zIndex`    | `number`                                                                                    | `9999`           |
| `draggable` | `boolean`                                                                                   | `false`          |

### Behaviour

| Prop                  | Type                                                      | Default                |
| --------------------- | --------------------------------------------------------- | ---------------------- |
| `trackCursor`         | `boolean`                                                 | `true`                 |
| `trackingSpeed`       | `"slow" \| "normal" \| "fast" \| "instant" \| number`     | `"normal"`             |
| `trackingIntensity`   | `number` 0..1                                             | `1`                    |
| `headTracking`        | `boolean`                                                 | `false`                |
| `enableFormAwareness` | `boolean \| { ignore?: string; reactToSubmit?: boolean }` | `false`                |
| `enableIdleAnimation` | `boolean`                                                 | `true`                 |
| `idle`                | `{ sleepyAfter?, sleepAfter?, wakeDuration? }` (ms)       | `30000 / 60000 / 1500` |
| `onClick`             | `(mascot, event) => void`                                 | wave                   |

### Messages and reactions

| Prop               | Type                         | Default                           |
| ------------------ | ---------------------------- | --------------------------------- |
| `messages`         | `MessageMap`                 |                                   |
| `locale`           | `string`                     | `"en"`                            |
| `locales`          | `Record<string, MessageMap>` |                                   |
| `autoMessages`     | `boolean`                    | `true`                            |
| `messageDuration`  | `number` (ms)                | `3500`                            |
| `showSpeechBubble` | `boolean`                    | `true`                            |
| `announceMessages` | `boolean`                    | `false`                           |
| `reactions`        | `Partial<ReactionTable>`     | see [expressions](expressions.md) |

### Instance

| Prop         | On               |                                    |
| ------------ | ---------------- | ---------------------------------- |
| `mascot`     | both             | use an existing engine             |
| `standalone` | `ContextMascot`  | ignore the surrounding provider    |
| `showMascot` | `MascotProvider` | render the mascot (default `true`) |
| `children`   | `MascotProvider` |                                    |

## Hooks

| Hook                        | Returns                            |
| --------------------------- | ---------------------------------- |
| `useMascot()`               | `Mascot` from the nearest provider |
| `useMascotState(mascot?)`   | `MascotState`                      |
| `useMascotMessage(mascot?)` | `string \| null`                   |
| `useCreateMascot(options?)` | a new owned `Mascot`               |

## `Mascot`

```ts
interface Mascot {
  readonly state: MascotState; // { expression, action }
  readonly message: string | null;
  readonly destroyed: boolean;
  play(name: Expression | Action, options?: { duration?: number }): void;
  emit(event: MascotEventName): void;
  say(text: string | null, options?: { duration?: number }): void;
  notify(key: string): void; // speak a configured message if autoMessages is on
  getMessage(key: string): string | undefined;
  configure(options: MascotOptions): void;
  on(event: "change", cb: (e: { state; previous }) => void): () => void;
  on(event: "event", cb: (e: { name: MascotEventName }) => void): () => void;
  on(event: "message", cb: (e: { text: string | null }) => void): () => void;
  destroy(): void;
}
```

## Functions

| Function                                   |                                       |
| ------------------------------------------ | ------------------------------------- |
| `createMascot(options?: MascotOptions)`    | create an engine                      |
| `watchIdle(mascot, options?)`              | inactivity behaviour; returns cleanup |
| `observeForms(root, mascot, options?)`     | native form adapter; returns cleanup  |
| `trackSubmit(mascot, fn)`                  | submit → success / error              |
| `rhfHandlers(mascot, onValid, onInvalid?)` | React Hook Form handlers              |
| `formikSubmit(mascot, onSubmit)`           | Formik `onSubmit` wrapper             |
| `formikInvalid(mascot, errors)`            | report a failed Formik validation     |
| `createMascotFetch(mascot, options?)`      | `fetch` wrapper                       |
| `attachAxios(instance, mascot, options?)`  | Axios interceptors; returns detach    |
| `defineCharacter(def)`                     | type-check a custom character         |
| `face(options)`, `fx(options)`             | SVG helpers for custom characters     |
| `renderCharacter(character, options?)`     | SVG string (SSR-safe)                 |

## Constants

`EXPRESSIONS`, `ACTIONS`, `MASCOT_EVENTS`, `DEFAULT_MESSAGES`,
`TRACKING_SPEEDS`, `MASCOT_CSS`, `characters`, `characterList`

## Types

```ts
type Expression =
  "idle" | "happy" | "curious" | "thinking" | "surprised" | "confused" | "sad" | "sleepy";
type Action =
  "loading" | "celebrating" | "blinking" | "looking-left" | "looking-right" | "waving" | "sleeping";
type MascotEventName =
  | "form:focus"
  | "form:input"
  | "form:invalid"
  | "form:submit"
  | "form:success"
  | "form:error"
  | "form:reset"
  | "api:start"
  | "api:loading"
  | "api:success"
  | "api:error"
  | "api:network-error"
  | "api:cancelled";
type PositionPreset =
  "bottom-right" | "bottom-left" | "top-right" | "top-left" | "center-right" | "center-left";
type MessageMap = Partial<Record<string, string | readonly string[]>>;

interface MascotOptions {
  reactions?: Partial<ReactionTable>;
  messages?: MessageMap;
  locales?: Record<string, MessageMap>;
  locale?: string;
  autoMessages?: boolean;
  messageDuration?: number;
}

interface Reaction {
  expression: Expression;
  action?: Action | null;
  revertAfter?: number; // ms
}

interface CharacterDefinition {
  id: string;
  name: string;
  description: string;
  accent: string;
  body: string; // SVG markup, 200x200 viewBox
}
```
