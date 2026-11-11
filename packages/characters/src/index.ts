import type { CharacterDefinition } from "@tinypal/core";
import { alien } from "./alien";
import { bunny } from "./bunny";
import { cat } from "./cat";
import { dog } from "./dog";
import { fox } from "./fox";
import { ghost } from "./ghost";
import { panda } from "./panda";
import { robot } from "./robot";

export { alien, bunny, cat, dog, fox, ghost, panda, robot };

/** All built-in characters, keyed by id. */
export const characters = { robot, cat, dog, fox, panda, alien, ghost, bunny } satisfies Record<
  string,
  CharacterDefinition
>;
export type CharacterId = keyof typeof characters;
export const characterList: CharacterDefinition[] = Object.values(characters);

/** Identity helper that type-checks a custom character definition. */
export function defineCharacter(definition: CharacterDefinition): CharacterDefinition {
  return definition;
}
