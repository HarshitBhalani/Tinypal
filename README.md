# Context Mascot (npm package: `tinypal`)

An interactive website companion SDK. A small SVG mascot that understands what is happening on your site (forms, API calls, inactivity, cursor) and reacts to it.

> Status: **in development**. Core engine, 8 characters, form/API adapters and the React SDK are built and tested. Website, docs and npm publishing are in progress.

## What it does

| Website event                 | Mascot reaction                   |
| ----------------------------- | --------------------------------- |
| Form focused                  | curious                           |
| User typing                   | thinking                          |
| Validation error              | confused                          |
| Form submitting / API loading | loading                           |
| Success                       | happy / celebrating               |
| Failure                       | sad                               |
| Form reset                    | idle                              |
| No activity (configurable)    | sleepy, then sleeping             |
| Activity after sleeping       | wakes up surprised                |
| Cursor moves                  | eyes (and optionally head) follow |

## Planned usage

```tsx
import { ContextMascot, useMascot } from "tinypal";

<ContextMascot
  character="robot"
  position="bottom-right"
  size={150}
  trackCursor
  enableFormAwareness
  enableIdleAnimation
/>;

const mascot = useMascot();
mascot.play("happy");
mascot.say("Your form was submitted!");
mascot.emit("api:loading");
```

The API may be refined during implementation. Docs will always match what is actually built.

## Core concepts

- **Expressions (8):** idle, happy, curious, thinking, surprised, confused, sad, sleepy
- **Extra states:** loading, celebrating, blinking, looking-left, looking-right, waving, sleeping
- **Characters (8):** robot, cat, dog, fox, panda, alien, ghost, bunny. Original SVG art, one shared expression interface, extensible with custom characters.
- **Events:** `form:*` and `api:*` (start, loading, success, error, network-error, cancelled)
- **Positioning:** 6 presets, custom coordinates, attach to a DOM element, draggable, mobile responsive
- **Messages:** speech bubbles, custom per-event messages, i18n architecture, no-repeat logic

## Principles

- Core engine is framework-independent. React is a thin integration layer.
- Never read or store password or sensitive field values.
- No analytics, no network requests, SSR safe (Next.js), tree-shakable.
- Respects `prefers-reduced-motion`; mascot is decorative (`aria-hidden`) and can be muted/hidden.
- No claim of auto-detecting every validation library: explicit event APIs are provided.
- HTTP 4xx/5xx handling is developer-configurable.

## Tech stack

React, TypeScript, Vite, Tailwind CSS, CSS/SVG animation (Framer Motion only if needed), Zustand only where needed, tsup, Vitest, ESLint, Prettier, npm workspaces.

## Planned structure

```
context-mascot/
  apps/
    website/          landing page, gallery, docs links
    playground/       live playground using the real engine
  packages/
    core/             engine, events, state-machine, expressions, positioning, tracking, personality
    react/            ContextMascot, MascotProvider, useMascot
    characters/       robot cat dog fox panda alien ghost bunny
    adapters/         native-form, react-hook-form, formik, fetch, axios
  examples/           basic-react, form-validation, api-interactions, nextjs-example
  docs/
```

Publishing decision (open): publish as one package `tinypal` with subpath exports (`tinypal`, `tinypal/core`, `tinypal/characters`, `tinypal/adapters/*`), with the workspace packages bundled by tsup.

## Phased plan

Each phase ends with typecheck, lint and tests passing before moving on.

1. **Inspect and scaffold:** workspace, tsconfig, ESLint, Prettier, Vitest
2. **Architecture and workspace config:** package boundaries, exports map
3. **Core engine:** event bus, state machine, typed events
4. **Expression and animation system:** the 8 expressions plus extra states
5. **First character (robot):** fully working, defines the character interface
6. **Remaining 7 characters**
7. **Cursor tracking and positioning**
8. **Form awareness:** native forms, React Hook Form and Formik adapters
9. **API awareness:** fetch and Axios adapters, manual `emit`
10. **Idle, sleep, wake**
11. **React layer:** `ContextMascot`, `MascotProvider`, `useMascot`
12. **Landing page**
13. **Live playground** on the real engine
14. **Docs and examples**
15. **Tests and performance pass**
16. **npm publish preparation** (`npm pack` validation; **no publish without explicit approval**)

## Before publishing to npm (your checklist)

1. Create an npm account at npmjs.com and verify your email.
2. Enable 2FA (required to publish).
3. Decide the package name. Checked on 2026-11-07: `tinypal` is unpublished (404). Re-check right before publishing. A scoped name like `@yourname/tinypal` is the fallback.
4. Create a GitHub repository (needed for real repo/homepage/bugs links in `package.json` and the footer).
5. Choose a license (MIT recommended) and the name to appear in it.
6. Later: `npm login`, then `npm publish --access public` after final approval.

## License

To be decided (MIT proposed).
