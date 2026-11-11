// Copies README / LICENSE / CHANGELOG from the repo root into the package and
// rewrites relative links so they work on npmjs.com.
import { copyFileSync, readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const pkg = fileURLToPath(new URL("..", import.meta.url));
const root = fileURLToPath(new URL("../../..", import.meta.url));
const BLOB = "https://github.com/HarshitBhalani/Tinypal/blob/main/";

const readme = readFileSync(`${root}README.md`, "utf8").replace(
  /\]\((?!https?:|#)([^)]+)\)/g,
  (_, path) => `](${BLOB}${path})`,
);
writeFileSync(`${pkg}README.md`, readme);
// Next.js App Router: the React entry must start with "use client".
for (const file of ["dist/index.js", "dist/index.cjs"]) {
  const code = readFileSync(`${pkg}${file}`, "utf8");
  if (!code.startsWith('"use client"')) writeFileSync(`${pkg}${file}`, `"use client";\n${code}`);
}

copyFileSync(`${root}LICENSE`, `${pkg}LICENSE`);
copyFileSync(`${root}CHANGELOG.md`, `${pkg}CHANGELOG.md`);
console.log("copied README.md (links rewritten), LICENSE, CHANGELOG.md");
