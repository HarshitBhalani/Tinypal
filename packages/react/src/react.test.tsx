import { afterEach, describe, expect, it, vi } from "vitest";
import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { ContextMascot, MascotProvider, createMascot, defineCharacter, useMascot } from "./index";

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

const svg = (c: HTMLElement = document.body) => c.querySelector("svg.tp-root") as SVGSVGElement;
const host = () => document.querySelector(".tp-host") as HTMLElement;

describe("<ContextMascot>", () => {
  it("renders the chosen character, hidden from screen readers, visible after mount", () => {
    render(<ContextMascot character="cat" size={120} />);
    expect(svg().getAttribute("data-character")).toBe("cat");
    expect(svg().getAttribute("aria-hidden")).toBe("true");
    expect(svg().getAttribute("width")).toBe("120");
    expect(host().style.visibility).toBe("");
    expect(document.getElementById("tinypal-styles")).not.toBeNull();
  });

  it("switches character without losing the current expression", () => {
    const mascot = createMascot();
    const { rerender } = render(<ContextMascot mascot={mascot} character="robot" />);
    act(() => mascot.play("sad"));
    rerender(<ContextMascot mascot={mascot} character="fox" />);
    expect(svg().getAttribute("data-character")).toBe("fox");
    expect(svg().getAttribute("data-expression")).toBe("sad");
  });

  it("applies expression changes to the DOM", () => {
    const mascot = createMascot();
    render(<ContextMascot mascot={mascot} />);
    act(() => mascot.play("loading"));
    expect(svg().getAttribute("data-action")).toBe("loading");
    act(() => mascot.play("happy"));
    expect(svg().getAttribute("data-expression")).toBe("happy");
    expect(svg().hasAttribute("data-action")).toBe(false);
  });

  it("positions with presets, custom coordinates and inline", () => {
    const { rerender } = render(<ContextMascot position="top-left" zIndex={50} />);
    expect(host().style).toMatchObject({
      position: "fixed",
      top: "24px",
      left: "24px",
      zIndex: "50",
    });
    rerender(<ContextMascot position={{ bottom: 10, right: 40 }} />);
    expect(host().style).toMatchObject({ bottom: "10px", right: "40px" });
    rerender(<ContextMascot position="inline" />);
    expect(host().style.position).toBe("relative");
  });

  it("accepts a custom character", () => {
    const blob = defineCharacter({
      id: "blob",
      name: "Blob",
      description: "test",
      accent: "#000",
      body: '<g class="tp-head"></g>',
    });
    render(<ContextMascot character={blob} />);
    expect(svg().getAttribute("data-character")).toBe("blob");
  });

  it("hidden renders nothing", () => {
    render(<ContextMascot hidden />);
    expect(svg()).toBeNull();
  });

  it("waves when clicked", () => {
    render(<ContextMascot />);
    fireEvent.click(svg());
    expect(svg().getAttribute("data-action")).toBe("waving");
  });
});

describe("speech bubbles", () => {
  it("say() shows a bubble that hides after its duration", () => {
    vi.useFakeTimers();
    const mascot = createMascot();
    render(<ContextMascot mascot={mascot} />);
    act(() => mascot.say("Hello there", { duration: 1000 }));
    expect(screen.getByText("Hello there").getAttribute("aria-hidden")).toBe("true");
    act(() => vi.advanceTimersByTime(1000));
    expect(screen.queryByText("Hello there")).toBeNull();
  });

  it("uses custom messages for events, and can be turned off", () => {
    const mascot = createMascot({ messages: { success: "Saved!" } });
    const { rerender } = render(<ContextMascot mascot={mascot} />);
    act(() => mascot.emit("api:success"));
    expect(screen.getByText("Saved!")).toBeTruthy();
    rerender(<ContextMascot mascot={mascot} showSpeechBubble={false} />);
    expect(screen.queryByText("Saved!")).toBeNull();
  });

  it("can announce messages to screen readers when asked", () => {
    const mascot = createMascot();
    render(<ContextMascot mascot={mascot} announceMessages />);
    act(() => mascot.say("Hi"));
    expect(screen.getByRole("status").textContent).toBe("Hi");
  });
});

describe("<MascotProvider> + useMascot", () => {
  function SaveButton() {
    const mascot = useMascot();
    return (
      <button
        onClick={() => {
          mascot.play("happy");
          mascot.say("Your form was submitted successfully!");
        }}
      >
        Save
      </button>
    );
  }

  it("lets any component control the shared mascot", () => {
    render(
      <MascotProvider character="panda" messages={{ success: "Yay" }}>
        <SaveButton />
      </MascotProvider>,
    );
    fireEvent.click(screen.getByText("Save"));
    expect(svg().getAttribute("data-character")).toBe("panda");
    expect(svg().getAttribute("data-expression")).toBe("happy");
    expect(screen.getByText("Your form was submitted successfully!")).toBeTruthy();
  });

  it("works under StrictMode (double mount)", () => {
    render(
      <StrictMode>
        <MascotProvider>
          <SaveButton />
        </MascotProvider>
      </StrictMode>,
    );
    fireEvent.click(screen.getByText("Save"));
    expect(svg().getAttribute("data-expression")).toBe("happy");
  });

  it("useMascot outside a provider throws a helpful error", () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => render(<SaveButton />)).toThrow(/MascotProvider/);
  });

  it("supports multiple independent mascots", () => {
    const a = createMascot();
    const b = createMascot();
    render(
      <>
        <ContextMascot mascot={a} character="cat" />
        <ContextMascot mascot={b} character="dog" />
      </>,
    );
    act(() => a.play("sad"));
    const [sa, sb] = Array.from(document.querySelectorAll("svg.tp-root"));
    expect(sa!.getAttribute("data-expression")).toBe("sad");
    expect(sb!.getAttribute("data-expression")).toBe("idle");
  });
});

