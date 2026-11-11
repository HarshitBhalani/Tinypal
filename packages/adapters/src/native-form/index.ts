import type { MascotEmitter } from "../shared";

export interface ObserveFormsOptions {
  /**
   * Fields matching this selector are ignored completely (no events at all).
   * Password fields are always ignored.
   */
  ignore?: string;
  /** Emit `form:submit` (loading) when a valid form is submitted. Default true. */
  reactToSubmit?: boolean;
}

const ALWAYS_IGNORED = 'input[type="password"], [data-tinypal-ignore]';

/**
 * Watch native HTML forms inside `root` (a form, a container, or the whole
 * document) using event delegation, so forms added later are covered too.
 *
 * Privacy: this only looks at event types and element types. It never reads
 * `.value` or any other field content.
 *
 * Note: the browser cannot tell whether your server accepted a submission.
 * Call `mascot.emit("form:success")` / `"form:error"` yourself, or use
 * `trackSubmit`.
 */
export function observeForms(
  root: Document | Element,
  mascot: MascotEmitter,
  options: ObserveFormsOptions = {},
): () => void {
  const ignoreSelector = options.ignore ? `${ALWAYS_IGNORED}, ${options.ignore}` : ALWAYS_IGNORED;
  const reactToSubmit = options.reactToSubmit ?? true;

  const field = (e: Event): Element | null => {
    const t = e.target;
    if (!(t instanceof Element)) return null;
    if (!t.closest("form") || t.matches(ignoreSelector)) return null;
    return t;
  };

  let focusedForm: Element | null = null;
  // Many fields can fire `invalid` for one submit; report it once per tick.
  let invalidQueued = false;

  const onFocusIn = (e: Event) => {
    const f = field(e);
    if (!f) return;
    const form = f.closest("form");
    if (form !== focusedForm) {
      focusedForm = form;
      mascot.emit("form:focus");
    }
  };
  const onFocusOut = (e: FocusEvent) => {
    const next = e.relatedTarget;
    if (!(next instanceof Element) || next.closest("form") !== focusedForm) focusedForm = null;
  };
  const onInput = (e: Event) => {
    if (field(e)) mascot.emit("form:input");
  };
  const onInvalid = (e: Event) => {
    if (!field(e) || invalidQueued) return;
    invalidQueued = true;
    queueMicrotask(() => (invalidQueued = false));
    mascot.emit("form:invalid");
  };
  const onSubmit = (e: Event) => {
    if (reactToSubmit && e.target instanceof HTMLFormElement) mascot.emit("form:submit");
  };
  const onReset = (e: Event) => {
    if (e.target instanceof HTMLFormElement) mascot.emit("form:reset");
  };

  const listeners: [string, EventListener, boolean][] = [
    ["focusin", onFocusIn, false],
    ["focusout", onFocusOut as EventListener, false],
    ["input", onInput, false],
    // `invalid` does not bubble, so listen in the capture phase.
    ["invalid", onInvalid, true],
    ["submit", onSubmit, false],
    ["reset", onReset, false],
  ];
  for (const [type, fn, capture] of listeners) root.addEventListener(type, fn, capture);
  return () => {
    for (const [type, fn, capture] of listeners) root.removeEventListener(type, fn, capture);
  };
}
