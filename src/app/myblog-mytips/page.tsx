import type { Metadata } from "next";

import { ContentPage } from "@/components/common/content-page";

export const metadata: Metadata = { title: "MyTips | Abel Tools" };

export default function Mb2Page() {
  return <ContentPage eyebrow="MYBLOG · MB-2" title="MyTips" description="작곡, 오케스트레이션, 프로덕션과 도구 사용 중 발견한 이것저것 유용한 팁을 소개합니다." backHref="/myblog" backLabel="MyBlog로 돌아가기" />;
}
