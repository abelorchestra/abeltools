"use client";

import { createContext, type ReactNode, useContext, useEffect, useState } from "react";

import { useSiteI18n } from "@/components/layout/site-i18n";

export type BrsoLocale = "ko" | "en";
export type BrsoLocalePreference = "inherit" | BrsoLocale;

const messages = {
  ko: {
    settings: "설정", productLanguage: "제품 언어", followSiteLanguage: "사이트 언어 따르기", defaultFileNameSetting: "기본 파일명 설정", debugFeatures: "디버그 기능", showKeyMapping: "Key Mapping 보기",
    editorTitle: "Articulation 편집", editorDescription: "FST를 불러오거나 기본 설정으로 시작하세요. 업로드한 FST를 템플릿으로 편집본을 다시 만들 수 있습니다.",
    defaultFileName: "기본 파일명", defaultFileNameHint: "다음 FST 생성 시 사용할 파일명입니다.", createFst: "FST 생성", debugTools: "디버그 도구", uploadFst: "FST 업로드", reading: "읽는 중…",
    createOrUpload: "FST 생성 버튼으로 새 설정을 시작하거나 디버그 도구에서 FST 파일을 불러오세요.", instrumentName: "악기 이름", currentColor: "현재 Channel Color 선택", palette: "팔레트", picker: "색상 선택", history: "기록", colorHistory: "색상 기록", noColorHistory: "사용한 색상이 아직 없습니다.",
    templateHint: "FST 생성을 누르거나 기준 FST를 업로드하면 FST 내보내기를 사용할 수 있습니다.", articulations: "ARTICULATIONS", articulationHint: "Enter를 누르면 다음 행으로 이동합니다.", add: "추가", clear: "비우기", articulationName: "ARTICULATION NAME", note: "NOTE", noArticulations: "Articulation이 없습니다. 추가 버튼을 눌러 시작하세요.",
    keyMapping: "KEY MAPPING", keyMappingHint: "FST에서 발견된 비어 있지 않은 Key Mapping만 표시합니다. 읽기 전용이며 내보낼 때 그대로 보존됩니다.", noKeyMapping: "Key Mapping이 없습니다.", previousPage: "이전 Key Mapping 페이지", nextPage: "다음 Key Mapping 페이지",
    validationTitle: "입력 오류가 있어 내보낼 수 없습니다.", saveFst: "FST 저장", exportFst: "FST 내보내기", templateRequired: "먼저 FST 템플릿을 업로드하세요.",
    savedFolder: "저장된 FST 폴더", savedFolderHint: "현재 세션에 저장된 FST입니다. 블록을 눌러 다시 편집하거나 ZIP으로 한 번에 내려받을 수 있습니다.", exportFolder: "FST 폴더 내보내기", emptySavedFolder: "저장된 FST가 없습니다. Editor에서 FST 저장을 눌러 추가하세요.", editSaved: "편집하기", removeSaved: "저장 목록에서 삭제",
    errorsFileNameRequired: "파일 이름을 입력하세요.", errorsInvalidFileName: "파일 이름에 < > : \" / \\ | ? * 문자를 사용할 수 없습니다.", errorsInvalidNote: "-1~128 사이 정수만 입력하세요.", errorsReadFst: "FST 파일을 해석하지 못했습니다.", errorsDefaultTemplate: "내장 Default FST 템플릿을 불러오지 못했습니다.", errorsStartDefault: "Default 설정을 시작하지 못했습니다.", errorsNoteOverflow: "다음 Note가 128을 초과하여 행을 추가할 수 없습니다.", errorsCreateFst: "FST를 생성하지 못했습니다.", errorsSaveFst: "FST를 저장하지 못했습니다.", errorsFolder: "FST 폴더를 생성하지 못했습니다.", errorsLoadSaved: "저장된 FST를 불러오지 못했습니다.", errorsSavedLimit: "세션에는 FST를 최대 {count}개까지 저장할 수 있습니다.",
  },
  en: {
    settings: "Settings", productLanguage: "Product language", followSiteLanguage: "Follow site language", defaultFileNameSetting: "Default file name", debugFeatures: "Debug features", showKeyMapping: "Show Key Mapping",
    editorTitle: "Edit Articulations", editorDescription: "Create a new setup or load an FST. Uploaded FST files can be used as templates for edited versions.",
    defaultFileName: "Default file name", defaultFileNameHint: "Used as the file name for the next FST you create.", createFst: "Create FST", debugTools: "Debug Tools", uploadFst: "Upload FST", reading: "Reading…",
    createOrUpload: "Create a new setup with Create FST, or load an FST from Debug Tools.", instrumentName: "Instrument name", currentColor: "Select the current channel color", palette: "Palette", picker: "Picker", history: "History", colorHistory: "Color History", noColorHistory: "No colors have been used yet.",
    templateHint: "Create an FST or upload a template to enable FST export.", articulations: "ARTICULATIONS", articulationHint: "Press Enter to move to the next row.", add: "Add", clear: "Clear", articulationName: "ARTICULATION NAME", note: "NOTE", noArticulations: "No articulations. Select Add to begin.",
    keyMapping: "KEY MAPPING", keyMappingHint: "Only non-empty Key Mappings found in the FST are shown. They are read-only and preserved on export.", noKeyMapping: "No Key Mapping found.", previousPage: "Previous Key Mapping page", nextPage: "Next Key Mapping page",
    validationTitle: "Export is unavailable due to an input error.", saveFst: "Save FST", exportFst: "Export FST", templateRequired: "Upload an FST template first.",
    savedFolder: "SAVED FST FOLDER", savedFolderHint: "FST files saved in this session. Select one to edit it again, or download all of them as a ZIP.", exportFolder: "Export FST Folder", emptySavedFolder: "No saved FST files. Select Save FST in the editor to add one.", editSaved: "Edit", removeSaved: "Remove from saved list",
    errorsFileNameRequired: "Enter a file name.", errorsInvalidFileName: "File names cannot contain < > : \" / \\ | ? *.", errorsInvalidNote: "Enter an integer from -1 to 128.", errorsReadFst: "The FST file could not be decoded.", errorsDefaultTemplate: "The built-in Default FST template could not be loaded.", errorsStartDefault: "The default setup could not be created.", errorsNoteOverflow: "A new row cannot be added because the next Note exceeds 128.", errorsCreateFst: "The FST could not be created.", errorsSaveFst: "The FST could not be saved.", errorsFolder: "The FST folder could not be created.", errorsLoadSaved: "The saved FST could not be loaded.", errorsSavedLimit: "You can save up to {count} FST files in this session.",
  },
} as const;

