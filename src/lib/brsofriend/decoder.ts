import type {
  BrsoArticulation,
  BrsoKeyMapping,
  DecodedFst,
  ValidationIssue,
  ValidationResult,
} from "./types";

const FL_HEADER = "FLhd";
const FL_DATA = "FLdt";
const BRSO_PLUGIN_DATA_EVENT = 213;
const MAX_ARTICULATIONS = 64;

class FstDecodeError extends Error {
  constructor(
    message: string,
    readonly code: string,
    readonly offset?: number,
  ) {
    super(message);
    this.name = "FstDecodeError";
  }
}

function ascii(view: DataView, offset: number, length: number) {
  let value = "";
  for (let index = 0; index < length; index += 1) {
    value += String.fromCharCode(view.getUint8(offset + index));
  }
  return value;
}

function readVariableLength(view: DataView, start: number) {
  let offset = start;
  let value = 0;
  let shift = 0;

  for (let count = 0; count < 5; count += 1) {
    if (offset >= view.byteLength) {
      throw new FstDecodeError("이벤트 길이가 파일 끝에서 잘렸습니다.", "TRUNCATED_EVENT_LENGTH", offset);
    }
    const byte = view.getUint8(offset);
    offset += 1;
    value |= (byte & 0x7f) << shift;
    if ((byte & 0x80) === 0) return { value, nextOffset: offset };
    shift += 7;
  }

  throw new FstDecodeError("지원하지 않는 이벤트 길이 값입니다.", "INVALID_EVENT_LENGTH", start);
}

interface FlEvent {
  id: number;
  eventOffset: number;
  payloadOffset: number;
  payloadLength: number;
}

function readEvents(view: DataView): FlEvent[] {
  const events: FlEvent[] = [];
  let offset = 22;

  while (offset < view.byteLength) {
    const eventOffset = offset;
    const id = view.getUint8(offset);
    offset += 1;

    let payloadLength: number;
    if (id < 64) payloadLength = 1;
    else if (id < 128) payloadLength = 2;
    else if (id < 192) payloadLength = 4;
    else {
      const decodedLength = readVariableLength(view, offset);
      payloadLength = decodedLength.value;
      offset = decodedLength.nextOffset;
    }

    if (payloadLength < 0 || offset + payloadLength > view.byteLength) {
      throw new FstDecodeError("FL Studio 이벤트 데이터가 파일 끝에서 잘렸습니다.", "TRUNCATED_EVENT", eventOffset);
    }

    events.push({ id, eventOffset, payloadOffset: offset, payloadLength });
    offset += payloadLength;
  }

  return events;
}

function validateBuffer(buffer: ArrayBuffer): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const view = new DataView(buffer);

  if (view.byteLength < 22) {
    return [{ code: "FILE_TOO_SMALL", message: "FL Studio FST 헤더보다 파일이 작습니다." }];
  }
  if (ascii(view, 0, 4) !== FL_HEADER) {
    issues.push({ code: "INVALID_FL_HEADER", message: "FLhd 시그니처가 없습니다.", offset: 0 });
  }
  if (view.getUint32(4, true) !== 6) {
    issues.push({ code: "UNSUPPORTED_HEADER", message: "지원하지 않는 FL Studio 헤더 길이입니다.", offset: 4 });
  }
  if (ascii(view, 14, 4) !== FL_DATA) {
    issues.push({ code: "INVALID_DATA_HEADER", message: "FLdt 데이터 청크가 없습니다.", offset: 14 });
  }
  const declaredLength = view.getUint32(18, true);
  if (declaredLength !== view.byteLength - 22) {
    issues.push({ code: "DATA_LENGTH_MISMATCH", message: "FLdt 청크 길이와 실제 파일 크기가 다릅니다.", offset: 18 });
  }

  if (issues.length === 0) {
    try {
      const candidates = readEvents(view).filter((event) => event.id === BRSO_PLUGIN_DATA_EVENT);
      if (!candidates.some((event) => isBrsoPayload(view, event))) {
        issues.push({ code: "BRSO_PAYLOAD_NOT_FOUND", message: "BRSO Articulate 설정 payload를 찾지 못했습니다." });
      }
    } catch (error) {
      if (error instanceof FstDecodeError) {
        issues.push({ code: error.code, message: error.message, offset: error.offset });
      } else {
        throw error;
      }
    }
  }

  return issues;
}

function isBrsoPayload(view: DataView, event: FlEvent) {
  if (event.payloadLength < 6) return false;
  const version = view.getUint32(event.payloadOffset, true);
  const count = view.getUint16(event.payloadOffset + 4, true);
  const minimumLength = 6 + count * 6 * 4 + count * 2;
  return version === 10 && count <= MAX_ARTICULATIONS && event.payloadLength >= minimumLength;
}

