import type { Metadata } from "next";

import { ContentPage } from "@/components/common/content-page";
import { TutorialVideoWidget } from "@/components/tutorial/tutorial-video-widget";

export const metadata: Metadata = { title: "BRSOfriend Tutorial | Abel Tools" };

export default function BrsofriendTutorialPage() {
  return (
    <ContentPage
      eyebrow="BRSOFRIEND · TUTORIAL"
      title="BRSOfriend 시작하기"
      description="BRSOfriend의 기본 설정과 사용 흐름을 영상으로 확인합니다."
      backHref="/orchtools-brsofriend"
      backLabel="BRSOfriend로 돌아가기"
    >
      <TutorialVideoWidget
        videoId="Sklc_fQBmcs"
        title="BRSOfriend 시작하기"
        description="현재는 레이아웃 확인을 위한 예시 영상입니다. 실제 강의가 준비되면 영상 ID와 설명을 교체할 수 있습니다."
      />
    </ContentPage>
  );
}
