import type { Metadata } from "next";

import { CategoryPage } from "@/components/common/category-page";

export const metadata: Metadata = { title: "ProdTools | Abel Tools" };

const items = [
  { href: "/prodtools-mixerpalette" as const, label: "PT-1", title: "MixerPalette", description: "믹서창의 색 설정을 템플릿으로 만들어 관리하기 위한 도구입니다." },
  { href: "/prodtools-pt2" as const, label: "PT-2", title: "준비 중", description: "새로운 프로덕션 도구를 준비하고 있습니다." },
  { href: "/prodtools-pt3" as const, label: "PT-3", title: "준비 중", description: "새로운 프로덕션 도구를 준비하고 있습니다." },
];

export default function ProdToolsPage() {
  return <CategoryPage eyebrow="PRODUCTION TOOLS" title="ProdTools" description="음악 제작 환경을 더 빠르고 일관되게 관리하기 위한 도구들입니다." items={items} />;
}
