// React API
export { ContextMascot, MascotProvider } from "./components";
export type { ContextMascotProps, MascotProviderProps } from "./components";
export type { MascotViewProps, TrackingSpeed, TrackingSpeedPreset } from "./MascotView";
export { TRACKING_SPEEDS } from "./MascotView";
export { useMascot, useMascotState, useMascotMessage } from "./hooks";
export { useCreateMascot } from "./context";

// Engine (framework-independent) - re-exported so one import is enough.
export {
  createMascot,
  watchIdle,
  renderCharacter,
  face,
  applyState,
  applyLook,
  ensureStyles,
  createCursorTracker,
  fx,
  MASCOT_CSS,
  EXPRESSIONS,
  ACTIONS,
  MASCOT_EVENTS,
  DEFAULT_MESSAGES,
} from "@tinypal/core";
export type {
  Mascot,
  MascotOptions,
  MascotState,
  MascotEventName,
  Expression,
  Action,
  PlayName,
  Reaction,
  ReactionTable,
  MessageMap,
  CharacterDefinition,
  MascotPosition,
  PositionPreset,
  FixedCoordinates,
  AttachedPosition,
  Offset,
  Theme,
  FaceOptions,
  FxOptions,
  IdleOptions,
} from "@tinypal/core";

// Characters
export { characters, characterList, defineCharacter } from "@tinypal/characters";
export type { CharacterId } from "@tinypal/characters";

// Adapters
export {
  trackSubmit,
  observeForms,
  rhfHandlers,
  formikSubmit,
  formikInvalid,
  createMascotFetch,
  attachAxios,
} from "@tinypal/adapters";
