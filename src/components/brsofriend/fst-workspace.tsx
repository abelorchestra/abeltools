"use client";

import { Archive, ChevronLeft, ChevronRight, Download, FileCheck2, KeyRound, LoaderCircle, Plus, RotateCcw, Save, Trash2, Upload } from "lucide-react";
import { type ChangeEvent, type KeyboardEvent, useEffect, useMemo, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  createDefaultArticulation,
  createDefaultBrsoSettings,
  createZip,
  decodeFst,
  encodeFst,
  exportBrsoSettings,
  MAX_ARTICULATIONS,
  noteNumberToName,
  validateBrsoSettings,
  validateFstFile,
  type BrsoSettings,
  type DecodedFst,
} from "@/lib/brsofriend";

const MAX_SAVED_FSTS = 16;
const SAVED_FSTS_STORAGE_KEY = "brsofriend.saved-fsts";
const KEY_MAPPINGS_PER_PAGE = 12;

const ARTICULATION_COLORS = [
  { source: "#9ED1A5", light: "#C0E1C5" },
  { source: "#9FD3BA", light: "#C1E2D2" },
  { source: "#A1D6D0", light: "#C2E4E0" },
  { source: "#A3CAD8", light: "#C3DDE6" },
  { source: "#A5B8DB", light: "#C5D1E8" },
  { source: "#A8A7DE", light: "#C6C6EA" },
  { source: "#BCA7DE", light: "#D3C6EA" },
  { source: "#D1A7DE", light: "#E1C6EA" },
  { source: "#DDA7D6", light: "#E9C6E4" },
  { source: "#DBA5C0", light: "#E8C5D6" },
  { source: "#D9A3A9", light: "#E6C3C7" },
  { source: "#D6AFA2", light: "#E4CBC3" },
  { source: "#D4C1A0", light: "#E3D7C1" },
  { source: "#D1D29E", light: "#E1E2C0" },
  { source: "#BDD19E", light: "#D4E1C0" },
  { source: "#A9D19D", light: "#C7E1BF" },
] as const;

interface SavedFst {
  name: string;
  data: ArrayBuffer;
  articulationCount: number;
  channelColor: string;
}

function bufferToBase64(buffer: ArrayBuffer) {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let offset = 0; offset < bytes.length; offset += 0x8000) {
    binary += String.fromCharCode(...bytes.subarray(offset, offset + 0x8000));
  }
  return btoa(binary);
}

function base64ToBuffer(value: string) {
  const binary = atob(value);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) bytes[index] = binary.charCodeAt(index);
  return bytes.buffer;
}

const KNOWN_ICONS = [
  { id: 0, name: "Spiccato", file: "00-spiccato.png" },
  { id: 1, name: "Staccato", file: "01-staccato.png" },
  { id: 14, name: "Marcato", file: "14-marcato.png" },
  { id: 4, name: "Sustain", file: "04-sustain.png" },
  { id: 28, name: "Tremolo", file: "28-tremolo.png" },
  { id: 5, name: "Harmonic", file: "05-harmonic.png" },
  { id: 8, name: "Trills", file: "08-trills.png" },
  { id: 15, name: "Pizzicato", file: "15-pizzicato.png" },
  { id: 25, name: "Trill", file: "25-trill.png" },
  { id: 73, name: "Run", file: "73-run.png" },
  { id: 55, name: "Default", file: "55-rest.png" },
  { id: 20, name: "Legato", file: "20-legato.png" },
] as const;

function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  return `${(bytes / 1024).toFixed(1)} KB`;
}

function initialDrafts(settings: BrsoSettings) {
  return settings.Articulations.map((item) => String(item.note));
}

function IconGlyph({ file, className }: { file: string; className: string }) {
  const imageUrl = `url("/brsofriend/icons/${file}")`;

  return (
    <span
      aria-hidden="true"
      className={`inline-block bg-[#183d2d] ${className}`}
      style={{
        WebkitMaskImage: imageUrl,
        maskImage: imageUrl,
        WebkitMaskPosition: "center",
        maskPosition: "center",
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        WebkitMaskSize: "contain",
        maskSize: "contain",
      }}
    />
  );
}

