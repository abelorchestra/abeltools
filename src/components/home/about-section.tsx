import { Check } from "lucide-react";
import Image from "next/image";

const principles = [
  "회원가입 없이 바로",
  "필요한 기능만 간결하게",
  "모바일에서도 편리하게",
];

export function AboutSection() {
  return (
    <section id="about" className="mx-auto max-w-6xl px-6 py-24 lg:px-8">
      <div className="grid gap-12 rounded-[2rem] bg-[#eaf1e2] p-8 sm:p-12 lg:grid-cols-[0.9fr_1.1fr] lg:p-16">
        <Image
          src="/logo/logo_char.png"
          alt="Abel Tools 캐릭터 로고"
          width={2048}
          height={683}
          className="h-auto w-full rounded-2xl lg:col-span-2"
        />
        <div>
          <p className="text-sm font-semibold text-[#527043]">OUR PROMISE</p>
          <h2 className="mt-4 text-3xl font-semibold leading-tight tracking-[-0.045em] sm:text-4xl">
            도구는 설명보다<br />먼저 이해되어야 하니까.
          </h2>
        </div>
        <div className="flex flex-col justify-center gap-5">
          {principles.map((principle) => (
            <div key={principle} className="flex items-center gap-4 text-lg">
              <span className="grid size-7 place-items-center rounded-full bg-[#172d23] text-[#d8ff72]">
                <Check className="size-4" aria-hidden="true" />
              </span>
              {principle}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
