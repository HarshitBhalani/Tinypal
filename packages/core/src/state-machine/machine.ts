import { ACTIONS, EXPRESSIONS } from "../types";
import type { Action, Expression, MascotState, PlayName } from "../types";

const isExpression = (n: string): n is Expression => (EXPRESSIONS as readonly string[]).includes(n);
const isAction = (n: string): n is Action => (ACTIONS as readonly string[]).includes(n);

export interface PlayOptions {
  /** Return to idle after this many ms. */
  duration?: number;
}

/**
 * Holds the current expression + action and an optional revert-to-idle timer.
 * Any new state change cancels a pending revert, so a stale timer can never
 * clobber a newer reaction.
 */
export class StateMachine {
  private state: MascotState = { expression: "idle", action: null };
  private timer: ReturnType<typeof setTimeout> | null = null;

  constructor(private readonly onChange: (next: MascotState, prev: MascotState) => void) {}

  get current(): MascotState {
    return this.state;
  }

  set(expression: Expression, action: Action | null, duration?: number): void {
    this.cancelRevert();
    this.update({ expression, action });
    if (duration !== undefined && duration > 0) {
      this.timer = setTimeout(() => {
        this.timer = null;
        this.update({ expression: "idle", action: null });
      }, duration);
    }
  }

  play(name: PlayName, options: PlayOptions = {}): void {
    if (isExpression(name)) {
      this.set(name, null, options.duration);
    } else if (isAction(name)) {
      // Sleeping implies the sleepy face; other actions keep the current face.
      const expression = name === "sleeping" ? "sleepy" : this.state.expression;
      this.set(expression, name, options.duration);
    }
  }

  cancelRevert(): void {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }

  dispose(): void {
    this.cancelRevert();
  }

  private update(next: MascotState): void {
    const prev = this.state;
    if (prev.expression === next.expression && prev.action === next.action) return;
    this.state = next;
    this.onChange(next, prev);
  }
}
