import { Sparkles, Zap } from "lucide-react";

export function HeroPreview() {
  return (
    <div className="relative mx-auto w-full max-w-lg lg:mx-0">
      <div className="absolute -inset-10 -z-10 rounded-full bg-[#dfff8d]/35 blur-3xl" />
      <div className="rotate-2 rounded-[2rem] border border-white/80 bg-white/70 p-4 shadow-[0_30px_90px_-35px_rgba(31,47,35,0.3)] backdrop-blur-xl">
        <div className="rounded-[1.45rem] bg-[#172d23] p-6 text-white sm:p-8">
          <div className="flex items-center justify-between">
            <div className="flex gap-1.5" aria-hidden="true"><span className="size-2.5 rounded-full bg-white/30" /><span className="size-2.5 rounded-full bg-white/20" /><span className="size-2.5 rounded-full bg-white/10" /></div>
            <span className="text-xs text-white/50">abeltools.vercel.app</span>
          </div>
          <div className="mt-12 grid gap-3">
            <div className="rounded-2xl border border-white/10 bg-white/8 p-5">
              <p className="text-xs uppercase tracking-[0.18em] text-[#d8ff72]">Quick tool</p>
              <p className="mt-2 text-xl font-medium">오늘 필요한 작업은?</p>
              <div className="mt-5 h-12 rounded-xl bg-white/10 p-3 text-sm text-white/45">텍스트를 입력하세요...</div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-[#d8ff72] p-5 text-[#172d23]"><Zap className="size-5" aria-hidden="true" /><p className="mt-8 text-sm font-semibold">빠른 실행</p></div>
              <div className="rounded-2xl bg-white/10 p-5"><Sparkles className="size-5 text-[#d8ff72]" aria-hidden="true" /><p className="mt-8 text-sm font-semibold">깔끔한 결과</p></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
