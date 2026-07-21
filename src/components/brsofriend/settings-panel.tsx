import { ChevronDown, Settings2 } from "lucide-react";

import type { UiSettings } from "./workspace-model";
import { useBrsofriendI18n } from "./brsofriend-i18n";

export function SettingsPanel({ settings, onChange }: { settings: UiSettings; onChange: <K extends keyof UiSettings>(key: K, value: UiSettings[K]) => void }) {
  const { localePreference, setLocalePreference, t } = useBrsofriendI18n();
  const options = [
    ["showDefaultName", t("defaultFileNameSetting")], ["showDebugTools", t("debugFeatures")], ["showKeyMapping", t("showKeyMapping")],
  ] as const;
  return (
    <div className="mb-6 rounded-xl border border-[#d9ded4] bg-[#f7f8f4] p-4">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center"><p className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.14em] text-[#5b7f44]"><Settings2 className="size-4" /> {t("settings")}</p><label className="flex items-center gap-2"><span className="text-xs font-bold text-[#72776f]">{t("productLanguage")}</span><span className="relative"><select value={localePreference} onChange={(event) => setLocalePreference(event.target.value as "inherit" | "ko" | "en")} className="appearance-none rounded-lg border border-[#d9ded4] bg-white py-2 pl-3 pr-8 text-xs font-bold text-[#4f554d] outline-none transition-colors hover:border-[#aeb8a8] focus:border-[#5b7f44] focus:ring-2 focus:ring-[#5b7f44]/15"><option value="inherit">{t("followSiteLanguage")}</option><option value="ko">한국어</option><option value="en">English</option></select><ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 size-3.5 -translate-y-1/2 text-[#72776f]" aria-hidden="true" /></span></label></div>
      <div className="mt-3 grid gap-2 sm:grid-cols-3">
        {options.map(([key, label]) => <label key={key} className="flex cursor-pointer items-center justify-between gap-3 rounded-lg border border-[#e1e5dc] bg-white px-3 py-2.5 text-sm font-bold text-[#596057]">
          <span>{label}</span><span className="relative inline-flex"><input type="checkbox" checked={settings[key]} onChange={(event) => onChange(key, event.target.checked)} className="peer sr-only" /><span className="h-6 w-11 rounded-full bg-[#d9ded4] transition-colors peer-checked:bg-[#5b7f44]" /><span className="absolute left-1 top-1 size-4 rounded-full bg-white shadow-sm transition-transform peer-checked:translate-x-5" /></span>
        </label>)}
      </div>
      <label className="mt-4 block rounded-lg border border-[#e1e5dc] bg-white p-3 text-sm font-bold text-[#596057]">
        <span className="flex items-center justify-between gap-3"><span>BRSO Instance ID</span><span className="text-[0.65rem] font-normal text-[#92978f]">Debug API · localhost:8000</span></span>
        <input value={settings.brsoInstanceId} onChange={(event) => onChange("brsoInstanceId", event.target.value.replace(/\D/g, ""))} inputMode="numeric" placeholder="306675328" className="mt-2 h-10 w-full rounded-lg border border-[#d9ded4] bg-[#fafbf8] px-3 font-mono text-sm font-normal text-[#17201a] outline-none transition-colors focus:border-[#5b7f44] focus:ring-2 focus:ring-[#5b7f44]/15" />
        <span className="mt-1.5 block text-[0.68rem] font-normal leading-5 text-[#8c9189]">FL Studio의 BRSO API에서 확인한 인스턴스 ID를 입력하세요.</span>
      </label>
    </div>
  );
}