class PayloadCursor {
  offset: number;
  readonly end: number;

  constructor(
    private readonly view: DataView,
    start: number,
    length: number,
  ) {
    this.offset = start;
    this.end = start + length;
  }

  uint16() {
    this.ensure(2);
    const value = this.view.getUint16(this.offset, true);
    this.offset += 2;
    return value;
  }

  uint32() {
    this.ensure(4);
    const value = this.view.getUint32(this.offset, true);
    this.offset += 4;
    return value;
  }

  int32() {
    this.ensure(4);
    const value = this.view.getInt32(this.offset, true);
    this.offset += 4;
    return value;
  }

  string() {
    const length = this.uint16();
    this.ensure(length);
    const bytes = new Uint8Array(this.view.buffer, this.view.byteOffset + this.offset, length);
    const value = new TextDecoder("utf-8", { fatal: true }).decode(bytes);
    this.offset += length;
    return value;
  }

  private ensure(length: number) {
    if (this.offset + length > this.end) {
      throw new FstDecodeError("BRSO payload가 예상보다 일찍 끝났습니다.", "TRUNCATED_BRSO_PAYLOAD", this.offset);
    }
  }
}

function readInt32Array(cursor: PayloadCursor, count: number) {
  return Array.from({ length: count }, () => cursor.int32());
}

function decodeArticulations(view: DataView, event: FlEvent) {
  const cursor = new PayloadCursor(view, event.payloadOffset, event.payloadLength);
  const formatVersion = cursor.uint32();
  const count = cursor.uint16();
  const notes = readInt32Array(cursor, count);
  const noteVelocities = readInt32Array(cursor, count);
  const programs = readInt32Array(cursor, count);
  const modWheels = readInt32Array(cursor, count);
  const modControllers = readInt32Array(cursor, count);
  const icons = readInt32Array(cursor, count);
  const names = Array.from({ length: count }, () => cursor.string());

  const articulations: BrsoArticulation[] = names.map((name, index) => ({
    name,
    icon: icons[index],
    note: notes[index],
    notev: noteVelocities[index],
    prog: programs[index],
    modw: modWheels[index],
    modc: modControllers[index],
  }));

  return { articulations, formatVersion, nextOffset: cursor.offset };
}

function isMappingName(value: string) {
  return value.length > 0 && value.length <= 128 && !/[\u0000-\u001f]/.test(value);
}

interface MappingBlock {
  start: number;
  end: number;
  mappings: BrsoKeyMapping[];
}

function findKeyMappingBlocks(view: DataView, start: number, end: number) {
  const blocks: MappingBlock[] = [];
  let offset = start;

  while (offset + 2 <= end && blocks.length < 16) {
    const count = view.getUint16(offset, true);
    if (count < 2 || count > 128) {
      offset += 2;
      continue;
    }

    const mappings: BrsoKeyMapping[] = [];
    let cursor = offset + 2;
    try {
      for (let index = 0; index < count; index += 1) {
        if (cursor + 4 > end) throw new Error("out of bounds");
        const note = view.getUint16(cursor, true);
        const length = view.getUint16(cursor + 2, true);
        cursor += 4;
        if (note > 128 || length === 0 || cursor + length > end) throw new Error("invalid mapping");
        const bytes = new Uint8Array(view.buffer, view.byteOffset + cursor, length);
        const name = new TextDecoder("utf-8", { fatal: true }).decode(bytes);
        if (!isMappingName(name)) throw new Error("invalid name");
        mappings.push({ note, name });
        cursor += length;
      }
    } catch {
      offset += 2;
      continue;
    }

    blocks.push({ start: offset, end: cursor, mappings });
    offset = cursor;
  }

  return blocks.map((block, index) => ({ slot: index + 1, mappings: block.mappings }));
}

function locateKeyMappingBlocks(view: DataView, start: number, end: number) {
  const blocks: MappingBlock[] = [];
  let offset = start;
  while (offset + 2 <= end && blocks.length < 16) {
    const count = view.getUint16(offset, true);
    if (count < 2 || count > 128) { offset += 2; continue; }
    const mappings: BrsoKeyMapping[] = [];
    let cursor = offset + 2;
    let valid = true;
    for (let index = 0; index < count && valid; index += 1) {
      if (cursor + 4 > end) { valid = false; break; }
      const note = view.getUint16(cursor, true);
      const length = view.getUint16(cursor + 2, true);
      cursor += 4;
      if (note > 128 || length === 0 || cursor + length > end) { valid = false; break; }
      try {
        const bytes = new Uint8Array(view.buffer, view.byteOffset + cursor, length);
        const name = new TextDecoder("utf-8", { fatal: true }).decode(bytes);
        if (!isMappingName(name)) { valid = false; break; }
        mappings.push({ note, name });
      } catch { valid = false; break; }
      cursor += length;
    }
    if (valid) {
      blocks.push({ start: offset, end: cursor, mappings });
      offset = cursor;
    } else offset += 2;
  }
  return blocks;
}

