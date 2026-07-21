"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";

export function MessageExpander() {
  const [open, setOpen] = useState(true);
  return (
    <section className="mx-auto max-w-[1000px] px-5 py-16 sm:px-8 sm:py-24">
      <button type="button" onClick={() => setOpen((value) => !value)} aria-expanded={open} className="w-full rounded-[22px] border border-[#c2debc] bg-[#f4fbf1] px-6 py-5 text-left shadow-[0_6px_16px_rgba(45,90,35,0.12)] transition-shadow hover:shadow-[0_10px_24px_rgba(45,90,35,0.15)] sm:px-8">
        <span className="flex items-start justify-between gap-6">
          <span className="text-2xl font-bold leading-snug text-[#20301f] sm:text-[34px]">오케스트레이션을 더 쉽게, 더 좋게, 더 재밌게 해보자</span>
          <ChevronDown className={`mt-1 size-7 shrink-0 transition-transform duration-300 ${open ? "rotate-180" : ""}`} aria-hidden="true" />
        </span>
        <span className="my-5 flex items-center gap-3" aria-hidden="true"><span className="h-px flex-1 bg-[#c2debc]" /><span className="text-[#8aac73]">♥</span><span className="h-px flex-1 bg-[#c2debc]" /></span>
        <span className={`grid overflow-hidden text-[17px] leading-8 text-[#52624f] transition-[grid-template-rows,opacity] duration-300 ${open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
          <span className="min-h-0">복잡한 오케스트레이션 작업을 조금 더 편하게 만들고 싶었습니다. BRSO Articulate의 설정과 프리셋 공유부터 시작해, 작업의 완성도를 높이는 도구와 음악을 더 즐겁게 만드는 작은 기능들을 하나씩 만들어갑니다.</span>
        </span>
      </button>
    </section>
  );
}
