"use client";

import { ChevronDown, Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { useSiteI18n } from "@/components/layout/site-i18n";
import { navigation, type NavigationItem } from "@/lib/navigation";

function HeaderItem({ item }: { item: NavigationItem }) {
  return (
    <div className="group relative">
      <Link href={item.href} className="flex min-h-11 items-center gap-1 whitespace-nowrap px-2 text-[#564321] transition-colors hover:text-black">
        {item.label}
        {item.children && <ChevronDown className="size-3.5 transition-transform group-hover:rotate-180" aria-hidden="true" />}
      </Link>
      {item.children && (
        <div className="invisible absolute left-1/2 top-full z-50 w-44 -translate-x-1/2 pt-2 opacity-0 transition-all group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
          <div className="rounded-2xl border border-[#eadfc8] bg-[#fffdf8] p-2 shadow-xl shadow-[#564321]/10">
            {item.children.map((child) => (
              <Link key={child.href} href={child.href} className="block rounded-xl px-3 py-2.5 text-sm text-[#564321] transition-colors hover:bg-[#fbefd4] hover:text-black">
                {child.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function Header() {
  const { locale, setLocale } = useSiteI18n();
  const [open, setOpen] = useState(false);

  return (
    <header className="relative z-50 mx-auto max-w-[1200px] px-5 sm:px-8">
      <div className="flex min-h-24 items-center justify-between border-b border-[#d7cfbf]">
        <Link href="/" aria-label="AbelTools 홈" className="shrink-0">
          <Image src="/home/brand-lockup.png" alt="AbelTools" width={284} height={76} className="h-10 w-auto" priority />
        </Link>
        <button type="button" className="grid size-11 place-items-center rounded-full border border-[#e4dac5] bg-white/70 md:hidden" onClick={() => setOpen((value) => !value)} aria-label="메뉴 열기" aria-expanded={open}>
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
        <nav className="hidden items-center gap-3 text-lg md:flex lg:gap-6" aria-label="주요 메뉴">
          {navigation.map((item) => <HeaderItem key={item.href} item={item} />)}
          <label className="relative ml-1">
            <span className="sr-only">사이트 언어</span>
            <select value={locale} onChange={(event) => setLocale(event.target.value as "ko" | "en")} className="appearance-none bg-transparent py-2 pl-2 pr-7 text-sm text-black outline-none focus-visible:ring-2 focus-visible:ring-[#8aac73]">
              <option value="ko">한국어</option><option value="en">English</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-1 top-1/2 size-3.5 -translate-y-1/2" aria-hidden="true" />
          </label>
        </nav>
      </div>
      {open && (
        <nav className="absolute left-5 right-5 top-[86px] rounded-2xl border border-[#eadfc8] bg-[#fffdf8] p-3 shadow-xl md:hidden" aria-label="모바일 메뉴">
          {navigation.map((item) => <Link key={item.href} href={item.href} onClick={() => setOpen(false)} className="block rounded-xl px-4 py-3 text-[#564321] hover:bg-[#fbefd4]">{item.label}</Link>)}
        </nav>
      )}
    </header>
  );
}
