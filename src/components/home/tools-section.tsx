import { Braces, FileText, WandSparkles } from "lucide-react";

import { ToolCard, type Tool } from "@/components/home/tool-card";

const tools: Tool[] = [
  { icon: FileText, title: "텍스트 정리", description: "복잡한 문장을 읽기 쉽고 명확한 형태로 빠르게 다듬습니다.", label: "곧 공개" },
  { icon: Braces, title: "JSON 포매터", description: "JSON 데이터를 보기 좋게 정렬하고 오류를 한눈에 확인합니다.", label: "곧 공개" },
  { icon: WandSparkles, title: "스마트 변환", description: "반복되는 형식 변환을 단 몇 번의 클릭으로 끝냅니다.", label: "곧 공개" },
];

export function ToolsSection() {
  return (
    <section id="tools" className="border-y border-[#e3e6df] bg-white/65 py-24">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div><p className="text-sm font-semibold text-[#5b7f44]">TOOLS</p><h2 className="mt-3 text-3xl font-semibold tracking-[-0.045em] sm:text-4xl">작지만 확실한 도구들</h2></div>
          <p className="max-w-md text-sm leading-6 text-[#70756e]">첫 번째 도구부터 차근차근 준비하고 있습니다. 복잡함은 덜고, 쓰임새는 선명하게.</p>
        </div>
        <div className="mt-12 grid gap-5 md:grid-cols-3">{tools.map((tool) => <ToolCard key={tool.title} tool={tool} />)}</div>
      </div>
    </section>
  );
}
