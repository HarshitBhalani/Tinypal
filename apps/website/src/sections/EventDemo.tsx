import { useEffect, useMemo, useRef, useState } from "react";
import type { FormEvent } from "react";
import {
  ContextMascot,
  createMascotFetch,
  observeForms,
  trackSubmit,
  useCreateMascot,
  useMascotState,
  watchIdle,
} from "@tinypal/react";
import type { MascotEventName } from "@tinypal/react";
import { Section } from "../components/ui";
import type { SiteTheme } from "../hooks/useTheme";

const wait = (ms: number, signal?: AbortSignal) =>
  new Promise<void>((resolve, reject) => {
    const t = setTimeout(resolve, ms);
    signal?.addEventListener("abort", () => {
      clearTimeout(t);
      reject(new DOMException("Request cancelled", "AbortError"));
    });
  });

/**
 * A pretend server so the demo works offline. The mascot logic is the real
 * `createMascotFetch` adapter; only the network is simulated.
 */
const fakeServer: typeof fetch = async (input, init) => {
  const url = String(input);
  await wait(url.includes("slow") ? 4000 : 1200, init?.signal ?? undefined);
  if (url.includes("offline")) throw new TypeError("Failed to fetch");
  const status = url.includes("500") ? 500 : 200;
  return new Response(JSON.stringify({ ok: status === 200 }), { status });
};

interface LogEntry {
  id: number;
  name: string;
}

function Card({
  title,
  hint,
  children,
}: {
  title: string;
  hint: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-ink-700 dark:bg-ink-900">
      <h3 className="font-semibold">{title}</h3>
      <p className="mb-4 mt-1 text-sm text-slate-500 dark:text-slate-400">{hint}</p>
      {children}
    </div>
  );
}

const btn =
  "rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium transition hover:border-brand-400 hover:text-brand-600 disabled:opacity-50 dark:border-ink-700 dark:hover:text-brand-300";
const input =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition placeholder:text-slate-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 dark:border-ink-700 dark:bg-ink-800 user-invalid:border-rose-400";

