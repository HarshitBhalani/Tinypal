# Next.js

tinypal renders on the server. The mascot's SVG is in the server HTML but stays
hidden until hydration, so there is no flash of unstyled artwork, and nothing
touches `window` during server rendering.

## App Router

`MascotProvider` uses hooks, so put it in a client component:

```tsx
// app/providers.tsx
"use client";

import { MascotProvider } from "tinypal";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <MascotProvider character="fox" position="bottom-right" theme="auto">
      {children}
    </MascotProvider>
  );
}
```

```tsx
// app/layout.tsx
import { Providers } from "./providers";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

Your pages stay server components. Components that call `useMascot()` need
`"use client"`:

```tsx
// app/save-button.tsx
"use client";

import { useMascot } from "tinypal";

export function SaveButton() {
  const mascot = useMascot();
  return <button onClick={() => mascot.emit("api:success")}>Save</button>;
}
```

## Pages Router

Wrap the app in `pages/_app.tsx`:

```tsx
import { MascotProvider } from "tinypal";

export default function MyApp({ Component, pageProps }) {
  return (
    <MascotProvider character="fox">
      <Component {...pageProps} />
    </MascotProvider>
  );
}
```

A complete App Router project is in [examples/nextjs-example](../examples/nextjs-example).
