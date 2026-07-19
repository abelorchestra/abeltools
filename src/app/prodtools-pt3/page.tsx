import type { Metadata } from "next";

import { ContentPage } from "@/components/common/content-page";

export const metadata: Metadata = { title: "PT-3 | Abel Tools" };

export default function Pt3Page() {
  return <ContentPage eyebrow="PRODTOOLS · PT-3" title="준비 중" description="세 번째 ProdTools를 준비하고 있습니다. 아이디어와 기능이 구체화되면 이곳에 소개합니다." backHref="/prodtools" backLabel="ProdTools로 돌아가기" />;
}
