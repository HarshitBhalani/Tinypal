import { defineConfig } from "tsup";
import type { Options } from "tsup";

const shared: Options = {
  format: ["esm", "cjs"],
  dts: { resolve: [/^@tinypal\//] },
  // Bundle the internal workspace packages; React stays a peer dependency.
  noExternal: [/^@tinypal\//],
  external: ["react", "react/jsx-runtime"],
  target: "es2020",
  treeshake: true,
  minify: true,
  sourcemap: false,
  splitting: false,
  tsconfig: "tsconfig.build.json",
};

export default defineConfig([
  {
    ...shared,
    entry: { index: "src/index.ts" },
    clean: true,
    // "use client" is prepended by scripts/copy-files.mjs after bundling,
    // because the bundler strips module-level directives.
  },
  {
    ...shared,
    entry: { core: "src/core.ts" },
    clean: false,
  },
]);
