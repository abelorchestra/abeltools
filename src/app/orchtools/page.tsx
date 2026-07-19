import type { Metadata } from "next";

import { CategoryPage } from "@/components/common/category-page";

export const metadata: Metadata = { title: "OrchTools | Abel Tools" };

const items = [
  { href: "/orchtools-brsofriend" as const, label: "OT-1", title: "BRSOfriend", description: "BRSO articulate 설정의 편의성을 높이고 세팅을 공유하기 위한 도구입니다." },
  { href: "/orchtools-kontaktcutter" as const, label: "OT-2", title: "KontaktCutter", description: "Kontakt의 FX와 percussion 샘플을 편리하게 이용하기 위한 도구입니다." },
  { href: "/orchtools-ot3" as const, label: "OT-3", title: "준비 중", description: "새로운 오케스트레이션 도구를 준비하고 있습니다." },
];

export default function OrchToolsPage() {
  return <CategoryPage eyebrow="ORCHESTRATION TOOLS" title="OrchTools" description="오케스트레이션 작업의 반복을 줄이고 설정을 더 편리하게 관리하는 도구들입니다." items={items} />;
}