describe("form awareness", () => {
  it("reacts to native forms when enabled", () => {
    const mascot = createMascot();
    render(
      <>
        <form>
          <input name="email" />
        </form>
        <ContextMascot mascot={mascot} enableFormAwareness />
      </>,
    );
    fireEvent.focusIn(document.querySelector("input")!);
    expect(svg().getAttribute("data-expression")).toBe("curious");
  });
});

describe("cleanup", () => {
  it("unmount removes window listeners and destroys an owned mascot's timers", () => {
    vi.useFakeTimers();
    const add = vi.spyOn(window, "addEventListener");
    const remove = vi.spyOn(window, "removeEventListener");
    const { unmount } = render(<ContextMascot enableFormAwareness draggable />);
    const added = add.mock.calls.length;
    unmount();
    expect(remove.mock.calls.length).toBeGreaterThanOrEqual(added);
    expect(vi.getTimerCount()).toBe(0);
    add.mockRestore();
    remove.mockRestore();
  });
});

describe("SSR", () => {
  it("renders on the server without touching window, hidden until hydrated", () => {
    const html = renderToString(
      <MascotProvider character="ghost">
        <p>app</p>
      </MascotProvider>,
    );
    expect(html).toContain('data-character="ghost"');
    expect(html).toContain("visibility:hidden");
  });
});

describe("tracking speed presets", () => {
  it("maps names to speeds and clamps numbers", async () => {
    const { resolveTrackingSpeed, TRACKING_SPEEDS } = await import("./MascotView");
    expect(resolveTrackingSpeed("slow")).toBe(TRACKING_SPEEDS.slow);
    expect(resolveTrackingSpeed("instant")).toBe(1);
    expect(resolveTrackingSpeed(5)).toBe(1);
    expect(resolveTrackingSpeed(0)).toBe(0.01);
  });

  it("accepts a preset name as a prop", () => {
    render(<ContextMascot trackingSpeed="fast" />);
    expect(svg()).not.toBeNull();
  });
});

describe("state hooks", () => {
  it("useMascotState / useMascotMessage re-render on change", async () => {
    const { useMascotState, useMascotMessage } = await import("./hooks");
    const mascot = createMascot();
    function Readout() {
      const s = useMascotState(mascot);
      const msg = useMascotMessage(mascot);
      return (
        <p data-testid="out">
          {s.expression}/{s.action ?? "-"}/{msg ?? "-"}
        </p>
      );
    }
    render(<Readout />);
    expect(screen.getByTestId("out").textContent).toBe("idle/-/-");
    act(() => {
      mascot.play("loading");
      mascot.say("wait", { duration: 0 });
    });
    expect(screen.getByTestId("out").textContent).toBe("idle/loading/wait");
  });
});

describe("no leaks", () => {
  it("100 mount/unmount cycles leave no window listeners or timers behind", () => {
    vi.useFakeTimers();
    // Track each (target, type, listener) so an extra defensive remove can't
    // hide a real leak.
    const live = new Set<string>();
    const ids = new WeakMap<object, number>();
    let next = 0;
    const key = (target: object, type: string, fn: unknown) => {
      if (!ids.has(fn as object)) ids.set(fn as object, ++next);
      const t = target === window ? "window" : "document";
      return `${t}:${type}:${ids.get(fn as object)}`;
    };
    const spies = [window, document].flatMap((target) => {
      const add = target.addEventListener.bind(target);
      const remove = target.removeEventListener.bind(target);
      return [
        vi.spyOn(target, "addEventListener").mockImplementation(((
          type: string,
          fn: never,
          o?: boolean | AddEventListenerOptions,
        ) => {
          live.add(key(target, type, fn));
          add(type, fn, o);
        }) as typeof target.addEventListener),
        vi.spyOn(target, "removeEventListener").mockImplementation(((
          type: string,
          fn: never,
          o?: boolean | EventListenerOptions,
        ) => {
          live.delete(key(target, type, fn));
          remove(type, fn, o);
        }) as typeof target.removeEventListener),
      ];
    });
    const before = new Set(live);
    let peak = 0;
    for (let i = 0; i < 100; i++) {
      const { unmount } = render(
        <ContextMascot enableFormAwareness draggable trackCursor character="frog" />,
      );
      peak = Math.max(peak, live.size);
      unmount();
    }
    spies.forEach((s) => s.mockRestore());
    const leaked = [...live].filter((k) => !before.has(k));
    expect(peak).toBeGreaterThan(0); // listeners really were attached
    expect(leaked).toEqual([]);
    expect(vi.getTimerCount()).toBe(0);
  });
});
