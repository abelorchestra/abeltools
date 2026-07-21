"use client";

import { BookOpen, Download, FileCheck2, FilePlus2, FolderOpen, History, LoaderCircle, Plus, Sparkles, Trash2, Upload } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { MAX_ARTICULATIONS, noteNumberToName } from "@/lib/brsofriend";

import { EditorActionBar } from "./editor-action-bar";
import { BrsoTestDialog } from "./brso-test-dialog";
import { BrsofriendI18nProvider, useBrsofriendI18n } from "./brsofriend-i18n";
import { IconPicker } from "./icon-picker";
import { KeyMappingPanel } from "./key-mapping-panel";
import { SettingsPanel } from "./settings-panel";
import { useFstWorkspace } from "./use-fst-workspace";
import { WorkspaceSidebar, type WorkspaceView } from "./workspace-sidebar";
import { ARTICULATION_COLORS, formatFileSize, MAX_COLOR_HISTORY } from "./workspace-model";

const CHANNEL_PRESETS = ["#995555", "#B3983C", "#5B7F44", "#3D7F88", "#4F68A8", "#795AA6", "#A65776", "#777777"];

export function FstWorkspace() {
  return <BrsofriendI18nProvider><FstWorkspaceContent /></BrsofriendI18nProvider>;
}

