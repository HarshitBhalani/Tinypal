# tinypal documentation

tinypal adds a small animated companion to your website. It reacts to what is
happening on the page: forms being filled in, requests loading or failing, the
visitor going quiet, and the cursor moving around.

## Guides

1. [Getting started](getting-started.md): install, first mascot, the provider
2. [Characters](characters.md): the 19 built-in characters
3. [Expressions and animations](expressions.md): `play()`, durations, reaction table
4. [Cursor tracking](cursor-tracking.md): eye/head following, speed, intensity
5. [Form awareness](forms.md): native forms, React Hook Form, Formik
6. [API awareness](api.md): `fetch`, Axios, manual `api:*` events
7. [Messages and speech bubbles](messages.md): `say()`, custom messages, languages
8. [Positioning](positioning.md): corners, coordinates, next to an element, dragging
9. [Inactivity and sleep](idle.md): sleepy, asleep, waking up
10. [React components and hooks](react.md): `ContextMascot`, `MascotProvider`, hooks
11. [Next.js](nextjs.md): App Router and SSR
12. [Custom characters](custom-characters.md): draw your own
13. [API reference](api-reference.md): every export and type
14. [Troubleshooting](troubleshooting.md)

## Principles

- **Small and dependency-free at runtime.** Characters are inline SVG; there are no images or fonts to host.
- **Private.** No analytics, no network requests, and form adapters never read field values.
- **Accessible.** The mascot is hidden from screen readers, respects `prefers-reduced-motion`, and can be hidden.
- **Framework-independent core.** The React components are a thin layer over a plain TypeScript engine.
