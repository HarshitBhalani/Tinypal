import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import type { UserConfig } from "vite";

/**
 * Shared Vite config for the examples. `tinypal` points at the local source
 * so the examples import it exactly like an app using the published package.
 */
export const exampleConfig: UserConfig = {
  plugins: [react()],
  resolve: {
    alias: {
      tinypal: fileURLToPath(new URL("../packages/react/src/index.ts", import.meta.url)),
    },
  },
};
