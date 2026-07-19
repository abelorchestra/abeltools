import { ChevronDown } from "lucide-react";
import Link from "next/link";

import { Brand } from "@/components/common/brand";
import { navigation, type NavigationItem } from "@/lib/navigation";

function HeaderItem({ item }: { item: NavigationItem }) {
  return (
    <div className="group relative">
      <Link
        href={item.href}
        className="flex items-center gap-1 whitespace-nowrap py-2 transition-colors hover:text-[#171916]"
      >
        {item.label}
        {item.children && <ChevronDown className="size-3.5 transition-transform group-hover:rotate-180" aria-hidden="true" />}
      </Link>

      {item.children && (
        <div className="invisible absolute left-1/2 top-full z-50 w-36 -translate-x-1/2 pt-2 opacity-0 transition-all group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
          <div className="rounded-xl border border-[#e1e5dc] bg-white p-2 shadow-xl shadow-black/10">
            {item.children.map((child) => (
              <Link
                key={child.href}
                href={child.href}
                className="block rounded-lg px-3 py-2.5 text-sm transition-colors hover:bg-[#f7f8f4] hover:text-[#171916]"
              >
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
  return (
    <header className="relative z-50 mx-auto flex min-h-20 max-w-6xl flex-col items-center justify-between gap-3 px-6 py-4 sm:flex-row lg:px-8">
      <Link href="/" aria-label="Abel Tools 홈" className="shrink-0">
        <Brand />
      </Link>
      <nav className="flex flex-wrap items-center justify-center gap-x-5 text-sm text-[#5d625b] lg:gap-x-8" aria-label="주요 메뉴">
        {navigation.map((item) => <HeaderItem key={item.href} item={item} />)}
      </nav>
    </header>
  );
}
