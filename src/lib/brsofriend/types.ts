export interface ValidationIssue {
  code: string;
  message: string;
  offset?: number;
}

export interface ValidationResult {
  valid: boolean;
  issues: ValidationIssue[];
}

export interface BrsoArticulation {
  name: string;
  icon: number;
  note: number;
  notev: number;
  prog: number;
  modw: number;
  modc: number;
}

export interface BrsoController {
  name: string;
  type?: number;
  default?: number;
  cc?: number;
  on?: number;
  value?: number;
  lock?: number;
}

export interface BrsoSettings {
  Articulations: BrsoArticulation[];
  Controllers: BrsoController[];
  ControllerPages: unknown[];
  Keys: BrsoKeySlot[];
  Settings: Record<string, number | boolean | string>;
}

export interface BrsoKeyMapping {
  note: number;
  name: string;
}

export interface BrsoKeySlot {
  slot: number;
  mappings: BrsoKeyMapping[];
}

export interface FstMetadata {
  fileSize: number;
  flDataLength: number;
  brsoFormatVersion: number;
  brsoPayloadOffset: number;
  brsoPayloadLength: number;
  channelColorHex?: string;
}

export interface DecodedFst {
  settings: BrsoSettings;
  metadata: FstMetadata;
  warnings: string[];
}

export interface SettingsValidationError {
  path: string;
  message: string;
}