function variableLengthBytes(value: number) {
  const bytes: number[] = [];
  let remaining = value;
  do {
    let byte = remaining & 0x7f;
    remaining >>>= 7;
    if (remaining > 0) byte |= 0x80;
    bytes.push(byte);
  } while (remaining > 0);
  return new Uint8Array(bytes);
}

function uint16Bytes(value: number) {
  const bytes = new Uint8Array(2);
  new DataView(bytes.buffer).setUint16(0, value, true);
  return bytes;
}

function uint32Bytes(value: number) {
  const bytes = new Uint8Array(4);
  new DataView(bytes.buffer).setUint32(0, value, true);
  return bytes;
}

function int32Bytes(value: number) {
  const bytes = new Uint8Array(4);
  new DataView(bytes.buffer).setInt32(0, value, true);
  return bytes;
}

function joinBytes(parts: Uint8Array[]) {
  const result = new Uint8Array(parts.reduce((sum, part) => sum + part.length, 0));
  let offset = 0;
  for (const part of parts) { result.set(part, offset); offset += part.length; }
  return result;
}

function stringBytes(value: string) {
  const encoded = new TextEncoder().encode(value);
  if (encoded.length > 0xffff) throw new FstDecodeError("문자열이 너무 깁니다.", "STRING_TOO_LONG");
  return joinBytes([uint16Bytes(encoded.length), encoded]);
}

function mappingBytes(mappings: BrsoKeyMapping[]) {
  return joinBytes([
    uint16Bytes(mappings.length),
    ...mappings.flatMap((mapping) => [uint16Bytes(mapping.note), stringBytes(mapping.name)]),
  ]);
}

function rebuildFst(source: Uint8Array, event: FlEvent, payload: Uint8Array, channelColorHex?: string) {
  const prefix = source.slice(0, event.eventOffset);
  if (channelColorHex && /^#[0-9a-f]{6}$/i.test(channelColorHex)) {
    const colorOffset = event.payloadOffset - 9;
    for (let index = 0; index < 3; index += 1) prefix[colorOffset + index] = Number.parseInt(channelColorHex.slice(1 + index * 2, 3 + index * 2), 16);
  }
  const result = joinBytes([
    prefix,
    new Uint8Array([event.id]),
    variableLengthBytes(payload.length),
    payload,
    source.slice(event.payloadOffset + event.payloadLength),
  ]);
  new DataView(result.buffer).setUint32(18, result.length - 22, true);
  return result.buffer;
}

function articulationBytes(formatVersion: number, articulations: BrsoArticulation[]) {
  return joinBytes([
    uint32Bytes(formatVersion),
    uint16Bytes(articulations.length),
    ...articulations.map((item) => int32Bytes(item.note)),
    ...articulations.map((item) => int32Bytes(item.notev)),
    ...articulations.map((item) => int32Bytes(item.prog)),
    ...articulations.map((item) => int32Bytes(item.modw)),
    ...articulations.map((item) => int32Bytes(item.modc)),
    ...articulations.map((item) => int32Bytes(item.icon)),
    ...articulations.map((item) => stringBytes(item.name)),
  ]);
}

export function validateFst(buffer: ArrayBuffer): ValidationResult {
  const issues = validateBuffer(buffer);
  return { valid: issues.length === 0, issues };
}

export async function validateFstFile(file: File): Promise<ValidationResult> {
  if (!file.name.toLowerCase().endsWith(".fst")) {
    return { valid: false, issues: [{ code: "INVALID_EXTENSION", message: ".fst 확장자 파일만 사용할 수 있습니다." }] };
  }
  return validateFst(await file.arrayBuffer());
}

