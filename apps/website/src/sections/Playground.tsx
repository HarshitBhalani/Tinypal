import { useState } from "react";
import type { ReactNode } from "react";
import {
  ACTIONS,
  EXPRESSIONS,
  TRACKING_SPEEDS,
  characterList,
  useMascot,
  useMascotState,
} from "@tinypal/react";
import type { CharacterId, PlayName } from "@tinypal/react";
import { CodeBlock, Section } from "../components/ui";
import { ANCHOR_ID, PRESETS, toCode } from "../data/playground";
import type { PlaygroundConfig, PositionChoice } from "../data/playground";

function Group({ title, children }: { title: string; children: ReactNode }) {
  return (
    <fieldset className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-ink-700 dark:bg-ink-900">
      <legend className="px-1 text-sm font-semibold">{title}</legend>
      <div className="space-y-4">{children}</div>
    </fieldset>
  );
}

function Slider({
  label,
  value,
  min,
  max,
  step,
  onChange,
  format = String,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  format?: (v: number) => string;
}) {
  return (
    <label className="block text-sm">
      <span className="flex justify-between text-slate-600 dark:text-slate-400">
        {label}
        <span className="font-mono text-slate-900 dark:text-slate-100">{format(value)}</span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-2 w-full accent-brand-500"
      />
    </label>
  );
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between text-sm text-slate-700 dark:text-slate-300">
      {label}
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 rounded-full transition ${checked ? "bg-brand-500" : "bg-slate-300 dark:bg-ink-700"}`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${checked ? "left-[22px]" : "left-0.5"}`}
        />
      </button>
    </label>
  );
}

const chip = (active: boolean) =>
  `rounded-lg px-3 py-1.5 text-sm font-medium capitalize transition ${
    active
      ? "bg-brand-500 text-white"
      : "border border-slate-200 text-slate-700 hover:border-brand-400 hover:text-brand-600 dark:border-ink-700 dark:text-slate-300 dark:hover:text-brand-300"
  }`;

const field =
  "mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 dark:border-ink-700 dark:bg-ink-800";

