export const MAX_SAVED_FSTS = 16;
export const MAX_COLOR_HISTORY = 12;
export const KEY_MAPPINGS_PER_PAGE = 12;

export const STORAGE_KEYS = {
  savedFsts: "brsofriend.saved-fsts",
  defaultName: "brsofriend.default-name",
  uiSettings: "brsofriend.ui-settings",
  channelColor: "brsofriend.channel-color",
  colorHistory: "brsofriend.color-history",
} as const;

export interface UiSettings {
  showDefaultName: boolean;
  showDebugTools: boolean;
  showKeyMapping: boolean;
}

export const INITIAL_UI_SETTINGS: UiSettings = {
  showDefaultName: true,
  showDebugTools: false,
  showKeyMapping: false,
};

export interface SavedFst {
  name: string;
  data: ArrayBuffer;
  articulationCount: number;
  channelColor: string;
}

export const ARTICULATION_COLORS = [
  { source: "#9ED1A5", light: "#C0E1C5" }, { source: "#9FD3BA", light: "#C1E2D2" },
  { source: "#A1D6D0", light: "#C2E4E0" }, { source: "#A3CAD8", light: "#C3DDE6" },
  { source: "#A5B8DB", light: "#C5D1E8" }, { source: "#A8A7DE", light: "#C6C6EA" },
  { source: "#BCA7DE", light: "#D3C6EA" }, { source: "#D1A7DE", light: "#E1C6EA" },
  { source: "#DDA7D6", light: "#E9C6E4" }, { source: "#DBA5C0", light: "#E8C5D6" },
  { source: "#D9A3A9", light: "#E6C3C7" }, { source: "#D6AFA2", light: "#E4CBC3" },
  { source: "#D4C1A0", light: "#E3D7C1" }, { source: "#D1D29E", light: "#E1E2C0" },
  { source: "#BDD19E", light: "#D4E1C0" }, { source: "#A9D19D", light: "#C7E1BF" },
] as const;

export function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  return `${(bytes / 1024).toFixed(1)} KB`;
}