function IconPicker({ value, onChange }: { value: number; onChange: (value: number) => void }) {
  const selected = KNOWN_ICONS.find((icon) => icon.id === value);
  return (
    <details className="group relative mt-1.5">
      <summary className="flex h-9 w-12 cursor-pointer list-none items-center justify-center rounded-lg border border-[#d9ded4] bg-white px-1 outline-none focus-visible:border-[#5b7f44]">
        {selected ? <IconGlyph file={selected.file} className="size-6" /> : <span className="flex size-7 items-center justify-center rounded bg-[#eef0eb] font-mono text-[0.65rem]">?</span>}
        <span className="sr-only">Icon ID {value}</span>
      </summary>
      <div className="absolute right-0 z-30 mt-2 grid w-72 grid-cols-4 gap-2 rounded-xl border border-[#d9ded4] bg-white p-3 shadow-xl">
        {KNOWN_ICONS.map((icon) => (
          <button key={icon.id} type="button" onClick={(event) => { onChange(icon.id); event.currentTarget.closest("details")?.removeAttribute("open"); }} aria-pressed={value === icon.id} aria-label={`Icon ID ${icon.id}`} title={`ID ${icon.id}`} className="rounded-lg border border-transparent bg-white p-2 text-center hover:bg-[#eef3e9] aria-pressed:border-[#5b7f44] aria-pressed:bg-[#eaf1e2]">
            <IconGlyph file={icon.file} className="mx-auto size-9" />
          </button>
        ))}
      </div>
    </details>
  );
}

