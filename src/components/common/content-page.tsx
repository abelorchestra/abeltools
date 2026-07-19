import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

import { SitePage } from "@/components/layout/site-page";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ContentPageProps = {
  eyebrow: string;
  title: string;
  description: string;
  backHref: `/${string}`;
  backLabel: string;
  children?: ReactNode;
};

export function ContentPage({ eyebrow, title, description, backHref, backLabel, children }: ContentPageProps) {
  return (
    <SitePage>
      <section className="mx-auto flex w-full max-w-4xl flex-1 flex-col items-center justify-center px-6 py-24 text-center">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#5b7f44]">{eyebrow}</p>
        <h1 className="mt-4 text-5xl font-bold tracking-[-0.04em] sm:text-6xl">{title}</h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-[#666b64]">{description}</p>
        {children}
        <Link href={backHref} className={cn(buttonVariants({ size: "lg" }), "mt-10 h-12 rounded-full bg-[#172d23] px-6 text-white hover:bg-[#244334]")}>
          <ArrowLeft className="mr-1 size-4" aria-hidden="true" /> {backLabel}
        </Link>
      </section>
    </SitePage>
  );
}
