import type { ReactionTable } from "../types";

/** Default website-event to mascot-reaction table. Override per instance. */
export const DEFAULT_REACTIONS: ReactionTable = {
  "form:focus": { expression: "curious" },
  "form:input": { expression: "thinking" },
  "form:invalid": { expression: "confused", revertAfter: 3000 },
  "form:submit": { expression: "thinking", action: "loading" },
  "form:success": { expression: "happy", action: "celebrating", revertAfter: 3000 },
  "form:error": { expression: "sad", revertAfter: 4000 },
  "form:reset": { expression: "idle" },
  "api:start": { expression: "thinking", action: "loading" },
  "api:loading": { expression: "thinking", action: "loading" },
  "api:success": { expression: "happy", action: "celebrating", revertAfter: 3000 },
  "api:error": { expression: "sad", revertAfter: 4000 },
  "api:network-error": { expression: "sad", revertAfter: 4000 },
  "api:cancelled": { expression: "idle" },
};
