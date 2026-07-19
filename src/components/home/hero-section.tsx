import { ArrowRight, Code2, Zap } from "lucide-react";

import { HeroPreview } from "@/components/home/hero-preview";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function HeroSection() {
  return (
    <section className="relative mx-auto grid max-w-6xl items-center gap-14 px-6 pb-24 pt-16 lg:grid-cols-[1.08fr_0.92fr] lg:px-8 lg:pb-32 lg:pt-24">
      <div className="relative z-10">
        <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#dce1d7] bg-white/70 px-3.5 py-2 text-xs font-medium text-[#4c584e] shadow-sm backdrop-blur">
          <Zap className="size-3.5 fill-[#b9e45c] text-[#487135]" aria-hidden="true" />
          일상을 가볍게 만드는 웹 도구
        </div>
        <h1 className="max-w-3xl text-5xl font-semibold leading-[1.03] tracking-[-0.065em] sm:text-6xl lg:text-[4.75rem]">
          번거로운 일을<br /><span className="text-[#5b7f44]">더 단순하게.</span>
        </h1>
        <p className="mt-7 max-w-xl text-lg leading-8 text-[#666b64] sm:text-xl">
          설치도, 복잡한 설정도 필요 없습니다. 자주 쓰는 작은 기능을 빠르고 편안한 웹 도구로 만듭니다.
        </p>
        <div className="mt-9 flex flex-col gap-3 sm:flex-row">
          <a href="#tools" className={cn(buttonVariants({ size: "lg" }), "h-12 rounded-full bg-[#172d23] px-6 text-base text-white shadow-lg shadow-[#172d23]/10 hover:bg-[#244334]")}>
            지금 둘러보기 <ArrowRight className="ml-1 size-4" aria-hidden="true" />
          </a>
          <a href="https://github.com/abelorchestra/abeltools" target="_blank" rel="noreferrer" className={cn(buttonVariants({ variant: "outline", size: "lg" }), "h-12 rounded-full border-[#d9ddd4] bg-white/60 px-6 text-base hover:bg-white")}>
            <Code2 className="mr-1 size-4" aria-hidden="true" /> GitHub
          </a>
        </div>
      </div>
      <HeroPreview />
    </section>
  );
}
