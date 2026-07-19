import type { Metadata } from "next";

import { ContentPage } from "@/components/common/content-page";

export const metadata: Metadata = { title: "OT-3 | Abel Tools" };

export default function Ot3Page() {
  return <ContentPage eyebrow="ORCHTOOLS · OT-3" title="준비 중" description="세 번째 OrchTools를 구상하고 있습니다. 작업 흐름을 실제로 개선할 수 있는 아이디어가 정리되면 공개합니다." backHref="/orchtools" backLabel="OrchTools로 돌아가기" />;
}
