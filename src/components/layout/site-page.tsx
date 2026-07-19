import type { ReactNode } from "react";

import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";

export function SitePage({ children }: { children: ReactNode }) {
  return (
    <main className="flex min-h-screen flex-col bg-[#FFFCEE] text-[#171916]">
      <Header />
      {children}
      <Footer />
    </main>
  );
}
