import { Emitter } from "../events/emitter";
import { DEFAULT_REACTIONS } from "../expressions/reactions";
import { EVENT_MESSAGE_KEYS, MessageBook } from "../personality/messages";
import type { MessageConfig } from "../personality/messages";
import { StateMachine } from "../state-machine/machine";
import type { PlayOptions } from "../state-machine/machine";
import type { MascotEventName, MascotState, PlayName, ReactionTable } from "../types";

export interface MascotOptions extends MessageConfig {
  /** Override or extend the default event reactions. */
  reactions?: Partial<ReactionTable>;
  /** Speak automatically when events fire. Default true. */
  autoMessages?: boolean;
  /** How long a speech bubble stays visible, in ms. Default 3500. */
  messageDuration?: number;
}

export interface SayOptions {
  /** ms before the bubble hides. 0 keeps it until the next message. */
  duration?: number;
}

export interface MascotEvents extends Record<string, unknown> {
  /** Fired whenever expression or action changes. */
  change: { state: MascotState; previous: MascotState };
  /** Fired for every website event passed to `emit`. */
  event: { name: MascotEventName };
  /** Speech bubble text changed; `null` means hidden. */
  message: { text: string | null };
}

export interface Mascot {
  readonly state: MascotState;
  /** Current speech bubble text, or null. */
  readonly message: string | null;
  /** True after `destroy()`. */
  readonly destroyed: boolean;
  play(name: PlayName, options?: PlayOptions): void;
  emit(name: MascotEventName): void;
  /** Show a speech bubble. `say(null)` hides it. */
  say(text: string | null, options?: SayOptions): void;
  /** Speak the configured message for `key` if auto messages are on. */
  notify(key: string): void;
  /** Look up a message for the active locale (rotates, never repeats). */
  getMessage(key: string): string | undefined;
  /** Update options after creation (messages, locale, reactions...). */
  configure(options: MascotOptions): void;
  on<K extends keyof MascotEvents>(name: K, listener: (p: MascotEvents[K]) => void): () => void;
  destroy(): void;
}

/** Framework-independent mascot engine. */
export function createMascot(options: MascotOptions = {}): Mascot {
  let reactions: ReactionTable = { ...DEFAULT_REACTIONS, ...options.reactions };
  let autoMessages = options.autoMessages ?? true;
  let messageDuration = options.messageDuration ?? 3500;
  const book = new MessageBook(options);
  const emitter = new Emitter<MascotEvents>();
  const machine = new StateMachine((state, previous) =>
    emitter.emit("change", { state, previous }),
  );
  let message: string | null = null;
  let messageTimer: ReturnType<typeof setTimeout> | null = null;
  let destroyed = false;

  const clearMessageTimer = () => {
    if (messageTimer) clearTimeout(messageTimer);
    messageTimer = null;
  };

  const say: Mascot["say"] = (text, sayOptions = {}) => {
    if (destroyed) return;
    clearMessageTimer();
    if (text !== message) {
      message = text;
      emitter.emit("message", { text });
    }
    const duration = sayOptions.duration ?? messageDuration;
    if (text !== null && duration > 0) {
      messageTimer = setTimeout(() => say(null), duration);
    }
  };

  const notify = (key: string) => {
    if (!autoMessages) return;
    const text = book.get(key);
    if (text) say(text);
  };

  return {
    get state() {
      return machine.current;
    },
    get message() {
      return message;
    },
    get destroyed() {
      return destroyed;
    },
    play(name, playOptions) {
      if (!destroyed) machine.play(name, playOptions);
    },
    emit(name) {
      if (destroyed) return;
      const reaction = reactions[name];
      if (!reaction) return;
      machine.set(reaction.expression, reaction.action ?? null, reaction.revertAfter);
      emitter.emit("event", { name });
      if (autoMessages) {
        for (const key of EVENT_MESSAGE_KEYS[name]) {
          const text = book.get(key);
          if (text) {
            say(text);
            break;
          }
        }
      }
    },
    say,
    notify,
    getMessage: (key) => book.get(key),
    configure(next) {
      if (next.reactions) reactions = { ...DEFAULT_REACTIONS, ...next.reactions };
      if (next.autoMessages !== undefined) autoMessages = next.autoMessages;
      if (next.messageDuration !== undefined) messageDuration = next.messageDuration;
      book.configure(next);
    },
    on: (name, listener) => emitter.on(name, listener),
    destroy() {
      destroyed = true;
      clearMessageTimer();
      machine.dispose();
      emitter.clear();
    },
  };
}
