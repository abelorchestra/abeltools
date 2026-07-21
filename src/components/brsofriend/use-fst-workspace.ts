"use client";

import { type ChangeEvent, type KeyboardEvent, useEffect, useMemo, useRef, useState } from "react";

import {
  createDefaultArticulation, createDefaultBrsoSettings, createZip, decodeFst, encodeFst,
  exportBrsoSettings, MAX_ARTICULATIONS, validateBrsoSettings, validateFstFile,
  type BrsoSettings, type DecodedFst,
} from "@/lib/brsofriend";

import { base64ToBuffer, bufferToBase64 } from "./workspace-storage";
import { useBrsofriendI18n } from "./brsofriend-i18n";
import {
  INITIAL_UI_SETTINGS, KEY_MAPPINGS_PER_PAGE, MAX_COLOR_HISTORY, MAX_SAVED_FSTS, STORAGE_KEYS,
  type SavedFst, type UiSettings,
} from "./workspace-model";

function initialDrafts(settings: BrsoSettings) {
  return settings.Articulations.map((item) => String(item.note));
}

export function useFstWorkspace() {
  const { t } = useBrsofriendI18n();
  const inputRef = useRef<HTMLInputElement>(null);
  const nameInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [decoded, setDecoded] = useState<DecodedFst | null>(null);
  const [templateBuffer, setTemplateBuffer] = useState<ArrayBuffer | null>(null);
  const [channelColor, setChannelColor] = useState("#995555");
  const [colorHistory, setColorHistory] = useState<string[]>([]);
  const [presetName, setPresetName] = useState("brsofriend");
  const [defaultName, setDefaultName] = useState("brsofriend");
  const [keyswitchInit, setKeyswitchInit] = useState(0);
  const [settings, setSettings] = useState<BrsoSettings | null>(null);
  const [noteDrafts, setNoteDrafts] = useState<string[]>([]);
  const [noteErrors, setNoteErrors] = useState<(string | null)[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isReading, setIsReading] = useState(false);
  const [savedFsts, setSavedFsts] = useState<SavedFst[]>([]);
  const [savedFstsLoaded, setSavedFstsLoaded] = useState(false);
  const [keyMappingPage, setKeyMappingPage] = useState(0);
  const [uiSettings, setUiSettings] = useState<UiSettings>(INITIAL_UI_SETTINGS);

  useEffect(() => {
    let cancelled = false;
    queueMicrotask(() => {
      if (cancelled) return;
      try {
        const storedDefaultName = localStorage.getItem(STORAGE_KEYS.defaultName);
        if (storedDefaultName) setDefaultName(storedDefaultName);
        const storedUiSettings = localStorage.getItem(STORAGE_KEYS.uiSettings);
        if (storedUiSettings) setUiSettings({ ...INITIAL_UI_SETTINGS, ...JSON.parse(storedUiSettings) });
        const storedChannelColor = localStorage.getItem(STORAGE_KEYS.channelColor);
        if (storedChannelColor) setChannelColor(storedChannelColor);
        const storedColorHistory = localStorage.getItem(STORAGE_KEYS.colorHistory);
        if (storedColorHistory) setColorHistory(JSON.parse(storedColorHistory));
        const stored = sessionStorage.getItem(STORAGE_KEYS.savedFsts);
        if (stored) {
          const parsed = JSON.parse(stored) as Array<{ name: string; data: string; articulationCount: number; channelColor?: string }>;
          setSavedFsts(parsed.slice(0, MAX_SAVED_FSTS).map((item) => {
            const data = base64ToBuffer(item.data);
            return { ...item, data, channelColor: item.channelColor ?? decodeFst(data).metadata.channelColorHex ?? "#995555" };
          }));
        }
      } catch {
        sessionStorage.removeItem(STORAGE_KEYS.savedFsts);
      } finally {
        setSavedFstsLoaded(true);
      }
    });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (!savedFstsLoaded) return;
    sessionStorage.setItem(STORAGE_KEYS.savedFsts, JSON.stringify(savedFsts.map((item) => ({ ...item, data: bufferToBase64(item.data) }))));
  }, [savedFsts, savedFstsLoaded]);

  const validationErrors = useMemo(() => settings ? validateBrsoSettings(settings) : [], [settings]);
  const keyMappings = useMemo(() => settings?.Keys.flatMap((slot) => slot.mappings.map((mapping, mappingIndex) => ({ slot: slot.slot, mapping, mappingIndex }))) ?? [], [settings]);
  const keyMappingPageCount = Math.max(1, Math.ceil(keyMappings.length / KEY_MAPPINGS_PER_PAGE));
  const visibleKeyMappings = keyMappings.slice(keyMappingPage * KEY_MAPPINGS_PER_PAGE, (keyMappingPage + 1) * KEY_MAPPINGS_PER_PAGE);
  const presetNameError = !presetName.trim()
    ? t("errorsFileNameRequired")
    : /[<>:"/\\|?*\u0000-\u001f]/.test(presetName) ? t("errorsInvalidFileName") : null;
  const hasErrors = validationErrors.length > 0 || noteErrors.some(Boolean) || Boolean(presetNameError);

  function updateDefaultName(value: string) {
    const next = value.replace(/\.fst$/i, "").replace(/[<>:"/\\|?*\u0000-\u001f]/g, "");
    setDefaultName(next);
    if (next.trim()) localStorage.setItem(STORAGE_KEYS.defaultName, next.trim());
    else localStorage.removeItem(STORAGE_KEYS.defaultName);
  }

  function updateUiSetting<K extends keyof UiSettings>(key: K, value: UiSettings[K]) {
    setUiSettings((current) => {
      const next = { ...current, [key]: value };
      localStorage.setItem(STORAGE_KEYS.uiSettings, JSON.stringify(next));
      return next;
    });
  }

  function selectChannelColor(color: string) {
    const normalized = color.toUpperCase();
    setChannelColor(normalized);
    localStorage.setItem(STORAGE_KEYS.channelColor, normalized);
    setColorHistory((current) => {
      const next = [normalized, ...current.filter((item) => item !== normalized)].slice(0, MAX_COLOR_HISTORY);
      localStorage.setItem(STORAGE_KEYS.colorHistory, JSON.stringify(next));
      return next;
    });
  }

  function loadSettings(next: BrsoSettings, file: File | null, metadata: DecodedFst | null, template?: ArrayBuffer | null, nextName?: string, colorOverride?: string) {
    setSettings(structuredClone(next));
    setSelectedFile(file);
    setDecoded(metadata);
    if (template !== undefined) setTemplateBuffer(template);
    const nextColor = colorOverride ?? metadata?.metadata.channelColorHex;
    if (nextColor) selectChannelColor(nextColor);
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
      setError(caught instanceof Error ? caught.message : t("errorsReadFst"));
    } finally {
      setIsReading(false);
    }
  }

  async function startDefault() {
    setIsReading(true);
    setError(null);
    try {
      const response = await fetch("/brsofriend/fst_default.fst");
      if (!response.ok) throw new Error(t("errorsDefaultTemplate"));
      const buffer = await response.arrayBuffer();
      const template = decodeFst(buffer);
      const nextName = uiSettings.showDefaultName ? defaultName.trim() || "brsofriend" : "brsofriend";
      loadSettings(createDefaultBrsoSettings(), null, template, buffer, nextName, channelColor);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : t("errorsStartDefault"));
    } finally {
      setIsReading(false);
    }
  }

  function updateArticulation(index: number, patch: Partial<BrsoSettings["Articulations"][number]>) {
    setSettings((current) => current && ({ ...current, Articulations: current.Articulations.map((item, itemIndex) => itemIndex === index ? { ...item, ...patch } : item) }));
  }

  function updateNote(index: number, value: string) {
    const parsed = /^-?\d+$/.test(value.trim()) ? Number(value) : null;
    const message = parsed === null || !Number.isInteger(parsed) || parsed < -1 || parsed > 128 ? t("errorsInvalidNote") : null;
    setNoteDrafts((current) => current.map((item, itemIndex) => itemIndex === index ? value : item));
    setNoteErrors((current) => current.map((item, itemIndex) => itemIndex === index ? message : item));
    if (message === null && parsed !== null) updateArticulation(index, { note: parsed });
  }

  function addArticulation(focusNewRow = false) {
    if (!settings || settings.Articulations.length >= MAX_ARTICULATIONS) return;
    const nextIndex = settings.Articulations.length;
    const previousNote = settings.Articulations.at(-1)?.note;
    const nextNote = typeof previousNote === "number" && previousNote >= -1 ? previousNote + 1 : keyswitchInit + nextIndex;
    if (nextNote > 128) { setError(t("errorsNoteOverflow")); return; }
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
    setSettings({ ...settings, Articulations: settings.Articulations.map((articulation, index) => ({ ...articulation, note: parsed + index })) });
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
    setNoteDrafts([]); setNoteErrors([]); nameInputRefs.current = []; setError(null);
  }

  function handleJsonExport() {
    if (settings && !hasErrors) exportBrsoSettings(settings, `${presetName.trim()}.brsoartic`);
  }

  function download(buffer: ArrayBuffer, name: string, type = "application/octet-stream") {
    const url = URL.createObjectURL(new Blob([buffer], { type }));
    const anchor = document.createElement("a");
    anchor.href = url; anchor.download = name; anchor.click(); URL.revokeObjectURL(url);
  }

  function handleFstExport() {
    if (!settings || !templateBuffer || hasErrors) return;
    try { download(encodeFst(settings, templateBuffer, channelColor), `${presetName.trim()}.fst`); }
    catch (caught) { setError(caught instanceof Error ? caught.message : t("errorsCreateFst")); }
  }

  function saveCurrentFst() {
    if (!settings || !templateBuffer || hasErrors) return;
    try {
      const name = `${presetName.trim()}.fst`;
      const data = encodeFst(settings, templateBuffer, channelColor);
      const existingIndex = savedFsts.findIndex((item) => item.name.toLocaleLowerCase() === name.toLocaleLowerCase());
      if (existingIndex === -1 && savedFsts.length >= MAX_SAVED_FSTS) { setError(t("errorsSavedLimit", { count: MAX_SAVED_FSTS })); return; }
      const saved = { name, data, articulationCount: settings.Articulations.length, channelColor };
      setSavedFsts((current) => existingIndex === -1 ? [...current, saved] : current.map((item, index) => index === existingIndex ? saved : item));
      setError(null);
    } catch (caught) { setError(caught instanceof Error ? caught.message : t("errorsSaveFst")); }
  }

  function exportFstFolder() {
    if (savedFsts.length === 0) return;
    try { download(createZip(savedFsts.map((item) => ({ name: item.name, data: item.data }))), "brsofriend-fst-folder.zip", "application/zip"); }
    catch (caught) { setError(caught instanceof Error ? caught.message : t("errorsFolder")); }
  }

  function loadSavedFst(saved: SavedFst) {
    try {
      const buffer = saved.data.slice(0);
      const result = decodeFst(buffer);
      loadSettings(result.settings, null, result, buffer, saved.name.replace(/\.fst$/i, ""));
    } catch (caught) { setError(caught instanceof Error ? caught.message : t("errorsLoadSaved")); }
  }

  return {
    inputRef, nameInputRefs, selectedFile, decoded, templateBuffer, channelColor, colorHistory, presetName,
    defaultName, keyswitchInit, settings, noteDrafts, noteErrors, error, isReading, savedFsts,
    keyMappingPage, keyMappingPageCount, visibleKeyMappings, keyMappings, uiSettings, validationErrors,
    presetNameError, hasErrors, setPresetName, setKeyMappingPage, setSavedFsts, updateDefaultName,
    updateUiSetting, selectChannelColor, handleFileChange, startDefault, updateArticulation, updateNote,
    addArticulation, handleRowEnter, updateKeyswitchInit, removeArticulation, clearArticulations,
    handleJsonExport, handleFstExport, saveCurrentFst, exportFstFolder, loadSavedFst,
  };
}
