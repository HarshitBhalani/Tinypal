import { useContext } from "react";
import type { ReactNode } from "react";
import type { Mascot } from "@tinypal/core";
import { MascotContext, pickEngineOptions, useOwnedMascot } from "./context";
import type { EngineProps } from "./context";
import { MascotView } from "./MascotView";
import type { MascotViewProps } from "./MascotView";

export interface ContextMascotProps extends MascotViewProps, EngineProps {
  /** Drive an existing engine instead of the provider's / a new one. */
  mascot?: Mascot;
  /** Ignore any surrounding <MascotProvider> and create an independent mascot. */
  standalone?: boolean;
}

/**
 * Drop-in mascot. Inside a <MascotProvider> it shows the provider's mascot;
 * otherwise (or with `standalone`) it creates and owns its own.
 */
export function ContextMascot({ mascot, standalone = false, ...props }: ContextMascotProps) {
  const fromProvider = useContext(MascotContext);
  const outer = mascot ?? (standalone ? null : fromProvider);
  const own = useOwnedMascot(pickEngineOptions(props), outer !== null);
  const active = outer ?? own;
  if (!active) return null;
  return <MascotView mascot={active} {...props} />;
}

export interface MascotProviderProps extends MascotViewProps, EngineProps {
  children?: ReactNode;
  /** Render the mascot itself. Set false to place <ContextMascot /> yourself. Default true. */
  showMascot?: boolean;
  /** Use an engine you created with `createMascot()`. */
  mascot?: Mascot;
}

/** Shares one mascot with every `useMascot()` below it, and renders it. */
export function MascotProvider({
  children,
  showMascot = true,
  mascot,
  ...props
}: MascotProviderProps) {
  const own = useOwnedMascot(pickEngineOptions(props), mascot !== undefined);
  const active = mascot ?? own;
  if (!active) return <>{children}</>;
  return (
    <MascotContext.Provider value={active}>
      {children}
      {showMascot && <MascotView mascot={active} {...props} />}
    </MascotContext.Provider>
  );
}