export function EventDemo({ theme }: { theme: SiteTheme }) {
  const mascot = useCreateMascot({ messageDuration: 3000 });
  const state = useMascotState(mascot);
  const formRef = useRef<HTMLFormElement>(null);
  const [log, setLog] = useState<LogEntry[]>([]);
  const [serverFails, setServerFails] = useState(false);
  const [sleepDemo, setSleepDemo] = useState(false);
  const [busy, setBusy] = useState(false);
  const controller = useRef<AbortController | null>(null);

  const api = useMemo(() => createMascotFetch(mascot, { fetch: fakeServer }), [mascot]);

  // Event log (what the engine received).
  useEffect(() => {
    let id = 0;
    const push = (name: string) => setLog((l) => [{ id: ++id, name }, ...l].slice(0, 6));
    const offEvent = mascot.on("event", ({ name }) => push(name));
    return offEvent;
  }, [mascot]);

  // Real native-form adapter, scoped to this one form.
  useEffect(() => {
    const form = formRef.current;
    if (!form) return;
    return observeForms(form, mascot, { reactToSubmit: false });
  }, [mascot]);

  // Real inactivity watcher with short demo timings.
  useEffect(() => {
    if (!sleepDemo) return;
    return watchIdle(mascot, { sleepyAfter: 2500, sleepAfter: 5000 });
  }, [mascot, sleepDemo]);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setBusy(true);
    try {
      await trackSubmit(mascot, async () => {
        await wait(1400);
        if (serverFails) throw new Error("Server said no");
      });
      formRef.current?.reset();
    } catch {
      /* the mascot already reacted */
    } finally {
      setBusy(false);
    }
  };

  const request = async (path: string) => {
    controller.current?.abort();
    const c = new AbortController();
    controller.current = c;
    try {
      await api(path, { signal: c.signal });
    } catch {
      /* network error / cancelled: the mascot already reacted */
    }
  };

  return (
    <Section
      id="reactions"
      eyebrow="Event reactions"
      title="It notices what is happening"
      lead="Everything below runs on the real engine and adapters. Only the server is pretend."
    >
      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <div className="grid gap-5 md:grid-cols-2">
          <Card
            title="Form awareness"
            hint="Focus a field, type, submit empty, or submit for real."
          >
            <form ref={formRef} onSubmit={onSubmit} className="space-y-3">
              <input
                className={input}
                name="name"
                placeholder="Your name"
                required
                autoComplete="off"
              />
              <input
                className={input}
                name="email"
                type="email"
                placeholder="you@example.com"
                required
                autoComplete="off"
              />
              <input
                className={input}
                name="password"
                type="password"
                placeholder="Password (ignored by tinypal)"
                autoComplete="new-password"
              />
              <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                <input
                  type="checkbox"
                  checked={serverFails}
                  onChange={(e) => setServerFails(e.target.checked)}
                />
                Make the server fail
              </label>
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={busy}
                  className="flex-1 rounded-lg bg-brand-500 py-2 text-sm font-semibold text-white transition hover:bg-brand-600 disabled:opacity-60"
                >
                  {busy ? "Sending..." : "Sign up"}
                </button>
                <button type="reset" className={btn}>
                  Reset
                </button>
              </div>
            </form>
          </Card>

          <Card title="API awareness" hint="Requests go through createMascotFetch().">
            <div className="grid grid-cols-2 gap-2">
              <button type="button" className={btn} onClick={() => request("/api/ok")}>
                Successful request
              </button>
              <button type="button" className={btn} onClick={() => request("/api/500")}>
                Server error (500)
              </button>
              <button type="button" className={btn} onClick={() => request("/api/offline")}>
                Network error
              </button>
              <button type="button" className={btn} onClick={() => request("/api/slow")}>
                Slow request
              </button>
              <button
                type="button"
                className={`${btn} col-span-2`}
                onClick={() => controller.current?.abort()}
              >
                Cancel request
              </button>
            </div>
          </Card>

          <Card
            title="Inactivity"
            hint="Short timers for the demo: sleepy at 2.5 s, asleep at 5 s."
          >
            <button
              type="button"
              className={`${btn} w-full`}
              onClick={() => setSleepDemo((v) => !v)}
            >
              {sleepDemo ? "Stop inactivity demo" : "Start inactivity demo"}
            </button>
            <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
              {sleepDemo
                ? "Now keep still. Move the mouse afterwards to wake it up."
                : "Off. The floating mascot uses the real defaults (30 s / 60 s)."}
            </p>
          </Card>

          <Card title="Manual control" hint="mascot.play(), mascot.say() and mascot.emit().">
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                className={btn}
                onClick={() => mascot.play("happy", { duration: 2500 })}
              >
                play("happy")
              </button>
              <button
                type="button"
                className={btn}
                onClick={() => mascot.play("celebrating", { duration: 2500 })}
              >
                play("celebrating")
              </button>
              <button type="button" className={btn} onClick={() => mascot.say("Hello from say()!")}>
                say("Hello...")
              </button>
              <button type="button" className={btn} onClick={() => mascot.emit("api:error")}>
                emit("api:error")
              </button>
            </div>
          </Card>
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-3xl border border-slate-200 bg-gradient-to-b from-brand-50 to-white p-6 dark:border-ink-700 dark:from-ink-800 dark:to-ink-900">
            <div className="flex min-h-[240px] items-end justify-center pt-14">
              <ContextMascot
                mascot={mascot}
                character="cat"
                position="inline"
                size={180}
                theme={theme}
                enableIdleAnimation={false}
                responsive={false}
              />
            </div>
            <div className="mt-4 flex justify-center gap-2 font-mono text-xs">
              <span className="rounded-md bg-white px-2 py-1 shadow-sm dark:bg-ink-700">
                {state.expression}
              </span>
              {state.action && (
                <span className="rounded-md bg-brand-500 px-2 py-1 text-white">{state.action}</span>
              )}
            </div>
            <div className="mt-5">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Events received
              </p>
              <ul className="space-y-1 font-mono text-xs" aria-live="polite">
                {log.length === 0 && (
                  <li className="text-slate-400">Nothing yet. Try the cards.</li>
                )}
                {log.map((e) => (
                  <li key={e.id} className="rounded bg-white/70 px-2 py-1 dark:bg-ink-700/60">
                    {e.name as MascotEventName}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </aside>
      </div>
    </Section>
  );
}
