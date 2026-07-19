import type { Metadata } from "next";

import { ContentPage } from "@/components/common/content-page";
import { TutorialVideoWidget } from "@/components/tutorial/tutorial-video-widget";

export const metadata: Metadata = { title: "BRSOfriend | Abel Tools" };

export default function Ot1Page() {
  return (
    <ContentPage eyebrow="ORCHTOOLS · OT-1" title="BRSOfriend" description="BRSO articulate 설정의 편의성을 높이고, 완성한 세팅을 다른 사용자와 쉽게 공유하기 위한 도구입니다." backHref="/orchtools" backLabel="OrchTools로 돌아가기">
      <TutorialVideoWidget videoId="Sklc_fQBmcs" title="BRSOfriend 시작하기" description="BRSOfriend의 기본 설정과 사용 흐름을 소개할 튜토리얼 영역입니다. 실제 강의가 준비되면 영상 ID와 설명을 교체할 수 있습니다." />
    </ContentPage>
  );
}