export function decodeFst(buffer: ArrayBuffer): DecodedFst {
  const validation = validateFst(buffer);
  if (!validation.valid) {
    const issue = validation.issues[0];
    throw new FstDecodeError(issue.message, issue.code, issue.offset);
  }

  const view = new DataView(buffer);
  const event = readEvents(view).find(
    (candidate) => candidate.id === BRSO_PLUGIN_DATA_EVENT && isBrsoPayload(view, candidate),
  );
  if (!event) throw new FstDecodeError("BRSO payload를 찾지 못했습니다.", "BRSO_PAYLOAD_NOT_FOUND");

  const decoded = decodeArticulations(view, event);
  const keySlots = findKeyMappingBlocks(view, decoded.nextOffset, event.payloadOffset + event.payloadLength);
  const colorOffset = event.payloadOffset - 9;
  const channelColorHex = colorOffset >= 0
    ? `#${Array.from(new Uint8Array(buffer, colorOffset, 3), (byte) => byte.toString(16).padStart(2, "0")).join("")}`
    : undefined;

  return {
    settings: {
      Articulations: decoded.articulations,
      Controllers: [],
      ControllerPages: [],
      Keys: keySlots,
      Settings: {},
    },
    metadata: {
      fileSize: buffer.byteLength,
      flDataLength: view.getUint32(18, true),
      brsoFormatVersion: decoded.formatVersion,
      brsoPayloadOffset: event.payloadOffset,
      brsoPayloadLength: event.payloadLength,
      channelColorHex,
    },
    warnings: ["Controller와 일반 Settings는 원본 payload에 보존되지만 현재 편집 화면에는 표시하지 않습니다."],
  };
}

export function encodeFst(settings: DecodedFst["settings"], template: ArrayBuffer, channelColorHex?: string): ArrayBuffer {
  const validation = validateFst(template);
  if (!validation.valid) throw new FstDecodeError(validation.issues[0].message, validation.issues[0].code);
  if (settings.Articulations.length > MAX_ARTICULATIONS) throw new FstDecodeError("Articulation은 최대 64개입니다.", "TOO_MANY_ARTICULATIONS");

  const source = new Uint8Array(template.slice(0));
  const view = new DataView(source.buffer);
  const event = readEvents(view).find((candidate) => candidate.id === BRSO_PLUGIN_DATA_EVENT && isBrsoPayload(view, candidate));
  if (!event) throw new FstDecodeError("BRSO payload를 찾지 못했습니다.", "BRSO_PAYLOAD_NOT_FOUND");
  const decoded = decodeArticulations(view, event);
  const blocks = locateKeyMappingBlocks(view, decoded.nextOffset, event.payloadOffset + event.payloadLength);
  const oldCount = decoded.articulations.length;
  const byteSlice = (start: number, end: number) => source.slice(start, end);

  if (blocks.length === 0) {
    if (settings.Articulations.length > oldCount) {
      throw new FstDecodeError(`이 기본 템플릿은 최대 ${oldCount}개 articulation을 지원합니다.`, "TEMPLATE_SLOT_LIMIT");
    }
    const padded = [
      ...settings.Articulations,
      ...Array.from({ length: oldCount - settings.Articulations.length }, () => ({
        name: "", icon: 55, note: -1, notev: 127, prog: -1, modw: -1, modc: -1,
      })),
    ];
    const payload = joinBytes([
      articulationBytes(decoded.formatVersion, padded),
      byteSlice(decoded.nextOffset, event.payloadOffset + event.payloadLength),
    ]);
    return rebuildFst(source, event, payload, channelColorHex);
  }

  const seventhArrayStart = blocks[blocks.length - 1].end;
  const seventhArrayEnd = seventhArrayStart + oldCount * 4;
  if (seventhArrayEnd > event.payloadOffset + event.payloadLength) throw new FstDecodeError("Articulation 보조 배열이 잘렸습니다.", "TRUNCATED_AUX_ARRAY");

  const articulations = settings.Articulations;
  const countDelta = articulations.length - oldCount;
  const auxiliaryArray = countDelta >= 0
    ? joinBytes([...Array.from({ length: countDelta }, () => int32Bytes(0)), byteSlice(seventhArrayStart, seventhArrayEnd)])
    : byteSlice(seventhArrayStart + (-countDelta) * 4, seventhArrayEnd);
  const mappingParts: Uint8Array[] = [byteSlice(decoded.nextOffset, blocks[0].start)];
  blocks.forEach((block, index) => {
    mappingParts.push(mappingBytes(settings.Keys[index]?.mappings ?? block.mappings));
    if (index < blocks.length - 1) mappingParts.push(byteSlice(block.end, blocks[index + 1].start));
  });

  const payload = joinBytes([
    articulationBytes(decoded.formatVersion, articulations),
    ...mappingParts,
    auxiliaryArray,
    byteSlice(seventhArrayEnd, event.payloadOffset + event.payloadLength),
  ]);

  return rebuildFst(source, event, payload, channelColorHex);
}
