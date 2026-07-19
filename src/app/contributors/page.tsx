import type { Metadata } from "next";

import { ContentPage } from "@/components/common/content-page";

export const metadata: Metadata = { title: "Contributors | Abel Tools" };

export default function ContributorsPage() {
  return <ContentPage eyebrow="TOGETHER WITH ABEL TOOLS" title="컨트리뷰터 모집 중!" description="Abel Tools를 함께 만들어갈 기획자, 개발자, 디자이너와 음악인을 기다리고 있습니다." backHref="/" backLabel="홈으로 돌아가기" />;
}
