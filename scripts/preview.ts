/**
 * Dev tool: writes a static HTML sheet showing every character in every
 * expression/action. Usage: npx tsx scripts/preview.ts <out.html>
 */
import { writeFileSync } from "node:fs";
import { ACTIONS, EXPRESSIONS, MASCOT_CSS, renderCharacter } from "@tinypal/core";
import { characterList } from "@tinypal/characters";

const out = process.argv[2];
if (!out) throw new Error("usage: preview.ts <out.html>");

const cell = (svg: string, label: string) =>
  `<figure><div class="art">${svg}</div><figcaption>${label}</figcaption></figure>`;

const sections = characterList
  .map((c) => {
    const rows = (theme: "light" | "dark") => {
      const ex = EXPRESSIONS.map((e) =>
        cell(renderCharacter(c, { size: 110, expression: e, theme, reducedMotion: true }), e),
      );
      const ac = ACTIONS.map((a) =>
        cell(renderCharacter(c, { size: 110, action: a, theme, reducedMotion: true }), a),
      );
      return `<div class="grid ${theme}">${[...ex, ...ac].join("")}</div>`;
    };
    return `<h2>${c.name}</h2>${rows("light")}${rows("dark")}`;
  })
  .join("");

writeFileSync(
  out,
  `<!doctype html><meta charset="utf-8"><style>${MASCOT_CSS}
body{font:12px system-ui;margin:16px;background:#fff}
.grid{display:grid;grid-template-columns:repeat(8,1fr);gap:6px;padding:10px;border-radius:12px;margin-bottom:8px}
.light{background:#f4f6fb}.dark{background:#141a28;color:#cbd5e1}
figure{margin:0;text-align:center}.art{display:flex;justify-content:center}
</style>${sections}`,
);
