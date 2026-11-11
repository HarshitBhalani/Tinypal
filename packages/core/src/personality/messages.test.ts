import { describe, expect, it } from "vitest";
import { MessageBook } from "./messages";
import { createMascot } from "../engine/mascot";

/** Deterministic "random" that always picks the given indexes in order. */
const sequence = (...picks: number[]) => {
  let i = 0;
  return () => (picks[i++ % picks.length]! + 0.01) / 10;
};

describe("MessageBook", () => {
  it("never repeats the same line twice in a row", () => {
    // random always lands on index 0 of a 3-item list
    const book = new MessageBook({ messages: { hi: ["a", "b", "c"] } }, () => 0);
    const said = Array.from({ length: 6 }, () => book.get("hi"));
    for (let i = 1; i < said.length; i++) expect(said[i]).not.toBe(said[i - 1]);
  });

  it("returns single strings and ignores empty lists", () => {
    const book = new MessageBook({ messages: { one: "only", none: [], single: ["x"] } });
    expect(book.get("one")).toBe("only");
    expect(book.get("none")).toBeUndefined();
    expect(book.get("single")).toBe("x");
    expect(book.get("missing-key")).toBeUndefined();
  });

  it("uses the active locale and falls back to English", () => {
    const book = new MessageBook({ locale: "hi" }, sequence(0));
    expect(book.get("network-error")).toBe("Server se connect nahi ho pa raha.");
    const es = new MessageBook({ locale: "es", locales: { es: { success: "¡Bien!" } } });
    expect(es.get("success")).toBe("¡Bien!");
    expect(es.get("network-error")).toBe("I can't reach the server right now.");
  });

  it("messages override locales; configure() merges", () => {
    const book = new MessageBook({ locale: "hi", messages: { success: "Custom" } });
    expect(book.get("success")).toBe("Custom");
    book.configure({ messages: { success: "Changed" } });
    expect(book.get("success")).toBe("Changed");
  });
});

describe("engine messages", () => {
  it("say() replaces, hides with null, and duration 0 keeps it", () => {
    const m = createMascot();
    const seen: (string | null)[] = [];
    m.on("message", ({ text }) => seen.push(text));
    m.say("one", { duration: 0 });
    m.say("one", { duration: 0 }); // same text: no duplicate event
    m.say(null);
    expect(seen).toEqual(["one", null]);
    expect(m.message).toBeNull();
  });

  it("autoMessages off silences events and notify()", () => {
    const m = createMascot({ autoMessages: false });
    m.emit("api:success");
    m.notify("sleepy");
    expect(m.message).toBeNull();
    m.configure({ autoMessages: true });
    m.notify("sleepy");
    expect(m.message).not.toBeNull();
  });

  it("event messages prefer the most specific key", () => {
    const m = createMascot({ messages: { "api:error": "API broke", error: "Generic" } });
    m.emit("api:error");
    expect(m.message).toBe("API broke");
    m.emit("form:error");
    expect(m.message).toBe("Generic");
  });
});
