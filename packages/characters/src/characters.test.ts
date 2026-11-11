import { describe, expect, it } from "vitest";
import {
  ACTIONS,
  EXPRESSIONS,
  MASCOT_CSS,
  applyLook,
  applyState,
  renderCharacter,
} from "@tinypal/core";
import { characterList, defineCharacter, robot } from "./index";

describe.each(characterList)("character $id", (c) => {
  const svg = renderCharacter(c);

  it("has identity metadata", () => {
    expect(c.name).toBeTruthy();
    expect(c.description).toBeTruthy();
  });

  it("includes a face variant for every expression", () => {
    for (const e of EXPRESSIONS) expect(svg).toContain(`tp-m-${e}`);
  });

  it("is hidden from screen readers", () => {
    expect(svg).toContain('aria-hidden="true"');
  });

  it("has the hooks the shared CSS needs", () => {
    for (const cls of ["tp-eye-open", "tp-pupil", "tp-float", "tp-fx", "tp-head"]) {
      expect(svg).toContain(cls);
    }
  });
});

describe("renderCharacter", () => {
  it("applies size, state, theme and options", () => {
    const svg = renderCharacter(robot, {
      size: 200,
      expression: "happy",
      action: "waving",
      theme: "dark",
      headTracking: true,
      reducedMotion: true,
    });
    expect(svg).toContain('width="200"');
    expect(svg).toContain('data-expression="happy"');
    expect(svg).toContain('data-action="waving"');
    expect(svg).toContain('data-theme="dark"');
    expect(svg).toContain('data-head="on"');
    expect(svg).toContain('data-motion="off"');
  });

  it("defaults to idle/light with no action", () => {
    const svg = renderCharacter(robot);
    expect(svg).toContain('data-expression="idle"');
    expect(svg).toContain('data-theme="light"');
    expect(svg).not.toContain("data-action");
  });
});

describe("stylesheet", () => {
  it("styles every expression and action", () => {
    for (const e of EXPRESSIONS) expect(MASCOT_CSS).toContain(`data-expression="${e}"`);
    for (const a of ["loading", "celebrating", "waving", "sleeping"]) {
      expect(MASCOT_CSS).toContain(`data-action="${a}"`);
    }
  });

  it("respects prefers-reduced-motion", () => {
    expect(MASCOT_CSS).toContain("prefers-reduced-motion");
  });

  it("covers all declared actions via attribute or animation", () => {
    expect(ACTIONS.length).toBe(7);
  });
});

describe("dom helpers", () => {
  it("applyState and applyLook update the element without re-rendering", () => {
    const host = document.createElement("div");
    host.innerHTML = renderCharacter(robot);
    const el = host.querySelector("svg")!;
    applyState(el, { expression: "sad", action: "loading" });
    expect(el.getAttribute("data-expression")).toBe("sad");
    expect(el.getAttribute("data-action")).toBe("loading");
    applyState(el, { expression: "idle", action: null });
    expect(el.hasAttribute("data-action")).toBe(false);
    applyLook(el, 0.5, -0.25);
    expect(el.style.getPropertyValue("--tp-look-x")).toBe("0.5");
    expect(el.style.getPropertyValue("--tp-look-y")).toBe("-0.25");
  });
});

describe("custom characters", () => {
  it("defineCharacter returns the definition for registration", () => {
    const custom = defineCharacter({
      id: "x",
      name: "X",
      description: "d",
      accent: "#000",
      body: "",
    });
    expect(custom.id).toBe("x");
  });
});
