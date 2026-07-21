import { ChevronLeft, ChevronRight, KeyRound } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { BrsoKeyMapping } from "@/lib/brsofriend";
import { useBrsofriendI18n } from "./brsofriend-i18n";

export interface VisibleKeyMapping {
  slot: number;
  mapping: BrsoKeyMapping;
  mappingIndex: number;
}

interface KeyMappingPanelProps {
  entries: VisibleKeyMapping[];
  totalCount: number;
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
}

export function KeyMappingPanel({ entries, totalCount, page, pageCount, onPageChange }: KeyMappingPanelProps) {
  const { t } = useBrsofriendI18n();
  return (
    <div className="rounded-xl border border-[#e1e5dc]">
      <div className="flex flex-col gap-3 border-b border-[#e1e5dc] bg-[#f7f8f4] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <div><p className="flex items-center gap-2 font-bold"><KeyRound className="size-4" /> {t("keyMapping")}</p><p className="mt-1 text-xs text-[#72776f]">{t("keyMappingHint")}</p></div>
        {totalCount > 0 && <span className="shrink-0 rounded-full bg-[#eef0eb] px-3 py-1.5 text-xs font-bold text-[#72776f]">{totalCount} mappings</span>}
      </div>
      <div className="p-4">
        <div className="grid gap-2 lg:grid-cols-2">
          {entries.map(({ slot, mapping, mappingIndex }) => <div key={`${slot}-${mappingIndex}`} className="grid grid-cols-[4.5rem_minmax(0,1fr)_auto] gap-2 rounded-lg border border-[#e1e5dc] bg-white p-2"><span className="flex h-9 items-center rounded-md bg-[#f3f5f0] px-2 font-mono text-sm text-[#596057]">{mapping.note}</span><span className="flex h-9 min-w-0 items-center truncate rounded-md bg-[#f3f5f0] px-3 text-sm text-[#596057]">{mapping.name}</span><span className="flex items-center rounded-full bg-[#eef0eb] px-2 text-[0.65rem] font-bold text-[#72776f]">LIST {slot}</span></div>)}
          {totalCount === 0 && <p className="py-6 text-center text-sm text-[#8c9189] lg:col-span-2">{t("noKeyMapping")}</p>}
        </div>
        {pageCount > 1 && <div className="mt-4 flex items-center justify-center gap-3 border-t border-[#edf0e9] pt-4"><Button type="button" size="sm" variant="outline" onClick={() => onPageChange(Math.max(0, page - 1))} disabled={page === 0} aria-label={t("previousPage")}><ChevronLeft /></Button><span className="min-w-20 text-center font-mono text-xs font-bold text-[#596057]">{page + 1} / {pageCount}</span><Button type="button" size="sm" variant="outline" onClick={() => onPageChange(Math.min(pageCount - 1, page + 1))} disabled={page >= pageCount - 1} aria-label={t("nextPage")}><ChevronRight /></Button></div>}
      </div>
    </div>
  );
}
