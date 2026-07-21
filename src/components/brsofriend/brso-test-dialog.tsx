import { Check, Copy, Terminal, TriangleAlert, X } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";

export function BrsoTestDialog({ command, articulationCount, onClose }: { command: string; articulationCount: number; onClose: () => void }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === "Escape") onClose(); };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [onClose]);

  async function copyCommand() {
    await navigator.clipboard.writeText(command);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return <div className="fixed inset-0 z-[100] grid place-items-center bg-[#17201a]/55 p-4 backdrop-blur-sm" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
    <section role="dialog" aria-modal="true" aria-labelledby="brso-test-title" className="w-full max-w-2xl overflow-hidden rounded-[1.5rem] border border-[#d9cdb7] bg-[#fffdf8] text-left shadow-2xl">
      <header className="flex items-start justify-between gap-4 border-b border-[#e7dfd0] px-5 py-4 sm:px-6">
        <div className="flex gap-3"><span className="grid size-10 shrink-0 place-items-center rounded-xl bg-[#202823] text-[#d8bd59]"><Terminal className="size-5" /></span><div><p className="text-[0.68rem] font-bold uppercase tracking-[0.15em] text-[#8a7657]">Advanced Debug</p><h2 id="brso-test-title" className="mt-1 text-xl font-bold text-[#292820]">PowerShell로 FST 테스트</h2></div></div>
        <button type="button" onClick={onClose} aria-label="닫기" className="grid size-9 place-items-center rounded-full text-[#8b877e] hover:bg-[#f3eee4] hover:text-[#292820]"><X className="size-4" /></button>
      </header>
      <div className="p-5 sm:p-6">
        <div className="flex gap-3 rounded-xl border border-[#ead7a6] bg-[#fff7df] p-4 text-[#6b5619]"><TriangleAlert className="mt-0.5 size-5 shrink-0" /><div><p className="text-sm font-bold">현재 BRSO articulation의 일부 값을 변경합니다.</p><p className="mt-1 text-xs leading-5 opacity-80">BRSO의 HTTP JSON API를 켜고 기존 설정을 먼저 저장하세요. 아래 명령은 {articulationCount}개 articulation의 name, icon, note를 차례로 전송합니다.</p></div></div>
        <label className="mt-5 block text-xs font-bold uppercase tracking-[0.12em] text-[#777267]">복사 후 CMD 또는 PowerShell에 붙여넣기
          <textarea readOnly value={command} onFocus={(event) => event.currentTarget.select()} className="mt-2 h-64 w-full resize-none rounded-xl border border-[#d9ded4] bg-[#202823] p-4 font-mono text-xs font-normal normal-case leading-5 tracking-normal text-[#eef4ea] outline-none focus:border-[#b3983c]" />
        </label>
        <div className="mt-4 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end"><Button type="button" variant="outline" onClick={onClose} className="rounded-full">취소</Button><Button type="button" onClick={copyCommand} className="rounded-full bg-[#5b7f44] px-5 text-white hover:bg-[#4b6c39]">{copied ? <Check /> : <Copy />}{copied ? "복사 완료" : "명령어 전체 복사"}</Button></div>
      </div>
    </section>
  </div>;
}
