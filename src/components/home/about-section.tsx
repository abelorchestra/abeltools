import Image from "next/image";

export function AboutSection() {
  return (
    <section className="relative overflow-hidden bg-[#fdfdfd]">
      <div className="mx-auto max-w-[1200px] px-5 pb-14 pt-10 sm:px-8 sm:pt-16">
        <Image src="/home/main-logo.png" alt="악기들과 사카노 캐릭터가 함께 있는 AbelTools 로고" width={2048} height={768} className="mx-auto h-auto w-full" priority />
        <p className="mt-2 text-center text-2xl font-bold text-[#3c3011] sm:text-4xl">Easier, Better, Funnier</p>
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-[#fffcf2]" />
    </section>
  );
}