export function FstWorkspace() {
  const inputRef = useRef<HTMLInputElement>(null);
  const nameInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [decoded, setDecoded] = useState<DecodedFst | null>(null);
  const [templateBuffer, setTemplateBuffer] = useState<ArrayBuffer | null>(null);
  const [channelColor, setChannelColor] = useState("#995555");
  const [presetName, setPresetName] = useState("brsofriend");
  const [keyswitchInit, setKeyswitchInit] = useState(0);
  const [settings, setSettings] = useState<BrsoSettings | null>(null);
  const [noteDrafts, setNoteDrafts] = useState<string[]>([]);
  const [noteErrors, setNoteErrors] = useState<(string | null)[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isReading, setIsReading] = useState(false);
  const [savedFsts, setSavedFsts] = useState<SavedFst[]>([]);
  const [savedFstsLoaded, setSavedFstsLoaded] = useState(false);
  const [keyMappingPage, setKeyMappingPage] = useState(0);

  useEffect(() => {
    let cancelled = false;
    queueMicrotask(() => {
      if (cancelled) return;
      try {
        const stored = sessionStorage.getItem(SAVED_FSTS_STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored) as Array<{ name: string; data: string; articulationCount: number; channelColor?: string }>;
          setSavedFsts(parsed.slice(0, MAX_SAVED_FSTS).map((item) => {
            const data = base64ToBuffer(item.data);
            return {
              ...item,
              data,
              channelColor: item.channelColor ?? decodeFst(data).metadata.channelColorHex ?? "#995555",
            };
          }));
        }
      } catch {
        sessionStorage.removeItem(SAVED_FSTS_STORAGE_KEY);
      } finally {
        setSavedFstsLoaded(true);
      }
    });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (!savedFstsLoaded) return;
    sessionStorage.setItem(SAVED_FSTS_STORAGE_KEY, JSON.stringify(savedFsts.map((item) => ({
      ...item,
      data: bufferToBase64(item.data),
    }))));
  }, [savedFsts, savedFstsLoaded]);

  const validationErrors = useMemo(() => settings ? validateBrsoSettings(settings) : [], [settings]);
  const keyMappings = useMemo(() => settings?.Keys.flatMap((slot) => slot.mappings.map((mapping, mappingIndex) => ({
    slot: slot.slot,
    mapping,
    mappingIndex,
  }))) ?? [], [settings]);
  const keyMappingPageCount = Math.max(1, Math.ceil(keyMappings.length / KEY_MAPPINGS_PER_PAGE));
  const visibleKeyMappings = keyMappings.slice(keyMappingPage * KEY_MAPPINGS_PER_PAGE, (keyMappingPage + 1) * KEY_MAPPINGS_PER_PAGE);
  const presetNameError = !presetName.trim()
    ? "파일 이름을 입력하세요."
    : /[<>:"/\\|?*\u0000-\u001f]/.test(presetName)
      ? "파일 이름에 < > : \" / \\ | ? * 문자를 사용할 수 없습니다."
      : null;
  const hasErrors = validationErrors.length > 0 || noteErrors.some(Boolean) || Boolean(presetNameError);

  function loadSettings(next: BrsoSettings, file: File | null, metadata: DecodedFst | null, template?: ArrayBuffer | null, nextName?: string) {
    setSettings(structuredClone(next));
    setSelectedFile(file);
    setDecoded(metadata);
    if (template !== undefined) setTemplateBuffer(template);
    if (metadata?.metadata.channelColorHex) setChannelColor(metadata.metadata.channelColorHex);
    if (nextName !== undefined) setPresetName(nextName);
    setNoteDrafts(initialDrafts(next));
    setNoteErrors(next.Articulations.map(() => null));
    setKeyswitchInit(next.Articulations[0]?.note >= 0 ? next.Articulations[0].note : 0);
    setKeyMappingPage(0);
    setError(null);
  }

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    setIsReading(true);
    setError(null);
    try {
      const validation = await validateFstFile(file);
      if (!validation.valid) throw new Error(validation.issues.map((issue) => issue.message).join(" "));
      const buffer = await file.arrayBuffer();
      const result = decodeFst(buffer);
      loadSettings(result.settings, file, result, buffer, file.name.replace(/\.fst$/i, ""));
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "FST 파일을 해석하지 못했습니다.");
    } finally {
      setIsReading(false);
    }
  }

  async function startDefault() {
    setIsReading(true);
    setError(null);
    try {
      const response = await fetch("/brsofriend/fst_default.fst");
      if (!response.ok) throw new Error("내장 Default FST 템플릿을 불러오지 못했습니다.");
      const buffer = await response.arrayBuffer();
      const template = decodeFst(buffer);
      loadSettings(createDefaultBrsoSettings(), null, template, buffer, "brsofriend");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Default 설정을 시작하지 못했습니다.");
    } finally {
      setIsReading(false);
    }
  }

  function updateArticulation(index: number, patch: Partial<BrsoSettings["Articulations"][number]>) {
    setSettings((current) => current && ({
      ...current,
      Articulations: current.Articulations.map((item, itemIndex) => itemIndex === index ? { ...item, ...patch } : item),
    }));
  }

  function updateNote(index: number, value: string) {
    const parsed = /^-?\d+$/.test(value.trim()) ? Number(value) : null;
    const message = parsed === null || !Number.isInteger(parsed) || parsed < -1 || parsed > 128
      ? "-1~128 사이 정수만 입력하세요."
      : null;
    setNoteDrafts((current) => current.map((item, itemIndex) => itemIndex === index ? value : item));
    setNoteErrors((current) => current.map((item, itemIndex) => itemIndex === index ? message : item));
    if (message === null && parsed !== null) updateArticulation(index, { note: parsed });
  }

  function addArticulation(focusNewRow = false) {
    if (!settings || settings.Articulations.length >= MAX_ARTICULATIONS) return;
    const nextIndex = settings.Articulations.length;
    const previousNote = settings.Articulations.at(-1)?.note;
    const nextNote = typeof previousNote === "number" && previousNote >= -1 ? previousNote + 1 : keyswitchInit + nextIndex;
    if (nextNote > 128) {
      setError("다음 Note가 128을 초과하여 행을 추가할 수 없습니다.");
      return;
    }
    setSettings({ ...settings, Articulations: [...settings.Articulations, { ...createDefaultArticulation(nextIndex), note: nextNote }] });
    setNoteDrafts((current) => [...current, String(nextNote)]);
    setNoteErrors((current) => [...current, null]);
    if (focusNewRow) setTimeout(() => nameInputRefs.current[nextIndex]?.focus(), 0);
  }

  function handleRowEnter(event: KeyboardEvent<HTMLInputElement>, index: number) {
    if (event.key !== "Enter") return;
    event.preventDefault();
    if (index === settings!.Articulations.length - 1) addArticulation(true);
    else nameInputRefs.current[index + 1]?.focus();
  }

  function updateKeyswitchInit(value: string) {
    if (!/^\d+$/.test(value)) return;
    const parsed = Number(value);
    if (!settings || parsed < 0 || parsed + Math.max(settings.Articulations.length - 1, 0) > 128) return;
    setKeyswitchInit(parsed);
    setSettings({
      ...settings,
      Articulations: settings.Articulations.map((articulation, index) => ({ ...articulation, note: parsed + index })),
    });
    setNoteDrafts(settings.Articulations.map((_, index) => String(parsed + index)));
    setNoteErrors(settings.Articulations.map(() => null));
  }

  function removeArticulation(index: number) {
    if (!settings) return;
    setSettings({ ...settings, Articulations: settings.Articulations.filter((_, itemIndex) => itemIndex !== index) });
    setNoteDrafts((current) => current.filter((_, itemIndex) => itemIndex !== index));
    setNoteErrors((current) => current.filter((_, itemIndex) => itemIndex !== index));
  }

  function clearArticulations() {
    if (!settings) return;
    setSettings({ ...settings, Articulations: [] });
    setNoteDrafts([]);
    setNoteErrors([]);
    nameInputRefs.current = [];
    setError(null);
  }

  function handleJsonExport() {
    if (!settings || hasErrors) return;
    exportBrsoSettings(settings, `${presetName.trim()}.brsoartic`);
  }

  function handleFstExport() {
    if (!settings || !templateBuffer || hasErrors) return;
    try {
      const encoded = encodeFst(settings, templateBuffer, channelColor);
      const blob = new Blob([encoded], { type: "application/octet-stream" });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `${presetName.trim()}.fst`;
      anchor.click();
      URL.revokeObjectURL(url);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "FST를 생성하지 못했습니다.");
    }
  }

  function saveCurrentFst() {
    if (!settings || !templateBuffer || hasErrors) return;
    try {
      const name = `${presetName.trim()}.fst`;
      const data = encodeFst(settings, templateBuffer, channelColor);
      const existingIndex = savedFsts.findIndex((item) => item.name.toLocaleLowerCase() === name.toLocaleLowerCase());
      if (existingIndex === -1 && savedFsts.length >= MAX_SAVED_FSTS) {
        setError(`세션에는 FST를 최대 ${MAX_SAVED_FSTS}개까지 저장할 수 있습니다.`);
        return;
      }
      const saved = { name, data, articulationCount: settings.Articulations.length, channelColor };
      setSavedFsts((current) => existingIndex === -1
        ? [...current, saved]
        : current.map((item, index) => index === existingIndex ? saved : item));
      setError(null);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "FST를 저장하지 못했습니다.");
    }
  }

  function exportFstFolder() {
    if (savedFsts.length === 0) return;
    try {
      const zip = createZip(savedFsts.map((item) => ({ name: item.name, data: item.data })));
      const blob = new Blob([zip], { type: "application/zip" });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = "brsofriend-fst-folder.zip";
      anchor.click();
      URL.revokeObjectURL(url);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "FST 폴더를 생성하지 못했습니다.");
    }
  }

  function loadSavedFst(saved: SavedFst) {
    try {
      const buffer = saved.data.slice(0);
      const result = decodeFst(buffer);
      loadSettings(result.settings, null, result, buffer, saved.name.replace(/\.fst$/i, ""));
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "저장된 FST를 불러오지 못했습니다.");
    }
  }

  return (
    <>
    <section className="mt-10 w-full rounded-[1.5rem] border border-[#e1e5dc] bg-white/70 p-5 text-left shadow-xl shadow-[#263d2c]/5 sm:p-7">
      <input ref={inputRef} type="file" accept=".fst" onChange={handleFileChange} className="sr-only" aria-label="FST 파일 선택" />

      <div className="flex flex-col gap-5">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#5b7f44]">BRSOFRIEND EDITOR</p>
          <h2 className="mt-2 text-2xl font-bold tracking-[-0.03em]">Articulation 편집</h2>
          <p className="mt-2 max-w-xl text-sm leading-6 text-[#666b64]">FST를 불러오거나 기본 설정으로 시작하세요. 업로드한 FST를 템플릿으로 편집본을 다시 만들 수 있습니다.</p>
        </div>
        <div className="grid w-full grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
          <Button type="button" size="lg" onClick={() => inputRef.current?.click()} disabled={isReading} className="h-11 rounded-full bg-[#172d23] px-5 text-white hover:bg-[#244334]">
            {isReading ? <LoaderCircle className="animate-spin" /> : <Upload />} {isReading ? "Reading…" : "Upload FST"}
          </Button>
          <Button type="button" size="lg" variant="outline" onClick={startDefault} disabled={isReading} className="h-11 rounded-full px-5"><RotateCcw /> Default</Button>
          <Button type="button" size="lg" variant="outline" onClick={handleFstExport} disabled={!settings || !templateBuffer || hasErrors} title={!templateBuffer ? "먼저 FST 템플릿을 업로드하세요." : undefined} className="h-11 rounded-full px-5"><Download /> Export FST</Button>
          <Button type="button" size="lg" variant="outline" onClick={saveCurrentFst} disabled={!settings || !templateBuffer || hasErrors} className="h-11 rounded-full px-5"><Save /> Save FST</Button>
          <Button type="button" size="lg" variant="outline" onClick={handleJsonExport} disabled={!settings || hasErrors} className="h-11 rounded-full px-5"><Download /> JSON</Button>
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-dashed border-[#cad4c3] p-5">
        {settings ? (
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3"><FileCheck2 className="size-6 text-[#5b7f44]" /><div><p className="font-bold">{selectedFile?.name ?? "새 BRSO 설정"}</p><p className="mt-1 text-xs text-[#666b64]">{selectedFile ? `${formatFileSize(selectedFile.size)} · ` : ""}{settings.Articulations.length}/{MAX_ARTICULATIONS} articulations</p></div></div>
            {decoded && <span className="rounded-full bg-[#eaf1e2] px-3 py-1.5 text-xs font-bold text-[#5b7f44]">BRSO v{decoded.metadata.brsoFormatVersion}</span>}
          </div>
        ) : <p className="text-sm text-[#666b64]">FST 파일을 선택하거나 Default 버튼으로 새 설정을 시작하세요.</p>}
        {error && <p role="alert" className="mt-3 text-sm font-bold text-destructive">{error}</p>}
      </div>

      {settings && (
        <div className="mt-5 space-y-5">
          <div className="rounded-xl border border-[#e1e5dc] bg-[#f7f8f4] p-4">
            <label className="block text-xs font-bold uppercase tracking-wider text-[#72776f]">FST FILE NAME
              <div className="mt-2 flex items-center rounded-lg border border-[#d9ded4] bg-white focus-within:border-[#5b7f44]">
                <input value={presetName} onChange={(event) => setPresetName(event.target.value.replace(/\.fst$/i, ""))} aria-invalid={Boolean(presetNameError)} className="h-10 min-w-0 flex-1 rounded-l-lg bg-transparent px-3 text-sm font-normal normal-case tracking-normal text-[#17201a] outline-none aria-invalid:text-red-700" placeholder="brsofriend" />
                <span className="border-l border-[#e1e5dc] px-3 font-mono text-sm font-normal normal-case tracking-normal text-[#72776f]">.fst</span>
              </div>
            </label>
            {presetNameError && <p className="mt-2 text-xs font-bold text-red-600">{presetNameError}</p>}
          </div>

          <div className="rounded-xl border border-[#e1e5dc] bg-[#f7f8f4] p-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div><p className="font-bold">CHANNEL COLOR</p><p className="mt-1 text-xs text-[#72776f]">FL Studio 채널에 저장할 색상을 선택하세요.</p></div>
              <div className="flex flex-wrap items-center gap-2">
                {["#995555", "#b3983c", "#5b7f44", "#3d7f88", "#4f68a8", "#795aa6", "#a65776", "#777777"].map((color) => (
                  <button key={color} type="button" onClick={() => setChannelColor(color)} aria-label={`색상 ${color}`} aria-pressed={channelColor === color} className="size-8 rounded-full border-2 border-white shadow-sm outline outline-1 outline-[#d5d9d0] aria-pressed:outline-2 aria-pressed:outline-[#172d23]" style={{ backgroundColor: color }} />
                ))}
                <label className="relative size-9 overflow-hidden rounded-full border-2 border-white shadow-sm outline outline-1 outline-[#d5d9d0]" title="사용자 색상"><input type="color" value={channelColor} onChange={(event) => setChannelColor(event.target.value)} className="absolute -inset-2 size-14 cursor-pointer border-0" /><span className="sr-only">사용자 색상 선택</span></label>
                <span className="ml-1 font-mono text-xs font-bold">{channelColor.toUpperCase()}</span>
              </div>
            </div>
            {!templateBuffer && <p className="mt-3 rounded-lg bg-[#fff7df] px-3 py-2 text-xs text-[#755d16]">Default 버튼을 누르거나 기준 FST를 업로드하면 FST export를 사용할 수 있습니다.</p>}
          </div>
          <div className="rounded-xl border border-[#e1e5dc]">
            <div className="flex flex-col gap-3 rounded-t-xl border-b border-[#e1e5dc] bg-[#f7f8f4] px-4 py-3 sm:flex-row sm:items-center sm:justify-between"><div><p className="font-bold">ARTICULATIONS</p><p className="mt-1 text-xs text-[#72776f]">Enter를 누르면 다음 행으로 이동하며 마지막 행에서는 Note가 1 증가한 새 행을 만듭니다.</p></div><div className="flex flex-wrap items-center gap-2"><label className="mr-1 flex items-center gap-2 text-xs font-bold text-[#72776f]">Keyswitch Init<input type="number" min={0} max={128} value={keyswitchInit} onChange={(event) => updateKeyswitchInit(event.target.value)} className="h-8 w-16 rounded-lg border border-[#d9ded4] bg-white px-2 font-mono text-sm text-[#17201a]" /><span className="min-w-10 font-mono text-[#5b7f44]">({noteNumberToName(keyswitchInit)})</span></label><Button type="button" size="sm" onClick={() => addArticulation()} disabled={settings.Articulations.length >= MAX_ARTICULATIONS}><Plus /> 추가</Button><Button type="button" size="sm" variant="outline" onClick={clearArticulations} disabled={settings.Articulations.length === 0} className="text-[#8b4a4a] hover:bg-red-50 hover:text-red-700"><Trash2 /> 비우기</Button></div></div>
            <div className="divide-y divide-[#edf0e9]">
              {settings.Articulations.map((articulation, index) => (
                <div
                  key={index}
                  className="grid gap-3 border-l-4 p-4 last:rounded-b-xl sm:grid-cols-[2rem_minmax(10rem,1fr)_minmax(9rem,0.6fr)_3rem_2rem] sm:items-start"
                  style={{
                    backgroundColor: ARTICULATION_COLORS[index].light,
                    borderLeftColor: ARTICULATION_COLORS[index].source,
                  }}
                >
                  <span className="pt-2 font-mono text-xs text-[#72776f]">{index + 1}</span>
                  <label className="text-xs font-bold text-[#72776f]">ARTICULATION NAME<input ref={(element) => { nameInputRefs.current[index] = element; }} value={articulation.name} onChange={(event) => updateArticulation(index, { name: event.target.value })} onKeyDown={(event) => handleRowEnter(event, index)} className="mt-1.5 h-9 w-full rounded-lg border border-[#d9ded4] bg-white px-3 text-sm font-normal text-[#17201a] outline-none focus:border-[#5b7f44]" /></label>
                  <label className="text-xs font-bold text-[#72776f]">NOTE<div className="mt-1.5 flex h-9 overflow-hidden rounded-lg border border-[#d9ded4] bg-white focus-within:border-[#5b7f44] has-[[aria-invalid=true]]:border-red-500"><input value={noteDrafts[index]} onChange={(event) => updateNote(index, event.target.value)} onKeyDown={(event) => handleRowEnter(event, index)} inputMode="numeric" aria-invalid={Boolean(noteErrors[index])} className="min-w-0 flex-1 bg-transparent px-3 font-mono text-sm font-normal text-[#17201a] outline-none" /><span className="flex min-w-14 items-center justify-center border-l border-[#d9ded4] bg-[#f7f9f5] px-2 font-mono text-xs text-[#5b7f44]">{noteErrors[index] ? "—" : articulation.note === -1 ? "OFF" : noteNumberToName(articulation.note)}</span></div>{noteErrors[index] && <span className="mt-1 block font-normal text-red-600">{noteErrors[index]}</span>}</label>
                  <div className="pt-5"><IconPicker value={articulation.icon} onChange={(icon) => updateArticulation(index, { icon })} /></div>
                  <button type="button" onClick={() => removeArticulation(index)} aria-label={`${articulation.name} 삭제`} className="mt-6 flex size-8 items-center justify-center rounded-lg text-[#8c9189] hover:bg-red-50 hover:text-red-600"><Trash2 className="size-4" /></button>
                </div>
              ))}
              {settings.Articulations.length === 0 && <p className="p-6 text-center text-sm text-[#72776f]">Articulation이 없습니다. 추가 버튼을 눌러 시작하세요.</p>}
            </div>
          </div>

          <div className="rounded-xl border border-[#e1e5dc]">
            <div className="flex flex-col gap-3 border-b border-[#e1e5dc] bg-[#f7f8f4] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
              <div><p className="flex items-center gap-2 font-bold"><KeyRound className="size-4" /> KEY MAPPING</p><p className="mt-1 text-xs text-[#72776f]">FST에서 발견된 비어 있지 않은 Key Mapping만 표시합니다. 읽기 전용이며 export 시 그대로 보존됩니다.</p></div>
              {keyMappings.length > 0 && <span className="shrink-0 rounded-full bg-[#eef0eb] px-3 py-1.5 text-xs font-bold text-[#72776f]">{keyMappings.length} mappings</span>}
            </div>
            <div className="p-4">
              <div className="grid gap-2 lg:grid-cols-2">
                {visibleKeyMappings.map(({ slot, mapping, mappingIndex }) => (
                  <div key={`${slot}-${mappingIndex}`} className="grid grid-cols-[4.5rem_minmax(0,1fr)_auto] gap-2 rounded-lg border border-[#e1e5dc] bg-white p-2">
                    <span className="flex h-9 items-center rounded-md bg-[#f3f5f0] px-2 font-mono text-sm text-[#596057]">{mapping.note}</span>
                    <span className="flex h-9 min-w-0 items-center truncate rounded-md bg-[#f3f5f0] px-3 text-sm text-[#596057]">{mapping.name}</span>
                    <span className="flex items-center rounded-full bg-[#eef0eb] px-2 text-[0.65rem] font-bold text-[#72776f]">LIST {slot}</span>
                  </div>
                ))}
                {keyMappings.length === 0 && <p className="py-6 text-center text-sm text-[#8c9189] lg:col-span-2">Key Mapping이 없습니다.</p>}
              </div>
              {keyMappingPageCount > 1 && (
                <div className="mt-4 flex items-center justify-center gap-3 border-t border-[#edf0e9] pt-4">
                  <Button type="button" size="sm" variant="outline" onClick={() => setKeyMappingPage((page) => Math.max(0, page - 1))} disabled={keyMappingPage === 0} aria-label="이전 Key Mapping 페이지"><ChevronLeft /></Button>
                  <span className="min-w-20 text-center font-mono text-xs font-bold text-[#596057]">{keyMappingPage + 1} / {keyMappingPageCount}</span>
                  <Button type="button" size="sm" variant="outline" onClick={() => setKeyMappingPage((page) => Math.min(keyMappingPageCount - 1, page + 1))} disabled={keyMappingPage >= keyMappingPageCount - 1} aria-label="다음 Key Mapping 페이지"><ChevronRight /></Button>
                </div>
              )}
            </div>
          </div>

          {hasErrors && <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"><p className="font-bold">입력 오류가 있어 export할 수 없습니다.</p><p className="mt-1 text-xs">{presetNameError ?? noteErrors.find(Boolean) ?? validationErrors[0]?.message}</p></div>}
        </div>
      )}
    </section>

    <section className="mt-6 w-full rounded-[1.5rem] border border-[#e1e5dc] bg-white/70 p-5 text-left shadow-xl shadow-[#263d2c]/5 sm:p-7">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#5b7f44]">SAVED FST FOLDER</p>
          <p className="mt-2 text-sm text-[#72776f]">현재 세션에 저장된 FST입니다. 블록을 눌러 다시 편집하거나 ZIP으로 한 번에 내려받을 수 있습니다.</p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <span className="rounded-full bg-[#eaf1e2] px-3 py-1.5 text-xs font-bold text-[#5b7f44]">{savedFsts.length}/{MAX_SAVED_FSTS}</span>
          <Button type="button" variant="outline" onClick={exportFstFolder} disabled={savedFsts.length === 0} className="rounded-full"><Archive /> Export FST Folder</Button>
        </div>
      </div>
      {savedFsts.length > 0 ? (
        <div className="mt-5 grid gap-2 sm:grid-cols-2">
          {savedFsts.map((item) => (
            <div key={item.name} className="flex min-w-0 items-center justify-between gap-3 rounded-lg border-l-4 px-3 py-3" style={{ backgroundColor: `${item.channelColor}20`, borderColor: item.channelColor }}>
              <button type="button" onClick={() => loadSavedFst(item)} className="min-w-0 flex-1 rounded-md text-left outline-none hover:text-[#5b7f44] focus-visible:ring-2 focus-visible:ring-[#5b7f44] focus-visible:ring-offset-2" title={`${item.name} 편집하기`}>
                <span className="block truncate text-sm font-bold">{item.name}</span>
                <span className="mt-0.5 block text-xs text-[#72776f]">{item.articulationCount} articulations · {formatFileSize(item.data.byteLength)}</span>
              </button>
              <button type="button" onClick={() => setSavedFsts((current) => current.filter((saved) => saved.name !== item.name))} aria-label={`${item.name} 저장 목록에서 삭제`} className="flex size-8 shrink-0 items-center justify-center rounded-lg text-[#8c9189] hover:bg-red-50 hover:text-red-600"><Trash2 className="size-4" /></button>
            </div>
          ))}
        </div>
      ) : <p className="mt-5 rounded-xl border border-dashed border-[#cad4c3] px-4 py-8 text-center text-sm text-[#8c9189]">저장된 FST가 없습니다. Editor에서 Save FST를 눌러 추가하세요.</p>}
    </section>
    </>
  );
}
