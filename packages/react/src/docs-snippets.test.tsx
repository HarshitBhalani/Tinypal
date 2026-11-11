/**
 * Snippets from /docs, kept here so a docs/API mismatch fails typecheck or
 * tests. If you change a snippet in the docs, change it here too.
 */
import { afterEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, render } from "@testing-library/react";
import {
  ContextMascot,
  applyState,
  attachAxios,
  characters,
  createCursorTracker,
  createMascot,
  createMascotFetch,
  defineCharacter,
  ensureStyles,
  face,
  fx,
  renderCharacter,
  useCreateMascot,
  watchIdle,
} from "./index";
import type { CharacterId } from "./index";

afterEach(cleanup);

describe("docs snippets", () => {
  it("custom-characters.md: tomato", () => {
    const tomato = defineCharacter({
      id: "tomato",
      name: "Tomato",
      description: "A juicy little tomato.",
      accent: "#3fae6a",
      body: `
        <g class="tp-wave-arm" style="transform-origin:150px 110px"><ellipse cx="156" cy="124" rx="9" ry="16"/></g>
        <g class="tp-head"><circle cx="100" cy="112" r="64"/>
        ${face({ eyeY: 100, eyeDX: 22, eyeR: 11, mouthY: 128, mouthW: 12 })}</g>
        ${fx({ x: 156, y: 36 })}`,
    });
    const { container } = render(<ContextMascot character={tomato} />);
    expect(container.ownerDocument.querySelector('[data-character="tomato"]')).not.toBeNull();
  });

  it("react.md: two independent pals", () => {
    let cheer: () => void = () => {};
    function TwoPals() {
      const left = useCreateMascot();
      const right = useCreateMascot({ autoMessages: false });
      cheer = () => left.play("happy", { duration: 2000 });
      return (
        <>
          <ContextMascot mascot={left} character="cat" position="bottom-left" />
          <ContextMascot mascot={right} character="dog" position="bottom-right" />
        </>
      );
    }
    render(<TwoPals />);
    act(() => cheer());
    const [cat, dog] = Array.from(document.querySelectorAll("svg.tp-root"));
    expect(cat!.getAttribute("data-expression")).toBe("happy");
    expect(dog!.getAttribute("data-expression")).toBe("idle");
  });

  it("react.md: without React", () => {
    const host = document.createElement("div");
    ensureStyles();
    const mascot = createMascot();
    host.innerHTML = renderCharacter(characters.robot, { size: 150 });
    const svg = host.querySelector("svg")!;
    mascot.on("change", ({ state }) => applyState(svg, state));
    mascot.play("happy");
    expect(svg.getAttribute("data-expression")).toBe("happy");
  });

  it("idle.md + cursor-tracking.md: engine helpers", () => {
    const mascot = createMascot();
    const stop = watchIdle(mascot, { sleepyAfter: 30_000, sleepAfter: 60_000 });
    stop();
    const el = document.createElement("div");
    const tracker = createCursorTracker({ target: el, onLook: () => {}, speed: 0.5 });
    tracker.destroy();
  });

  it("messages.md / expressions.md / positioning.md: props type-check", () => {
    const character: CharacterId = "owl";
    render(
      <>
        <ContextMascot
          character={character}
          messages={{ success: ["Nice!", "Done and dusted."], sleepy: "Is anyone there?" }}
          locale="es"
          locales={{ es: { success: "¡Lo lograste!" } }}
          reactions={{
            "api:error": { expression: "confused", revertAfter: 2000 },
            "form:success": { expression: "happy", action: "waving", revertAfter: 2500 },
          }}
          position={{ bottom: 24, right: "2rem" }}
          offset={{ x: 0, y: 80 }}
          zIndex={50}
          trackingSpeed="slow"
          idle={{ sleepyAfter: 20_000, sleepAfter: 45_000, wakeDuration: 1000 }}
          enableFormAwareness={{ ignore: ".newsletter input", reactToSubmit: false }}
        />
        <ContextMascot standalone position={{ element: "#signup-form", placement: "right" }} />
        <ContextMascot standalone position="inline" size={240} />
      </>,
    );
  });

  it("api.md: fetch and axios options type-check", () => {
    const mascot = createMascot();
    createMascotFetch(mascot, {
      isError: (res) => res.status >= 500,
      filter: (input) => !String(input).includes("/analytics"),
      fetch: vi.fn(),
    });
    const interceptors = {
      request: { use: vi.fn(() => 1), eject: vi.fn() },
      response: { use: vi.fn(() => 2), eject: vi.fn() },
    };
    const detach = attachAxios({ interceptors }, mascot, {
      isError: (status) => status >= 500,
      filter: (config) => config.url !== "/ping",
    });
    detach();
    expect(interceptors.request.eject).toHaveBeenCalledWith(1);
  });
});
