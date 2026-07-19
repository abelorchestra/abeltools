import type { Metadata } from "next";

import { ContentPage } from "@/components/common/content-page";

export const metadata: Metadata = { title: "PT-2 | Abel Tools" };

export default function Pt2Page() {
  return <ContentPage eyebrow="PRODTOOLS · PT-2" title="준비 중" description="두 번째 ProdTools를 준비하고 있습니다. 음악 제작 과정의 반복 작업을 줄일 아이디어를 찾고 있습니다." backHref="/prodtools" backLabel="ProdTools로 돌아가기" />;
}
