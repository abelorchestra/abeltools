import { Download, Save } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useBrsofriendI18n } from "./brsofriend-i18n";

export function EditorActionBar({ disabled, hasTemplate, onSave, onExport }: { disabled: boolean; hasTemplate: boolean; onSave: () => void; onExport: () => void }) {
  const { t } = useBrsofriendI18n();
  return (
    <div className="z-20 flex flex-col gap-2 rounded-2xl border border-[#d9ded4] bg-white/90 p-3 shadow-lg shadow-[#263d2c]/10 backdrop-blur sm:flex-row sm:justify-end lg:sticky lg:bottom-4">
      <Button type="button" size="lg" onClick={onSave} disabled={disabled} className="h-11 rounded-full bg-[#3d7f88] px-6 text-white hover:bg-[#326c74]"><Save /> {t("saveFst")}</Button>
      <Button type="button" size="lg" onClick={onExport} disabled={disabled} title={!hasTemplate ? t("templateRequired") : undefined} className="h-11 rounded-full bg-[#b3983c] px-6 text-white hover:bg-[#987f2f]"><Download /> {t("exportFst")}</Button>
    </div>
  );
}
