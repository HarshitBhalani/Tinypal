import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createMascot } from "@tinypal/core";
import type { Mascot } from "@tinypal/core";
import { formikInvalid, formikSubmit, observeForms, rhfHandlers, trackSubmit } from "./index";

let mascot: Mascot;
let events: string[];
let form: HTMLFormElement;
let stop: () => void;

beforeEach(() => {
  mascot = createMascot();
  events = [];
  mascot.on("event", ({ name }) => events.push(name));
  document.body.innerHTML = `
    <form id="f">
      <input name="email" type="email" required />
      <input name="name" required />
      <input name="pw" type="password" />
      <input name="secret" data-tinypal-ignore />
      <button>Send</button>
    </form>
    <input id="outside" />`;
  form = document.getElementById("f") as HTMLFormElement;
});
afterEach(() => {
  stop?.();
  mascot.destroy();
});

const $ = (sel: string) => document.querySelector(sel) as HTMLInputElement;
const fire = (el: Element, type: string, init: EventInit = { bubbles: true }) =>
  el.dispatchEvent(new Event(type, init));

describe("observeForms (native)", () => {
  it("maps focus, typing, submit and reset to mascot events", () => {
    stop = observeForms(document, mascot);
    fire($("[name=email]"), "focusin");
    fire($("[name=email]"), "input");
    fire(form, "submit");
    fire(form, "reset");
    expect(events).toEqual(["form:focus", "form:input", "form:submit", "form:reset"]);
    expect(mascot.state.expression).toBe("idle");
  });

  it("reports focus once per form, not per field", () => {
    stop = observeForms(document, mascot);
    fire($("[name=email]"), "focusin");
    $("[name=email]").dispatchEvent(
      new FocusEvent("focusout", { bubbles: true, relatedTarget: $("[name=name]") }),
    );
    fire($("[name=name]"), "focusin");
    expect(events).toEqual(["form:focus"]);
  });

  it("reports one confused reaction when several fields are invalid", async () => {
    stop = observeForms(document, mascot);
    form.checkValidity(); // fires `invalid` on both required fields
    expect(events).toEqual(["form:invalid"]);
    expect(mascot.state.expression).toBe("confused");
    await Promise.resolve();
    form.checkValidity();
    expect(events).toEqual(["form:invalid", "form:invalid"]);
  });

  it("ignores password fields, opted-out fields, and inputs outside forms", () => {
    stop = observeForms(document, mascot);
    for (const sel of ["[name=pw]", "[name=secret]", "#outside"]) {
      fire($(sel), "focusin");
      fire($(sel), "input");
    }
    expect(events).toEqual([]);
  });

  it("supports a custom ignore selector and disabling submit reactions", () => {
    stop = observeForms(form, mascot, { ignore: "[name=name]", reactToSubmit: false });
    fire($("[name=name]"), "input");
    fire(form, "submit");
    expect(events).toEqual([]);
  });

  it("never reads field values", () => {
    const desc = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")!;
    const get = vi.fn(desc.get);
    Object.defineProperty(HTMLInputElement.prototype, "value", { ...desc, get });
    try {
      stop = observeForms(document, mascot);
      fire($("[name=email]"), "focusin");
      fire($("[name=email]"), "input");
      fire($("[name=pw]"), "input");
      fire(form, "submit");
      expect(get).not.toHaveBeenCalled();
    } finally {
      Object.defineProperty(HTMLInputElement.prototype, "value", desc);
    }
  });

  it("removes all listeners on cleanup", () => {
    observeForms(document, mascot)();
    fire($("[name=email]"), "focusin");
    fire(form, "submit");
    expect(events).toEqual([]);
  });
});

describe("trackSubmit", () => {
  it("emits loading then success", async () => {
    const p = trackSubmit(mascot, async () => "ok");
    expect(mascot.state.action).toBe("loading");
    await expect(p).resolves.toBe("ok");
    expect(events).toEqual(["form:submit", "form:success"]);
  });

  it("emits error and re-throws", async () => {
    await expect(
      trackSubmit(mascot, () => {
        throw new Error("boom");
      }),
    ).rejects.toThrow("boom");
    expect(events).toEqual(["form:submit", "form:error"]);
    expect(mascot.state.expression).toBe("sad");
  });
});

describe("React Hook Form adapter", () => {
  it("wraps valid and invalid handlers", async () => {
    const onValid = vi.fn().mockResolvedValue(undefined);
    const onInvalid = vi.fn();
    const [valid, invalid] = rhfHandlers(mascot, onValid, onInvalid);
    await valid({ email: "a@b.c" });
    expect(onValid).toHaveBeenCalledWith({ email: "a@b.c" }, undefined);
    invalid({ email: { message: "required" } });
    expect(onInvalid).toHaveBeenCalled();
    expect(events).toEqual(["form:submit", "form:success", "form:invalid"]);
  });
});

describe("Formik adapter", () => {
  it("wraps onSubmit and reports failures", async () => {
    const submit = formikSubmit(mascot, async () => {
      throw new Error("server");
    });
    await expect(submit({}, {})).rejects.toThrow("server");
    expect(events).toEqual(["form:submit", "form:error"]);
  });

  it("formikInvalid only fires when there are errors", () => {
    expect(formikInvalid(mascot, {})).toBe(false);
    expect(formikInvalid(mascot, { email: undefined })).toBe(false);
    expect(formikInvalid(mascot, { email: "Required" })).toBe(true);
    expect(events).toEqual(["form:invalid"]);
  });
});
