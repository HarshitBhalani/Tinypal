# Changelog

All notable changes to this project are documented here. This project follows
[Semantic Versioning](https://semver.org/).

## 0.1.2 (2026-11-11)

### Changed

- Website link without a trailing slash.

## 0.1.1 (2026-11-11)

### Changed

- README: removed the outdated "not yet published" status, added npm, license
  and size badges and a link to the live website.
- `homepage` in package.json now points to the live website.

## 0.1.0 (2026-11-11)

First release.

### Added

- Framework-independent engine with 8 expressions, 7 animations, an event
  reaction table and a state machine with safe auto-revert timers.
- 19 original SVG characters: robot, cat, dog, fox, panda, alien, ghost, bunny,
  blob, owl, penguin, dino, mouse, monster, chick, frog, bear, cactus, pip.
- `defineCharacter`, `face()` and `fx()` for custom characters.
- Cursor tracking on a single `requestAnimationFrame` loop with speed presets
  (`slow`, `normal`, `fast`, `instant`), intensity and optional head tracking.
- Positioning: presets, coordinates, attach to an element, inline, draggable,
  responsive sizing.
- Form awareness for native forms, React Hook Form and Formik. Field values are
  never read; password fields are ignored.
- API awareness with `fetch` and Axios adapters, configurable error rules and
  aggregation of concurrent requests.
- Speech bubbles with custom messages, rotation without repeats, English and
  Hindi built in, and custom locales.
- Inactivity: sleepy, asleep, and a surprised wake-up.
- React: `ContextMascot`, `MascotProvider`, `useMascot`, `useMascotState`,
  `useMascotMessage`, `useCreateMascot`. SSR-safe; works under StrictMode.
- `tinypal/core` entry without React.

### Security

- `renderCharacter` escapes attribute values (`id`, `accent`, expression,
  action, theme), so a character colour taken from user settings cannot inject
  HTML or extra CSS.
- Documented that custom character `body` SVG is inserted as-is and must only
  come from trusted sources.
