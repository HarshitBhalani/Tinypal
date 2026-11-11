import { beforeEach, describe, expect, it, vi } from "vitest";
import axios, { AxiosError } from "axios";
import type { AxiosAdapter, InternalAxiosRequestConfig } from "axios";
import { createMascot } from "@tinypal/core";
import type { Mascot } from "@tinypal/core";
import { attachAxios, createApiTracker, createMascotFetch } from "./index";

let mascot: Mascot;
let events: string[];
beforeEach(() => {
  mascot = createMascot();
  events = [];
  mascot.on("event", ({ name }) => events.push(name));
});

const deferred = <T>() => {
  let resolve!: (v: T) => void;
  let reject!: (e: unknown) => void;
  const promise = new Promise<T>((res, rej) => ((resolve = res), (reject = rej)));
  return { promise, resolve, reject };
};

describe("api tracker", () => {
  it("reports one start and the worst outcome across concurrent requests", () => {
    const t = createApiTracker(mascot);
    const a = t.begin();
    const b = t.begin();
    const c = t.begin();
    a("success");
    b("error");
    expect(events).toEqual(["api:start"]);
    expect(mascot.state.action).toBe("loading");
    c("success");
    expect(events).toEqual(["api:start", "api:error"]);
    expect(t.pending).toBe(0);
  });

  it("ignores double completion", () => {
    const t = createApiTracker(mascot);
    const end = t.begin();
    end("success");
    end("error");
    expect(events).toEqual(["api:start", "api:success"]);
  });
});

describe("createMascotFetch", () => {
  it("shows loading while pending and success after", async () => {
    const d = deferred<Response>();
    const f = createMascotFetch(mascot, { fetch: () => d.promise });
    const p = f("/x");
    expect(mascot.state.action).toBe("loading");
    d.resolve(new Response("ok", { status: 200 }));
    await p;
    expect(events).toEqual(["api:start", "api:success"]);
  });

  it("treats non-ok as error by default, configurable via isError", async () => {
    const res404 = () => Promise.resolve(new Response("", { status: 404 }));
    await createMascotFetch(mascot, { fetch: res404 })("/a");
    await createMascotFetch(mascot, { fetch: res404, isError: (r) => r.status >= 500 })("/b");
    expect(events).toEqual(["api:start", "api:error", "api:start", "api:success"]);
  });

  it("returns the response unchanged", async () => {
    const response = new Response("body", { status: 500 });
    const f = createMascotFetch(mascot, { fetch: () => Promise.resolve(response) });
    expect(await f("/x")).toBe(response);
  });

  it("distinguishes network errors and cancellations, and re-throws", async () => {
    const net = createMascotFetch(mascot, {
      fetch: () => Promise.reject(new TypeError("Failed to fetch")),
    });
    await expect(net("/x")).rejects.toThrow("Failed to fetch");
    const abort = createMascotFetch(mascot, {
      fetch: () => Promise.reject(new DOMException("aborted", "AbortError")),
    });
    await expect(abort("/x")).rejects.toThrow("aborted");
    expect(events).toEqual(["api:start", "api:network-error", "api:start", "api:cancelled"]);
  });

  it("skips filtered requests entirely", async () => {
    const inner = vi.fn().mockResolvedValue(new Response("ok"));
    const f = createMascotFetch(mascot, {
      fetch: inner,
      filter: (input) => !String(input).includes("/analytics"),
    });
    await f("/analytics/ping");
    expect(inner).toHaveBeenCalledOnce();
    expect(events).toEqual([]);
  });
});

describe("attachAxios (real axios)", () => {
  const respond =
    (status: number): AxiosAdapter =>
    async (config: InternalAxiosRequestConfig) => {
      const response = { data: {}, status, statusText: "", headers: {}, config };
      if (config.validateStatus && !config.validateStatus(status)) {
        throw new AxiosError("fail", "ERR_BAD_RESPONSE", config, null, response);
      }
      return response;
    };

  it("reports success and HTTP errors", async () => {
    const ok = axios.create({ adapter: respond(200) });
    attachAxios(ok, mascot);
    await ok.get("/x");
    const bad = axios.create({ adapter: respond(500) });
    attachAxios(bad, mascot);
    await expect(bad.get("/x")).rejects.toThrow();
    expect(events).toEqual(["api:start", "api:success", "api:start", "api:error"]);
  });

  it("lets the developer decide which statuses are failures", async () => {
    const inst = axios.create({ adapter: respond(404) });
    attachAxios(inst, mascot, { isError: (s) => s >= 500 });
    await expect(inst.get("/x")).rejects.toThrow();
    expect(events).toEqual(["api:start", "api:success"]);
  });

  it("detects network errors and cancellation", async () => {
    const net = axios.create({
      adapter: async (config) => {
        throw new AxiosError("Network Error", "ERR_NETWORK", config);
      },
    });
    attachAxios(net, mascot);
    await expect(net.get("/x")).rejects.toThrow();

    const cancelled = axios.create({ adapter: respond(200) });
    attachAxios(cancelled, mascot);
    const controller = new AbortController();
    controller.abort();
    await expect(cancelled.get("/x", { signal: controller.signal })).rejects.toThrow();
    expect(events).toEqual(["api:start", "api:network-error", "api:start", "api:cancelled"]);
  });

  it("detach removes the interceptors", async () => {
    const inst = axios.create({ adapter: respond(200) });
    const detach = attachAxios(inst, mascot);
    detach();
    await inst.get("/x");
    expect(events).toEqual([]);
  });
});
