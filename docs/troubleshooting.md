# Troubleshooting

### "useMascot() must be used inside <MascotProvider>"

`useMascot()` reads the mascot from a provider. Wrap your app (or the part
that uses it) in `<MascotProvider>`. A lone `<ContextMascot />` works for
display but doesn't provide a mascot to hooks.

### I can't see the mascot

- Check `hidden` isn't `true`.
- Another element may be on top. Raise `zIndex`, or move it with `offset`.
- With `position={{ element: "#id" }}`, the mascot is hidden until that element exists.
- During SSR the mascot is invisible until hydration; if your app never hydrates, it stays hidden.

### The eyes don't follow the cursor

- `trackCursor` may be `false`.
- Your OS has "reduce motion" turned on: tracking stays off by design.
- Tracking pauses while the mascot is off screen or the tab is hidden.

### The eyes feel too slow or too twitchy

Set `trackingSpeed`: `"slow"`, `"normal"`, `"fast"` or `"instant"`. Lower
`trackingIntensity` for smaller eye movements.

### My form doesn't trigger reactions

- Add `enableFormAwareness`.
- Only fields **inside** a `<form>` count. Password fields and fields with
  `data-tinypal-ignore` are always ignored.
- Custom inputs that don't fire `focusin` / `input` events need explicit
  `mascot.emit("form:...")` calls.

### The mascot keeps showing loading after a submit

The browser can't know your server's answer. Use `trackSubmit()`, or call
`mascot.emit("form:success")` / `mascot.emit("form:error")` when you know the
result.

### A 404 shows a sad mascot but it's expected

Configure what counts as an error:
`createMascotFetch(mascot, { isError: (r) => r.status >= 500 })`, and the same
`isError` option for `attachAxios`.

### The mascot falls asleep too soon / too late

`idle={{ sleepyAfter: 60_000, sleepAfter: 120_000 }}`, or
`enableIdleAnimation={false}`.

### Next.js: "You're importing a component that needs useState..."

Put `MascotProvider` and any component that calls `useMascot()` in a file with
`"use client"`. See [Next.js](nextjs.md).

### Speech bubbles are read out by screen readers / aren't read

They are hidden from assistive tech by default because the mascot is
decorative. Opt in with `announceMessages`.

### The celebration stops immediately after a successful submit

With `enableFormAwareness`, calling `form.reset()` fires the form's `reset`
event, which means `form:reset` and returns the mascot to idle. Reset the form
later (for example after a short delay, or when the user starts a new entry).
