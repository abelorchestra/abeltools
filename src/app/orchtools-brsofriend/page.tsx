import type { Metadata } from "next";

import { FstWorkspace } from "@/components/brsofriend/fst-workspace";
import { ContentPage } from "@/components/common/content-page";
import { TutorialLinkCard } from "@/components/tutorial/tutorial-link-card";

export const metadata: Metadata = { title: "BRSOfriend | Abel Tools" };

export default function BrsofriendPage() {
  return (
    <ContentPage
      eyebrow="ORCHTOOLS · OT-1"
      title="BRSOfriend"
      description="BRSO articulate 설정의 편의성을 높이고, 완성한 세팅을 다른 사용자와 쉽게 공유하기 위한 도구입니다."
      backHref="/orchtools"
      backLabel="OrchTools로 돌아가기"
    >
      <FstWorkspace />
      <TutorialLinkCard href="/orchtools-brsofriend/tutorial" />
    </ContentPage>
  );
}
