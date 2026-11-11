# Characters

Pass a character id to `character`:

```tsx
<ContextMascot character="fox" />
```

| id        | Character                                             |
| --------- | ----------------------------------------------------- |
| `robot`   | Friendly helper bot with an LED-screen face (default) |
| `cat`     | Orange tabby with whiskers and a curled tail          |
| `dog`     | Pup with floppy ears, an eye patch and a collar       |
| `fox`     | Fox with a white mask and a bushy tail                |
| `panda`   | Round panda with eye patches                          |
| `alien`   | Big-eyed alien in a space suit                        |
| `ghost`   | Floating ghost with a wavy hem                        |
| `bunny`   | Bunny with tall uneven ears                           |
| `blob`    | Squishy mint jelly blob                               |
| `owl`     | Brown owl with huge yellow eyes                       |
| `penguin` | Penguin with a red scarf                              |
| `dino`    | Little T-rex with tiny arms                           |
| `mouse`   | Grey mouse holding a wedge of cheese                  |
| `monster` | Fluffy one-eyed purple monster                        |
| `chick`   | Baby chick in a cracked eggshell                      |
| `frog`    | Frog with eyes on top of its head                     |
| `bear`    | Teddy bear with a bow tie                             |
| `cactus`  | Potted cactus with a flower                           |
| `pip`     | Blue sidekick with a monocle, sweater and teddy       |

Every character supports all [expressions and animations](expressions.md).

## Switching characters

`character` is an ordinary prop, so switching is just a state change. The
current expression is kept:

```tsx
const [character, setCharacter] = useState<CharacterId>("robot");

<ContextMascot character={character} />
<button onClick={() => setCharacter("panda")}>Panda</button>
```

## Listing characters

```ts
import { characters, characterList } from "tinypal";

characters.cat; // the cat definition
characterList.map((c) => c.name); // ["Robot", "Cat", ...]
```

## Size and theme

```tsx
<ContextMascot character="owl" size={180} theme="dark" />
```

- `size` is in pixels (default `150`). On screens narrower than 640px the mascot
  shrinks to 70% unless you pass `responsive={false}`.
- `theme` is `"light"` (default), `"dark"` or `"auto"` (follows the visitor's
  OS setting). It adjusts the shadow and the speech bubble colours so the mascot
  reads well on light and dark pages.

## Your own character

See [Custom characters](custom-characters.md).
