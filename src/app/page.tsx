import {
  ArrowRight,
  Braces,
  Check,
  Code2,
  FileText,
  Sparkles,
  WandSparkles,
  Zap,
} from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const tools = [
  {
    icon: FileText,
    title: "텍스트 정리",
    description: "복잡한 문장을 읽기 쉽고 명확한 형태로 빠르게 다듬습니다.",
    label: "곧 공개",
  },
  {
    icon: Braces,
    title: "JSON 포매터",
    description: "JSON 데이터를 보기 좋게 정렬하고 오류를 한눈에 확인합니다.",
    label: "곧 공개",
  },
  {
    icon: WandSparkles,
    title: "스마트 변환",
    description: "반복되는 형식 변환을 단 몇 번의 클릭으로 끝냅니다.",
    label: "곧 공개",
  },
];

const principles = ["회원가입 없이 바로", "필요한 기능만 간결하게", "모바일에서도 편리하게"];

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#f7f8f4] text-[#171916]">
      <header className="mx-auto flex h-20 max-w-6xl items-center justify-between px-6 lg:px-8">
        <a href="#" className="flex items-center gap-2.5" aria-label="Abel Tools 홈">
          <span className="grid size-9 place-items-center rounded-xl bg-[#172d23] text-[#d8ff72] shadow-sm">
            <Sparkles className="size-4" />
          </span>
          <span className="text-lg font-semibold tracking-[-0.03em]">Abel Tools</span>
        </a>
        <nav className="hidden items-center gap-8 text-sm text-[#5d625b] sm:flex" aria-label="주요 메뉴">
          <a className="transition-colors hover:text-[#171916]" href="#tools">도구</a>
          <a className="transition-colors hover:text-[#171916]" href="#about">소개</a>
        </nav>
        <a href="#tools" className={cn(buttonVariants(), "rounded-full bg-[#172d23] px-5 text-white hover:bg-[#244334]")}>도구 둘러보기</a>
      </header>

      <section className="relative mx-auto grid max-w-6xl items-center gap-14 px-6 pb-24 pt-16 lg:grid-cols-[1.08fr_0.92fr] lg:px-8 lg:pb-32 lg:pt-24">
        <div className="relative z-10">
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#dce1d7] bg-white/70 px-3.5 py-2 text-xs font-medium text-[#4c584e] shadow-sm backdrop-blur">
            <Zap className="size-3.5 fill-[#b9e45c] text-[#487135]" />
            일상을 가볍게 만드는 웹 도구
          </div>
          <h1 className="max-w-3xl text-5xl font-semibold leading-[1.03] tracking-[-0.065em] sm:text-6xl lg:text-[4.75rem]">
            번거로운 일을
            <br />
            <span className="text-[#5b7f44]">더 단순하게.</span>
          </h1>
          <p className="mt-7 max-w-xl text-lg leading-8 text-[#666b64] sm:text-xl">
            설치도, 복잡한 설정도 필요 없습니다. 자주 쓰는 작은 기능을 빠르고 편안한 웹 도구로 만듭니다.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <a href="#tools" className={cn(buttonVariants({ size: "lg" }), "h-12 rounded-full bg-[#172d23] px-6 text-base text-white shadow-lg shadow-[#172d23]/10 hover:bg-[#244334]")}>지금 둘러보기 <ArrowRight className="ml-1 size-4" /></a>
            <a href="https://github.com" target="_blank" rel="noreferrer" className={cn(buttonVariants({ variant: "outline", size: "lg" }), "h-12 rounded-full border-[#d9ddd4] bg-white/60 px-6 text-base hover:bg-white")}><Code2 className="mr-1 size-4" /> GitHub</a>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-lg lg:mx-0">
          <div className="absolute -inset-10 -z-10 rounded-full bg-[#dfff8d]/35 blur-3xl" />
          <div className="rotate-2 rounded-[2rem] border border-white/80 bg-white/70 p-4 shadow-[0_30px_90px_-35px_rgba(31,47,35,0.3)] backdrop-blur-xl">
            <div className="rounded-[1.45rem] bg-[#172d23] p-6 text-white sm:p-8">
              <div className="flex items-center justify-between">
                <div className="flex gap-1.5"><span className="size-2.5 rounded-full bg-white/30" /><span className="size-2.5 rounded-full bg-white/20" /><span className="size-2.5 rounded-full bg-white/10" /></div>
                <span className="text-xs text-white/50">abeltools.vercel.app</span>
              </div>
              <div className="mt-12 grid gap-3">
                <div className="rounded-2xl border border-white/10 bg-white/8 p-5">
                  <p className="text-xs uppercase tracking-[0.18em] text-[#d8ff72]">Quick tool</p>
                  <p className="mt-2 text-xl font-medium">오늘 필요한 작업은?</p>
                  <div className="mt-5 h-12 rounded-xl bg-white/10 p-3 text-sm text-white/45">텍스트를 입력하세요...</div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-2xl bg-[#d8ff72] p-5 text-[#172d23]"><Zap className="size-5" /><p className="mt-8 text-sm font-semibold">빠른 실행</p></div>
                  <div className="rounded-2xl bg-white/10 p-5"><Sparkles className="size-5 text-[#d8ff72]" /><p className="mt-8 text-sm font-semibold">깔끔한 결과</p></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="tools" className="border-y border-[#e3e6df] bg-white/65 py-24">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-semibold text-[#5b7f44]">TOOLS</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-[-0.045em] sm:text-4xl">작지만 확실한 도구들</h2>
            </div>
            <p className="max-w-md text-sm leading-6 text-[#70756e]">첫 번째 도구부터 차근차근 준비하고 있습니다. 복잡함은 덜고, 쓰임새는 선명하게.</p>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {tools.map((tool) => (
              <article key={tool.title} className="group rounded-[1.5rem] border border-[#e1e5dc] bg-[#fbfcf9] p-7 transition-all hover:-translate-y-1 hover:border-[#cad4c3] hover:shadow-xl hover:shadow-[#263d2c]/5">
                <div className="grid size-11 place-items-center rounded-xl bg-[#eaf1e2] text-[#45683a]"><tool.icon className="size-5" /></div>
                <h3 className="mt-7 text-xl font-semibold tracking-[-0.025em]">{tool.title}</h3>
                <p className="mt-3 min-h-14 text-sm leading-6 text-[#6b7169]">{tool.description}</p>
                <div className="mt-7 flex items-center justify-between border-t border-[#e7eae4] pt-5">
                  <span className="text-xs font-medium text-[#8a8f87]">{tool.label}</span>
                  <ArrowRight className="size-4 text-[#7b8378] transition-transform group-hover:translate-x-1" />
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="about" className="mx-auto max-w-6xl px-6 py-24 lg:px-8">
        <div className="grid gap-12 rounded-[2rem] bg-[#eaf1e2] p-8 sm:p-12 lg:grid-cols-[0.9fr_1.1fr] lg:p-16">
          <div><p className="text-sm font-semibold text-[#527043]">OUR PROMISE</p><h2 className="mt-4 text-3xl font-semibold leading-tight tracking-[-0.045em] sm:text-4xl">도구는 설명보다<br />먼저 이해되어야 하니까.</h2></div>
          <div className="flex flex-col justify-center gap-5">
            {principles.map((principle) => <div key={principle} className="flex items-center gap-4 text-lg"><span className="grid size-7 place-items-center rounded-full bg-[#172d23] text-[#d8ff72]"><Check className="size-4" /></span>{principle}</div>)}
          </div>
        </div>
      </section>

      <footer className="border-t border-[#e0e4dc]">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-8 text-sm text-[#777d75] sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <p>© 2026 Abel Tools. Simple tools, better days.</p>
          <p>Seoul, Korea</p>
        </div>
      </footer>
    </main>
  );
}
