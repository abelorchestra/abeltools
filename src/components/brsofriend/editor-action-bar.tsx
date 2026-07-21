import { Download, FlaskConical, Save } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useBrsofriendI18n } from "./brsofriend-i18n";

export function EditorActionBar({ disabled, hasTemplate, showTest, testDisabled, onTest, onSave, onExport }: { disabled: boolean; hasTemplate: boolean; showTest: boolean; testDisabled: boolean; onTest: () => void; onSave: () => void; onExport: () => void }) {
  const { t } = useBrsofriendI18n();
  return (
    <div className="z-20 flex flex-col gap-2 rounded-2xl border border-[#d9ded4] bg-white/90 p-3 shadow-lg shadow-[#263d2c]/10 backdrop-blur sm:flex-row sm:justify-end lg:sticky lg:bottom-4">
      {showTest && <div className="flex sm:mr-auto"><Button type="button" size="lg" variant="outline" onClick={onTest} disabled={testDisabled} className="h-11 w-full rounded-full border-[#5b7f44] bg-[#eff5e9] px-6 text-[#36552b] hover:bg-[#e1edd8] hover:text-[#294421]"><FlaskConical /> FST 테스트</Button></div>}
      <Button type="button" size="lg" onClick={onSave} disabled={disabled} title="Shift + Enter" className="h-11 rounded-full bg-[#3d7f88] px-6 text-white hover:bg-[#326c74]"><Save /> {t("saveFst")}<kbd className="ml-1 hidden rounded-md bg-white/15 px-1.5 py-0.5 font-sans text-[0.62rem] font-bold text-white/80 sm:inline">Shift ↵</kbd></Button>
      <Button type="button" size="lg" onClick={onExport} disabled={disabled} title={!hasTemplate ? t("templateRequired") : undefined} className="h-11 rounded-full bg-[#b3983c] px-6 text-white hover:bg-[#987f2f]"><Download /> {t("exportFst")}</Button>
    </div>
  );
}
