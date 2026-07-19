import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { SitePage } from "@/components/layout/site-page";

type CategoryItem = {
  href: `/${string}`;
  label: string;
  title: string;
  description: string;
};

export function CategoryPage({ eyebrow, title, description, items }: { eyebrow: string; title: string; description: string; items: CategoryItem[] }) {
  return (
    <SitePage>
      <section className="mx-auto w-full max-w-6xl flex-1 px-6 py-20 lg:px-8">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#5b7f44]">{eyebrow}</p>
        <h1 className="mt-4 text-5xl font-bold tracking-[-0.04em] sm:text-6xl">{title}</h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-[#666b64]">{description}</p>
        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {items.map((item) => (
            <Link key={item.href} href={item.href} className="group rounded-[1.5rem] border border-[#e1e5dc] bg-white/70 p-7 transition-transform hover:-translate-y-1">
              <span className="text-sm font-bold text-[#5b7f44]">{item.label}</span>
              <h2 className="mt-3 text-2xl font-bold tracking-[-0.03em]">{item.title}</h2>
              <p className="mt-3 min-h-20 text-sm leading-6 text-[#666b64]">{item.description}</p>
              <span className="mt-6 flex items-center gap-2 text-sm font-bold">자세히 보기 <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" /></span>
            </Link>
          ))}
        </div>
      </section>
    </SitePage>
  );
}