export function Playground({
  config,
  onChange,
}: {
  config: PlaygroundConfig;
  onChange: (c: PlaygroundConfig) => void;
}) {
  const mascot = useMascot();
  const state = useMascotState();
  const [sayText, setSayText] = useState("Hello! I'm your new pal.");
  const set = <K extends keyof PlaygroundConfig>(key: K, value: PlaygroundConfig[K]) =>
    onChange({ ...config, [key]: value });

  const play = (name: PlayName) => {
    const lasting = name === "loading" || name === "sleeping" || name === "sleepy";
    mascot.play(name, lasting ? {} : { duration: 3000 });
    if (name === "happy" || name === "celebrating") mascot.say(config.messages.success);
    else if (name === "sad") mascot.say(config.messages.error);
    else if (name === "loading") mascot.say(config.messages.loading, { duration: 0 });
    else if (name === "sleepy" || name === "sleeping") mascot.say(config.messages.sleepy);
  };

  return (
    <Section
      id="playground"
      eyebrow="Playground"
      title="Play with the real thing"
      lead="These controls drive the mascot in the corner of this page, using the same engine you install."
      className="bg-slate-50/70 dark:bg-ink-900/40"
    >
      <div className="grid gap-5 lg:grid-cols-3">
        <Group title="Character">
          <div className="grid grid-cols-4 gap-2">
            {characterList.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => set("character", c.id as CharacterId)}
                className={chip(config.character === c.id)}
              >
                {c.name}
              </button>
            ))}
          </div>
          <Slider
            label="Size"
            value={config.size}
            min={60}
            max={240}
            step={5}
            onChange={(v) => set("size", v)}
            format={(v) => `${v}px`}
          />
        </Group>

        <Group title="Position">
          <div className="grid grid-cols-2 gap-2">
            {[...PRESETS, "custom", "attach"].map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => set("position", p as PositionChoice)}
                className={chip(config.position === p)}
              >
                {p === "attach" ? "Attach to box" : p.replace("-", " ")}
              </button>
            ))}
          </div>
          {config.position === "custom" && (
            <>
              <Slider
                label="bottom"
                value={config.custom.bottom}
                min={0}
                max={500}
                step={10}
                onChange={(v) => set("custom", { ...config.custom, bottom: v })}
                format={(v) => `${v}px`}
              />
              <Slider
                label="right"
                value={config.custom.right}
                min={0}
                max={900}
                step={10}
                onChange={(v) => set("custom", { ...config.custom, right: v })}
                format={(v) => `${v}px`}
              />
            </>
          )}
          {config.position === "attach" && (
            <div
              id={ANCHOR_ID}
              className="rounded-xl border-2 border-dashed border-brand-400 p-4 text-center text-sm text-brand-600 dark:text-brand-300"
            >
              The mascot sits to the right of this box and follows it when you scroll.
            </div>
          )}
          <Toggle
            label="Draggable"
            checked={config.draggable}
            onChange={(v) => set("draggable", v)}
          />
        </Group>

        <Group title="Cursor tracking">
          <Toggle
            label="Track cursor"
            checked={config.trackCursor}
            onChange={(v) => set("trackCursor", v)}
          />
          <Toggle
            label="Head follows too"
            checked={config.headTracking}
            onChange={(v) => set("headTracking", v)}
          />
          <Slider
            label="Intensity"
            value={config.trackingIntensity}
            min={0.1}
            max={1}
            step={0.1}
            onChange={(v) => set("trackingIntensity", v)}
            format={(v) => v.toFixed(1)}
          />
          <div className="grid grid-cols-4 gap-1.5">
            {(Object.entries(TRACKING_SPEEDS) as [string, number][]).map(([name, v]) => (
              <button
                key={name}
                type="button"
                onClick={() => set("trackingSpeed", v)}
                className={chip(config.trackingSpeed === v)}
              >
                {name}
              </button>
            ))}
          </div>
          <Slider
            label="Speed"
            value={config.trackingSpeed}
            min={0.05}
            max={1}
            step={0.05}
            onChange={(v) => set("trackingSpeed", v)}
            format={(v) => (v === 1 ? "instant" : v.toFixed(2))}
          />
        </Group>

        <Group title="Expressions">
          <div className="flex flex-wrap gap-2">
            {EXPRESSIONS.map((e) => (
              <button
                key={e}
                type="button"
                onClick={() => play(e)}
                className={chip(state.expression === e && !state.action)}
              >
                {e}
              </button>
            ))}
          </div>
        </Group>

        <Group title="Animations">
          <div className="flex flex-wrap gap-2">
            {ACTIONS.map((a) => (
              <button
                key={a}
                type="button"
                onClick={() => play(a)}
                className={chip(state.action === a)}
              >
                {a.replace("-", " ")}
              </button>
            ))}
            <button type="button" onClick={() => mascot.play("idle")} className={chip(false)}>
              reset
            </button>
          </div>
        </Group>

        <Group title="Sleep & wake">
          <Toggle
            label="Quick sleep (3 s / 6 s)"
            checked={config.quickSleep}
            onChange={(v) => set("quickSleep", v)}
          />
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {config.quickSleep
              ? "Stop moving: it gets sleepy at 3 s and falls asleep at 6 s. Move to wake it up."
              : "Default timings: sleepy after 30 s, asleep after 60 s of no activity."}
          </p>
        </Group>

        <Group title="Speech bubble">
          <Toggle
            label="Show speech bubbles"
            checked={config.showSpeechBubble}
            onChange={(v) => set("showSpeechBubble", v)}
          />
          <form
            className="flex gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              mascot.say(sayText);
            }}
          >
            <input
              className={`${field} mt-0`}
              value={sayText}
              onChange={(e) => setSayText(e.target.value)}
              aria-label="Message to say"
              data-tinypal-ignore
            />
            <button
              type="submit"
              className="rounded-lg bg-brand-500 px-4 text-sm font-semibold text-white hover:bg-brand-600"
            >
              Say
            </button>
          </form>
        </Group>

        <Group title="Event messages">
          {(Object.keys(config.messages) as (keyof PlaygroundConfig["messages"])[]).map((k) => (
            <label key={k} className="block text-sm capitalize text-slate-600 dark:text-slate-400">
              {k}
              <input
                className={field}
                value={config.messages[k]}
                onChange={(e) => set("messages", { ...config.messages, [k]: e.target.value })}
                data-tinypal-ignore
              />
            </label>
          ))}
          <div className="flex flex-wrap gap-2 pt-1">
            <button
              type="button"
              className={chip(false)}
              onClick={() => mascot.emit("api:success")}
            >
              emit success
            </button>
            <button type="button" className={chip(false)} onClick={() => mascot.emit("api:error")}>
              emit error
            </button>
            <button
              type="button"
              className={chip(false)}
              onClick={() => mascot.emit("api:loading")}
            >
              emit loading
            </button>
          </div>
        </Group>

        <div className="lg:col-span-1">
          <p className="mb-2 text-sm font-semibold">Your code</p>
          <CodeBlock code={toCode(config)} file="App.tsx" />
        </div>
      </div>
    </Section>
  );
}