type MessageKey = keyof typeof messages.ko;
type I18nValue = { locale: BrsoLocale; localePreference: BrsoLocalePreference; setLocalePreference: (locale: BrsoLocalePreference) => void; t: (key: MessageKey, values?: Record<string, string | number>) => string };
const I18nContext = createContext<I18nValue | null>(null);

export function BrsofriendI18nProvider({ children }: { children: ReactNode }) {
  const { locale: siteLocale } = useSiteI18n();
  const [localePreference, setLocalePreferenceState] = useState<BrsoLocalePreference>("inherit");
  const locale = localePreference === "inherit" ? siteLocale : localePreference;
  useEffect(() => { const stored = localStorage.getItem("brsofriend.locale"); if (stored === "inherit" || stored === "ko" || stored === "en") queueMicrotask(() => setLocalePreferenceState(stored)); }, []);
  function setLocalePreference(next: BrsoLocalePreference) { setLocalePreferenceState(next); localStorage.setItem("brsofriend.locale", next); }
  function t(key: MessageKey, values?: Record<string, string | number>) {
    let result: string = messages[locale][key];
    for (const [name, value] of Object.entries(values ?? {})) result = result.replaceAll(`{${name}}`, String(value));
    return result;
  }
  return <I18nContext.Provider value={{ locale, localePreference, setLocalePreference, t }}>{children}</I18nContext.Provider>;
}

export function useBrsofriendI18n() {
  const value = useContext(I18nContext);
  if (!value) throw new Error("useBrsofriendI18n must be used inside BrsofriendI18nProvider");
  return value;
}
