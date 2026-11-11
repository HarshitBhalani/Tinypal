import { ContextMascot, EXPRESSIONS, useCreateMascot } from "@tinypal/react";
import { useState } from "react";
import type { CharacterId, Expression, Mascot, TrackingSpeedPreset } from "@tinypal/react";

const SPEEDS: TrackingSpeedPreset[] = ["slow", "normal", "fast", "instant"];
import { Button, InstallCommand } from "../components/ui";
import { INSTALL } from "../data/links";
import type { SiteTheme } from "../hooks/useTheme";

const CLICK_REACTIONS: { play: Expression; say: string }[] = [
  { play: "happy", say: "Hi there! I follow your cursor." },
  { play: "surprised", say: "Whoa, that tickles!" },
  { play: "curious", say: "Try hovering the expressions below." },
  { play: "happy", say: "I react to forms, APIs and inactivity." },
];

let clicks = 0;
const onHeroClick = (m: Mascot) => {
  const r = CLICK_REACTIONS[clicks++ % CLICK_REACTIONS.length]!;
  m.play(r.play, { duration: 2200 });
  m.play("waving", { duration: 1400 });
  m.say(r.say, { duration: 2600 });
};

const HERO_CHARACTERS: CharacterId[] = ["robot", "cat", "fox", "ghost"];

export function Hero({ theme }: { theme: SiteTheme }) {
  const mascot = useCreateMascot({ autoMessages: true });
  const [character, setCharacter] = useState<CharacterId>("robot");
  const [speed, setSpeed] = useState<TrackingSpeedPreset>("normal");

  return (
    <section
      id="top"
      className="relative overflow-hidden px-4 pb-20 pt-16 sm:px-6 sm:pb-28 sm:pt-24"
    >
      <div className="grid-bg pointer-events-none absolute inset-0" aria-hidden="true" />
      <div
        className="pointer-events-none absolute -top-40 left-1/2 h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-brand-500/20 blur-3xl dark:bg-brand-500/15"
        aria-hidden="true"
      />
      <div className="relative mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[1.1fr_1fr]">
        <div className="text-center lg:text-left">
          <h1 className="text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl">
            Give your website a{" "}
            <span className="bg-gradient-to-r from-brand-500 via-fuchsia-500 to-orange-400 bg-clip-text text-transparent">
              little personality.
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg text-slate-600 lg:mx-0 dark:text-slate-400">
            An interactive mascot SDK that understands your website and reacts to every important
            moment: form submits, failed requests, loading states, and quiet afternoons.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3 lg:justify-start">
            <Button href="#code">Get started</Button>
            <Button href="#characters" variant="secondary">
              Explore characters
            </Button>
          </div>
          <div className="mt-8">
            <InstallCommand command={INSTALL} />
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-md">
          <div className="relative rounded-3xl border border-slate-200 bg-white/70 p-6 shadow-2xl shadow-brand-500/10 backdrop-blur dark:border-ink-700 dark:bg-ink-900/70">
            <div
              role="group"
              aria-label="Choose a character"
              className="flex justify-center gap-1 rounded-xl bg-slate-100 p-1 dark:bg-ink-800"
            >
              {HERO_CHARACTERS.map((c) => (
                <button
                  key={c}
                  type="button"
                  aria-pressed={character === c}
                  onClick={() => {
                    setCharacter(c);
                    mascot.play("happy", { duration: 1500 });
                    mascot.play("waving", { duration: 1200 });
                  }}
                  className={`flex-1 rounded-lg px-3 py-1.5 text-sm font-medium capitalize transition ${
                    character === c
                      ? "bg-white text-slate-900 shadow-sm dark:bg-ink-700 dark:text-white"
                      : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
            <div className="flex min-h-[300px] items-end justify-center pt-12">
              <ContextMascot
                mascot={mascot}
                character={character}
                position="inline"
                size={240}
                theme={theme}
                headTracking
                responsive={false}
                trackingSpeed={speed}
                onClick={onHeroClick}
              />
            </div>
            <p className="mt-2 text-center text-xs text-slate-500 dark:text-slate-400">
              Move your cursor. Click me. Hover an expression.
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-1.5">
              {EXPRESSIONS.map((e) => (
                <button
                  key={e}
                  type="button"
                  onMouseEnter={() => mascot.play(e)}
                  onFocus={() => mascot.play(e)}
                  onClick={() => mascot.play(e, { duration: 2500 })}
                  onMouseLeave={() => mascot.play("idle")}
                  className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium capitalize text-slate-600 transition hover:border-brand-400 hover:text-brand-600 dark:border-ink-700 dark:bg-ink-800 dark:text-slate-300 dark:hover:text-brand-300"
                >
                  {e}
                </button>
              ))}
            </div>
            <div className="mt-5 flex items-center justify-center gap-2 border-t border-slate-200 pt-4 dark:border-ink-700">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Eye speed
              </span>
              <div
                role="group"
                aria-label="Eye speed"
                className="flex gap-0.5 rounded-lg bg-slate-100 p-0.5 dark:bg-ink-800"
              >
                {SPEEDS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    aria-pressed={speed === s}
                    onClick={() => setSpeed(s)}
                    className={`rounded-md px-2.5 py-1 text-xs font-medium capitalize transition ${
                      speed === s
                        ? "bg-white text-slate-900 shadow-sm dark:bg-ink-700 dark:text-white"
                        : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
