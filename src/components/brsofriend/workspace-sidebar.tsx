import { Archive, BookOpen, FilePenLine, FolderOpen, Settings2, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";

import { useBrsofriendI18n } from "./brsofriend-i18n";
import { formatFileSize, MAX_SAVED_FSTS, type SavedFst } from "./workspace-model";

export type WorkspaceView = "tutorial" | "settings" | "editor" | "presets";

interface WorkspaceSidebarProps {
  activeView: WorkspaceView;
  onViewChange: (view: WorkspaceView) => void;
  items: SavedFst[];
  onLoad: (item: SavedFst) => void;
  onRemove: (name: string) => void;
  onExport: () => void;
}

const NAVIGATION = [
  { id: "tutorial", label: "Tutorial", icon: BookOpen },
  { id: "settings", label: "Settings", icon: Settings2 },
  { id: "editor", label: "Editor", icon: FilePenLine },
  { id: "presets", label: "Presets", icon: FolderOpen },
] as const;

export function WorkspaceSidebar({ activeView, onViewChange, items, onLoad, onRemove, onExport }: WorkspaceSidebarProps) {
  const { t } = useBrsofriendI18n();

  return (
    <aside className="flex min-h-0 flex-col overflow-hidden border-b border-[#dfd5c2] bg-[#fffaf0] text-left lg:min-h-[38rem] lg:border-b-0 lg:border-r">
      <nav className="grid grid-cols-2 border-b border-[#dfd5c2] p-3 sm:grid-cols-4 lg:block lg:p-4" aria-label="BRSOfriend 메뉴">
        {NAVIGATION.map(({ id, label, icon: Icon }) => <button key={id} type="button" onClick={() => onViewChange(id)} aria-current={activeView === id ? "page" : undefined} className={`flex min-h-11 w-full items-center gap-2 rounded-xl px-3 text-sm font-bold transition-colors ${activeView === id ? "bg-[#fbefd4] text-[#4e3814] shadow-sm ring-1 ring-[#e5cf9f]" : "text-[#aaa69d] hover:bg-white hover:text-[#4e3814]"}`}>
          <Icon className={`size-4 ${activeView === id ? "text-[#b3983c]" : ""}`} aria-hidden="true" /> {label}
        </button>)}
      </nav>

      <div className="min-h-0 flex-1 p-4 lg:overflow-y-auto">
        <div className="flex items-center justify-between gap-3">
          <div><p className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#8a7657]">{t("savedFolder")}</p><p className="mt-1 text-[0.68rem] text-[#aaa69d]">{items.length}/{MAX_SAVED_FSTS}</p></div>
          <span className="grid size-8 place-items-center rounded-full bg-white text-[#b3983c] ring-1 ring-[#e6dbc6]"><FolderOpen className="size-4" aria-hidden="true" /></span>
        </div>

        {items.length > 0 ? <div className="mt-4 space-y-2">{items.map((item) => <div key={item.name} className="group flex min-w-0 items-center gap-2 rounded-xl border border-black/5 bg-white p-2 shadow-sm transition-transform hover:-translate-y-0.5" style={{ borderLeftColor: item.channelColor, borderLeftWidth: 4 }}>
          <button type="button" onClick={() => { onLoad(item); onViewChange("editor"); }} className="min-w-0 flex-1 rounded-lg px-1 py-1 text-left outline-none focus-visible:ring-2 focus-visible:ring-[#b3983c]" title={`${item.name} ${t("editSaved")}`}><span className="block truncate text-xs font-bold text-[#4e3814]">{item.name}</span><span className="mt-1 block truncate text-[0.65rem] text-[#918b80]">{item.articulationCount} articulations · {formatFileSize(item.data.byteLength)}</span></button>
          <button type="button" onClick={() => onRemove(item.name)} aria-label={`${item.name} ${t("removeSaved")}`} className="grid size-8 shrink-0 place-items-center rounded-lg text-[#b7b1a7] opacity-70 transition-colors hover:bg-red-50 hover:text-red-600 group-hover:opacity-100"><Trash2 className="size-3.5" /></button>
        </div>)}</div> : <div className="mt-4 rounded-2xl border border-dashed border-[#d9cdb7] bg-white/55 px-3 py-7 text-center"><span className="mx-auto grid size-10 place-items-center rounded-full bg-[#fbefd4] text-[#b3983c]"><FolderOpen className="size-5" /></span><p className="mt-3 text-xs font-bold text-[#80796d]">{t("emptySavedFolder")}</p><p className="mt-1 text-[0.65rem] leading-5 text-[#aaa69d]">Editor에서 저장하면 여기에 표시됩니다.</p></div>}
      </div>

      <div className="border-t border-[#dfd5c2] p-4">
        <Button type="button" variant="outline" onClick={onExport} disabled={items.length === 0} className="h-11 w-full rounded-xl border-[#d9c9a9] bg-white text-[#4e3814] hover:bg-[#fbefd4] hover:text-[#4e3814]"><Archive className="size-4" /> {t("exportFolder")}</Button>
      </div>
    </aside>
  );
}
