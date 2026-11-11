"use client";

import { MascotProvider } from "tinypal";
import type { ReactNode } from "react";

/**
 * MascotProvider uses hooks and browser events, so it lives in a client
 * component. It still renders on the server; the mascot stays hidden until
 * hydration, so there is no unstyled flash.
 */
export function Providers({ children }: { children: ReactNode }) {
  return (
    <MascotProvider character="fox" position="bottom-right" theme="auto" enableFormAwareness>
      {children}
    </MascotProvider>
  );
}
