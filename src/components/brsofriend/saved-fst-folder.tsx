import { Archive, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";

import { formatFileSize, MAX_SAVED_FSTS, type SavedFst } from "./workspace-model";
import { useBrsofriendI18n } from "./brsofriend-i18n";

interface SavedFstFolderProps {
  items: SavedFst[];
  onLoad: (item: SavedFst) => void;
  onRemove: (name: string) => void;
  onExport: () => void;
}

export function SavedFstFolder({ items, onLoad, onRemove, onExport }: SavedFstFolderProps) {
  const { t } = useBrsofriendI18n();
  return (
    <section className="mt-6 w-full rounded-[1.5rem] border border-[#e1e5dc] bg-white/70 p-5 text-left shadow-xl shadow-[#263d2c]/5 sm:p-7">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div><p className="text-sm font-bold uppercase tracking-[0.16em] text-[#5b7f44]">{t("savedFolder")}</p><p className="mt-2 text-sm text-[#72776f]">{t("savedFolderHint")}</p></div>
        <div className="flex shrink-0 items-center gap-2"><span className="rounded-full bg-[#eaf1e2] px-3 py-1.5 text-xs font-bold text-[#5b7f44]">{items.length}/{MAX_SAVED_FSTS}</span><Button type="button" variant="outline" onClick={onExport} disabled={items.length === 0} className="rounded-full"><Archive /> {t("exportFolder")}</Button></div>
      </div>
      {items.length > 0 ? <div className="mt-5 grid gap-2 sm:grid-cols-2">{items.map((item) => <div key={item.name} className="flex min-w-0 items-center justify-between gap-3 rounded-lg border-l-4 px-3 py-3" style={{ backgroundColor: `${item.channelColor}20`, borderColor: item.channelColor }}>
        <button type="button" onClick={() => onLoad(item)} className="min-w-0 flex-1 rounded-md text-left outline-none hover:text-[#5b7f44] focus-visible:ring-2 focus-visible:ring-[#5b7f44] focus-visible:ring-offset-2" title={`${item.name} ${t("editSaved")}`}><span className="block truncate text-sm font-bold">{item.name}</span><span className="mt-0.5 block text-xs text-[#72776f]">{item.articulationCount} articulations · {formatFileSize(item.data.byteLength)}</span></button>
        <button type="button" onClick={() => onRemove(item.name)} aria-label={`${item.name} ${t("removeSaved")}`} className="flex size-8 shrink-0 items-center justify-center rounded-lg text-[#8c9189] hover:bg-red-50 hover:text-red-600"><Trash2 className="size-4" /></button>
      </div>)}</div> : <p className="mt-5 rounded-xl border border-dashed border-[#cad4c3] px-4 py-8 text-center text-sm text-[#8c9189]">{t("emptySavedFolder")}</p>}
    </section>
  );
}
