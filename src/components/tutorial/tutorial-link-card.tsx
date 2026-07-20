import { ArrowRight, PlayCircle } from "lucide-react";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function TutorialLinkCard({ href }: { href: `/${string}` }) {
  return (
    <section className="mt-6 flex w-full flex-col gap-5 rounded-[1.5rem] border border-[#e1e5dc] bg-white/70 p-6 text-left sm:flex-row sm:items-center sm:justify-between">
      <div className="flex gap-4">
        <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-[#eaf1e2] text-[#5b7f44]"><PlayCircle className="size-5" /></span>
        <div><h2 className="text-xl font-bold">Tutorial</h2><p className="mt-1 text-sm leading-6 text-[#666b64]">BRSOfriend의 설정과 기본 사용 흐름을 영상으로 확인하세요.</p></div>
      </div>
      <Link href={href} className={cn(buttonVariants({ size: "lg" }), "h-11 shrink-0 rounded-full bg-[#172d23] px-5 text-white hover:bg-[#244334]")}>
        자세히 알아보기 <ArrowRight className="ml-1 size-4" />
      </Link>
    </section>
  );
}
