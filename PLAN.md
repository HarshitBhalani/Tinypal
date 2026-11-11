# Implementation Plan: tinypal (Context Mascot)

Defaults assumed until you say otherwise: **one npm package `tinypal` with subpath exports**, **MIT license**, npm workspaces monorepo.

## Architecture decisions

1. **One published package, many internal workspaces.** `packages/core`, `react`, `characters`, `adapters` are separate workspaces for clean boundaries. `tsup` bundles them into a single `tinypal` package with subpath exports: `tinypal` (React API), `tinypal/core`, `tinypal/characters`, `tinypal/adapters/*`. Users install one thing; bundles stay tree-shakable.
2. **Core is framework-free.** It is a plain TypeScript engine: typed event bus, state machine, timers. React only subscribes to it.
3. **Characters are data plus SVG.** A character is a typed object (SVG parts, anchor points for eyes/mouth/head, per-expression poses). Expressions are CSS classes and CSS variables, so no animation library is needed.
4. **No React re-renders for hot paths.** Cursor tracking runs in requestAnimationFrame and writes CSS variables or transforms directly on the DOM.
5. **Privacy by design.** Form adapters only listen to event types (focus, input, invalid, submit). They never read `value`. Password fields are ignored entirely.
6. **Playground uses the real engine**, imported from the workspace packages, with no mock logic.

## Core API (draft)

```ts
type Expression =
  "idle" | "happy" | "curious" | "thinking" | "surprised" | "confused" | "sad" | "sleepy";
type Action =
  "loading" | "celebrating" | "blinking" | "looking-left" | "looking-right" | "waving" | "sleeping";

const mascot = createMascot({
  character,
  trackCursor,
  idle: { sleepyAfter, sleepAfter },
  messages,
});
mascot.play("happy");
mascot.say("Done!");
mascot.emit("api:success");
mascot.on("expression", cb);
mascot.destroy();
```

State machine: events map to expressions via a configurable reaction table (the table in README). Priority rules so e.g. `loading` is not overridden by idle timers. Sleep/wake: activity resets timers, wake from sleeping goes to `surprised`, then `idle`.

## Phases, deliverables and exit checks

| #   | Phase                    | Deliverables                                                                                                                               | Exit check                                                        |
| --- | ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------- |
| 1   | Scaffold                 | root `package.json` workspaces, `tsconfig.base`, ESLint, Prettier, Vitest, `.gitignore`, LICENSE                                           | `npm install`, `npm run typecheck`, `npm run lint` pass           |
| 2   | Architecture             | package skeletons, tsup config, exports map, shared types                                                                                  | all workspaces build empty                                        |
| 3   | Core engine              | event bus, state machine, reaction table, timers with cleanup                                                                              | unit tests: expression changes, event dispatch, cleanup           |
| 4   | Expression system        | 8 expressions plus 7 extra states, shared CSS animation layer, reduced-motion support                                                      | tests for transitions and priorities                              |
| 5   | Robot character          | full SVG, all states, character interface finalized                                                                                        | visual check in a scratch page                                    |
| 6   | 7 more characters        | cat, dog, fox, panda, alien, ghost, bunny, each with distinct silhouette                                                                   | all 8 render every state; light/dark check                        |
| 7   | Tracking and positioning | rAF cursor tracking (intensity, speed), pause when hidden/tab inactive; 6 presets, custom coords, attach to element, draggable, responsive | tests for positioning math; manual check                          |
| 8   | Form awareness           | native form adapter, React Hook Form and Formik adapters, explicit form event API                                                          | tests with jsdom; confirm no value reads                          |
| 9   | API awareness            | `api:*` events, fetch and Axios adapters with configurable status handling                                                                 | tests with mocked fetch/axios                                     |
| 10  | Idle/sleep/wake          | configurable timers, wake-surprise                                                                                                         | fake-timer tests                                                  |
| 11  | React layer              | `ContextMascot`, `MascotProvider`, `useMascot`, SSR-safe, speech bubble, i18n messages with no-repeat                                      | RTL tests; render in Next.js example                              |
| 12  | Landing page             | hero with live mascot, gallery, how-it-works, event demos, code tabs with copy, features, install, footer with placeholder links           | responsive check, Lighthouse sanity                               |
| 13  | Playground               | character, size, position, tracking, expression buttons, sleep/wake, message editor, all on the real engine                                | every control verified manually                                   |
| 14  | Docs and examples        | docs for each topic in the spec, 4 examples (basic-react, form-validation, api-interactions, nextjs)                                       | every doc snippet compiles against real API                       |
| 15  | Tests and perf           | coverage of the list in the spec, bundle size check, listener-leak test                                                                    | `npm test` green; size budget noted                               |
| 16  | Publish prep             | package.json, exports, `.d.ts`, ESM+CJS, README, CHANGELOG, `npm pack` inspection                                                          | `npm pack --dry-run` clean. **No publish without your approval.** |

## Order of work and reporting

I work one phase at a time. After each phase I report files created, features done, commands run and results, then wait for your go-ahead before the next major phase.

## What I need from you

- Confirm: single package with subpath exports, and MIT.
- Folder name: I tried to rename `context-mascot` to `tinypal` but Windows says the folder is in use (likely open in your editor). Close the README tab (or the folder in VS Code) and rename it, or tell me to proceed under the current name.
- Later (not now): npm account with 2FA and a GitHub repo, before Phase 16.
