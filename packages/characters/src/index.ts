import type { CharacterDefinition } from "@tinypal/core";
import { alien } from "./alien";
import { bear } from "./bear";
import { blob } from "./blob";
import { bunny } from "./bunny";
import { cactus } from "./cactus";
import { cat } from "./cat";
import { chick } from "./chick";
import { dino } from "./dino";
import { dog } from "./dog";
import { fox } from "./fox";
import { frog } from "./frog";
import { ghost } from "./ghost";
import { monster } from "./monster";
import { mouse } from "./mouse";
import { owl } from "./owl";
import { panda } from "./panda";
import { penguin } from "./penguin";
import { pip } from "./pip";
import { robot } from "./robot";

export {
  alien,
  bear,
  blob,
  bunny,
  cactus,
  cat,
  chick,
  dino,
  dog,
  fox,
  frog,
  ghost,
  monster,
  mouse,
  owl,
  panda,
  penguin,
  pip,
  robot,
};

/** All built-in characters, keyed by id. */
export const characters = {
  robot,
  cat,
  dog,
  fox,
  panda,
  alien,
  ghost,
  bunny,
  blob,
  owl,
  penguin,
  dino,
  mouse,
  monster,
  chick,
  frog,
  bear,
  cactus,
  pip,
} satisfies Record<string, CharacterDefinition>;
export type CharacterId = keyof typeof characters;
export const characterList: CharacterDefinition[] = Object.values(characters);

/** Identity helper that type-checks a custom character definition. */
export function defineCharacter(definition: CharacterDefinition): CharacterDefinition {
  return definition;
}