function FstWorkspaceContent() {
  const { t } = useBrsofriendI18n();
  const [activeView, setActiveView] = useState<WorkspaceView>("editor");
  const [isTestDialogOpen, setIsTestDialogOpen] = useState(false);
  // 비즈니스 로직은 hook에 두고, 이 파일은 화면 배치와 이벤트 연결만 담당합니다.
  const workspace = useFstWorkspace();

  // 화면 표시용 상태
  const {
    inputRef, nameInputRefs, selectedFile, decoded, templateBuffer, channelColor, colorHistory,
    presetName, defaultName, keyswitchInit, settings, noteDrafts, noteErrors, error, isReading,
    savedFsts, keyMappingPage, keyMappingPageCount, visibleKeyMappings, keyMappings, uiSettings,

    // 검증 결과와 기본 setter
    validationErrors, presetNameError, hasErrors, setPresetName, setKeyMappingPage, setSavedFsts,

    // UI에서 호출하는 workspace 액션
    updateDefaultName, updateUiSetting, selectChannelColor, handleFileChange, startDefault,
    updateArticulation, updateNote, addArticulation, handleRowEnter, updateKeyswitchInit,
    removeArticulation, clearArticulations, handleJsonExport, handleFstExport, saveCurrentFst,
    exportFstFolder, loadSavedFst,
  } = workspace;

  const testCommand = settings && uiSettings.brsoInstanceId ? createBrsoTestCommand(settings.Articulations, uiSettings.brsoInstanceId) : "";

  return <>
    <div className="mt-10 grid w-full overflow-hidden rounded-[1.75rem] border border-[#dfd5c2] bg-white/70 shadow-xl shadow-[#263d2c]/7 lg:grid-cols-[14rem_minmax(0,1fr)] lg:items-stretch">
      <WorkspaceSidebar
        activeView={activeView}
        onViewChange={setActiveView}
        items={savedFsts}
        onLoad={loadSavedFst}
        onRemove={(name) => setSavedFsts((current) => current.filter((saved) => saved.name !== name))}
        onExport={exportFstFolder}
      />
      {activeView === "tutorial" && <WorkspacePlaceholder icon={BookOpen} eyebrow="GETTING STARTED" title="Tutorial" description="BRSO Articulate 파일을 만들고 편집하는 과정을 이 화면 안에서 단계별로 안내할 예정입니다." action="튜토리얼 콘텐츠 준비 중" />}
      {activeView === "settings" && <section className="min-h-[38rem] min-w-0 bg-white/70 p-5 text-left sm:p-7">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#5b7f44]">WORKSPACE SETTINGS</p>
          <h2 className="mt-2 text-2xl font-bold tracking-[-0.03em]">{t("settings")}</h2>
          <p className="mt-2 max-w-xl text-sm leading-6 text-[#666b64]">편집 화면의 표시 방식과 새 FST에 사용할 기본 파일명을 설정합니다.</p>
        </div>
        <div className="mt-7"><SettingsPanel settings={uiSettings} onChange={updateUiSetting} /></div>
        {uiSettings.showDefaultName && <div className="mt-5 rounded-2xl border border-[#e1e5dc] bg-[#f7f8f4] p-4 sm:p-5">
          <label className="block max-w-md text-xs font-bold uppercase tracking-wider text-[#72776f]">{t("defaultFileName")}
            <div className="mt-2 flex items-center rounded-lg border border-[#d9ded4] bg-white focus-within:border-[#5b7f44] focus-within:ring-2 focus-within:ring-[#5b7f44]/15">
              <input value={defaultName} onChange={(event) => updateDefaultName(event.target.value)} className="h-11 min-w-0 flex-1 rounded-l-lg bg-transparent px-3 text-sm font-normal normal-case tracking-normal text-[#17201a] outline-none" placeholder="nucleus-strings" />
              <span className="border-l border-[#e1e5dc] px-3 font-mono text-sm font-normal normal-case tracking-normal text-[#72776f]">.fst</span>
            </div>
            <span className="mt-1.5 block font-normal normal-case leading-5 tracking-normal text-[#8c9189]">{t("defaultFileNameHint")}</span>
          </label>
        </div>}
      </section>}
      {activeView === "presets" && <WorkspacePlaceholder icon={FolderOpen} eyebrow="PRESET LIBRARY" title="Presets" description="저장한 FST와 공유받은 아티큘레이션 설정을 탐색하고 불러오는 라이브러리가 이곳에 들어갈 예정입니다." action="프리셋 라이브러리 준비 중" />}
      {activeView === "editor" && <section onKeyDownCapture={(event) => {
        if (event.key !== "Enter" || !event.shiftKey) return;
        event.preventDefault();
        event.stopPropagation();
        if (templateBuffer && !hasErrors) saveCurrentFst();
      }} className="min-w-0 bg-white/70 p-5 text-left sm:p-7">
        {/* 실제 파일 input은 숨기고 Debug Tools의 Upload 버튼으로 실행합니다. */}
        <input ref={inputRef} type="file" accept=".fst" onChange={handleFileChange} className="sr-only" aria-label="FST 파일 선택" />

        {/* 에디터 소개, 생성 및 디버그 도구 */}
        <div className="flex flex-col gap-5">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#5b7f44]">BRSOFRIEND EDITOR</p>
            <h2 className="mt-2 text-2xl font-bold tracking-[-0.03em]">{t("editorTitle")}</h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-[#666b64]">{t("editorDescription")}</p>
          </div>

          <div className="flex w-full flex-col gap-3">
            <div className="grid gap-2 sm:max-w-md sm:grid-cols-2"><Button type="button" size="lg" onClick={startDefault} disabled={isReading} className="h-11 w-full rounded-full bg-[#5b7f44] px-5 text-white hover:bg-[#4b6c39]"><FilePlus2 /> {t("createFst")}</Button><Button type="button" size="lg" variant="outline" onClick={() => inputRef.current?.click()} disabled={isReading} className="h-11 w-full rounded-full border-[#9eae98] bg-white px-5 text-[#48643b] hover:bg-[#f0f5ec] hover:text-[#36512b]">{isReading ? <LoaderCircle className="animate-spin" /> : <Upload />} {isReading ? t("reading") : t("uploadFst")}</Button></div>
            {uiSettings.showDebugTools && <div className="flex flex-col gap-3 rounded-xl bg-[#202823] p-3 sm:flex-row sm:items-center">
              <span className="shrink-0 text-[0.65rem] font-bold uppercase tracking-[0.14em] text-white/55">{t("debugTools")}</span>
              <div className="grid flex-1 gap-2">
                <Button type="button" size="lg" variant="outline" onClick={handleJsonExport} disabled={!settings || hasErrors} className="h-10 rounded-full border-dashed border-white/25 bg-white/10 px-5 text-white hover:bg-white/20 hover:text-white"><Download /> JSON</Button>
              </div>
            </div>}
          </div>
        </div>

        {/* 디버그 모드에서만 원본 FST 메타데이터를 표시합니다. */}
        {uiSettings.showDebugTools && <div className="mt-6 rounded-xl border border-dashed bg-[#202823] p-5 text-white transition-colors" style={settings ? { background: `linear-gradient(${channelColor}30, ${channelColor}30), #202823`, borderColor: channelColor } : { borderColor: "#667168" }}>
          {settings ? <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3"><FileCheck2 className="size-6" style={{ color: channelColor }} /><div><p className="font-bold">{selectedFile?.name ?? `${presetName || defaultName || "brsofriend"}.fst`}</p><p className="mt-1 text-xs text-white/60">{selectedFile ? `${formatFileSize(selectedFile.size)} · ` : ""}{settings.Articulations.length}/{MAX_ARTICULATIONS} articulations</p></div></div>
            {decoded && <span className="rounded-full border px-3 py-1.5 text-xs font-bold text-white" style={{ backgroundColor: `${channelColor}55`, borderColor: channelColor }}>BRSO v{decoded.metadata.brsoFormatVersion}</span>}
          </div> : <p className="text-sm text-white/65">{t("createOrUpload")}</p>}
          {error && <p role="alert" className="mt-3 text-sm font-bold text-red-300">{error}</p>}
        </div>}

        {/* FST가 준비된 이후 표시되는 실제 편집 영역 */}
        {settings && <div className="mt-5 space-y-5">
          {/* Instrument Name과 Channel Color는 하나의 프리셋 단위입니다. */}
          <div className="overflow-visible rounded-xl border p-3 transition-colors" style={{ backgroundColor: `${channelColor}18`, borderColor: `${channelColor}55` }}>
            <div className="space-y-3">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <label className="min-w-0 flex-1 text-xs font-bold uppercase tracking-wider text-[#596057]">{t("instrumentName")}
                  <div className="mt-2 flex items-center rounded-lg border border-white/70 bg-white focus-within:border-[#5b7f44]">
                    <input value={presetName} onChange={(event) => setPresetName(event.target.value.replace(/\.fst$/i, ""))} aria-invalid={Boolean(presetNameError)} className="h-10 min-w-0 flex-1 rounded-l-lg bg-transparent px-3 text-sm font-normal normal-case tracking-normal text-[#17201a] outline-none aria-invalid:text-red-700" placeholder="brsofriend" />
                    <span className="border-l border-[#e1e5dc] px-3 font-mono text-sm font-normal normal-case tracking-normal text-[#72776f]">.fst</span>
                  </div>
                </label>
                <label className="relative flex h-11 cursor-pointer items-center gap-2 overflow-hidden rounded-xl bg-white px-2.5 shadow-sm ring-1 ring-black/10 hover:bg-[#fafbf8]" title={t("currentColor")}>
                  <input type="color" value={channelColor} onChange={(event) => selectChannelColor(event.target.value)} className="absolute inset-0 size-full cursor-pointer opacity-0" />
                  <span className="size-7 rounded-lg border border-black/15 shadow-sm" style={{ backgroundColor: channelColor }} /><span className="font-mono text-xs font-bold text-[#17201a]">{channelColor}</span><span className="sr-only">현재 Channel Color 선택</span>
                </label>
              </div>
              {presetNameError && <p className="text-xs font-bold text-red-600">{presetNameError}</p>}
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2 rounded-xl bg-[#202823] p-2 shadow-inner" aria-label="Channel color presets"><span className="mr-1 text-[0.6rem] font-bold uppercase tracking-[0.12em] text-white/55">{t("palette")}</span>{CHANNEL_PRESETS.map((color) => <button key={color} type="button" onClick={() => selectChannelColor(color)} aria-label={`${t("palette")} ${color}`} aria-pressed={channelColor === color} className="size-8 rounded-full border-2 border-white/80 shadow-sm outline outline-1 outline-black/25 transition-transform hover:scale-110 aria-pressed:outline-2 aria-pressed:outline-white" style={{ backgroundColor: color }} />)}</div>
                <label className="flex h-12 cursor-pointer items-center gap-2 rounded-xl bg-white px-2.5 shadow-sm ring-1 ring-black/10" title={t("picker")}><span className="relative size-8 overflow-hidden rounded-full border-2 border-white shadow-sm ring-1 ring-black/15" style={{ background: "conic-gradient(#ff3b30, #ffcc00, #34c759, #00c7be, #007aff, #af52de, #ff2d55, #ff3b30)" }}><input type="color" value={channelColor} onChange={(event) => selectChannelColor(event.target.value)} className="absolute inset-0 size-full cursor-pointer opacity-0" /></span><span className="text-xs font-bold text-[#596057]">{t("picker")}</span></label>
                <details className="group relative"><summary className="flex h-12 cursor-pointer list-none items-center gap-2 rounded-xl bg-white px-3 text-xs font-bold text-[#596057] shadow-sm ring-1 ring-black/10 hover:bg-[#fafbf8]"><History className="size-4" /> {t("history")}</summary><div className="absolute right-0 z-40 mt-2 w-56 rounded-xl border border-[#d9ded4] bg-white p-3 shadow-xl"><div className="flex items-center justify-between"><p className="text-xs font-bold uppercase tracking-wider text-[#72776f]">{t("colorHistory")}</p><span className="text-[0.65rem] text-[#8c9189]">{colorHistory.length}/{MAX_COLOR_HISTORY}</span></div>{colorHistory.length > 0 ? <div className="mt-3 grid grid-cols-4 gap-2">{colorHistory.map((color) => <button key={color} type="button" onClick={(event) => { selectChannelColor(color); event.currentTarget.closest("details")?.removeAttribute("open"); }} aria-label={`${t("history")} ${color}`} title={color} aria-pressed={channelColor === color} className="aspect-square rounded-lg border-2 border-white shadow-sm outline outline-1 outline-black/15 aria-pressed:outline-2 aria-pressed:outline-[#172d23]" style={{ backgroundColor: color }} />)}</div> : <p className="mt-3 text-xs text-[#8c9189]">{t("noColorHistory")}</p>}</div></details>
              </div>
            </div>
            {!templateBuffer && <p className="mt-3 rounded-lg bg-[#fff7df] px-3 py-2 text-xs text-[#755d16]">{t("templateHint")}</p>}
          </div>

          {/* Articulation 행 편집 */}
          <div className="rounded-xl border border-[#e1e5dc]">
            <div className="flex flex-col gap-3 rounded-t-xl border-b border-[#e1e5dc] bg-[#f7f8f4] px-4 py-3 sm:flex-row sm:items-center sm:justify-between"><div><p className="font-bold">{t("articulations")}</p><p className="mt-1 text-xs text-[#72776f]">{t("articulationHint")}</p></div><div className="flex flex-wrap items-center gap-2"><label className="mr-1 flex items-center gap-2 text-xs font-bold text-[#72776f]">Keyswitch Init<input type="number" min={0} max={128} value={keyswitchInit} onChange={(event) => updateKeyswitchInit(event.target.value)} className="h-8 w-16 rounded-lg border border-[#d9ded4] bg-white px-2 font-mono text-sm text-[#17201a]" /><span className="min-w-10 font-mono text-[#5b7f44]">({noteNumberToName(keyswitchInit)})</span></label><Button type="button" size="sm" onClick={() => addArticulation()} disabled={settings.Articulations.length >= MAX_ARTICULATIONS}><Plus /> {t("add")}</Button><Button type="button" size="sm" variant="outline" onClick={clearArticulations} disabled={settings.Articulations.length === 0} className="text-[#8b4a4a] hover:bg-red-50 hover:text-red-700"><Trash2 /> {t("clear")}</Button></div></div>
            <div className="divide-y divide-[#edf0e9]">
              {settings.Articulations.map((articulation, index) => <div key={index} className="grid gap-3 border-l-4 p-4 last:rounded-b-xl sm:grid-cols-[2rem_minmax(10rem,1fr)_minmax(9rem,0.6fr)_3rem_2rem] sm:items-start" style={{ backgroundColor: ARTICULATION_COLORS[index].light, borderLeftColor: ARTICULATION_COLORS[index].source }}>
                <span className="pt-2 font-mono text-xs text-[#72776f]">{index + 1}</span>
                <label className="text-xs font-bold text-[#72776f]">{t("articulationName")}<input ref={(element) => { nameInputRefs.current[index] = element; }} value={articulation.name} onChange={(event) => updateArticulation(index, { name: event.target.value })} onKeyDown={(event) => handleRowEnter(event, index)} className="mt-1.5 h-9 w-full rounded-lg border border-[#d9ded4] bg-white px-3 text-sm font-normal text-[#17201a] outline-none focus:border-[#5b7f44]" /></label>
                <label className="text-xs font-bold text-[#72776f]">{t("note")}<div className="mt-1.5 flex h-9 overflow-hidden rounded-lg border border-[#d9ded4] bg-white focus-within:border-[#5b7f44] has-[[aria-invalid=true]]:border-red-500"><input value={noteDrafts[index]} onChange={(event) => updateNote(index, event.target.value)} onKeyDown={(event) => handleRowEnter(event, index)} inputMode="numeric" aria-invalid={Boolean(noteErrors[index])} className="min-w-0 flex-1 bg-transparent px-3 font-mono text-sm font-normal text-[#17201a] outline-none" /><span className="flex min-w-14 items-center justify-center border-l border-[#d9ded4] bg-[#f7f9f5] px-2 font-mono text-xs text-[#5b7f44]">{noteErrors[index] ? "?" : articulation.note === -1 ? "OFF" : noteNumberToName(articulation.note)}</span></div>{noteErrors[index] && <span className="mt-1 block font-normal text-red-600">{noteErrors[index]}</span>}</label>
                <div className="pt-5"><IconPicker value={articulation.icon} onChange={(icon) => updateArticulation(index, { icon })} /></div>
                <button type="button" onClick={() => removeArticulation(index)} aria-label={`${articulation.name || index + 1} 삭제`} className="mt-6 flex size-8 items-center justify-center rounded-lg text-[#8c9189] hover:bg-red-50 hover:text-red-600"><Trash2 className="size-4" /></button>
              </div>)}
              {settings.Articulations.length === 0 && <p className="p-6 text-center text-sm text-[#72776f]">{t("noArticulations")}</p>}
            </div>
          </div>

          {/* Key Mapping은 설정에서 활성화한 경우에만 읽기 전용으로 표시합니다. */}
          {uiSettings.showKeyMapping && <KeyMappingPanel entries={visibleKeyMappings} totalCount={keyMappings.length} page={keyMappingPage} pageCount={keyMappingPageCount} onPageChange={setKeyMappingPage} />}

          {/* 검증 결과와 최종 Save / Export 액션 */}
          {hasErrors && <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"><p className="font-bold">{t("validationTitle")}</p><p className="mt-1 text-xs">{presetNameError ?? noteErrors.find(Boolean) ?? validationErrors[0]?.message}</p></div>}
          <EditorActionBar disabled={!templateBuffer || hasErrors} hasTemplate={Boolean(templateBuffer)} showTest={uiSettings.showDebugTools} testDisabled={!settings || hasErrors || !uiSettings.brsoInstanceId} onTest={() => setIsTestDialogOpen(true)} onSave={saveCurrentFst} onExport={handleFstExport} />
        </div>}
      </section>}

      {/* 여러 FST를 세션에 보관하고 ZIP으로 내보내는 별도 영역 */}
    </div>
    {isTestDialogOpen && settings && <BrsoTestDialog command={testCommand} articulationCount={settings.Articulations.length} onClose={() => setIsTestDialogOpen(false)} />}
  </>;
}

function createBrsoTestCommand(articulations: Array<{ name: string; icon: number; note: number; notev: number; prog: number; modw: number; modc: number }>, instanceId: string) {
  const lines = [
    `$base = "http://localhost:8000/api/${instanceId}"`,
    "$ErrorActionPreference = \"Stop\"",
    "",
  ];
  articulations.forEach(({ name, icon, note }, index) => {
    const encodedName = encodeURIComponent(name);
    lines.push(
      `# Articulation ${index + 1}`,
      `Invoke-RestMethod -Uri "$base/articulations/${index}/name=${encodedName}" -TimeoutSec 3`,
      `Invoke-RestMethod -Uri "$base/articulations/${index}/icon=${icon}" -TimeoutSec 3`,
      `Invoke-RestMethod -Uri "$base/articulations/${index}/note=${note}" -TimeoutSec 3`,
      "",
    );
  });
  return lines.join("\n").trim();
}

function WorkspacePlaceholder({ icon: Icon, eyebrow, title, description, action }: { icon: typeof BookOpen; eyebrow: string; title: string; description: string; action: string }) {
  return <section className="grid min-h-[38rem] min-w-0 place-items-center bg-white/70 p-6 text-center sm:p-10">
    <div className="max-w-md">
      <span className="mx-auto grid size-16 place-items-center rounded-2xl bg-[#fbefd4] text-[#b3983c] ring-1 ring-[#e5cf9f]"><Icon className="size-7" /></span>
      <p className="mt-6 text-xs font-bold uppercase tracking-[0.16em] text-[#5b7f44]">{eyebrow}</p>
      <h2 className="mt-2 text-3xl font-bold tracking-[-0.04em] text-[#292820]">{title}</h2>
      <p className="mt-3 text-sm leading-7 text-[#777267]">{description}</p>
      <div className="mt-7 inline-flex items-center gap-2 rounded-full border border-dashed border-[#d9cdb7] bg-[#fffaf0] px-4 py-2.5 text-xs font-bold text-[#8a7657]"><Sparkles className="size-4 text-[#b3983c]" />{action}</div>
    </div>
  </section>;
}
