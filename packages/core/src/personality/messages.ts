import type { MascotEventName } from "../types";

/** One message, or several to rotate through without repeating. */
export type MessageValue = string | readonly string[];

/**
 * Messages keyed by event name ("api:success"), a shorthand ("success",
 * "error", "loading", "invalid", "network-error", "cancelled", "sleepy",
 * "wake") or an expression name ("happy", "sad").
 */
export type MessageMap = Partial<Record<string, MessageValue>>;

/** Built-in messages. Add a locale by passing `locales: { fr: {...} }`. */
export const DEFAULT_MESSAGES: Record<string, MessageMap> = {
  en: {
    loading: ["Give me a moment...", "Working on it...", "Hang tight..."],
    success: ["You did it!", "Awesome! Everything worked!", "All done!"],
    error: ["Oops! Something went wrong.", "Hmm, that didn't work."],
    invalid: ["Something needs a second look.", "Almost! Check the highlighted fields."],
    "network-error": "I can't reach the server right now.",
    cancelled: "Okay, cancelled.",
    sleepy: ["Is anyone there?", "*yawn*"],
    wake: ["Oh! You're back!", "I'm awake, I'm awake!"],
  },
  hi: {
    loading: ["Ek pal rukiye...", "Kaam chal raha hai..."],
    success: ["Ho gaya!", "Bahut badhiya!"],
    error: ["Oops! Kuch gadbad ho gayi.", "Yeh kaam nahi kiya."],
    invalid: "Kuch fields dobara dekhiye.",
    "network-error": "Server se connect nahi ho pa raha.",
    cancelled: "Theek hai, cancel kar diya.",
    sleepy: ["Koi hai?", "*ubaasi*"],
    wake: "Arre! Aap wapas aa gaye!",
  },
};

/** Keys tried, in order, when an event fires with auto messages on. */
export const EVENT_MESSAGE_KEYS: Record<MascotEventName, readonly string[]> = {
  "form:focus": ["form:focus"],
  "form:input": ["form:input"],
  "form:invalid": ["form:invalid", "invalid", "confused"],
  "form:submit": ["form:submit", "loading"],
  "form:success": ["form:success", "success", "happy"],
  "form:error": ["form:error", "error", "sad"],
  "form:reset": ["form:reset"],
  "api:start": ["api:start", "loading"],
  "api:loading": ["api:loading", "loading"],
  "api:success": ["api:success", "success", "happy"],
  "api:error": ["api:error", "error", "sad"],
  "api:network-error": ["api:network-error", "network-error", "error"],
  "api:cancelled": ["api:cancelled", "cancelled"],
};

export interface MessageConfig {
  /** Overrides applied on top of the active locale. */
  messages?: MessageMap;
  /** Extra or replacement locales. */
  locales?: Record<string, MessageMap>;
  /** Active locale. Falls back to English for missing keys. Default "en". */
  locale?: string;
}

/**
 * Resolves message keys for the active locale and rotates through arrays so
 * the same line is never shown twice in a row.
 */
export class MessageBook {
  private last = new Map<string, number>();

  constructor(
    private config: MessageConfig = {},
    private readonly random: () => number = Math.random,
  ) {}

  configure(config: MessageConfig): void {
    this.config = { ...this.config, ...config };
  }

  get(key: string): string | undefined {
    const locale = this.config.locale ?? "en";
    const value =
      this.config.messages?.[key] ??
      this.config.locales?.[locale]?.[key] ??
      DEFAULT_MESSAGES[locale]?.[key] ??
      this.config.locales?.en?.[key] ??
      DEFAULT_MESSAGES.en?.[key];
    if (value === undefined) return undefined;
    if (typeof value === "string") return value;
    if (value.length === 0) return undefined;
    if (value.length === 1) return value[0];

    const previous = this.last.get(key);
    let i = Math.floor(this.random() * value.length);
    if (i === previous) i = (i + 1) % value.length;
    this.last.set(key, i);
    return value[i];
  }
}
