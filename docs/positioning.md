# Positioning

## Presets

```tsx
<ContextMascot position="bottom-right" />
```

`bottom-right` (default), `bottom-left`, `top-right`, `top-left`,
`center-right`, `center-left`. Presets sit 24px from the edges.

## Offset and z-index

```tsx
<ContextMascot position="bottom-right" offset={{ x: 0, y: 80 }} zIndex={50} />
```

Use `offset` to clear a cookie banner or chat widget. The default `zIndex` is `9999`.

## Custom coordinates

```tsx
<ContextMascot position={{ bottom: 24, right: 24 }} />
<ContextMascot position={{ top: "30%", left: "2rem" }} />
```

Numbers are pixels; strings are any CSS length.

## Next to an element

```tsx
<ContextMascot position={{ element: "#signup-form", placement: "right" }} />
```

`element` is a CSS selector or an `Element`. `placement` is `top`, `bottom`,
`left` or `right` (default). The mascot follows the element on scroll and
resize and is kept inside the viewport.

## Inline

```tsx
<div className="hero">
  <ContextMascot position="inline" size={240} />
</div>
```

Renders in normal document flow instead of fixed to the viewport, for heroes,
cards and sidebars.

## Size

`size` in pixels (default `150`). With `responsive` (default on), the mascot
shrinks to 70% on screens narrower than 640px.

## Dragging

```tsx
<ContextMascot draggable />
```

Works with mouse, touch and pen, stays inside the viewport, and a simple click
is still a click.

## Hiding

```tsx
const [hidden, setHidden] = useState(false);

<ContextMascot hidden={hidden} />
<button onClick={() => setHidden((h) => !h)}>{hidden ? "Show" : "Hide"} mascot</button>
```

While hidden, all listeners and timers stop. Giving visitors a way to hide the
mascot is a good idea.
