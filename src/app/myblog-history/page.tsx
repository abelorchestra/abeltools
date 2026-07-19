import type { Metadata } from "next";

import { ContentPage } from "@/components/common/content-page";

export const metadata: Metadata = { title: "History | Abel Tools" };

export default function Mb3Page() {
  return <ContentPage eyebrow="MYBLOG · MB-3" title="History" description="Abel Tools 사이트가 어떻게 변하고 성장했는지 개발 내역과 주요 결정을 시간순으로 기록합니다." backHref="/myblog" backLabel="MyBlog로 돌아가기" />;
}
