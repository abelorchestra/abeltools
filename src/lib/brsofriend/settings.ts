import type {
  BrsoArticulation,
  BrsoKeySlot,
  BrsoSettings,
  SettingsValidationError,
} from "./types";

export const MAX_ARTICULATIONS = 16;

export function createDefaultArticulation(index = 0): BrsoArticulation {
  return {
    name: "",
    icon: 55,
    note: index,
    notev: 127,
    prog: -1,
    modw: -1,
    modc: -1,
  };
}

export function createDefaultBrsoSettings(): BrsoSettings {
  return {
    Articulations: [createDefaultArticulation()],
    Controllers: [],
    ControllerPages: [],
    Keys: [],
    Settings: {},
  };
}

const NOTE_OFFSETS: Record<string, number> = {
  C: 0, "C#": 1, DB: 1, D: 2, "D#": 3, EB: 3, E: 4,
  F: 5, "F#": 6, GB: 6, G: 7, "G#": 8, AB: 8, A: 9,
  "A#": 10, BB: 10, B: 11,
};

export function noteNumberToName(note: number) {
  if (!Number.isInteger(note) || note < -1 || note > 128) return "";
  const names = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
  const normalized = ((note % 12) + 12) % 12;
  return `${names[normalized]}${Math.floor(note / 12) - 2}`;
}

export function parseNoteName(value: string): number | null {
  const match = value.trim().match(/^([A-Ga-g])([#♯b♭]?)(-?\d+)$/);
  if (!match) return null;
  const accidental = match[2].replace("♯", "#").replace("♭", "b");
  const key = `${match[1]}${accidental}`.toUpperCase();
  const offset = NOTE_OFFSETS[key];
  if (offset === undefined) return null;
  const note = (Number(match[3]) + 2) * 12 + offset;
  return Number.isInteger(note) && note >= -1 && note <= 128 ? note : null;
}

export function validateBrsoSettings(settings: BrsoSettings): SettingsValidationError[] {
  const errors: SettingsValidationError[] = [];
  if (settings.Articulations.length === 0) {
    errors.push({ path: "Articulations", message: "Articulation을 하나 이상 추가하세요." });
  }
  if (settings.Articulations.length > MAX_ARTICULATIONS) {
    errors.push({ path: "Articulations", message: `Articulation은 최대 ${MAX_ARTICULATIONS}개입니다.` });
  }
  settings.Articulations.forEach((articulation, index) => {
    if (!Number.isInteger(articulation.note) || articulation.note < -1 || articulation.note > 128) {
      errors.push({ path: `Articulations.${index}.note`, message: "Note는 -1~128 사이의 정수여야 합니다." });
    }
  });
  settings.Keys.forEach((slot) => slot.mappings.forEach((mapping, index) => {
    if (!mapping.name.trim()) errors.push({ path: `Keys.${slot.slot}.${index}.name`, message: "Key mapping 이름을 입력하세요." });
    if (!Number.isInteger(mapping.note) || mapping.note < -1 || mapping.note > 128) {
      errors.push({ path: `Keys.${slot.slot}.${index}.note`, message: "Key mapping note는 -1~128 사이의 정수여야 합니다." });
    }
  }));
  return errors;
}

function compactArticulation(articulation: BrsoArticulation) {
  return {
    name: articulation.name,
    ...(articulation.icon !== 55 ? { icon: articulation.icon } : {}),
    ...(articulation.note !== -1 ? { note: articulation.note } : {}),
    ...(articulation.notev !== 127 ? { notev: articulation.notev } : {}),
    ...(articulation.prog !== -1 ? { prog: articulation.prog } : {}),
    ...(articulation.modw !== -1 ? { modw: articulation.modw } : {}),
    ...(articulation.modc !== -1 ? { modc: articulation.modc } : {}),
  };
}

function serializeKeys(slots: BrsoKeySlot[]) {
  const keys = Array.from({ length: 9 }, () => ({} as Record<string, unknown>));
  for (const slot of slots) {
    if (slot.mappings.length === 0) continue;
    const note = Array.from<null | string>({ length: 129 }).fill(null);
    for (const mapping of slot.mappings) if (mapping.note >= 0) note[mapping.note] = mapping.name;
    keys[slot.slot - 1] = { note };
  }
  while (keys.length > 0 && Object.keys(keys[keys.length - 1]).length === 0) keys.pop();
  return keys;
}

export function serializeBrsoSettings(settings: BrsoSettings) {
  return {
    Articulations: settings.Articulations.map(compactArticulation),
    Controllers: settings.Controllers,
    ControllerPages: settings.ControllerPages,
    Keys: serializeKeys(settings.Keys),
    Settings: settings.Settings,
  };
}

export function exportBrsoSettings(settings: BrsoSettings, filename = "brsofriend.brsoartic") {
  const errors = validateBrsoSettings(settings);
  if (errors.length > 0) throw new Error(errors[0].message);
  const blob = new Blob([JSON.stringify(serializeBrsoSettings(settings), null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}
