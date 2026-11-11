import { createContext, useEffect, useLayoutEffect, useReducer, useRef } from "react";
import { createMascot } from "@tinypal/core";
import type { Mascot, MascotOptions } from "@tinypal/core";

export const MascotContext = createContext<Mascot | null>(null);

/** useLayoutEffect on the client, useEffect on the server (no SSR warning). */
export const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

/** Engine options that can be passed as React props. */
export type EngineProps = MascotOptions;

export const pickEngineOptions = (p: EngineProps): MascotOptions => ({
  reactions: p.reactions,
  messages: p.messages,
  locales: p.locales,
  locale: p.locale,
  autoMessages: p.autoMessages,
  messageDuration: p.messageDuration,
});

const definedOnly = (o: MascotOptions): MascotOptions =>
  Object.fromEntries(Object.entries(o).filter(([, v]) => v !== undefined)) as MascotOptions;

/**
 * Create (and own) a mascot for the component's lifetime. Survives React
 * StrictMode's mount/unmount/remount by recreating a destroyed instance.
 * Pass `skip` to not create one (when an outer mascot is used instead).
 */
export function useOwnedMascot(options: MascotOptions, skip: boolean): Mascot | null {
  const ref = useRef<Mascot | null>(null);
  const [, rerender] = useReducer((n: number) => n + 1, 0);
  // eslint-disable-next-line react-hooks/refs -- lazy init of a stable instance
  if (!skip && !ref.current) ref.current = createMascot(definedOnly(options));

  useEffect(() => {
    if (skip) return;
    if (!ref.current || ref.current.destroyed) {
      ref.current = createMascot(definedOnly(options));
      rerender();
    }
    const m = ref.current;
    return () => m.destroy();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- options are synced below
  }, [skip]);

  // Keep messages / locale / reactions in sync with props.
  useIsomorphicLayoutEffect(() => {
    if (!skip && ref.current) ref.current.configure(definedOnly(options));
  });

  // eslint-disable-next-line react-hooks/refs -- returns the stable instance
  return skip ? null : ref.current;
}

/**
 * Create an independent mascot owned by this component (destroyed on unmount).
 * Pass it to `<ContextMascot mascot={...} />` to control several mascots.
 */
export function useCreateMascot(options: MascotOptions = {}): Mascot {
  return useOwnedMascot(options, false) as Mascot;
}
