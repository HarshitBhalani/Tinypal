import { ContextMascot, characterList, useCreateMascot, useMascot } from "@tinypal/react";
import type { CharacterDefinition, CharacterId, Expression } from "@tinypal/react";
import { Section } from "../components/ui";
import type { SiteTheme } from "../hooks/useTheme";

const PREVIEW: Expression[] = [
  "happy",
  "curious",
  "thinking",
  "surprised",
  "confused",
  "sad",
  "sleepy",
];

function CharacterCard({
  character,
  selected,
  onSelect,
  theme,
}: {
  character: CharacterDefinition;
  selected: boolean;
  onSelect: () => void;
  theme: SiteTheme;
}) {
  const mascot = useCreateMascot({ autoMessages: false });
  const floating = useMascot();

  return (
    <div
      onMouseEnter={() => mascot.play("happy")}
      onMouseLeave={() => mascot.play("idle")}
      className={`group relative flex flex-col items-center rounded-2xl border bg-white p-5 transition dark:bg-ink-900 ${
        selected
          ? "border-brand-500 shadow-lg shadow-brand-500/15 ring-1 ring-brand-500"
          : "border-slate-200 hover:-translate-y-0.5 hover:shadow-lg dark:border-ink-700"
      }`}
    >
      {selected && (
        <span className="absolute right-3 top-3 rounded-full bg-brand-500 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
          Active
        </span>
      )}
      <div className="flex h-[130px] items-end">
        <ContextMascot
          mascot={mascot}
          character={character}
          position="inline"
          size={120}
          theme={theme}
          enableIdleAnimation={false}
          showSpeechBubble={false}
          responsive={false}
        />
      </div>
      <h3 className="mt-3 font-semibold">{character.name}</h3>
      <p className="mt-1 min-h-[40px] text-center text-sm text-slate-500 dark:text-slate-400">
        {character.description}
      </p>
      <div className="mt-3 flex gap-1" aria-label={`${character.name} expressions`}>
        {PREVIEW.map((e) => (
          <button
            key={e}
            type="button"
            title={e}
            aria-label={`Show ${e}`}
            onMouseEnter={() => mascot.play(e)}
            onFocus={() => mascot.play(e)}
            onClick={() => mascot.play(e)}
            className="h-2.5 w-2.5 rounded-full bg-slate-300 transition hover:scale-150 hover:bg-brand-500 dark:bg-ink-700"
          />
        ))}
      </div>
      <button
        type="button"
        onClick={() => {
          onSelect();
          floating.play("happy", { duration: 2000 });
          floating.play("waving", { duration: 1400 });
          floating.say(`Hi! I'm ${character.name}.`, { duration: 2500 });
        }}
        className={`mt-4 w-full rounded-lg py-2 text-sm font-semibold transition ${
          selected
            ? "bg-brand-500 text-white"
            : "bg-slate-100 text-slate-700 hover:bg-brand-500 hover:text-white dark:bg-ink-800 dark:text-slate-200"
        }`}
      >
        {selected ? "Your companion" : "Use this mascot"}
      </button>
    </div>
  );
}

export function Gallery({
  selected,
  onSelect,
  theme,
}: {
  selected: CharacterId;
  onSelect: (id: CharacterId) => void;
  theme: SiteTheme;
}) {
  return (
    <Section
      id="characters"
      eyebrow="Characters"
      title="19 original companions"
      lead="Every character supports the same 8 expressions and 7 animations. Pick one and it becomes the companion in the corner of this page."
      className="bg-slate-50/70 dark:bg-ink-900/40"
    >
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {characterList.map((c) => (
          <CharacterCard
            key={c.id}
            character={c}
            selected={selected === c.id}
            onSelect={() => onSelect(c.id as CharacterId)}
            theme={theme}
          />
        ))}
      </div>
    </Section>
  );
}
