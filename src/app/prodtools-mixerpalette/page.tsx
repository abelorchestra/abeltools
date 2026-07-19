import type { Metadata } from "next";

import { ContentPage } from "@/components/common/content-page";

export const metadata: Metadata = { title: "MixerPalette | Abel Tools" };

export default function Pt1Page() {
  return <ContentPage eyebrow="PRODTOOLS · PT-1" title="MixerPalette" description="믹서창의 색 설정을 템플릿으로 만들어 저장하고 관리할 수 있도록 돕는 도구입니다." backHref="/prodtools" backLabel="ProdTools로 돌아가기" />;
}
